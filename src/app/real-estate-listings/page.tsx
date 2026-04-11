import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Real Estate Listings Kenya | Property Database',
  description: 'Browse comprehensive real estate listings in Kenya. Verified property database with houses, apartments & commercial properties.',
  keywords: 'real estate listings Kenya, property database Kenya, MLS Kenya, property listings',
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
      title="Real Estate Listings Kenya - Property Database"
      description={`Access ${all.length}+ verified real estate listings in Kenya. Complete property database for rent & sale.`}
      featuredSectionTitle="Featured Listings"
      regularSectionTitle="More Property Listings"
      viewAllLink="/search"
      viewAllText="Browse All Listings"
    />
  );
}