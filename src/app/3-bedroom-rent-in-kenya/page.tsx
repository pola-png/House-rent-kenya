import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function ThreeBedroomRentKenyaPage() {
  return (
    <SEOLandingPageTemplate
      title="3 Bedroom Rent in Kenya - Family Homes & Apartments"
      description="Browse 3 bedroom houses and apartments for rent in Kenya. Spacious family homes in Nairobi, Mombasa, Kisumu, and across Kenya. Modern amenities, secure neighborhoods, verified listings."
      filters={{ bedrooms: 3, type: 'rent' }}
      searchUrl="/search?beds=3&type=rent"
    />
  );
}
