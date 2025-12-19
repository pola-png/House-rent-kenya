import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Houses for Sale in Kenya | Buy Your Dream Home',
  description: 'Browse houses for sale in Kenya. Standalone houses, townhouses, villas & luxury homes available for purchase with verified listings.',
  keywords: 'houses for sale Kenya, buy house Kenya, homes for sale Kenya, property for sale Kenya',
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    propertyType: 'House',
    status: 'For Sale',
    limit: 20
  });

  return (
    <PromotedPropertiesLayout
      promoted={promoted}
      regular={regular}
      totalProperties={all.length}
      title="Houses for Sale in Kenya - Buy Your Dream Home"
      description={`Discover ${all.length}+ houses for sale in Kenya. Standalone houses, townhouses, villas & luxury homes available for purchase.`}
      featuredSectionTitle="Featured Houses for Sale"
      regularSectionTitle="More Houses for Sale"
      viewAllLink="/search?property_type=house&type=sale"
      viewAllText="View All Houses for Sale"
    />
  );
}