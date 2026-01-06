import { PropertyCard } from '@/components/property-card';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bedsitter for Rent in Kasarani - Affordable Studio Apartments | House Rent Kenya',
  description: 'Find affordable bedsitter apartments for rent in Kasarani, Nairobi. Browse verified listings with photos, prices, and agent contacts. Studio apartments from KSh 8,000.',
  keywords: 'bedsitter Kasarani, studio apartment Kasarani, single room Kasarani, affordable rent Kasarani, Nairobi bedsitter',
  openGraph: {
    title: 'Bedsitter for Rent in Kasarani - Affordable Studio Apartments',
    description: 'Find affordable bedsitter apartments for rent in Kasarani, Nairobi. Browse verified listings with photos, prices, and agent contacts.',
    type: 'website',
  },
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    location: 'kasarani',
    maxBedrooms: 1,
    status: 'For Rent',
    limit: 20
  });
  const totalProperties = all.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Bedsitter for Rent in Kasarani - Affordable Studio Apartments</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Find affordable bedsitter apartments for rent in Kasarani, Nairobi. Browse {totalProperties}+ verified listings with photos, prices, and agent contacts.
        {promoted.length > 0 && ` Featuring ${promoted.length} premium listings.`}
      </p>
      
      {totalProperties > 0 ? (
        <>
          {/* Featured/Promoted Properties Section */}
          {promoted.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured Bedsitters in Kasarani
                </div>
                <span className="text-sm text-muted-foreground">({promoted.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h3 className="text-2xl font-semibold">More Bedsitters in Kasarani</h3>
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
              <Link href="/search?q=kasarani&beds=1">View All Bedsitters in Kasarani</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">
          No bedsitters available. <Link href="/search" className="text-primary underline">Browse all properties</Link>
        </p>
      )}
    </div>
  );
}
