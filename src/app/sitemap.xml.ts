
import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Property, Article, Development } from '@/lib/types';

const { firestore } = initializeFirebase();
const BASE_URL = 'https://houserent.co.ke'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly' },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${BASE_URL}/sitemap`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily' },
    { url: `${BASE_URL}/agents`, lastModified: new Date(), changeFrequency: 'weekly' },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' },
  ];

  // Fetch dynamic routes
  const propertiesSnapshot = await getDocs(collection(firestore, 'properties'));
  const propertyRoutes = propertiesSnapshot.docs.map(doc => {
    const data = doc.data() as Property;
    return {
      url: `${BASE_URL}/property/${doc.id}`,
      lastModified: data.updatedAt.toDate(),
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.8,
    };
  });

  const articlesSnapshot = await getDocs(collection(firestore, 'articles'));
  const articleRoutes = articlesSnapshot.docs.map(doc => {
    // Assuming articles have an 'updatedAt' field, otherwise use a static date
    return {
      url: `${BASE_URL}/advice/${doc.id}`, // Assuming this is the path
      lastModified: new Date(),
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.6,
    };
  });
  
  const developmentsSnapshot = await getDocs(collection(firestore, 'developments'));
  const developmentRoutes = developmentsSnapshot.docs.map(doc => {
    return {
      url: `${BASE_URL}/developments/${doc.id}`, // Assuming this is the path
      lastModified: new Date(),
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...propertyRoutes, ...articleRoutes, ...developmentRoutes];
}
