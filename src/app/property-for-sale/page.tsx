import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function PropertyForSalePage() {
  return (
    <SEOLandingPageTemplate
      title="Property for Sale in Kenya - Real Estate Listings"
      description="Explore property for sale in Kenya. Residential, commercial, and land for sale. Browse verified listings with detailed information and agent support."
      filters={{ type: 'buy' }}
      searchUrl="/search?type=buy"
    />
  );
}
