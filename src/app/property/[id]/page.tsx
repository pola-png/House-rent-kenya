
"use client";

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Bed, Bath, Maximize, MapPin, CheckCircle, Mail, Phone, User, Terminal, MessageSquare } from 'lucide-react';
import { doc } from 'firebase/firestore';

import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Map } from '@/components/map';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  
  const propertyRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'properties', id);
  }, [firestore, id]);

  const { data: property, isLoading, error } = useDoc<Property>(propertyRef);

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-[500px] w-full mb-8 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property && !isLoading) {
    notFound();
  }
  
  if (error) {
      console.error(error);
      return (
        <div className="container mx-auto px-4 py-12">
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Loading Property</AlertTitle>
                <AlertDescription>
                    There was an issue fetching the property details. Please try again later.
                </AlertDescription>
            </Alert>
        </div>
      )
  }
  
  if (!property) return null; // Should be handled by notFound, but for type safety

  const agentImage = placeholderImages.placeholderImages.find(img => img.id === 'agent_1');

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{property.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Image Carousel */}
        <Carousel className="w-full mb-8">
          <CarouselContent>
            {property.images.map((imageId, index) => {
              const image = placeholderImages.placeholderImages.find(img => img.id === imageId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg">
                    {image ? (
                      <Image
                        src={image.imageUrl}
                        alt={`${property.title} - image ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority={index === 0}
                      />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <Badge>{property.type}</Badge>
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
                    <span className="font-semibold">{property.area.toLocaleString()}</span> ft²
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
                 <Separator className="my-8" />
                 <h3 className="text-xl font-bold font-headline mb-4">Location</h3>
                 <div className="h-[400px] rounded-lg overflow-hidden">
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        <Map property={property} zoom={15} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                            <Alert>
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Map not available</AlertTitle>
                                <AlertDescription>
                                    Please provide a Google Maps API key in your environment variables to display the map.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                  <p className="text-sm text-muted-foreground">Marketed By</p>
                  <CardTitle className="font-headline -mt-1">{property.agent.agencyName || 'Independent Agent'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 border-t pt-4">
                  <Avatar className="h-16 w-16">
                    {agentImage && <AvatarImage src={agentImage.imageUrl} alt={property.agent.displayName} data-ai-hint={agentImage.imageHint} />}
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">{property.agent.displayName}</h4>
                    <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" /> {property.agent.phoneNumber || '0728270000'}
                    </Button>
                     <Button variant="outline" className="w-full justify-start">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.41.39.41.67v2.24c0 .67-.58 1.2-1.25 1.13-2.11-.22-4.08-.94-5.83-2.01-1.93-1.18-3.48-2.82-4.69-4.82-1.07-1.76-1.7-3.66-1.87-5.7-.07-.66.47-1.23 1.14-1.23h2.24c.28 0 .54.16.67.41.34.66.75 1.34 1.22 2.05.17.25.17.58 0 .84l-1.13 1.27c.92 1.93 2.57 3.58 4.5 4.5l1.27-1.13c.26-.26.59-.26.85,0 .71.47 1.39.88 2.05 1.22zM20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02-.37-1.12-.57-2.32-.57-3.57C8.5.94 7.56 0 6.5 0H3C1.9 0 1 .9 1 2c0 9.39 7.61 17 17 17 .9 0 1.5-.5 2-1v-3.5c1.1-.01 2-1.01 2-2.01V15.5z"/></svg>
                        254728000000
                    </Button>
                    <Button variant="secondary" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" /> Message Agent
                    </Button>
                </div>
                 <div className="border-t pt-4">
                    <Button size="lg" className="w-full">Enquire Now</Button>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
