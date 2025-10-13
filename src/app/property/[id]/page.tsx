import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './property-detail-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  return <PropertyDetailClient id={id} />;
}