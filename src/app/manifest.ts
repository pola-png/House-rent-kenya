import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'House Rent Kenya - Find Your Perfect Property',
    short_name: 'House Rent Kenya',
    description: 'Kenya\'s #1 property portal for rentals and sales. Find apartments, houses, and condos for rent across Kenya.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e67e22',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
