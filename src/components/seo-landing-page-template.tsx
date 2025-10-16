'use client';

import { PropertyCard } from '@/components/property-card';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SEOPageProps {
  title: string;
  description: string;
  filters: {
    location?: string;
    bedrooms?: number;
    type?: 'rent' | 'buy';
  };
  searchUrl: string;
}

export function SEOLandingPageTemplate({ title, description, filters, searchUrl }: SEOPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    let query = supabase.from('properties').select('*');

    if (filters.location) {
      query = query.or(`location.ilike.%${filters.location}%,city.ilike.%${filters.location}%`);
    }
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }
    if (filters.type === 'rent') {
      query = query.in('status', ['Available', 'For Rent']);
    } else if (filters.type === 'buy') {
      query = query.eq('status', 'For Sale');
    }

    const { data } = await query.order('createdAt', { ascending: false }).limit(12);

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
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{description}</p>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href={searchUrl}>View All Properties</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">No properties available at the moment. <Link href="/search" className="text-primary underline">Browse all properties</Link></p>
      )}
    </div>
  );
}
