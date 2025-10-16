import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function HomesForSalePage() {
  return (
    <SEOLandingPageTemplate
      title="Homes for Sale in Kenya - Buy Your Dream Home"
      description="Find homes for sale across Kenya. Luxury villas, family houses, and affordable apartments in Nairobi, Mombasa, Kisumu, and all major cities."
      filters={{ type: 'buy' }}
      searchUrl="/search?type=buy"
    />
  );
}
