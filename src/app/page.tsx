
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building, Home as HomeIcon, MapPin, Search, Star, TrendingUp, Handshake, Verified } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCard } from '@/components/property-card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Property } from '@/lib/types';
import { normalizeWasabiImageArray } from '@/lib/wasabi';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { SEOSchema } from '@/components/seo-schema';


const popularSearches = [
  'Apartments for rent in Kilimani',
  '4 bedroom houses for rent in Karen',
  'Apartments for rent in Westlands',
  'Townhouses for rent in Lavington',
  '3 bedroom apartments in Kileleshwa',
  'Houses for rent in Runda',
  'Penthouses for rent in Nairobi',
  'Beachfront villas in Diani'
];


const features = [
  {
    icon: TrendingUp,
    title: 'Market Trends',
    description: 'Stay ahead of the curve with the latest property market insights and data.'
  },
  {
    icon: Handshake,
    title: 'Trusted Agents',
    description: 'Connect with a network of vetted and experienced real estate agents.'
  },
  {
    icon: Verified,
    title: 'Verified Listings',
    description: 'We ensure all properties are verified, giving you peace of mind in your search.'
  }
];

export default function Home() {
  const heroImageUrl = "https://images.unsplash.com/photo-1664372623516-0b1540d6771e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MHx8fHwxNzU5NDQ3ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080";
  
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchForm, setSearchForm] = useState({
    location: '',
    type: '',
    minBeds: '',
    minPrice: '',
    maxPrice: '',
    listingType: 'rent'
  });

  useEffect(() => {
    fetchFeaturedProperties();
    
    const retryInterval = setInterval(() => {
      if (error) {
        fetchFeaturedProperties();
      }
    }, 10000);
    
    return () => clearInterval(retryInterval);
  }, [error]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchForm.location.trim()) params.set('q', searchForm.location.trim());
    params.set('type', searchForm.listingType);
    if (searchForm.type) params.set('property_type', searchForm.type);
    if (searchForm.minBeds) params.set('beds', searchForm.minBeds);
    if (searchForm.minPrice) params.set('min_price', searchForm.minPrice);
    if (searchForm.maxPrice) params.set('max_price', searchForm.maxPrice);
    
    window.location.href = `/search?${params.toString()}`;
  };

  const fetchFeaturedProperties = async () => {
    try {
      // Fetch properties with premium sorting like search page
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .in('status', ['Available', 'For Rent', 'For Sale'])
        .order('isPremium', { ascending: false, nullsFirst: false })
        .order('createdAt', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Fetch agent profiles for the properties
      const landlordIds = [...new Set((properties || []).map(p => p.landlordId))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', landlordIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const propertiesWithAgents = (properties || []).map(p => {

        const profileData = profileMap.get(p.landlordId);
        return {
          ...p,

          images: normalizeWasabiImageArray(p.images),
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          agent: profileData ? {
            uid: profileData.id,
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            displayName: profileData.displayName || profileData.email?.split('@')[0] || '',
            email: profileData.email || '',
            role: (profileData.role as 'user' | 'agent' | 'admin') || 'agent',
            agencyName: profileData.agencyName,
            phoneNumber: profileData.phoneNumber,
            photoURL: profileData.photoURL,
            createdAt: new Date(profileData.createdAt)
          } : {
            uid: 'default-agent',
            firstName: 'Default',
            lastName: 'Agent',
            displayName: 'Default Agent',
            email: 'agent@default.com',
            role: 'agent' as const,
            agencyName: 'Default Agency',
            createdAt: new Date()
          }
        };
      });

      setFeaturedProperties(propertiesWithAgents);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <SEOSchema type="homepage" />
      <SEOSchema type="organization" />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white" itemScope itemType="https://schema.org/WebSite">
          <Image
            src={heroImageUrl}
            alt="Modern apartment building"
            fill
            priority
            className="object-cover"
            data-ai-hint="modern apartment"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 px-4 w-full max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-headline font-bold mb-3 md:mb-4 drop-shadow-md px-2" itemProp="name">
              Find Your Perfect Home in Kenya
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 md:mb-8 drop-shadow px-4" itemProp="description">
              Kenya's #1 property rental platform. Discover verified apartments & homes in Nairobi, Westlands, Kilimani.
            </p>
            <Tabs value={searchForm.listingType} onValueChange={(value) => setSearchForm(prev => ({...prev, listingType: value}))} className="max-w-3xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 bg-black/50 backdrop-blur-sm border border-white/20">
                    <TabsTrigger value="rent" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white text-xs sm:text-sm">RENT</TabsTrigger>
                    <TabsTrigger value="buy" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white text-xs sm:text-sm">BUY</TabsTrigger>
                    <TabsTrigger value="short-let" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white text-xs sm:text-sm">SHORT</TabsTrigger>
                    <TabsTrigger value="land" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white text-xs sm:text-sm">LAND</TabsTrigger>
                </TabsList>
                <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-b-lg shadow-lg">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-grow">
                              <MapPin className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                              <Input
                                  type="text"
                                  placeholder="Location (e.g., Nairobi)"
                                  className="w-full pl-8 sm:pl-10 text-foreground h-10 sm:h-12 text-sm sm:text-base"
                                  value={searchForm.location}
                                  onChange={(e) => setSearchForm(prev => ({...prev, location: e.target.value}))}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              />
                          </div>
                          <Button size="lg" className="w-full sm:w-auto h-10 sm:h-12" onClick={handleSearch}>
                              <Search className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                              Search
                          </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Select value={searchForm.type || undefined} onValueChange={(value) => setSearchForm(prev => ({...prev, type: value}))}>
                          <SelectTrigger className="text-foreground">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={searchForm.minBeds || undefined} onValueChange={(value) => setSearchForm(prev => ({...prev, minBeds: value}))}>
                          <SelectTrigger className="text-foreground">
                            <SelectValue placeholder="Min Beds" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                         <Select value={searchForm.minPrice || undefined} onValueChange={(value) => setSearchForm(prev => ({...prev, minPrice: value}))}>
                          <SelectTrigger className="text-foreground">
                            <SelectValue placeholder="Min Price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50000">Ksh 50,000</SelectItem>
                            <SelectItem value="100000">Ksh 100,000</SelectItem>
                            <SelectItem value="150000">Ksh 150,000</SelectItem>
                            <SelectItem value="200000">Ksh 200,000</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={searchForm.maxPrice || undefined} onValueChange={(value) => setSearchForm(prev => ({...prev, maxPrice: value}))}>
                          <SelectTrigger className="text-foreground">
                            <SelectValue placeholder="Max Price" />
                          </SelectTrigger>
                           <SelectContent>
                            <SelectItem value="100000">Ksh 100,000</SelectItem>
                            <SelectItem value="200000">Ksh 200,000</SelectItem>
                            <SelectItem value="300000">Ksh 300,000</SelectItem>
                            <SelectItem value="500000">Ksh 500,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                </div>
            </Tabs>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-12 md:py-20 bg-background" itemScope itemType="https://schema.org/ItemList">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-center mb-2 px-4" itemProp="name">Sponsored Premium Properties</h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4" itemProp="description">Verified premium listings featuring the best apartments & homes in Nairobi & across Kenya.</p>
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-56 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {featuredProperties && featuredProperties.map((property, index) => (
                    <div key={property.id} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                      <meta itemProp="position" content={String(index + 1)} />
                      <PropertyCard property={property} />
                    </div>
                ))}
                </div>
            )}
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link href="/search">
                  View All Properties <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* SEO Landing Pages */}
        <section className="py-12 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-center mb-6 sm:mb-10 px-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Rental Properties</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/house-rent-in-kenya">House Rent in Kenya</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/houses-for-rent-in-kenya">Houses for Rent in Kenya</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/house-rent-in-nairobi">House Rent in Nairobi</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/bedsitter-for-rent-in-kasarani">Bedsitter for Rent in Kasarani</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">By Bedroom Count</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/2-bedroom-rent-in-kenya">2 Bedroom Rent in Kenya</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/3-bedroom-rent-in-kenya">3 Bedroom Rent in Kenya</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/1-bedroom-house-for-rent-in-kisumu">1 Bedroom in Kisumu</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/2-bedroom-house-for-rent-in-mombasa">2 Bedroom in Mombasa</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Properties for Sale</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/real-estate-for-sale">Real Estate for Sale</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/homes-for-sale">Homes for Sale</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/houses-for-sale">Houses for Sale</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto p-3">
                    <Link href="/property-for-sale">Property for Sale</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href="/real-estate-agents-near-me">Find Real Estate Agents Near Me</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Popular Searches */}
        <section className="py-12 md:py-20 bg-background" itemScope itemType="https://schema.org/WebPage">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-center mb-6 sm:mb-10 px-4" itemProp="name">Popular Searches</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search, index) => {
                const searchQuery = search.toLowerCase();
                let searchUrl = '/search?';
                
                // Extract property type and location from search text
                if (searchQuery.includes('apartment')) {
                  searchUrl += 'property_type=apartment&';
                }
                if (searchQuery.includes('house')) {
                  searchUrl += 'property_type=house&';
                }
                if (searchQuery.includes('townhouse')) {
                  searchUrl += 'property_type=townhouse&';
                }
                if (searchQuery.includes('penthouse')) {
                  searchUrl += 'property_type=penthouse&';
                }
                if (searchQuery.includes('villa')) {
                  searchUrl += 'property_type=villa&';
                }
                
                // Extract bedroom count
                if (searchQuery.includes('4 bedroom')) {
                  searchUrl += 'beds=4&';
                } else if (searchQuery.includes('3 bedroom')) {
                  searchUrl += 'beds=3&';
                }
                
                // Add location as general search query
                searchUrl += `q=${encodeURIComponent(search)}&type=rent`;
                
                return (
                  <Button key={index} variant="outline" asChild className="bg-background">
                    <Link href={searchUrl}>{search}</Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-12 md:py-20 bg-secondary/50" itemScope itemType="https://schema.org/Service">
          <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Why House Rent Kenya</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4" itemProp="name">Kenya's Most Trusted Platform</h2>
              <p className="text-muted-foreground text-lg mb-12" itemProp="description">
                Join thousands of satisfied tenants and landlords who trust House Rent Kenya for verified properties, instant booking, virtual tours & expert support across Nairobi, Westlands, Kilimani & all Kenya.
              </p>
            </div>
            
            {/* Additional Why Choose Sections */}
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Rental Properties in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Rental properties in Kenya are now easier to access than ever, with verified listings across Nairobi, Mombasa, Kisumu, and more. Whether you're looking for a city apartment or a quiet suburban home, find your ideal rental with trusted agents and secure bookings.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get House Rent in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  House rent in Kenya offers flexible living options for all lifestyles and budgets. From single-room units to spacious family homes, explore a wide range of rental listings in top neighborhoods nationwide—all verified and ready to move in.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Houses for Rent in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Houses for rent in Kenya come in various styles and sizes—from modern townhouses to standalone homes. Find secure, affordable, and well-located houses in Nairobi, Eldoret, Nakuru, and more with easy search and expert support.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get House Rent in Nairobi</h3>
                <p className="text-muted-foreground text-lg">
                  House rent in Nairobi puts you in the center of everything—schools, work, shopping, and entertainment. Discover apartments and homes in Westlands, Kilimani, Kileleshwa, and other prime areas with verified landlords and flexible terms.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get a Bedsitter for Rent in Kasarani</h3>
                <p className="text-muted-foreground text-lg">
                  Bedsitter for rent in Kasarani listings are ideal for students, young professionals, or solo renters. Enjoy affordable, clean, and well-maintained units with access to transport, markets, and essential services in this fast-growing Nairobi suburb.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get 2 Bedroom Rent in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  2 bedroom rent in Kenya is perfect for small families, couples, or roommates. Discover spacious and affordable homes in cities like Nairobi, Mombasa, Kisumu, and more—with great amenities and safe neighborhoods.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get 3 Bedroom Rent in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  3 bedroom rent in Kenya provides comfort and space for larger families or groups. Explore well-designed homes in secure communities with easy access to schools, hospitals, and shopping centers across the country.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get a 1 Bedroom in Kisumu</h3>
                <p className="text-muted-foreground text-lg">
                  1 bedroom in Kisumu is ideal for those seeking a compact and cozy home with lake city charm. Find modern units in secure neighborhoods, perfect for professionals or couples wanting convenience and affordability.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get a 2 Bedroom in Mombasa</h3>
                <p className="text-muted-foreground text-lg">
                  2 bedroom in Mombasa offers the best of coastal living with spacious rentals near beaches, business hubs, and tourist attractions. Live in comfort while enjoying the serene beauty of Kenya's coast.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Properties for Sale in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Properties for sale in Kenya offer unbeatable investment opportunities—from residential plots to commercial buildings. Browse verified listings with clean titles in Nairobi, Mombasa, and emerging towns across the country.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Real Estate for Sale in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Real estate for sale in Kenya is booming with high-return opportunities for investors and dream homes for families. Explore properties in gated communities, town centers, or up-and-coming suburbs—secure and vetted.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Homes for Sale in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Homes for sale in Kenya cater to every lifestyle—from affordable starter homes to luxury residences. Find your ideal property with trusted agents, flexible payment plans, and verified documentation.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Houses for Sale in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Houses for sale in Kenya are available in prime locations nationwide. Whether upgrading or investing, discover secure, move-in-ready homes with modern finishes and strong resale value.
                </p>
              </div>
              
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Get Property for Sale in Kenya</h3>
                <p className="text-muted-foreground text-lg">
                  Property for sale in Kenya includes land, apartments, and houses in growing urban and rural areas. Secure your future with verified listings, ready titles, and expert support every step of the way.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <feature.icon className="h-8 w-8 text-primary" />
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 px-4">Ready to Find Your Dream Home?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Create an account to save your favorite properties and get personalized alerts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
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
