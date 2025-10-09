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

// Mock data
import propertiesData from "@/lib/docs/properties.json";
import usersData from "@/lib/docs/users.json";


export default function SearchPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching and filtering data
    const q = searchParams.get('q')?.toLowerCase();
    const type = searchParams.get('type');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const beds = searchParams.get('beds');

    const agentMap = new Map(usersData.map(user => [user.uid, user]));

    let filtered = propertiesData.map(p => {
        const agent = agentMap.get(p.landlordId) || usersData.find(u => u.role === 'agent');
         return {
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            agent: agent ? {
                uid: agent.uid,
                firstName: agent.firstName,
                lastName: agent.lastName,
                displayName: agent.displayName,
                email: agent.email,
                role: 'agent',
                agencyName: agent.agencyName,
                createdAt: new Date(agent.createdAt)
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

    if (q) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
    }
    if (type) {
      filtered = filtered.filter(p => p.propertyType === type);
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(minPrice, 10));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(maxPrice, 10));
    }
    if (beds) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(beds, 10));
    }

    setProperties(filtered);
    setIsLoading(false);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
            <SearchFilters />
        </aside>

        <main className="lg:col-span-3">
          <h1 className="text-3xl font-headline font-bold mb-2">Properties for Rent</h1>
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
