"use client";

import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { AdvancedSearch } from "@/components/advanced-search";
import { PropertyComparison } from "@/components/property-comparison";
import { AIRecommendations } from "@/components/ai-recommendations";
import { MarketAnalytics } from "@/components/market-analytics";
import { CanonicalUrl } from "@/components/canonical-url";
import { SEOSchema } from "@/components/seo-schema";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter, BarChart3, Sparkles, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { normalizeWasabiImageArray } from "@/lib/wasabi";

function SearchContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [promotedProperties, setPromotedProperties] = useState<Property[]>([]);
  const [regularProperties, setRegularProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Properties");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchController, setFetchController] = useState<AbortController | null>(null);
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(properties.length / itemsPerPage));

  // Listen for force clear events
  useEffect(() => {
    const handleClearSearch = () => {
      setProperties([]);
      setPromotedProperties([]);
      setRegularProperties([]);
      setIsLoading(true);
    };
    
    // Listen for page load completion
    const handlePageLoad = () => {
      console.log('Page load detected, isLoading:', isLoading, 'properties:', properties.length);
      if (isLoading && properties.length === 0 && !fetchController) {
        console.log('Page loaded but no results, retrying fetch...');
        const controller = new AbortController();
        setFetchController(controller);
        setTimeout(() => fetchProperties(controller), 500);
      }
    };
    
    // Listen for navigation completion
    const handleRouteChange = () => {
      console.log('Route change detected, readyState:', document.readyState);
      if (document.readyState === 'complete') {
        handlePageLoad();
      }
    };
    
    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      console.log('Popstate detected, forcing search update');
      setProperties([]);
      setPromotedProperties([]);
      setRegularProperties([]);
      setIsLoading(true);
      setTimeout(() => fetchProperties(), 100);
    };
    
    window.addEventListener('clearSearch', handleClearSearch);
    window.addEventListener('load', handlePageLoad);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('readystatechange', handleRouteChange);
    
    return () => {
      window.removeEventListener('clearSearch', handleClearSearch);
      window.removeEventListener('load', handlePageLoad);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('readystatechange', handleRouteChange);
    };
  }, [isLoading, properties.length]);

  useEffect(() => {
    console.log('URL changed, searchParams:', searchParams?.toString());
    
    // Cancel previous request if it exists
    if (fetchController) {
      console.log('Cancelling previous request');
      fetchController.abort();
    }
    
    // Clear previous results and show loading immediately
    setProperties([]);
    setPromotedProperties([]);
    setRegularProperties([]);
    setIsLoading(true);
    setCurrentPage(1);
    
    // Create new controller for this request
    const controller = new AbortController();
    setFetchController(controller);
    
    // Force immediate fetch
    fetchProperties(controller);
    
    return () => {
      controller.abort();
    };
  }, [searchParams?.toString()]);

  const fetchProperties = async (controller?: AbortController) => {
    console.log('Starting fetchProperties...');
    
    // Prevent multiple simultaneous requests
    if (isLoading && !controller) {
      console.log('Request already in progress, skipping');
      return;
    }
    
    try {
      const q = searchParams?.get('q')?.toLowerCase();
      console.log('Search query:', q);
      
      const listingType = searchParams?.get('type');
      const propertyTypes = searchParams?.getAll('property_type') ?? [];
      const homePropertyType = searchParams?.get('property_type');
      const allPropertyTypes = [...propertyTypes];
      if (homePropertyType) allPropertyTypes.push(homePropertyType);
      const minPrice = searchParams?.get('min_price');
      const maxPrice = searchParams?.get('max_price');
      const beds = searchParams?.get('beds');
      const baths = searchParams?.get('baths');
      const amenities = searchParams?.getAll('amenities') ?? [];

      let query = supabase.from('properties').select('*');

      if (listingType === 'rent') {
        query = query.in('status', ['Available', 'For Rent']);
        setPageTitle("Properties for Rent");
      } else if (listingType === 'buy') {
        query = query.eq('status', 'For Sale');
        setPageTitle("Properties for Sale");
      } else if (listingType === 'short-let') {
        query = query.eq('status', 'Short Let');
        setPageTitle("Short Let Properties");
      } else if (listingType === 'land') {
        query = query.eq('propertyType', 'Land');
        setPageTitle("Land for Sale");
      }

      if (q) {
        query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,city.ilike.%${q}%,propertyType.ilike.%${q}%`);
      }

      const uniquePropertyTypes = [...new Set(allPropertyTypes)].filter(Boolean);
      if (uniquePropertyTypes.length > 0) {
        const typeConditions = uniquePropertyTypes.map(type => `propertyType.ilike.%${type}%`);
        if (typeConditions.length === 1) {
          query = query.ilike('propertyType', `%${uniquePropertyTypes[0]}%`);
        } else {
          query = query.or(typeConditions.join(','));
        }
      }

      if (baths) {
        query = query.gte('bathrooms', parseInt(baths, 10));
      }

      if (amenities.length > 0) {
        amenities.forEach(amenity => {
          query = query.contains('amenities', [amenity]);
        });
      }

      if (minPrice) {
        query = query.gte('price', parseInt(minPrice, 10));
      }
      if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice, 10));
      }

      if (beds) {
        const bedroomCount = beds === '4+' ? 4 : parseInt(beds, 10);
        query = query.gte('bedrooms', bedroomCount);
      }

      console.log('Executing query...');
      const { data, error } = await query.order('isPremium', { ascending: false, nullsFirst: false }).order('createdAt', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Query results:', data?.length || 0, 'properties');

      // Always fetch promoted properties separately to ensure they show
      const { data: allPromotedProperties, error: promotedError } = await supabase
        .from('properties')
        .select('*')
        .in('status', ['Available', 'For Rent', 'For Sale'])
        .eq('isPremium', true)
        .or('featuredExpiresAt.is.null,featuredExpiresAt.gt.' + new Date().toISOString())
        .order('createdAt', { ascending: false });

      if (promotedError) {
        console.error('Promoted properties error:', promotedError);
      }

      // Combine search results with promoted properties, removing duplicates
      const searchResultIds = new Set((data || []).map(p => p.id));
      const additionalPromoted = (allPromotedProperties || []).filter(p => !searchResultIds.has(p.id));
      const combinedData = [...(allPromotedProperties || []), ...(data || []).filter(p => !p.isPremium)];

      const landlordIds = [...new Set(combinedData.map(p => p.landlordId))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', landlordIds);
      
      if (profilesError) {
        console.error('Profiles error:', profilesError);
      }
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const propertiesWithAgents = combinedData.map(p => {
        const profileData = profileMap.get(p.landlordId);
        return {
          ...p,
          images: normalizeWasabiImageArray(p.images),
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          agent: profileData ? {
            uid: profileData.id,
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            displayName: profileData.displayName || profileData.email?.split('@')[0] || '',
            email: profileData.email || '',
            role: profileData.role || 'agent',
            agencyName: profileData.agencyName,
            phoneNumber: profileData.phoneNumber,
            photoURL: profileData.photoURL,
            createdAt: new Date(profileData.createdAt)
          } : {
            uid: 'default-agent',
            firstName: 'Default',
            lastName: 'Agent',
            displayName: 'Default Agent',
            email: 'agent@default.com',
            role: 'agent',
            agencyName: 'Default Agency',
            createdAt: new Date()
          }
        };
      });

      // Separate promoted and regular properties
      const currentDate = new Date();
      const promoted = propertiesWithAgents.filter(p => 
        p.isPremium && 
        (!p.featuredExpiresAt || new Date(p.featuredExpiresAt) > currentDate)
      );
      const regular = propertiesWithAgents.filter(p => 
        !p.isPremium || 
        (p.featuredExpiresAt && new Date(p.featuredExpiresAt) <= currentDate)
      );

      // Sort both arrays by creation date
      promoted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      regular.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      console.log('Setting properties:', promoted.length + regular.length, 'total');
      
      // Check if request was cancelled
      if (controller?.signal.aborted) {
        console.log('Request was cancelled, not updating state');
        return;
      }
      
      setPromotedProperties(promoted);
      setRegularProperties(regular);
      setProperties([...promoted, ...regular]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }
      console.error('Error fetching properties:', error);
      setProperties([]);
      setPromotedProperties([]);
      setRegularProperties([]);
    } finally {
      if (!controller?.signal.aborted) {
        console.log('Fetch completed, setting loading to false');
        setIsLoading(false);
        setFetchController(null);
      }
    }
  };

  // Ensure the current page never exceeds the available pages when the result count changes
  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [properties.length]);

  const getVisiblePages = () => {
    const windowSize = 5;
    const windowStart = Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
    const windowEnd = Math.min(windowStart + windowSize - 1, totalPages);
    return Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);
  };

  return (
    <>
      <CanonicalUrl />
      <SEOSchema type="search" data={{ properties, totalResults: properties.length }} />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="search" className="flex items-center gap-1 text-xs sm:text-sm">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden">Find</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1 text-xs sm:text-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Advanced</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-1 text-xs sm:text-sm">
            <span className="hidden sm:inline">Compare</span>
            <span className="sm:hidden">Comp</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <SearchFilters />
            </aside>

            <main className="lg:col-span-3">
          <h1 className="text-3xl font-headline font-bold mb-2">{pageTitle}</h1>
          <div className="text-muted-foreground mb-6">
            {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Searching properties...</span>
                </div>
            ) : (
                `Showing ${properties.length} results${promotedProperties.length > 0 ? ` (${promotedProperties.length} featured)` : ''}`
            )}
          </div>
          
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-56 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                ))}
             </div>
          ) : properties.length > 0 ? (
            <>
              {/* All Properties in Single Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {properties.length > itemsPerPage && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent className="flex-wrap justify-center gap-2">
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {getVisiblePages().map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#"
                            onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <p className="font-semibold">No properties found.</p>
                <p className="text-sm">Try adjusting your search filters.</p>
            </div>
          )}

            </main>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AdvancedSearch />
            </div>
            <div className="lg:col-span-1">
              <AIRecommendations />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-8">
          <MarketAnalytics />
        </TabsContent>

        <TabsContent value="compare" className="mt-8">
          <PropertyComparison properties={properties} />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}

export default function SearchPageClient() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
