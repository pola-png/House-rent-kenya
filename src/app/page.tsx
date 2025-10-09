
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building, Home as HomeIcon, MapPin, Search, Star, TrendingUp, Handshake, Verified } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCard } from '@/components/property-card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, where, limit } from 'firebase/firestore';


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
  const firestore = useFirestore();

  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'properties'), 
        where('featured', '==', true), 
        limit(6)
    );
  }, [firestore]);

  const { data: featuredProperties, isLoading } = useCollection<Property>(featuredQuery);


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
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
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-md">
              Find your perfect property
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow">
              Kenya's #1 property portal for rentals and sales.
            </p>
            <Tabs defaultValue="rent" className="max-w-3xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 bg-black/50 backdrop-blur-sm border border-white/20">
                    <TabsTrigger value="rent" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white">RENT</TabsTrigger>
                    <TabsTrigger value="buy" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white">BUY</TabsTrigger>
                    <TabsTrigger value="short-let" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white">SHORT LET</TabsTrigger>
                    <TabsTrigger value="land" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white">LAND</TabsTrigger>
                </TabsList>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-b-lg shadow-lg">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row gap-2">
                          <div className="relative flex-grow">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                  type="text"
                                  placeholder="Enter location, e.g., Nairobi, Kilimani"
                                  className="w-full pl-10 text-foreground h-12 text-base"
                              />
                          </div>
                          <Button asChild size="lg" className="w-full md:w-auto h-12">
                              <Link href="/search">
                                  <Search className="mr-2 h-5 w-5" />
                                  Search
                              </Link>
                          </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Select>
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
                        <Select>
                          <SelectTrigger className="text-foreground">
                            <SelectValue placeholder="Min Beds" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                         <Select>
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
                        <Select>
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
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-2">Featured Properties</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">Handpicked listings from our team, featuring the best of what's available for rent right now.</p>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties && featuredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
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
        
        {/* Popular Searches */}
        <section className="py-12 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">Popular Searches</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search, index) => (
                <Button key={index} variant="outline" asChild className="bg-background">
                  <Link href={`/search?q=${encodeURIComponent(search)}`}>{search}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Why House Rent Kenya</Badge>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Your Guide to the Property Market</h2>
              <p className="text-muted-foreground text-lg mb-12">
                We are dedicated to simplifying your property search experience with our comprehensive platform and expert support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
