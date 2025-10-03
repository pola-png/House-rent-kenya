import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { properties } from "@/lib/properties";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Map } from "@/components/map";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // In a real app, you would fetch filtered data from an API based on searchParams
  const filteredProperties = properties;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
            <SearchFilters />
        </aside>

        <main className="lg:col-span-3">
          <h1 className="text-3xl font-headline font-bold mb-2">Properties for Rent</h1>
          <p className="text-muted-foreground mb-6">Showing {filteredProperties.length} results</p>

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

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
        </main>
      </div>
    </div>
  );
}
