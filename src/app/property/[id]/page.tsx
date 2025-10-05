
"use client";

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Bed, Bath, Maximize, MapPin, CheckCircle, Mail, Phone, User, Terminal, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { doc, serverTimestamp, collection, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';

import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Map } from '@/components/map';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDoc, useFirestore, useMemoFirebase, addDocumentNonBlocking, initializeFirebase } from '@/firebase';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';

const { firestore } = initializeFirebase();

export async function generateStaticParams() {
    const propertiesCollection = collection(firestore, 'properties');
    const propertySnapshot = await getDocs(propertiesCollection);
    const properties = propertySnapshot.docs.map(doc => ({ id: doc.id }));
    return properties;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const propertyRef = doc(firestore, 'properties', params.id);
  const propertySnap = await getDoc(propertyRef);

  if (!propertySnap.exists()) {
    return {
      title: 'Property Not Found',
      description: 'The property you are looking for does not exist.',
    };
  }

  const property = propertySnap.data() as Property;
  const image = placeholderImages.placeholderImages.find(img => img.id === property.images[0]);
  const title = `For ${property.status}: ${property.title} in ${property.location}, ${property.city}`;
  const description = property.description.substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://houserent.co.ke/property/${params.id}`, // Replace with your domain
      images: [
        {
          url: image?.imageUrl || '',
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image?.imageUrl || ''],
    }
  };
}


export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();
  
  const propertyRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'properties', id);
  }, [firestore, id]);

  const { data: property, isLoading, error } = useDoc<Property>(propertyRef);
  
  const handleRequestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!property) return;

    const formData = new FormData(event.currentTarget);
    const userName = formData.get('name') as string;
    const userPhone = formData.get('phone') as string;

    if (!userName || !userPhone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your name and phone number.",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
        const callbackRequest = {
            propertyId: property.id,
            propertyTitle: property.title,
            userName,
            userPhone,
            agentId: property.agent.uid,
            status: 'pending' as const,
            createdAt: serverTimestamp(),
        };
        const collectionRef = collection(firestore, 'callback-requests');
        addDocumentNonBlocking(collectionRef, callbackRequest);
        
        toast({
            title: "Request Sent!",
            description: "The agent will contact you shortly to arrange a tour.",
        });
        setDialogOpen(false);
    } catch (e: any) {
        console.error("Error submitting request: ", e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not submit your request.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };


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
  const agentPhoneNumber = property.agent.phoneNumber || '+254704202939';
  
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Apartment",
      "name": property.title,
      "description": property.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.location,
        "addressLocality": property.city,
        "addressCountry": "KE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": property.latitude,
        "longitude": property.longitude
      },
      "image": property.images.map(id => placeholderImages.placeholderImages.find(img => img.id === id)?.imageUrl).filter(Boolean),
      "numberOfRooms": property.bedrooms,
      "numberOfBathroomsTotal": property.bathrooms,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.area,
        "unitCode": "FTS"
      },
      "amenityFeature": property.amenities.map(amenity => ({
          "@type": "LocationFeatureSpecification",
          "name": amenity
      })),
       "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "Ksh",
        "availability": property.status === 'Rented' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        "seller": {
            "@type": "RealEstateAgent",
            "name": property.agent.displayName,
            "telephone": agentPhoneNumber,
            "email": property.agent.email
        }
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location}, {property.city}</span>
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
                      <Button asChild variant="outline" className="w-full justify-start">
                          <a href={`tel:${agentPhoneNumber}`}>
                              <Phone className="h-4 w-4 mr-2" /> {agentPhoneNumber}
                          </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                          <a href={`https://wa.me/${agentPhoneNumber.replace('+', '')}`}>
                              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.41.39.41.67v2.24c0 .67-.58 1.2-1.25 1.13-2.11-.22-4.08-.94-5.83-2.01-1.93-1.18-3.48-2.82-4.69-4.82-1.07-1.76-1.7-3.66-1.87-5.7-.07-.66.47-1.23 1.14-1.23h2.24c.28 0 .54.16.67.41.34.66.75 1.34 1.22 2.05.17.25.17.58 0 .84l-1.13 1.27c.92 1.93 2.57 3.58 4.5 4.5l1.27-1.13c.26-.26.59-.26.85,0 .71.47 1.39.88 2.05 1.22zM20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02-.37-1.12-.57-2.32-.57-3.57C8.5.94 7.56 0 6.5 0H3C1.9 0 1 .9 1 2c0 9.39 7.61 17 17 17 .9 0 1.5-.5 2-1v-3.5c1.1-.01 2-1.01 2-2.01V15.5z"/></svg>
                              WhatsApp
                          </a>
                      </Button>
                      <Button variant="secondary" className="w-full" onClick={() => router.push(`/admin/messages?subject=${encodeURIComponent(`Inquiry about ${property.title}`)}`)}>
                          <MessageSquare className="h-4 w-4 mr-2" /> Message Agent
                      </Button>
                  </div>
                  <div className="border-t pt-4">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="lg" className="w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            Request a Tour
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request a Property Tour</DialogTitle>
                            <DialogDescription>
                              Submit your details and the agent will contact you to schedule a viewing for "{property.title}".
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleRequestSubmit} className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                  <Label htmlFor="name">Your Name</Label>
                                  <Input id="name" name="name" placeholder="John Doe" required />
                              </div>
                              <div className="grid gap-2">
                                  <Label htmlFor="phone">Phone Number</Label>
                                  <Input id="phone" name="phone" placeholder="+254704202939" required />
                              </div>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                              </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
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
