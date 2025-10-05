
"use client";

import { collection, query, where, orderBy, QueryConstraint } from "firebase/firestore";
import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Map } from "@/components/map";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();

  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    const constraints: QueryConstraint[] = [];

    // Basic Keyword Search (on title) - Firestore doesn't support full-text search natively
    const keyword = searchParams.get('q');
    // Note: A real full-text search requires a third-party service like Algolia.
    // This is a very basic prefix-based search simulation.
    if (keyword) {
        constraints.push(where('title', '>=', keyword));
        constraints.push(where('title', '<=', keyword + '\uf8ff'));
    }

    const propertyType = searchParams.get('type');
    if (propertyType) {
        constraints.push(where('type', '==', propertyType));
    }
    
    const minPrice = searchParams.get('min_price');
    if (minPrice) {
        constraints.push(where('price', '>=', parseInt(minPrice, 10)));
    }
    
    const maxPrice = searchParams.get('max_price');
    if (maxPrice) {
        constraints.push(where('price', '<=', parseInt(maxPrice, 10)));
    }

    const beds = searchParams.get('beds');
    if (beds) {
        constraints.push(where('bedrooms', '==', parseInt(beds, 10)));
    }

    const baths = searchParams.get('baths');
    if (baths) {
        constraints.push(where('bathrooms', '==', parseInt(baths, 10)));
    }

    const amenities = searchParams.getAll('amenities');
    if (amenities.length > 0) {
        // Firestore 'array-contains-any' is limited to 10 items in the array.
        // For more complex filtering, a different data model or search service would be better.
        amenities.slice(0, 10).forEach(amenity => {
            constraints.push(where('amenities', 'array-contains', amenity));
        })
    }
    
    return query(collection(firestore, 'properties'), ...constraints, orderBy('createdAt', 'desc'));
  }, [firestore, searchParams]);

  const { data: properties, isLoading } = useCollection<Property>(propertiesQuery);
  const filteredProperties = properties || [];

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
                `Showing ${filteredProperties.length} results`
            )}
          </div>

          <Card className="mb-8 h-[400px] overflow-hidden">
             {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                <Map properties={filteredProperties} />
             ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Map not available</AlertTitle>
                        <AlertDescription>
                            Please provide a Google Maps API key in your environment variables to display the map.
                        </AlertDescription>
                    </Alert>
                </div>
             )}
          </Card>
          
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          )}


          {!isLoading && (
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
