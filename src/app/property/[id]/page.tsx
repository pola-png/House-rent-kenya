import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PropertyDetailClient from './property-detail-client';

interface Props {
  params: { id: string };
}



export default function PropertyPage({ params }: Props) {
  return <PropertyDetailClient id={params.id} />;
}