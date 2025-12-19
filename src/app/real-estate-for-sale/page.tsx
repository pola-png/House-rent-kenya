import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Real Estate for Sale in Kenya | Premium Investment Properties',
  description: 'Invest in real estate in Kenya - residential, commercial & land. 1000+ premium investment opportunities with high ROI. Verified listings in prime locations.',
  keywords: [
    'real estate for sale Kenya',
    'investment property Kenya',
    'commercial property Kenya',
    'residential property Kenya',
    'real estate investment Kenya',
    'property investment opportunities',
    'buy real estate Kenya',
    'Kenya property market',
    'real estate deals Kenya'
  ],
  openGraph: {
    title: 'Real Estate for Sale in Kenya | Premium Investment Opportunities',
    description: 'Discover premium real estate investment opportunities in Kenya with verified listings and high ROI potential.',
    url: 'https://houserentkenya.co.ke/real-estate-for-sale',
    type: 'website'
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/real-estate-for-sale'
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
            "name": "Real Estate for Sale in Kenya",
            "description": "Invest in premium real estate in Kenya with verified listings and high ROI investment opportunities.",
            "url": "https://houserentkenya.co.ke/real-estate-for-sale",
            "mainEntity": {
              "@type": "RealEstateAgent",
              "name": "House Rent Kenya",
              "areaServed": "Kenya",
              "serviceType": "Real Estate Investment and Property Sales"
            }
          })
        }}
      />
      
      <PromotedPropertiesLayout
        promoted={promoted}
        regular={regular}
        totalProperties={all.length}
        title="Real Estate for Sale in Kenya - Investment Properties"
        description={`Explore ${all.length}+ real estate properties for sale in Kenya. Premium investment opportunities, residential & commercial properties with verified listings and high ROI potential.`}
        featuredSectionTitle="Featured Investment Properties"
        regularSectionTitle="More Real Estate Opportunities"
        viewAllLink="/search?type=sale"
        viewAllText="View All Real Estate Properties"
      />
    </>
  );
}