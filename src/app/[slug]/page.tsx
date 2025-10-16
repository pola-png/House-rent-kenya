import { supabase } from '@/lib/supabase';
import PropertyDetailClient from '../property/[id]/property-detail-client';
import { notFound } from 'next/navigation';
import { createSlug } from '@/lib/utils-seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // Return empty array - all slugs will be handled dynamically
  return [];
}

export default async function SlugPropertyPage({ params }: Props) {
  const { slug } = await params;
  
  // Immediate validation: must have 5+ parts for UUID
  const parts = slug.split('-');
  if (parts.length < 5) {
    notFound();
  }
  
  // Extract and validate UUID
  const actualId = parts.slice(-5).join('-');
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
