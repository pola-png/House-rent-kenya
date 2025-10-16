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
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/developments`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic property pages
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, updatedAt, status')
      .eq('status', 'Available')
      .order('updatedAt', { ascending: false })
      .limit(1000);

    if (properties) {
      propertyPages = properties.map((property) => ({
        url: `${baseUrl}/property/${property.id}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
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
    url: `${baseUrl}/search?q=${location}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Property type pages
  const propertyTypes = ['apartment', 'house', 'studio', 'bedsitter', 'mansion', 'townhouse', 'villa', 'penthouse', 'condo'];
  
  const typePages = propertyTypes.map(type => ({
    url: `${baseUrl}/search?property_type=${type}&type=rent`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Additional SEO pages
  const seoPages = [
    { url: `${baseUrl}/agents`, priority: 0.8 },
    { url: `${baseUrl}/advice`, priority: 0.7 },
    { url: `${baseUrl}/blog`, priority: 0.7 },
    { url: `${baseUrl}/search?type=rent`, priority: 0.9 },
    { url: `${baseUrl}/search?type=buy`, priority: 0.9 },
    { url: `${baseUrl}/search?type=short-let`, priority: 0.8 },
  ].map(page => ({
    ...page,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }));

  return [...staticPages, ...propertyPages, ...locationPages, ...typePages, ...seoPages];
}