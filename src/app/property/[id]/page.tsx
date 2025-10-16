import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './property-detail-client';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  
  // Extract actual ID from slug-id format
  // Format: "luxury-apartment-westlands-uuid" -> extract UUID after last dash
  // UUIDs contain dashes, so we need to find where slug ends and UUID begins
  let actualId = id;
  
  // Check if this looks like a slug-uuid format (contains multiple dashes)
  if (id.includes('-')) {
    // UUID format: 8-4-4-4-12 characters (with dashes)
    // Try to extract the last part that looks like a UUID
    const parts = id.split('-');
    // If we have enough parts, the last 5 parts form the UUID
    if (parts.length >= 5) {
      actualId = parts.slice(-5).join('-');
    }
  }
  
  return <PropertyDetailClient id={actualId} />;
}