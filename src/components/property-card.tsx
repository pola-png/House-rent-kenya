
import Link from 'next/link';
import { MapPin, Bed, Bath, Car, Maximize, Star, Eye, BadgeCheck, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import placeholderImages from '@/lib/placeholder-images.json';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { createPropertyUrl } from '@/lib/utils-seo';
import { OptimizedImage } from './optimized-image';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  // Handle images whether they come as array or need parsing
  const images = Array.isArray(property.images) ? property.images : [];
  const mainImageUrl = images.length > 0 ? images[0] : null;
  const agentPhotoUrl = property.agent?.photoURL;


  const propertyUrl = createPropertyUrl(property.id, property.title);

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link href={propertyUrl} className="block flex flex-col h-full">
        <div className="relative h-56 w-full">
          <OptimizedImage
            src={mainImageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center"}
            alt={`${property.bedrooms} bedroom ${property.propertyType} for ${property.status} in ${property.location}, ${property.city}`}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3">{property.status}</Badge>
           {property.status === 'Rented' && (
              <Badge variant="destructive" className="absolute top-3 right-3">Rented</Badge>
           )}
           {property.isPremium && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1">
                <Award className="w-3 h-3"/>
                Sponsored
              </Badge>
              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">
                <BadgeCheck className="w-3 h-3"/>
                Verified
              </Badge>
            </div>
           )}
        </div>
        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex-grow">
            <div className="text-xl font-bold text-primary">
              Ksh {property.price.toLocaleString()}{property.status === 'For Rent' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
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
                {property.agent && (
                    <>
                      <Avatar className="h-8 w-8">
                        {agentPhotoUrl && <AvatarImage src={agentPhotoUrl} alt={property.agent.displayName} />}
                        <AvatarFallback>{property.agent.displayName?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{property.agent.displayName}</span>
                        {property.agent.agencyName && (
                          <span className="text-xs text-muted-foreground">{property.agent.agencyName}</span>
                        )}
                      </div>
                    </>
                )}
             </div>
             <div className="flex items-center gap-1 text-xs text-muted-foreground">
               <Eye className="h-3 w-3" />
               <span>{property.views || 0}</span>
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
