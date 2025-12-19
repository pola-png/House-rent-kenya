import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Homes for Sale in Kenya | Real Estate Properties',
  description: 'Find homes for sale in Kenya. Houses, apartments, condos & luxury properties available nationwide with verified listings.',
  keywords: 'homes for sale Kenya, real estate Kenya, property for sale Kenya, buy home Kenya',
};

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    status: 'For Sale',
    limit: 20
  });

  return (
    <PromotedPropertiesLayout
      promoted={promoted}
      regular={regular}
      totalProperties={all.length}
      title="Homes for Sale in Kenya - Real Estate Properties"
      description={`Find ${all.length}+ homes for sale in Kenya. Houses, apartments, condos & luxury properties available nationwide.`}
      featuredSectionTitle="Featured Homes for Sale"
      regularSectionTitle="More Homes for Sale"
      viewAllLink="/search?type=sale"
      viewAllText="View All Homes for Sale"
    />
  );
}