import { supabase } from '@/lib/supabase';
import PropertyDetailClient from '../property/[id]/property-detail-client';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SlugPropertyPage({ params }: Props) {
  const { slug } = await params;
  
  // LAYER 1: Exclude system routes by exact match
  const excludedRoutes = [
    'login', 'signup', 'admin', 'api', 'search', 'agents', 'about',
    'contact', 'blog', 'careers', 'advice', 'developments', 'privacy',
    'terms', 'forgot-password', 'reset-password', 'property',
    'bedsitter-for-rent-in-kasarani', 'house-rent-in-kenya',
    'houses-for-rent-in-kenya', 'house-rent-in-nairobi',
    '2-bedroom-rent-in-kenya', '3-bedroom-rent-in-kenya',
    '1-bedroom-house-for-rent-in-kisumu', '2-bedroom-house-for-rent-in-mombasa',
    '3-bedroom-house-for-rent-in-meru', 'real-estate-for-sale',
    'homes-for-sale', 'houses-for-sale', 'property-for-sale',
    'real-estate-agents-near-me'
  ];
  
  if (excludedRoutes.includes(slug)) {
    notFound();
  }
  
  // LAYER 2: Exclude routes starting with system prefixes
  const excludedPrefixes = ['admin', 'api', 'signup'];
  if (excludedPrefixes.some(prefix => slug.startsWith(prefix))) {
    notFound();
  }
  
  // LAYER 3: Only allow slugs with exactly 5+ dash-separated parts (property format)
  const parts = slug.split('-');
  if (parts.length < 5) {
    notFound();
  }
  
  // LAYER 4: Extract and validate UUID from last 5 parts
  const actualId = parts.slice(-5).join('-');
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(actualId)) {
    notFound();
  }
  
  // LAYER 5: Verify property exists in database
  const { data: property } = await supabase
    .from('properties')
    .select('id')
    .eq('id', actualId)
    .single();
  
  if (!property) {
    notFound();
  }
  
  return <PropertyDetailClient id={actualId} />;
}
