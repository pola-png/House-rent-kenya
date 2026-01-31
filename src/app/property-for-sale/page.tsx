import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Property for Sale in Kenya | Land, Houses & Commercial Real Estate',
  description: 'Buy property in Kenya - residential, commercial & land. 1000+ verified listings with clean title deeds. Investment opportunities in Nairobi, Mombasa, Kisumu.',
  keywords: [
    'property for sale Kenya',
    'real estate for sale Kenya',
    'land for sale Kenya',
    'commercial property Kenya',
    'investment property Kenya',
    'buy property Kenya',
    'property investment Kenya',
    'real estate investment Kenya',
    'property deals Kenya'
  ],
  openGraph: {
    title: 'Property for Sale in Kenya | Real Estate Investment Opportunities',
    description: 'Discover premium property investment opportunities in Kenya with verified listings and clean titles.',
    url: 'https://houserentkenya.co.ke/property-for-sale',
    type: 'website'
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/property-for-sale'
  }
};

export default async function Page() {
  const { promoted } = await getPropertiesWithPromotion({
    status: 'For Sale',
    limit: 20
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Property for Sale in Kenya",
            "description": "Buy property in Kenya - residential, commercial and land with verified listings and investment opportunities.",
            "url": "https://houserentkenya.co.ke/property-for-sale",
            "mainEntity": {
              "@type": "RealEstateAgent",
              "name": "House Rent Kenya",
              "areaServed": "Kenya",
              "serviceType": "Property Sales and Real Estate Investment"
            }
          })
        }}
      />
      
      <PromotedPropertiesLayout
        promoted={promoted}
        regular={[]}
        totalProperties={promoted.length}
        title="Featured Properties for Sale in Kenya"
        description={`Discover ${promoted.length} premium featured properties for sale. Verified apartments, houses, land & commercial real estate with investment opportunities across Kenya.`}
        featuredSectionTitle="Featured Properties for Sale"
        regularSectionTitle=""
        viewAllLink="/search?type=buy"
        viewAllText="View All Properties for Sale"
      />
    </>
  );
}