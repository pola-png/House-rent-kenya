import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export const revalidate = 3600;

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    bedrooms: 2,
    status: 'For Rent',
    limit: 20
  });

  return (
    <PromotedPropertiesLayout
      promoted={promoted}
      regular={regular}
      totalProperties={all.length}
      title="2 Bedroom Rent in Kenya - Apartments & Houses"
      description={`Discover ${all.length}+ 2 bedroom properties for rent in Kenya. Perfect for small families & couples.`}
      featuredSectionTitle="Featured 2 Bedroom Properties"
      regularSectionTitle="More 2 Bedroom Properties"
      viewAllLink="/search?beds=2&type=rent"
      viewAllText="View All 2 Bedroom Properties"
    />
  );
}
