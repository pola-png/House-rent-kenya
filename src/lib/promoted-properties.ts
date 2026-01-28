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

  // Apply filters with better matching
  if (filters.location) {
    query = query.or(`location.ilike.%${filters.location}%,city.ilike.%${filters.location}%,title.ilike.%${filters.location}%,description.ilike.%${filters.location}%`);
  }
  
  if (filters.city) {
    query = query.or(`city.ilike.%${filters.city}%,location.ilike.%${filters.city}%,title.ilike.%${filters.city}%`);
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
    query = query.or(`propertyType.ilike.%${filters.propertyType}%,title.ilike.%${filters.propertyType}%`);
  }

  // Limit to 6 regular properties for landing pages
  const regularLimit = 6;
  const { data } = await query.limit(regularLimit).order('createdAt', { ascending: false });
  if (!data) return { promoted: [], regular: [], all: [] };

  // Get ALL promoted properties separately
  const { data: promotedData } = await supabase
    .from('properties')
    .select('*')
    .or('isPremium.eq.true,featuredExpiresAt.gt.' + new Date().toISOString())
    .order('createdAt', { ascending: false });

  // Get agent profiles
  const allProperties = [...(promotedData || []), ...data];
  const landlordIds = [...new Set(allProperties.map(p => p.landlordId))];
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', landlordIds);
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  // Map properties with agent data
  const propertiesWithAgents = allProperties.map(p => ({
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

  // Score properties for relevance
  const scoredProperties = propertiesWithAgents.map(p => {
    let score = 0;
    const title = p.title?.toLowerCase() || '';
    const location = p.location?.toLowerCase() || '';
    const city = p.city?.toLowerCase() || '';
    const description = p.description?.toLowerCase() || '';
    
    // Title matches get highest score
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      if (title.includes(searchTerm)) score += 15;
      if (location.includes(searchTerm)) score += 10;
      if (city.includes(searchTerm)) score += 8;
      if (description.includes(searchTerm)) score += 2;
    }
    
    if (filters.propertyType) {
      const propType = filters.propertyType.toLowerCase();
      if (title.includes(propType)) score += 15;
      if (p.propertyType?.toLowerCase().includes(propType)) score += 10;
    }
    
    // Bedroom match bonus
    if (filters.bedrooms && p.bedrooms === filters.bedrooms) score += 5;
    
    return { ...p, relevanceScore: score };
  });

  // Sort by relevance, then by promotion status
  const sortedProperties = scoredProperties
    .filter(p => p.relevanceScore > 0 || (!filters.location && !filters.propertyType))
    .sort((a, b) => {
      // First by promotion status
      const aPromoted = a.isPremium || (a.featuredExpiresAt && new Date(a.featuredExpiresAt) > new Date()) ? 1 : 0;
      const bPromoted = b.isPremium || (b.featuredExpiresAt && new Date(b.featuredExpiresAt) > new Date()) ? 1 : 0;
      if (aPromoted !== bPromoted) return bPromoted - aPromoted;
      
      // Then by relevance score
      if (a.relevanceScore !== b.relevanceScore) return b.relevanceScore - a.relevanceScore;
      
      // Finally by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Separate promoted and regular properties
  const currentDate = new Date();
  const promoted = sortedProperties.filter(p => 
    p.isPremium || 
    (p.featuredExpiresAt && new Date(p.featuredExpiresAt) > currentDate)
  );
  const regular = sortedProperties.filter(p => 
    !p.isPremium && 
    (!p.featuredExpiresAt || new Date(p.featuredExpiresAt) <= currentDate)
  ).slice(0, regularLimit); // Limit regular properties to 6

  return { promoted, regular, all: [...promoted, ...regular] };
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