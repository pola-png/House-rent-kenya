import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { COUNTRIES, slugifyCountry } from '@/lib/countries';
import { BRAND } from '@/lib/brand';
import { SEO_SITEMAP_LINKS } from '@/lib/seo-pages';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITEMAP_LIMIT = 5000;

export async function generateSitemaps() {
  try {
    const { count, error } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Available', 'For Rent', 'For Sale']);

    if (error) {
      console.error('Error fetching property count for generateSitemaps:', error);
      return [{ id: 0 }];
    }

    const total = count || 0;
    const numSitemaps = Math.max(1, Math.ceil(total / SITEMAP_LIMIT));

    return Array.from({ length: numSitemaps }, (_, i) => ({ id: i }));
  } catch (error) {
    console.error('Error in generateSitemaps:', error);
    return [{ id: 0 }];
  }
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BRAND.siteUrl;
  
  // If this is sitemap 0, we also include all the static, location, type, and country pages
  const staticPages = id === 0 ? [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/developments`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/advice`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ] : [];

  const seoPages = id === 0 ? SEO_SITEMAP_LINKS.map((page) => ({
    url: `${baseUrl}${page.href}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page.href.includes('/agents') ? 0.8 : 0.9,
  })) : [];

  const locations = [
    'lagos', 'abuja', 'london', 'manchester', 'dubai', 'abu dhabi', 'new york',
    'toronto', 'vancouver', 'singapore', 'sydney', 'melbourne', 'johannesburg',
    'cape town', 'paris', 'berlin', 'madrid', 'rome', 'tokyo', 'bangkok',
    'mumbai', 'delhi', 'istanbul', 'doha', 'riyadh', 'nairobi', 'accra', 'bali'
  ];

  const locationPages = id === 0 ? locations.map(location => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(location)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) : [];

  const propertyTypes = ['apartment', 'house', 'studio', 'bedsitter', 'mansion', 'townhouse', 'villa', 'penthouse', 'condo'];
  
  const typePages = id === 0 ? propertyTypes.map(type => ({
    url: `${baseUrl}/search?property_type=${encodeURIComponent(type)}&type=rent`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) : [];

  const countryPages = id === 0 ? COUNTRIES.map((country) => ({
    url: `${baseUrl}/countries/${slugifyCountry(country)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) : [];

  // Dynamic property pages for this specific chunk
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    const start = id * SITEMAP_LIMIT;
    const end = start + SITEMAP_LIMIT - 1;

    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, updatedAt, status, images')
      .in('status', ['Available', 'For Rent', 'For Sale'])
      .order('updatedAt', { ascending: false })
      .range(start, end);

    if (error) {
      console.error(`Error fetching property batch in sitemap id ${id}:`, error);
    } else if (properties && properties.length > 0) {
      const slug = (title: string) => title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      
      propertyPages = properties.map((property) => ({
        url: `${baseUrl}/property/${slug(property.title || property.id)}-${property.id}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        images: property.images?.slice(0, 3) || [],
      }));
    }
  } catch (error) {
    console.error(`Error generating sitemap chunk ${id}:`, error);
  }

  return [...staticPages, ...seoPages, ...countryPages, ...propertyPages, ...locationPages, ...typePages];
}
