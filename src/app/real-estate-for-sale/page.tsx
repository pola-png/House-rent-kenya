import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function RealEstateForSalePage() {
  return (
    <SEOLandingPageTemplate
      title="Real Estate for Sale in Kenya - Buy Property"
      description="Browse real estate for sale in Kenya. Houses, land, apartments, and commercial properties. Find your dream property with verified listings and trusted agents."
      filters={{ type: 'buy' }}
      searchUrl="/search?type=buy"
    />
  );
}
