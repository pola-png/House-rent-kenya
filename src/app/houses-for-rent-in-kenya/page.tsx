'use client';

import { PropertyCard } from '@/components/property-card';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HousesForRentKenyaPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .in('status', ['Available', 'For Rent'])
      .order('views', { ascending: false })
      .limit(12);

    if (data) {
      const landlordIds = [...new Set(data.map(p => p.landlordId))];
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', landlordIds);
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const propertiesWithAgents = data.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        agent: profileMap.get(p.landlordId) ? {
          uid: profileMap.get(p.landlordId)!.id,
          firstName: profileMap.get(p.landlordId)!.firstName || '',
          lastName: profileMap.get(p.landlordId)!.lastName || '',
          displayName: profileMap.get(p.landlordId)!.displayName || '',
          email: profileMap.get(p.landlordId)!.email || '',
          role: 'agent',
          agencyName: profileMap.get(p.landlordId)!.agencyName,
          phoneNumber: profileMap.get(p.landlordId)!.phoneNumber,
          photoURL: profileMap.get(p.landlordId)!.photoURL,
          createdAt: new Date(profileMap.get(p.landlordId)!.createdAt)
        } : undefined
      }));

      setProperties(propertiesWithAgents);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Houses for Rent in Kenya - Top Listings 2024</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Browse the best houses for rent in Kenya. Find family homes, apartments, bedsitters, and luxury properties across Nairobi, Mombasa, Kisumu, and all major cities. Verified listings with photos, virtual tours, and instant agent contact.
      </p>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/search?type=rent">Browse All Rental Properties</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
