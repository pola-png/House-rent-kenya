import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from '../property/[id]/property-detail-client';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SlugPropertyPage({ params }: Props) {
  const { slug } = await params;
  
  // Exclude non-property routes
  const excludedRoutes = [
    'login', 'signup', 'admin', 'api', 'search', 'agents', 'about', 
    'contact', 'blog', 'advice', 'developments', 'careers', 'privacy', 
    'terms', 'forgot-password', 'reset-password', 'property'
  ];
  
  if (excludedRoutes.includes(slug.split('-')[0])) {
    notFound();
  }
  
  // Extract UUID from slug (last 5 parts separated by dashes)
  let actualId = slug;
  
  if (slug.includes('-')) {
    const parts = slug.split('-');
    if (parts.length >= 5) {
      actualId = parts.slice(-5).join('-');
    }
  }
  
  // Verify this is actually a property ID before rendering
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
