import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function ThreeBedroomMeruPage() {
  return (
    <SEOLandingPageTemplate
      title="3 Bedroom House for Rent in Meru"
      description="Find spacious 3 bedroom houses for rent in Meru. Family-friendly homes in quiet neighborhoods with modern amenities and secure compounds."
      filters={{ location: 'meru', bedrooms: 3, type: 'rent' }}
      searchUrl="/search?q=meru&beds=3&type=rent"
    />
  );
}
