import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';

export interface PropertyQueryResult {
  promoted: Property[];
  regular: Property[];
  all: Property[];
}

export async function getPropertiesWithPromotion(
  filters: {
    location?: string;
    city?: string;
    bedrooms?: number;
    maxBedrooms?: number;
    status?: string;
    propertyType?: string;
    limit?: number;
  }
): Promise<PropertyQueryResult> {
  let query = supabase.from('properties').select('*');

  // Apply filters
  if (filters.location) {
    query = query.or(`location.ilike.%${filters.location}%,city.ilike.%${filters.location}%`);
  }
  
  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }
  
  if (filters.bedrooms !== undefined) {
    if (filters.maxBedrooms !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms).lte('bedrooms', filters.maxBedrooms);
    } else {
      query = query.eq('bedrooms', filters.bedrooms);
    }
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.propertyType) {
    query = query.ilike('propertyType', `%${filters.propertyType}%`);
  }

  // Order by promotion status first, then by creation date
  query = query
    .order('isPremium', { ascending: false, nullsFirst: false })
    .order('createdAt', { ascending: false });
    
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data } = await query;
  if (!data) return { promoted: [], regular: [], all: [] };

  // Get agent profiles
  const landlordIds = [...new Set(data.map(p => p.landlordId))];
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', landlordIds);
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  // Map properties with agent data
  const propertiesWithAgents = data.map(p => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    agent: profileMap.get(p.landlordId) ? {
      uid: profileMap.get(p.landlordId)!.id,
      firstName: profileMap.get(p.landlordId)!.firstName || '',
      lastName: profileMap.get(p.landlordId)!.lastName || '',
      displayName: profileMap.get(p.landlordId)!.displayName || '',
      email: profileMap.get(p.landlordId)!.email || '',
      role: 'agent' as const,
      agencyName: profileMap.get(p.landlordId)!.agencyName,
      phoneNumber: profileMap.get(p.landlordId)!.phoneNumber,
      photoURL: profileMap.get(p.landlordId)!.photoURL,
      createdAt: new Date(profileMap.get(p.landlordId)!.createdAt)
    } : undefined
  }));

  // Separate promoted and regular properties
  const currentDate = new Date();
  const promoted = propertiesWithAgents.filter(p => 
    p.isPremium && 
    (!p.featuredExpiresAt || new Date(p.featuredExpiresAt) > currentDate)
  );
  const regular = propertiesWithAgents.filter(p => 
    !p.isPremium || 
    (p.featuredExpiresAt && new Date(p.featuredExpiresAt) <= currentDate)
  );

  return { promoted, regular, all: propertiesWithAgents };
}

export function renderPromotedPropertiesSection(
  promoted: Property[],
  regular: Property[],
  sectionTitle: string = "Featured Properties"
) {
  return {
    promoted,
    regular,
    hasPromoted: promoted.length > 0,
    hasRegular: regular.length > 0,
    totalCount: promoted.length + regular.length,
    sectionTitle
  };
}