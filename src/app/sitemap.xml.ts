
import { MetadataRoute } from 'next';
import { firestoreAdmin } from '@/firebase/admin-config';
import type { Property, Article, Development } from '@/lib/types';
import type { Timestamp } from 'firebase-admin/firestore';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://houserent.co.ke';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    // Fetch dynamic routes
    const propertiesSnapshot = await firestoreAdmin.collection('properties').get();
    const propertyRoutes = propertiesSnapshot.docs.map(doc => {
      const data = doc.data() as Property;
      // Convert Admin SDK Timestamp to JS Date
      const lastModified = (data.updatedAt as unknown as Timestamp)?.toDate() || new Date();
      return {
        url: `${BASE_URL}/property/${doc.id}`,
        lastModified: lastModified,
        changeFrequency: 'weekly' as 'weekly',
        priority: 0.8,
      };
    });

    const articlesSnapshot = await firestoreAdmin.collection('articles').get();
    const articleRoutes = articlesSnapshot.docs.map(doc => {
      return {
        url: `${BASE_URL}/advice/${doc.id}`,
        lastModified: new Date(), // Articles don't have a timestamp, use current date
        changeFrequency: 'monthly' as 'monthly',
        priority: 0.6,
      };
    });
    
    const developmentsSnapshot = await firestoreAdmin.collection('developments').get();
    const developmentRoutes = developmentsSnapshot.docs.map(doc => {
      return {
        url: `${BASE_URL}/developments/${doc.id}`,
        lastModified: new Date(), // Developments don't have a timestamp
        changeFrequency: 'monthly' as 'monthly',
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...propertyRoutes, ...articleRoutes, ...developmentRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // In case of error, return only static routes to avoid breaking the build
    return staticRoutes;
  }
}
