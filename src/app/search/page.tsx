"use client";

import { collection } from "firebase/firestore";
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

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const firestore = useFirestore();
  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // In a real app, you would build a query based on searchParams
    return collection(firestore, 'properties');
  }, [firestore]);

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
          <p className="text-muted-foreground mb-6">
            {isLoading ? (
                <Skeleton className="h-5 w-32" />
            ) : (
                `Showing ${filteredProperties.length} results`
            )}
          </p>

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
