import { PropertyCard } from '@/components/property-card';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;

async function getProperties() {
  const { data } = await supabase.from('properties').select('*').in('status', ['Available', 'For Rent']).order('createdAt', { ascending: false }).limit(12);
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
      <h1 className="text-4xl font-bold mb-4">House Rent in Kenya - Find Your Perfect Home</h1>
      <p className="text-lg text-muted-foreground mb-8">Discover {properties.length}+ houses for rent across Kenya. Verified listings in Nairobi, Mombasa, Kisumu & more.</p>
      {properties.length > 0 ? (<><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div><div className="text-center"><Button asChild size="lg"><Link href="/search?type=rent">View All Houses for Rent</Link></Button></div></>) : (<p className="text-center py-12">No properties available. <Link href="/search" className="text-primary underline">Browse all properties</Link></p>)}
    </div>
  );
}
