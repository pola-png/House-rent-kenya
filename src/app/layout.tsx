
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'House Rent Kenya - Find Your Next Home',
    template: '%s | House Rent Kenya',
  },
  description: 'Search for rental properties in Kenya. Find apartments, houses, and condos for rent with our advanced search and interactive map.',
  keywords: ['house rent kenya', 'property for rent', 'apartments kenya', 'rental homes nairobi', 'real estate kenya'],
  openGraph: {
    title: 'House Rent Kenya - Find Your Next Home',
    description: 'Search for rental properties in Kenya. Find apartments, houses, and condos for rent with our advanced search and interactive map.',
    url: 'https://houserent.co.ke', // Replace with your actual domain
    siteName: 'House Rent Kenya',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1664372623516-0b1540d6771e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MHx8fHwxNzU5NDQ3ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080', // Replace with a default OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House Rent Kenya - Find Your Next Home',
    description: 'Search for rental properties in Kenya. Find apartments, houses, and condos for rent with our advanced search and interactive map.',
     images: ['https://images.unsplash.com/photo-1664372623516-0b1540d6771e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MHx8fHwxNzU5NDQ3ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080'], // Replace with a default Twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e67e22"/>
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
