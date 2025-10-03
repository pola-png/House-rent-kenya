import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building, Home as HomeIcon, MapPin, Search, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCard } from '@/components/property-card';
import { properties } from '@/lib/properties';
import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';

const propertyTypes = [
  { name: 'Apartments', icon: Building, count: 1203 },
  { name: 'Houses', icon: HomeIcon, count: 874 },
  { name: 'Townhouses', icon: Building, count: 450 },
  { name: 'Villas', icon: HomeIcon, count: 210 },
];

const cities = [
  { name: 'Nairobi', imageId: 'city_nairobi' },
  { name: 'Mombasa', imageId: 'city_mombasa' },
  { name: 'Kisumu', imageId: 'city_kisumu' },
  { name: 'Nakuru', imageId: 'city_nakuru' },
];

const features = [
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Easily find your perfect home with our powerful and intuitive search filters.'
  },
  {
    icon: MapPin,
    title: 'Interactive Maps',
    description: 'Explore properties in your desired neighborhood with our integrated map view.'
  },
  {
    icon: Star,
    title: 'Verified Listings',
    description: 'We ensure all properties are verified, giving you peace of mind in your search.'
  }
];

export default function Home() {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 6);
  const heroImage = placeholderImages.placeholderImages.find(img => img.id === 'hero_main');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Modern apartment building"
              fill
              priority
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-md">
              Find Your Next Home in Kenya
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow">
              Discover the best rental properties in prime locations across the country.
            </p>
            <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter location, e.g., Nairobi, Kilimani"
                    className="w-full pl-10 text-foreground"
                  />
                </div>
                <Button asChild size="lg" className="w-full md:w-auto">
                  <Link href="/search">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-2">Featured Properties</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">Handpicked listings from our team, featuring the best of what's available for rent right now.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link href="/search">
                  View All Properties <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Browse by Property Type */}
        <section className="py-12 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">Browse by Property Type</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {propertyTypes.map((type) => (
                <Card key={type.name} className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <type.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">{type.name}</h3>
                    <p className="text-muted-foreground">{type.count} properties</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Our Cities */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">Explore Our Cities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cities.map((city) => {
                const cityImage = placeholderImages.placeholderImages.find(img => img.id === city.imageId);
                return cityImage ? (
                  <Link href={`/search?location=${city.name}`} key={city.name}>
                    <div className="relative h-80 rounded-lg overflow-hidden group">
                      <Image
                        src={cityImage.imageUrl}
                        alt={`View of ${city.name}`}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={cityImage.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-2xl font-bold font-headline text-white">{city.name}</h3>
                      </div>
                    </div>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-12 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Why House Rent Kenya</Badge>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Your Trusted Partner in Finding a Home</h2>
              <p className="text-muted-foreground text-lg mb-12">
                We are dedicated to simplifying your property search experience with our comprehensive platform and expert support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary rounded-full">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Create an account to save your favorite properties and get personalized alerts.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/search">Start Searching</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
