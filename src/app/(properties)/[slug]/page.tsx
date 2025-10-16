import { supabase } from '@/lib/supabase';
import PropertyDetailClient from '../../property/[id]/property-detail-client';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SlugPropertyPage({ params }: Props) {
  const { slug } = await params;
  
  const parts = slug.split('-');
  if (parts.length < 5) {
    notFound();
  }
  
  const actualId = parts.slice(-5).join('-');
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidPattern.test(actualId)) {
    notFound();
  }
  
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
