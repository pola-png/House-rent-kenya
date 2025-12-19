import { PropertyCard } from '@/components/property-card';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '2 Bedroom House for Rent in Mombasa | Coastal Properties Kenya',
  description: 'Find 2 bedroom houses for rent in Mombasa, Kenya. Beachfront apartments, modern townhouses in Nyali, Bamburi & Diani. Prices from Ksh 40,000/month.',
  keywords: '2 bedroom house rent Mombasa, coastal properties Mombasa, Nyali apartments, Bamburi houses, Diani rentals',
  alternates: {
    canonical: 'https://houserentkenya.co.ke/2-bedroom-house-for-rent-in-mombasa',
  },
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    location: 'mombasa',
    bedrooms: 2,
    status: 'For Rent',
    limit: 20
  });
  const totalProperties = all.length;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">2 Bedroom House for Rent in Mombasa</h1>
      <p className="text-lg text-muted-foreground mb-8">Find 2 bedroom houses for rent in Mombasa. Coastal living with modern amenities and beachfront access.</p>
      <div className="bg-muted/50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">2 Bedroom Houses in Mombasa</h2>
        <p className="text-muted-foreground mb-4">
          Mombasa offers excellent 2 bedroom rental options from beachfront apartments to modern townhouses. 
          Popular areas include Nyali, Bamburi, and Diani with prices ranging from Ksh 40,000 to Ksh 150,000 per month.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Popular Areas:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Nyali - Beachfront living</li>
              <li>• Bamburi - Family-friendly</li>
              <li>• Diani - Luxury resorts area</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Price Ranges:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Standard: Ksh 40,000 - 80,000</li>
              <li>• Premium: Ksh 80,000 - 120,000</li>
              <li>• Luxury: Ksh 120,000+</li>
            </ul>
          </div>
        </div>
      </div>
      {totalProperties > 0 ? (
        <>
          {/* Featured Properties */}
          {promoted.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured Properties in Mombasa
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
                  <h3 className="text-2xl font-semibold">More Properties in Mombasa</h3>
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
              <Link href="/search?q=mombasa&beds=2">View All Mombasa Properties</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg mb-4">New properties are added daily. Be the first to know!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/search?q=mombasa">Browse Mombasa Properties</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search?beds=2">All 2 Bedroom Properties</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
