import { PropertyCard } from '@/components/property-card';
import { supabase } from '@/lib/supabase';
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

async function getProperties() {
  const { data } = await supabase.from('properties').select('*').or('location.ilike.%mombasa%,city.ilike.%mombasa%').eq('bedrooms', 2).eq('status', 'For Rent').order('createdAt', { ascending: false }).limit(12);
  if (!data) return [];
  const landlordIds = [...new Set(data.map(p => p.landlordId))];
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', landlordIds);
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
  return data.map(p => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt), agent: profileMap.get(p.landlordId) ? { uid: profileMap.get(p.landlordId)!.id, firstName: profileMap.get(p.landlordId)!.firstName || '', lastName: profileMap.get(p.landlordId)!.lastName || '', displayName: profileMap.get(p.landlordId)!.displayName || '', email: profileMap.get(p.landlordId)!.email || '', role: 'agent', agencyName: profileMap.get(p.landlordId)!.agencyName, phoneNumber: profileMap.get(p.landlordId)!.phoneNumber, photoURL: profileMap.get(p.landlordId)!.photoURL, createdAt: new Date(profileMap.get(p.landlordId)!.createdAt) } : undefined }));
}

export default async function Page() {
  const properties = await getProperties();
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
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
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
