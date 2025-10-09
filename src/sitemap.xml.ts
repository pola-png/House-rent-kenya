import { MetadataRoute } from 'next';
import propertiesData from '@/docs/properties.json';
import articlesData from '@/docs/articles.json';
import developmentsData from '@/docs/developments.json';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://houserent.co.ke';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sitemap`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/agents`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/developments`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/advice`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    const propertyRoutes = propertiesData.map(prop => {
      return {
        url: `${BASE_URL}/property/${prop.id}`,
        lastModified: new Date(prop.updatedAt),
        changeFrequency: 'weekly' as 'weekly',
        priority: 0.8,
      };
    });

    const articleRoutes = articlesData.map(article => {
      return {
        url: `${BASE_URL}/advice/${article.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as 'monthly',
        priority: 0.6,
      };
    });
    
    const developmentRoutes = developmentsData.map(dev => {
      return {
        url: `${BASE_URL}/developments/${dev.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as 'monthly',
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...propertyRoutes, ...articleRoutes, ...developmentRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
