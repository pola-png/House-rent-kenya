import { SEOLandingPageTemplate } from '@/components/seo-landing-page-template';

export default function TwoBedroomRentKenyaPage() {
  return (
    <SEOLandingPageTemplate
      title="2 Bedroom Rent in Kenya - Apartments & Houses"
      description="Find 2 bedroom apartments and houses for rent in Kenya. Browse affordable 2BR properties in Nairobi, Mombasa, Kisumu, and all major cities. Perfect for small families and couples."
      filters={{ bedrooms: 2, type: 'rent' }}
      searchUrl="/search?beds=2&type=rent"
    />
  );
}
