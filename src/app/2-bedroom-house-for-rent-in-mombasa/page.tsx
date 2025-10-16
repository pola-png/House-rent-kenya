import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function TwoBedroomMombasaPage() {
  return (
    <SEOLandingPageTemplate
      title="2 Bedroom House for Rent in Mombasa"
      description="Discover 2 bedroom houses for rent in Mombasa. Coastal living with beach access, modern facilities in Nyali, Bamburi, Diani, and all Mombasa areas."
      filters={{ location: 'mombasa', bedrooms: 2, type: 'rent' }}
      searchUrl="/search?q=mombasa&beds=2&type=rent"
    />
  );
}
