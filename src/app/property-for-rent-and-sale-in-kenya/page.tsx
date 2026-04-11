import Link from 'next/link';
import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Property for Rent and Sale in Kenya | Houses, Apartments & Land',
  description: 'Find property for rent and sale in Kenya. Browse verified houses, apartments, land and commercial listings across Nairobi, Mombasa and other cities.',
  keywords: [
    'property for rent and sale in Kenya',
    'house rent and buy in Kenya',
    'houses for rent and sale Kenya',
    'apartments for rent and sale Kenya',
    'property in Kenya',
    'Kenya real estate',
  ],
  openGraph: {
    title: 'Property for Rent and Sale in Kenya | Houses, Apartments & Land',
    description: 'Find property for rent and sale in Kenya with verified listings across major cities.',
    url: 'https://houserentkenya.co.ke/property-for-rent-and-sale-in-kenya',
    type: 'website',
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/property-for-rent-and-sale-in-kenya',
  },
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    statuses: ['Available', 'For Rent', 'For Sale'],
    limit: 18,
  });

  const title = 'Property for Rent and Sale in Kenya';
  const description = `Find property for rent and sale in Kenya. Browse ${all.length}+ verified houses, apartments, land and commercial listings across Nairobi, Mombasa and other major markets.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            url: 'https://houserentkenya.co.ke/property-for-rent-and-sale-in-kenya',
            mainEntity: {
              '@type': 'RealEstateAgent',
              name: 'House Rent Kenya',
              areaServed: 'Kenya',
              serviceType: 'Property Rentals and Sales',
            },
          }),
        }}
      />

      <PromotedPropertiesLayout
        promoted={promoted}
        regular={regular}
        totalProperties={all.length}
        title={title}
        description={description}
        featuredSectionTitle="Featured Rent and Sale Listings"
        regularSectionTitle="More Property Listings"
        viewAllLink="/search?type=buy"
        viewAllText="Browse All Property Listings"
      />

      <div className="container mx-auto px-4 pb-12">
        <div className="rounded-2xl border bg-secondary/30 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Related Pages</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/house-rent-and-buy-in-kenya">House Rent and Buy in Kenya</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/house-rent-in-kenya">House Rent in Kenya</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/houses-for-sale">Houses for Sale</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/property-for-sale">Property for Sale</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
