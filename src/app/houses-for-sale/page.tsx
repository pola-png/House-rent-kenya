import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Houses for Sale in Kenya | Buy Standalone Houses & Villas',
  description: 'Buy houses in Kenya - standalone houses, townhouses, villas & luxury homes. 1000+ verified listings in Nairobi, Karen, Runda. Ready title deeds.',
  keywords: [
    'houses for sale Kenya',
    'standalone houses Kenya',
    'buy house Kenya',
    'townhouses for sale Kenya',
    'villas for sale Kenya',
    'luxury houses Kenya',
    'family homes for sale Kenya',
    'residential houses Kenya',
    'houses for sale Nairobi'
  ],
  openGraph: {
    title: 'Houses for Sale in Kenya | Premium Standalone Homes',
    description: 'Discover premium standalone houses and villas for sale across Kenya with ready title deeds.',
    url: 'https://houserentkenya.co.ke/houses-for-sale',
    type: 'website'
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/houses-for-sale'
  }
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    propertyType: 'House',
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
            "name": "Houses for Sale in Kenya",
            "description": "Buy standalone houses, townhouses and villas in Kenya with verified listings and ready title deeds.",
            "url": "https://houserentkenya.co.ke/houses-for-sale",
            "mainEntity": {
              "@type": "RealEstateAgent",
              "name": "House Rent Kenya",
              "areaServed": "Kenya",
              "serviceType": "House Sales and Property Investment"
            }
          })
        }}
      />
      
      <PromotedPropertiesLayout
        promoted={promoted}
        regular={regular}
        totalProperties={all.length}
        title="Houses for Sale in Kenya - Buy Your Dream Home"
        description={`Discover ${all.length}+ houses for sale in Kenya. Standalone houses, townhouses, villas & luxury homes available for purchase with ready title deeds and financing options.`}
        featuredSectionTitle="Featured Houses for Sale"
        regularSectionTitle="More Houses for Sale"
        viewAllLink="/search?property_type=house&type=sale"
        viewAllText="View All Houses for Sale"
      />
    </>
  );
}