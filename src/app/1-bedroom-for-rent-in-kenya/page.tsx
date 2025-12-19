import { PropertyCard } from '@/components/property-card';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '1 Bedroom for Rent in Kenya | Affordable Apartments',
  description: 'Find 1 bedroom apartments for rent in Kenya. Affordable rental options for singles & couples across all major cities.',
  keywords: '1 bedroom for rent Kenya, one bedroom rental Kenya, 1BR rent Kenya, affordable apartments Kenya',
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    bedrooms: 1,
    status: 'For Rent',
    limit: 20
  });
  const totalProperties = all.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">1 Bedroom for Rent in Kenya - Affordable Apartments</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Discover {totalProperties}+ 1 bedroom apartments for rent in Kenya. Affordable options for singles & young professionals.
        {promoted.length > 0 && ` Featuring ${promoted.length} premium listings.`}
      </p>
      
      {totalProperties > 0 ? (
        <>
          {/* Featured/Promoted Properties Section */}
          {promoted.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured 1 Bedroom Apartments
                </div>
                <span className="text-sm text-muted-foreground">({promoted.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                {promoted.map((property) => (
                  <PropertyCard key={`featured-${property.id}`} property={property} />
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Properties Section */}
          {regular.length > 0 && (
            <div className="mb-8">
              {promoted.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-semibold">More 1 Bedroom Apartments</h3>
                  <span className="text-sm text-muted-foreground">({regular.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/search?beds=1&type=rent">View All 1 Bedroom Rentals</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">
          No properties available. <Link href="/search" className="text-primary underline">Browse all properties</Link>
        </p>
      )}
    </div>
  );
}