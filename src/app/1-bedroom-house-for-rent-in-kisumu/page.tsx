import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function OneBedroomKisumuPage() {
  return (
    <SEOLandingPageTemplate
      title="1 Bedroom House for Rent in Kisumu"
      description="Find 1 bedroom houses and apartments for rent in Kisumu. Affordable rentals near Lake Victoria with modern amenities and easy access to the city center."
      filters={{ location: 'kisumu', bedrooms: 1, type: 'rent' }}
      searchUrl="/search?q=kisumu&beds=1&type=rent"
    />
  );
}
