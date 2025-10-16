import { supabase } from '@/lib/supabase';
import PropertyDetailClient from '../property/[id]/property-detail-client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SlugPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const parts = slug.split('-');
  if (parts.length < 5) return notFound();
  
  const actualId = parts.slice(-5).join('-');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualId)) return notFound();
  
  const { data } = await supabase.from('properties').select('id').eq('id', actualId).single();
  if (!data) return notFound();
  
  return <PropertyDetailClient id={actualId} />;
}
