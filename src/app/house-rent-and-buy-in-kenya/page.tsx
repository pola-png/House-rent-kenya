import Link from 'next/link';
import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'House Rent and Buy in Kenya | Houses for Rent & Sale',
  description: 'Find house rent and buy in Kenya. Browse verified houses for rent and houses for sale across Nairobi, Westlands, Kilimani and more.',
  keywords: [
    'house rent and buy in Kenya',
    'houses for rent and sale Kenya',
    'house rental Kenya',
    'houses for sale Kenya',
    'Kenya homes',
  ],
  openGraph: {
    title: 'House Rent and Buy in Kenya | Houses for Rent & Sale',
    description: 'Find house rent and buy in Kenya with verified listings for rent and sale.',
    url: 'https://houserentkenya.co.ke/house-rent-and-buy-in-kenya',
    type: 'website',
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/house-rent-and-buy-in-kenya',
  },
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    statuses: ['Available', 'For Rent', 'For Sale'],
    propertyType: 'house',
    limit: 18,
  });

  const title = 'House Rent and Buy in Kenya';
  const description = `Find house rent and buy in Kenya. Browse ${all.length}+ verified houses for rent and houses for sale across Nairobi, Westlands, Kilimani and more.`;

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
            url: 'https://houserentkenya.co.ke/house-rent-and-buy-in-kenya',
            mainEntity: {
              '@type': 'RealEstateAgent',
              name: 'House Rent Kenya',
              areaServed: 'Kenya',
              serviceType: 'House Rentals and Sales',
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
        featuredSectionTitle="Featured Houses for Rent and Sale"
        regularSectionTitle="More Houses"
        viewAllLink="/search?property_type=house"
        viewAllText="Browse All Houses"
      />

      <div className="container mx-auto px-4 pb-12">
        <div className="rounded-2xl border bg-secondary/30 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Related Pages</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/property-for-rent-and-sale-in-kenya">Property for Rent and Sale in Kenya</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/house-rent-in-kenya">House Rent in Kenya</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/houses-for-rent-in-kenya">Houses for Rent in Kenya</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto p-3">
              <Link href="/houses-for-sale">Houses for Sale</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
