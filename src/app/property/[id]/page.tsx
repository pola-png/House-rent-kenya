import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './property-detail-client';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  
  // Extract actual ID from slug-id format (e.g., "luxury-apartment-westlands-abc123" -> "abc123")
  const actualId = id.includes('-') ? id.split('-').pop() || id : id;
  
  return <PropertyDetailClient id={actualId} />;
}