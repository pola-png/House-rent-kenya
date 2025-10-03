import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import placeholderImages from '@/lib/placeholder-images.json';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImageId = property.images[0];
  const image = placeholderImages.placeholderImages.find(img => img.id === mainImageId);

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <Link href={`/property/${property.id}`} className="block">
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
          <Badge className="absolute top-3 left-3">{property.type}</Badge>
           {property.status === 'Rented' && (
              <Badge variant="destructive" className="absolute top-3 right-3">Rented</Badge>
           )}
        </div>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-bold font-headline truncate" title={property.title}>{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="text-xl font-bold text-primary">
            Ksh {property.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-primary" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-primary" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4 text-primary" />
              <span>{property.area.toLocaleString()} ft²</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
