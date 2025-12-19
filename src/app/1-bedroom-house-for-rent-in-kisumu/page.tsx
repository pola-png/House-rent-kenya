import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export const revalidate = 3600;

export default async function Page() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    location: 'kisumu',
    bedrooms: 1,
    status: 'For Rent',
    limit: 20
  });

  return (
    <PromotedPropertiesLayout
      promoted={promoted}
      regular={regular}
      totalProperties={all.length}
      title="1 Bedroom House for Rent in Kisumu"
      description={`Find ${all.length}+ 1 bedroom properties for rent in Kisumu. Affordable lakeside living.`}
      featuredSectionTitle="Featured Properties in Kisumu"
      regularSectionTitle="More Properties in Kisumu"
      viewAllLink="/search?q=kisumu&beds=1"
      viewAllText="View All Kisumu Properties"
    />
  );
}
