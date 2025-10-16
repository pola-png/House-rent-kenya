import { supabase } from '@/lib/supabase';
import PropertyDetailClient from '../property/[id]/property-detail-client';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SlugPropertyPage({ params }: Props) {
  const { slug } = await params;
  
  // Exclude system routes - these should never be handled by this catch-all
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
  
  // Only process if slug looks like a property URL (contains UUID pattern)
  const parts = slug.split('-');
  if (parts.length < 5) {
    notFound();
  }
  
  // Extract UUID from slug (last 5 parts)
  const actualId = parts.slice(-5).join('-');
  
  // Quick UUID format validation
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(actualId)) {
    notFound();
  }
  
  // Verify property exists
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
