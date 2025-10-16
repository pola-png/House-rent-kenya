import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function HouseRentNairobiPage() {
  return (
    <SEOLandingPageTemplate
      title="House Rent in Nairobi - Find Apartments & Homes"
      description="Discover houses for rent in Nairobi. Browse 500+ verified properties in Westlands, Kilimani, Karen, Lavington, and all Nairobi neighborhoods. Apartments, family homes, and luxury villas with trusted agents."
      filters={{ location: 'nairobi', type: 'rent' }}
      searchUrl="/search?q=nairobi&type=rent"
    />
  );
}
