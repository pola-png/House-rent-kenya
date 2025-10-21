import { Metadata } from 'next';
import SearchPageClient from './search-client';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q as string;
  const type = params.type as string;
  const propertyType = params.property_type as string;
  const beds = params.beds as string;
  
  let title = 'Property Search Results | House Rent Kenya';
  let description = 'Find your perfect property in Kenya with House Rent Kenya';
  
  if (q && propertyType && beds) {
    title = `${beds} Bedroom ${propertyType} for ${type || 'rent'} in ${q} | House Rent Kenya`;
    description = `Find ${beds} bedroom ${propertyType.toLowerCase()} properties for ${type || 'rent'} in ${q}, Kenya. Browse verified listings with photos, prices & contact details.`;
  } else if (q && propertyType) {
    title = `${propertyType} for ${type || 'rent'} in ${q} | House Rent Kenya`;
    description = `Find ${propertyType.toLowerCase()} properties for ${type || 'rent'} in ${q}, Kenya. Verified listings with instant booking.`;
  } else if (q) {
    title = `Properties for ${type || 'rent'} in ${q} | House Rent Kenya`;
    description = `Find properties for ${type || 'rent'} in ${q}, Kenya. Browse apartments, houses & homes with verified listings.`;
  } else if (propertyType) {
    title = `${propertyType} for ${type || 'rent'} in Kenya | House Rent Kenya`;
    description = `Find ${propertyType.toLowerCase()} properties for ${type || 'rent'} across Kenya. Verified listings in Nairobi, Mombasa & more.`;
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://houserentkenya.co.ke/search'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}

export default function SearchPage() {
  return <SearchPageClient />;
}