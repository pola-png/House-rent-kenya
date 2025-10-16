import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://houserentkenya.co.ke';
  
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

  // Dynamic property pages
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title, updatedAt, status')
      .in('status', ['Available', 'For Rent', 'For Sale'])
      .order('updatedAt', { ascending: false })
      .limit(1000);

    if (properties) {
      const slug = (title: string) => title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      
      propertyPages = properties.flatMap((property) => [
        {
          url: `${baseUrl}/property/${slug(property.title)}-${property.id}`,
          lastModified: new Date(property.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `${baseUrl}/${slug(property.title)}-${property.id}`,
          lastModified: new Date(property.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
      ]);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Location-based pages
  const locations = [
    'nairobi', 'westlands', 'kilimani', 'karen', 'lavington', 'kileleshwa',
    'parklands', 'upperhill', 'south-b', 'south-c', 'langata', 'kasarani',
    'thika', 'kiambu', 'ruiru', 'kikuyu', 'limuru', 'juja', 'runda', 'muthaiga',
    'nyari', 'spring-valley', 'gigiri', 'ridgeways', 'rosslyn', 'mombasa',
    'diani', 'nyali', 'bamburi', 'kisumu', 'nakuru', 'eldoret'
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

  // Additional SEO pages
  return [...staticPages, ...propertyPages, ...locationPages, ...typePages];
}