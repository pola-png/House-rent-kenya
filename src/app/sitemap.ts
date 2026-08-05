import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { COUNTRIES, slugifyCountry } from '@/lib/countries';
import { BRAND } from '@/lib/brand';
import { SEO_SITEMAP_LINKS } from '@/lib/seo-pages';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BRAND.siteUrl;
  
  // Static pages
  const staticPages = [
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
  ];

  // SEO-focused landing pages
  const seoPages = SEO_SITEMAP_LINKS.map((page) => ({
    url: `${baseUrl}${page.href}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page.href.includes('/agents') ? 0.8 : 0.9,
  }));

  // Dynamic property pages with images
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    let allProperties: any[] = [];
    let hasMore = true;
    let page = 0;
    const pageSize = 1000;

    while (hasMore) {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, updatedAt, status, images, location, city, bedrooms, propertyType')
        .in('status', ['Available', 'For Rent', 'For Sale'])
        .order('updatedAt', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) {
        console.error('Error fetching property batch in sitemap:', error);
        break;
      }

      if (!properties || properties.length === 0) {
        hasMore = false;
      } else {
        allProperties = [...allProperties, ...properties];
        if (properties.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    if (allProperties.length > 0) {
      const slug = (title: string) => title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      
      propertyPages = allProperties.map((property) => ({
        url: `${baseUrl}/property/${slug(property.title)}-${property.id}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        images: property.images?.slice(0, 3) || [], // Include up to 3 images per property
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Location-based pages
  const locations = [
    'lagos', 'abuja', 'london', 'manchester', 'dubai', 'abu dhabi', 'new york',
    'toronto', 'vancouver', 'singapore', 'sydney', 'melbourne', 'johannesburg',
    'cape town', 'paris', 'berlin', 'madrid', 'rome', 'tokyo', 'bangkok',
    'mumbai', 'delhi', 'istanbul', 'doha', 'riyadh', 'nairobi', 'accra', 'bali'
  ];

  const locationPages = locations.map(location => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(location)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Property type pages
  const propertyTypes = ['apartment', 'house', 'studio', 'bedsitter', 'mansion', 'townhouse', 'villa', 'penthouse', 'condo'];
  
  const typePages = propertyTypes.map(type => ({
    url: `${baseUrl}/search?property_type=${encodeURIComponent(type)}&amp;type=rent`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const countryPages = COUNTRIES.map((country) => ({
    url: `${baseUrl}/countries/${slugifyCountry(country)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seoPages, ...countryPages, ...propertyPages, ...locationPages, ...typePages];
}
