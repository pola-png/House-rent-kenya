
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Car, Maximize, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import placeholderImages from '@/lib/placeholder-images.json';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImageId = property.images[0];
  const image = placeholderImages.placeholderImages.find(img => img.id === mainImageId);
  const agentImage = placeholderImages.placeholderImages.find(img => img.id === 'agent_1');


  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link href={`/property/${property.id}`} className="block flex flex-col h-full">
        <div className="relative h-56 w-full">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={property.title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={image.imageHint}
            />
          ) : (
            <div className="bg-muted h-full w-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <Badge className="absolute top-3 left-3">{property.propertyType}</Badge>
           {property.status === 'Rented' && (
              <Badge variant="destructive" className="absolute top-3 right-3">Rented</Badge>
           )}
           {property.featured && (
            <Badge variant="default" className="absolute bottom-3 left-3 bg-accent text-accent-foreground flex items-center gap-1">
                <Star className="w-3 h-3"/>
                Pro
            </Badge>
           )}
        </div>
        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex-grow">
            <div className="text-xl font-bold text-primary">
              Ksh {property.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/month</span>
            </div>
            <h3 className="text-lg font-bold font-headline truncate" title={property.title}>{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
            <div className="pt-3 flex justify-start items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4 text-primary" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-primary" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4 text-primary" />
                <span>{property.area.toLocaleString()} ft²</span>
              </div>
            </div>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
             <div className="flex items-center gap-2">
                {agentImage && property.agent.displayName && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={agentImage.imageUrl} alt={property.agent.displayName} />
                        <AvatarFallback>{property.agent.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <span className="text-xs text-muted-foreground">{property.agent.displayName}</span>
             </div>
             {/* Agency Logo can go here */}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
