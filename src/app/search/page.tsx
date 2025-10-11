"use client";

import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
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

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const q = searchParams.get('q')?.toLowerCase();
      const type = searchParams.get('type');
      const minPrice = searchParams.get('min_price');
      const maxPrice = searchParams.get('max_price');
      const beds = searchParams.get('beds');

      let query = supabase.from('properties').select('*');

      // Filter by listing type (rent/sale)
      if (type === 'rent') {
        query = query.eq('status', 'For Rent');
        setPageTitle("Properties for Rent");
      } else if (type === 'buy') {
        query = query.eq('status', 'For Sale');
        setPageTitle("Properties for Sale");
      }

      // Search query
      if (q) {
        query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,city.ilike.%${q}%`);
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
        query = query.gte('bedrooms', parseInt(beds, 10));
      }

      const { data, error } = await query.order('createdAt', { ascending: false });

      if (error) throw error;

      // Fetch agent details for each property
      const propertiesWithAgents = await Promise.all(
        (data || []).map(async (p) => {
          const { data: userData } = await supabase.auth.admin.getUserById(p.landlordId);
          
          return {
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            agent: userData?.user ? {
              uid: userData.user.id,
              firstName: userData.user.user_metadata?.firstName || '',
              lastName: userData.user.user_metadata?.lastName || '',
              displayName: userData.user.user_metadata?.displayName || userData.user.email?.split('@')[0] || '',
              email: userData.user.email || '',
              role: userData.user.user_metadata?.role || 'agent',
              agencyName: userData.user.user_metadata?.agencyName,
              photoURL: userData.user.user_metadata?.photoURL,
              createdAt: new Date(userData.user.created_at)
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <p className="font-semibold">No properties found.</p>
                <p className="text-sm">Try adjusting your search filters.</p>
            </div>
          )}


          {!isLoading && properties.length > 0 && (
            <div className="mt-12">
                <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
