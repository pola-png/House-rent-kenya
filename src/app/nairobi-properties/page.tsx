import { Metadata } from 'next';
import { PropertyCard } from '@/components/property-card';
import { supabase } from '@/lib/supabase';
import { PropertySchema } from '@/components/property-schema';
import { SEOSchema } from '@/components/seo-schema';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Properties for Rent in Nairobi - Apartments, Houses & Homes | House Rent Kenya',
  description: 'Find the best properties for rent in Nairobi, Kenya. Browse verified apartments, houses, studios & luxury homes in Westlands, Kilimani, Karen, Lavington & more. 1000+ listings with instant booking.',
  keywords: [
    'nairobi properties for rent',
    'apartments nairobi',
    'houses for rent nairobi',
    'nairobi rental properties',
    'westlands apartments',
    'kilimani houses',
    'karen homes',
    'lavington properties',
    'nairobi real estate'
  ],
  openGraph: {
    title: 'Properties for Rent in Nairobi - Best Apartments & Houses | House Rent Kenya',
    description: 'Discover premium properties for rent in Nairobi. Verified listings in Westlands, Kilimani, Karen & top neighborhoods. Instant booking, virtual tours.',
    url: 'https://houserentkenya.co.ke/nairobi-properties',
    images: ['/nairobi-properties-og.jpg']
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/nairobi-properties'
  }
};

export default async function NairobiPropertiesPage() {
  // Fetch featured Nairobi properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .ilike('city', '%nairobi%')
    .in('status', ['Available', 'For Rent'])
    .order('isPremium', { ascending: false })
    .order('createdAt', { ascending: false })
    .limit(12);

  const neighborhoods = [
    { name: 'Westlands', description: 'Modern apartments and commercial hub' },
    { name: 'Kilimani', description: 'Trendy neighborhood with great amenities' },
    { name: 'Karen', description: 'Upscale residential area with luxury homes' },
    { name: 'Lavington', description: 'Quiet residential with family homes' },
    { name: 'Kileleshwa', description: 'Central location with modern apartments' },
    { name: 'Parklands', description: 'Diverse community with affordable options' }
  ];

  return (
    <>
      <SEOSchema type="search" data={{ properties: properties || [], totalResults: properties?.length || 0 }} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Properties for Rent in Nairobi</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover your perfect home in Kenya's capital city. From modern apartments in Westlands to luxury homes in Karen, 
            find verified properties with instant booking and virtual tours.
          </p>
        </div>

        {/* Neighborhoods Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Nairobi Neighborhoods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((neighborhood) => (
              <div key={neighborhood.name} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{neighborhood.name}</h3>
                <p className="text-muted-foreground mb-4">{neighborhood.description}</p>
                <Button variant="outline" asChild>
                  <Link href={`/search?q=${neighborhood.name}&type=rent`}>
                    View Properties
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Properties in Nairobi</h2>
            <Button variant="outline" asChild>
              <Link href="/search?q=nairobi&type=rent">View All</Link>
            </Button>
          </div>
          
          {properties && properties.length > 0 ? (
            <>
              {/* Separate promoted and regular properties */}
              {(() => {
                const currentDate = new Date();
                const promoted = properties.filter(p => 
                  p.isPremium && 
                  (!p.featuredExpiresAt || new Date(p.featuredExpiresAt) > currentDate)
                );
                const regular = properties.filter(p => 
                  !p.isPremium || 
                  (p.featuredExpiresAt && new Date(p.featuredExpiresAt) <= currentDate)
                );
                
                return (
                  <>
                    {/* Featured Properties */}
                    {promoted.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ⭐ Featured Properties in Nairobi
                          </div>
                          <span className="text-sm text-muted-foreground">({promoted.length})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                          {promoted.map((property) => (
                            <div key={`featured-${property.id}`}>
                              <PropertySchema property={property} />
                              <PropertyCard property={{
                                ...property,
                                createdAt: new Date(property.createdAt),
                                updatedAt: new Date(property.updatedAt),
                                agent: {
                                  uid: 'default-agent',
                                  firstName: 'Default',
                                  lastName: 'Agent',
                                  displayName: 'Default Agent',
                                  email: 'agent@default.com',
                                  role: 'agent',
                                  agencyName: 'Default Agency',
                                  createdAt: new Date()
                                }
                              }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Regular Properties */}
                    {regular.length > 0 && (
                      <div>
                        {promoted.length > 0 && (
                          <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-xl font-semibold">More Properties in Nairobi</h3>
                            <span className="text-sm text-muted-foreground">({regular.length})</span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {regular.map((property) => (
                            <div key={property.id}>
                              <PropertySchema property={property} />
                              <PropertyCard property={{
                                ...property,
                                createdAt: new Date(property.createdAt),
                                updatedAt: new Date(property.updatedAt),
                                agent: {
                                  uid: 'default-agent',
                                  firstName: 'Default',
                                  lastName: 'Agent',
                                  displayName: 'Default Agent',
                                  email: 'agent@default.com',
                                  role: 'agent',
                                  agencyName: 'Default Agency',
                                  createdAt: new Date()
                                }
                              }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
              }
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties available at the moment.</p>
            </div>
          )}
        </section>

        {/* Local Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Living in Nairobi</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-4">
              Nairobi, Kenya's vibrant capital city, offers diverse rental opportunities from modern high-rise apartments 
              to spacious family homes. The city combines urban convenience with natural beauty, featuring excellent 
              shopping centers, restaurants, and proximity to Nairobi National Park.
            </p>
            
            <h3 className="text-lg font-semibold mb-3">Transportation & Connectivity</h3>
            <p className="text-muted-foreground mb-4">
              Excellent public transport including matatus, buses, and the SGR. Major highways connect all neighborhoods, 
              and Jomo Kenyatta International Airport is easily accessible.
            </p>
            
            <h3 className="text-lg font-semibold mb-3">Amenities & Lifestyle</h3>
            <p className="text-muted-foreground mb-4">
              World-class shopping malls like Westgate and Sarit Centre, top hospitals, international schools, 
              and vibrant nightlife. Green spaces include Uhuru Park, Central Park, and nearby Karura Forest.
            </p>
          </div>
        </section>

        {/* Property Types */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Property Types in Nairobi</h2>
          <div className="flex flex-wrap gap-3">
            {['Studio Apartments', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Townhouses', 'Penthouses', 'Serviced Apartments'].map((type) => (
              <Badge key={type} variant="outline" className="text-sm">
                <Link href={`/search?q=nairobi&property_type=${type.toLowerCase()}&type=rent`}>
                  {type}
                </Link>
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}