import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function HousesForSalePage() {
  return (
    <SEOLandingPageTemplate
      title="Houses for Sale in Kenya - Property Listings"
      description="Browse houses for sale in Kenya. New and resale properties in prime locations. Find your perfect home with photos, prices, and agent contacts."
      filters={{ type: 'buy' }}
      searchUrl="/search?type=buy"
    />
  );
}
