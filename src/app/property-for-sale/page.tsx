import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export const revalidate = 3600;

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
      title="Property for Sale in Kenya"
      description={`Discover ${all.length}+ properties for sale. Apartments, houses, land & commercial real estate.`}
      featuredSectionTitle="Featured Properties for Sale"
      regularSectionTitle="More Properties for Sale"
      viewAllLink="/search?type=buy"
      viewAllText="View All Properties for Sale"
    />
  );
}