import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Bed, Bath, Maximize, MapPin, CheckCircle, Mail, Phone, User } from 'lucide-react';
import { properties } from '@/lib/properties';
import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Map } from '@/components/map';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function PropertyPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

  const agentImage = placeholderImages.placeholderImages.find(img => img.id === property.agent.avatar);

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
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={`${property.title} - image ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority={index === 0}
                      />
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
                <CardTitle className="font-headline">Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {agentImage && <AvatarImage src={agentImage.imageUrl} alt={property.agent.name} data-ai-hint={agentImage.imageHint} />}
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">{property.agent.name}</h4>
                    <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-3">
                    <Button className="w-full">
                        <Phone className="h-4 w-4 mr-2" /> Call Agent
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" /> Email Agent
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
