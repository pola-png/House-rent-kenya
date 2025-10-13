"use client";

import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { AdvancedSearch } from "@/components/advanced-search";
import { PropertyComparison } from "@/components/property-comparison";
import { AIRecommendations } from "@/components/ai-recommendations";
import { MarketAnalytics } from "@/components/market-analytics";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Filter, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Property, UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Properties");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchProperties();
    setCurrentPage(1);
  }, [searchParams]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const q = searchParams.get('q')?.toLowerCase();
      const listingType = searchParams.get('type'); // rent/buy from home page
      const propertyTypes = searchParams.getAll('property_type'); // from search filters
      // Get property type from home page (single parameter)
      const homePropertyType = searchParams.get('property_type');
      const allPropertyTypes = [...propertyTypes];
      if (homePropertyType) allPropertyTypes.push(homePropertyType);
      const minPrice = searchParams.get('min_price');
      const maxPrice = searchParams.get('max_price');
      const beds = searchParams.get('beds');
      const baths = searchParams.get('baths');
      const amenities = searchParams.getAll('amenities');

      let query = supabase.from('properties').select('*');

      // Filter by listing type (rent/sale) from home page
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

      // Search query
      if (q) {
        query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,city.ilike.%${q}%,propertyType.ilike.%${q}%`);
      }

      // Property type filters (from home page or search filters)
      const uniquePropertyTypes = [...new Set(allPropertyTypes)].filter(Boolean);
      if (uniquePropertyTypes.length > 0) {
        // Use OR condition for multiple property types
        const typeConditions = uniquePropertyTypes.map(type => `propertyType.ilike.%${type}%`);
        if (typeConditions.length === 1) {
          query = query.ilike('propertyType', `%${uniquePropertyTypes[0]}%`);
        } else {
          query = query.or(typeConditions.join(','));
        }
      }

      // Bathroom filter
      if (baths) {
        query = query.gte('bathrooms', parseInt(baths, 10));
      }

      // Amenities filter
      if (amenities.length > 0) {
        amenities.forEach(amenity => {
          query = query.contains('amenities', [amenity]);
        });
      }

      // Price filters
      if (minPrice) {
        query = query.gte('price', parseInt(minPrice, 10));
      }
      if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice, 10));
      }

      // Bedroom filter
      if (beds) {
        const bedroomCount = beds === '4+' ? 4 : parseInt(beds, 10);
        query = query.gte('bedrooms', bedroomCount);
      }

      const { data, error } = await query.order('createdAt', { ascending: false });

      if (error) throw error;

      // Fetch agent details for each property
      const propertiesWithAgents = await Promise.all(
        (data || []).map(async (p) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', p.landlordId)
            .single();
          
          return {
            ...p,
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
        })
      );

      setProperties(propertiesWithAgents);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <Skeleton className="h-5 w-32" />
            ) : (
                `Showing ${properties.length} results`
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {properties.length > itemsPerPage && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(properties.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(Math.ceil(properties.length / itemsPerPage), p + 1)); }}
                          className={currentPage === Math.ceil(properties.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
  );
}
