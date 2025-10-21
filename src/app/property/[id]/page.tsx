import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './property-detail-client';
import { PropertySchema } from '@/components/property-schema';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Extract actual ID from slug-id format
  let actualId = id;
  if (id.includes('-')) {
    const parts = id.split('-');
    if (parts.length >= 5) {
      actualId = parts.slice(-5).join('-');
    }
  }

  try {
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', actualId)
      .single();

    if (!property) {
      return {
        title: 'Property Not Found | House Rent Kenya',
        description: 'The requested property could not be found on House Rent Kenya.'
      };
    }

    const title = `${property.title} - ${property.bedrooms} Bed ${property.propertyType} in ${property.location} | House Rent Kenya`;
    const description = `${property.bedrooms} bedroom ${property.propertyType.toLowerCase()} for ${property.status.toLowerCase()} in ${property.location}, ${property.city}. Ksh ${property.price.toLocaleString()}/month. ${property.description?.substring(0, 120)}...`;
    const images = property.images?.[0] ? [property.images[0]] : [];

    return {
      title,
      description,
      keywords: [
        `${property.bedrooms} bedroom ${property.propertyType.toLowerCase()}`,
        `${property.location} ${property.propertyType.toLowerCase()}`,
        `${property.city} property rental`,
        `house rent ${property.location.toLowerCase()}`,
        `${property.propertyType.toLowerCase()} for rent ${property.city.toLowerCase()}`,
        'kenya property rental',
        'nairobi apartments',
        'house rent kenya'
      ],
      openGraph: {
        title,
        description,
        images,
        url: `https://houserentkenya.co.ke/property/${id}`,
        type: 'article',
        siteName: 'House Rent Kenya'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images
      },
      alternates: {
        canonical: `https://houserentkenya.co.ke/property/${id}`
      }
    };
  } catch (error) {
    return {
      title: 'Property | House Rent Kenya',
      description: 'Find your perfect property on Kenya\'s leading rental platform.'
    };
  }
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  
  // Extract actual ID from slug-id format
  let actualId = id;
  if (id.includes('-')) {
    const parts = id.split('-');
    if (parts.length >= 5) {
      actualId = parts.slice(-5).join('-');
    }
  }

  // Fetch property for schema
  let property = null;
  try {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', actualId)
      .single();
    property = data;
  } catch (error) {
    console.error('Error fetching property for schema:', error);
  }
  
  return (
    <>
      {property && <PropertySchema property={property} />}
      <PropertyDetailClient id={actualId} />
    </>
  );
}