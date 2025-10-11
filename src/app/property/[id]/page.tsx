'use client';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Bed, Bath, Maximize, MapPin, CheckCircle, Phone, User } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Property, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const { data: userData } = await supabase.auth.admin.getUserById(data.landlordId);
        
        const typedProperty: Property = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          agent: userData?.user ? {
            uid: userData.user.id,
            firstName: userData.user.user_metadata?.firstName || '',
            lastName: userData.user.user_metadata?.lastName || '',
            displayName: userData.user.user_metadata?.displayName || userData.user.email?.split('@')[0] || '',
            email: userData.user.email || '',
            role: userData.user.user_metadata?.role || 'agent',
            agencyName: userData.user.user_metadata?.agencyName,
            phoneNumber: userData.user.user_metadata?.phoneNumber,
            photoURL: userData.user.user_metadata?.photoURL,
            createdAt: new Date(userData.user.created_at)
          } : {
            uid: 'default',
            firstName: 'Property',
            lastName: 'Agent',
            displayName: 'Property Agent',
            email: 'agent@houserent.co.ke',
            role: 'agent',
            agencyName: 'House Rent Kenya',
            phoneNumber: '+254704202939',
            createdAt: new Date()
          }
        };
        setProperty(typedProperty);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[500px] w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
                 <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  const agentPhoneNumber = property.agent?.phoneNumber || '+254704202939';
  
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Apartment",
      "name": property.title,
      "description": property.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.location,
        "addressCountry": "KE"
      },
      "numberOfRooms": property.bedrooms,
      "numberOfBathroomsTotal": property.bathrooms,
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "KSH"
      }
    };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location}, {property.city}</span>
            </div>
          </div>

          <Carousel className="w-full mb-8">
            <CarouselContent>
              {property.images && property.images.length > 0 ? property.images.map((imageUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg">
                    <Image
                      src={imageUrl}
                      alt={`${property.title} - image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              )) : (
                <CarouselItem>
                  <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                    <Building className="h-24 w-24 text-muted-foreground" />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16" />
          </Carousel>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <Badge>{property.propertyType}</Badge>
                      <CardTitle className="text-2xl mt-2">Property Overview</CardTitle>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      Ksh {property.price.toLocaleString()}<span className="text-base font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-x-8 gap-y-4 text-lg border-y py-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Bed className="h-6 w-6 text-primary" />
                      <span className="font-semibold">{property.bedrooms}</span> Bedrooms
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-6 w-6 text-primary" />
                      <span className="font-semibold">{property.bathrooms}</span> Bathrooms
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="h-6 w-6 text-primary" />
                      <span className="font-semibold">{property.area?.toLocaleString()}</span> ft²
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-headline mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>

                  <Separator className="my-8" />

                  <h3 className="text-xl font-bold font-headline mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-muted-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                    <p className="text-sm text-muted-foreground">Marketed By</p>
                    <CardTitle className="font-headline -mt-1">{property.agent.agencyName || "House Rent Kenya"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 border-t pt-4">
                    <Avatar className="h-16 w-16">
                      {property.agent.photoURL && <AvatarImage src={property.agent.photoURL} alt={property.agent.displayName} />}
                      <AvatarFallback>{property.agent.displayName?.charAt(0).toUpperCase() || <User />}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-lg">{property.agent.displayName || 'Property Agent'}</h4>
                      <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full justify-start">
                          <a href={`tel:${agentPhoneNumber}`}>
                              <Phone className="h-4 w-4 mr-2" /> {agentPhoneNumber}
                          </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                          <a href={`https://wa.me/${agentPhoneNumber.replace('+', '')}`}>
                              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.41.39.41.67v2.24c0 .67-.58 1.2-1.25 1.13-2.11-.22-4.08-.94-5.83-2.01-1.93-1.18-3.48-2.82-4.69-4.82-1.07-1.76-1.7-3.66-1.87-5.7-.07-.66.47-1.23 1.14-1.23h2.24c.28 0 .54.16.67.41.34.66.75 1.34 1.22 2.05.17.25.17.58 0 .84l-1.13 1.27c.92 1.93 2.57 3.58 4.5 4.5l1.27-1.13c.26-.26.59-.26.85 0 .71.47 1.39.88 2.05 1.22zM20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02-.37-1.12-.57-2.32-.57-3.57C8.5.94 7.56 0 6.5 0H3C1.9 0 1 .9 1 2c0 9.39 7.61 17 17 17 .9 0 1.5-.5 2-1v-3.5c1.1-.01 2-1.01 2-2.01V15.5z"/></svg>
                              WhatsApp
                          </a>
                      </Button>
                  </div>
                  <div className="border-t pt-4">
                      <Button size="lg" className="w-full" asChild>
                        <a href={`tel:${agentPhoneNumber}`}>
                          Call Agent
                        </a>
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
