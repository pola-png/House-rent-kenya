
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth-supabase';

export const metadata: Metadata = {
  metadataBase: new URL('https://houserentkenya.co.ke'),
  title: {
    default: 'House Rent Kenya - #1 Property Rental Platform | Find Apartments, Houses & Homes',
    template: '%s | House Rent Kenya - Premium Property Rentals',
  },
  description: 'Kenya\'s leading property rental platform. Find verified apartments, houses, studios & luxury homes in Nairobi, Westlands, Kilimani & across Kenya. 10,000+ properties, instant booking, virtual tours.',
  keywords: [
    'house rent kenya', 'property rental kenya', 'apartments nairobi', 'houses for rent kenya',
    'rental homes nairobi', 'real estate kenya', 'property search kenya', 'westlands apartments',
    'kilimani houses', 'karen homes', 'lavington properties', 'kileleshwa rentals',
    'nairobi property rental', 'kenya real estate', 'furnished apartments kenya',
    'studio apartments nairobi', 'bedsitter nairobi', 'mansion rental kenya',
    'townhouse kenya', 'property management kenya', 'landlord kenya', 'tenant kenya'
  ],
  authors: [{ name: 'House Rent Kenya Team' }],
  creator: 'House Rent Kenya',
  publisher: 'House Rent Kenya',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'House Rent Kenya - #1 Property Rental Platform | 10,000+ Verified Properties',
    description: 'Discover your perfect home in Kenya. Browse verified apartments, houses & luxury properties in Nairobi, Westlands, Kilimani. Instant booking, virtual tours, trusted agents.',
    url: 'https://houserentkenya.co.ke',
    siteName: 'House Rent Kenya',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'House Rent Kenya - Premium Property Rentals',
      },
    ],
    locale: 'en_KE',
    type: 'website',
    countryName: 'Kenya',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House Rent Kenya - #1 Property Rental Platform',
    description: 'Find your perfect home in Kenya. 10,000+ verified properties, instant booking, virtual tours.',
    images: ['/twitter-image.jpg'],
    creator: '@HouseRentKenya',
    site: '@HouseRentKenya',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://houserentkenya.co.ke',
    languages: {
      'en-KE': 'https://houserentkenya.co.ke',
      'sw-KE': 'https://houserentkenya.co.ke/sw',
    },
  },
  category: 'Real Estate',
  classification: 'Property Rental Platform',
  referrer: 'origin-when-cross-origin',

  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  appleWebApp: {
    title: 'House Rent Kenya',
    statusBarStyle: 'default',
    capable: true,
  },
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
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://api.supabase.co" />
        <link rel="canonical" href="https://houserentkenya.co.ke" />
        <meta name="msapplication-TileColor" content="#e67e22" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Kenya" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />
        <meta name="language" content="English" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="google-site-verification" content="PASTE_YOUR_VERIFICATION_CODE_HERE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "House Rent Kenya",
              "description": "Kenya's leading property rental platform with 10,000+ verified properties",
              "url": "https://houserentkenya.co.ke",
              "logo": "https://houserentkenya.co.ke/logo.png",
              "image": "https://houserentkenya.co.ke/og-image.jpg",
              "telephone": "+254704202939",
              "email": "info@houserentkenya.co.ke",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KE",
                "addressLocality": "Nairobi",
                "addressRegion": "Nairobi County"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Kenya"
              },
              "serviceType": "Property Rental",
              "priceRange": "KSh 10,000 - KSh 500,000",
              "sameAs": [
                "https://www.facebook.com/houserentkenya",
                "https://twitter.com/houserentkenya",
                "https://www.instagram.com/houserentkenya",
                "https://www.linkedin.com/company/houserentkenya",
                "https://www.youtube.com/@houserentkenya"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "2847",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
