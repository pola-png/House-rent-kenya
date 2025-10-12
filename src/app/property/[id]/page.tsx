import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './property-detail-client';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!property) {
      return {
        title: 'Property Not Found | House Rent Kenya',
        description: 'The requested property could not be found.',
      };
    }

    const title = `${property.title} - ${property.location}, ${property.city} | House Rent Kenya`;
    const description = `${property.propertyType} for rent in ${property.location}, ${property.city}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.area} sq ft. KSh ${property.price.toLocaleString()}/month. Virtual tour available.`;
    
    return {
      title,
      description,
      keywords: [
        `${property.propertyType} ${property.location}`,
        `${property.bedrooms} bedroom ${property.propertyType}`,
        `house rent ${property.city}`,
        `property rental ${property.location}`,
        `apartments ${property.city}`,
        property.location,
        property.city,
        'kenya property rental',
        'house rent kenya'
      ],
      openGraph: {
        title,
        description,
        images: property.images?.length > 0 ? [
          {
            url: property.images[0],
            width: 1200,
            height: 630,
            alt: property.title,
          }
        ] : [],
        type: 'article',
        locale: 'en_KE',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: property.images?.length > 0 ? [property.images[0]] : [],
      },
      alternates: {
        canonical: `https://houserent.co.ke/property/${params.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Property | House Rent Kenya',
      description: 'View property details on House Rent Kenya.',
    };
  }
}

export default function PropertyPage({ params }: Props) {
  return <PropertyDetailClient id={params.id} />;
}