import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export const revalidate = 3600;

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    bedrooms: 3,
    status: 'For Rent',
    limit: 20
  });

  return (
    <PromotedPropertiesLayout
      promoted={promoted}
      regular={regular}
      totalProperties={all.length}
      title="3 Bedroom Rent in Kenya - Family Homes"
      description={`Browse ${all.length}+ 3 bedroom properties for rent in Kenya. Spacious homes for families.`}
      featuredSectionTitle="Featured Family Homes"
      regularSectionTitle="More 3 Bedroom Properties"
      viewAllLink="/search?beds=3&type=rent"
      viewAllText="View All 3 Bedroom Properties"
    />
  );
}
