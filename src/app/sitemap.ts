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

  // SEO-focused landing pages
  const seoPages = [
    {
      url: `${baseUrl}/nairobi-properties`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/house-rent-in-nairobi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/house-rent-in-kenya`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/2-bedroom-rent-in-kenya`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/3-bedroom-rent-in-kenya`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bedsitter-for-rent-in-kasarani`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/1-bedroom-house-for-rent-in-kisumu`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/2-bedroom-house-for-rent-in-mombasa`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/3-bedroom-house-for-rent-in-meru`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/houses-for-rent-in-kenya`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/houses-for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/homes-for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/property-for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/real-estate-for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/real-estate-agents-near-me`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/buy-a-house`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/new-homes-for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/real-estate-listings`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/realtor-near-me`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/1-bedroom-in-kenya`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/1-bedroom-for-rent-in-kenya`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Dynamic property pages with images
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title, updatedAt, status, images, location, city, bedrooms, propertyType')
      .in('status', ['Available', 'For Rent', 'For Sale'])
      .order('updatedAt', { ascending: false })
      .limit(1000);

    if (properties) {
      const slug = (title: string) => title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      
      propertyPages = properties.map((property) => ({
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

  return [...staticPages, ...seoPages, ...propertyPages, ...locationPages, ...typePages];
}