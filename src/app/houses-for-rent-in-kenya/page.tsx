import { PropertyCard } from '@/components/property-card';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Houses for Rent in Kenya | Find Your Dream Home',
  description: 'Browse houses for rent across Kenya. Standalone houses, townhouses, villas & mansions available. Verified listings with photos, prices & agent contacts.',
  keywords: 'houses for rent Kenya, standalone houses Kenya, townhouses rent, villas for rent Kenya, mansion rental',
  openGraph: {
    title: 'Houses for Rent in Kenya | Find Your Dream Home',
    description: 'Browse houses for rent across Kenya. Standalone houses, townhouses, villas & mansions available.',
    type: 'website',
  },
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    propertyType: 'House',
    status: 'For Rent',
    limit: 20
  });
  const totalProperties = all.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Houses for Rent in Kenya - Find Your Dream Home</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Browse {totalProperties}+ houses for rent across Kenya. Standalone houses, townhouses, villas & mansions available.
        {promoted.length > 0 && ` Featuring ${promoted.length} premium listings.`}
      </p>
      
      {totalProperties > 0 ? (
        <>
          {/* Featured Properties */}
          {promoted.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured Houses
                </div>
                <span className="text-sm text-muted-foreground">({promoted.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                {promoted.map((property) => (
                  <PropertyCard key={`featured-${property.id}`} property={property} />
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Properties */}
          {regular.length > 0 && (
            <div className="mb-8">
              {promoted.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-semibold">More Houses for Rent</h3>
                  <span className="text-sm text-muted-foreground">({regular.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((property) => <PropertyCard key={property.id} property={property} />)}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/search?property_type=house&type=rent">View All Houses for Rent</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">No properties available. <Link href="/search" className="text-primary underline">Browse all properties</Link></p>
      )}
    </div>
  );
}