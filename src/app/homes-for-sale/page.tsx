import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Homes for Sale in Kenya | Buy Houses & Apartments | Real Estate',
  description: 'Buy homes in Kenya - houses, apartments, condos & luxury properties. 1000+ verified listings in Nairobi, Mombasa, Kisumu. Best prices & financing options.',
  keywords: [
    'homes for sale Kenya',
    'houses for sale Kenya',
    'buy house Kenya',
    'real estate for sale Kenya',
    'property for sale Kenya',
    'apartments for sale Nairobi',
    'luxury homes Kenya',
    'residential property Kenya',
    'buy home Kenya'
  ],
  openGraph: {
    title: 'Homes for Sale in Kenya | Premium Real Estate Properties',
    description: 'Discover premium homes for sale across Kenya. Verified listings with financing options and legal support.',
    url: 'https://houserentkenya.co.ke/homes-for-sale',
    type: 'website'
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/homes-for-sale'
  }
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
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
            "name": "Homes for Sale in Kenya",
            "description": "Buy premium homes in Kenya - houses, apartments and luxury properties with verified listings and financing options.",
            "url": "https://houserentkenya.co.ke/homes-for-sale",
            "mainEntity": {
              "@type": "RealEstateAgent",
              "name": "House Rent Kenya",
              "areaServed": "Kenya",
              "serviceType": "Home Sales and Real Estate"
            }
          })
        }}
      />
      
      <PromotedPropertiesLayout
        promoted={promoted}
        regular={regular}
        totalProperties={all.length}
        title="Homes for Sale in Kenya - Real Estate Properties"
        description={`Find ${all.length}+ homes for sale in Kenya. Houses, apartments, condos & luxury properties available nationwide with verified listings and financing support.`}
        featuredSectionTitle="Featured Homes for Sale"
        regularSectionTitle="More Homes for Sale"
        viewAllLink="/search?type=sale"
        viewAllText="View All Homes for Sale"
      />
    </>
  );
}