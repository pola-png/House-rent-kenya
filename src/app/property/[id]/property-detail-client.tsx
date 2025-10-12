"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SEOSchema } from '@/components/seo-schema';
// ... rest of your existing property detail component code

interface PropertyDetailClientProps {
  id: string;
}

export default function PropertyDetailClient({ id }: PropertyDetailClientProps) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div itemScope itemType="https://schema.org/Accommodation">
      <SEOSchema type="property" data={property} />
      
      {/* Your existing property detail JSX with structured data attributes */}
      <h1 itemProp="name">{property.title}</h1>
      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <span itemProp="addressLocality">{property.location}</span>,{' '}
        <span itemProp="addressRegion">{property.city}</span>
      </div>
      <div itemProp="priceRange">KSh {property.price.toLocaleString()}</div>
      
      {/* Add more structured data as needed */}
    </div>
  );
}