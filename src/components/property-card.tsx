'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Car, Maximize, Star, Eye, BadgeCheck, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { createPropertyUrl } from '@/lib/utils-seo';
import { OptimizedImage } from './optimized-image';
import { useImpressionTracking } from '@/hooks/use-impression-tracking';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  // Handle images whether they come as array or need parsing
  const images = Array.isArray(property.images) ? property.images : [];
  const mainImageUrl = images.length > 0 ? images[0] : null;
  const agentPhotoUrl = property.agent?.photoURL;
  
  // Track impressions when card is viewed
  const impressionRef = useImpressionTracking({
    propertyId: property.id,
    threshold: 0.6, // Track when 60% of card is visible
    delay: 2000 // Wait 2 seconds before tracking
  });

  const propertyUrl = createPropertyUrl(property.id, property.title);

  // Proactively prefetch the property route to reduce mobile open time
  useEffect(() => {
    try { router.prefetch(propertyUrl); } catch {}
  }, [router, propertyUrl]);

  useEffect(() => {
    setImageError(false);
    setReloadKey(0);
  }, [mainImageUrl]);

  return (
    <Card ref={impressionRef as any} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link href={propertyUrl} className="block flex flex-col h-full">
        <div className="relative h-56 w-full overflow-hidden bg-muted text-muted-foreground">
          {mainImageUrl ? (
            <OptimizedImage
              key={`${mainImageUrl}-${reloadKey}`}
              src={mainImageUrl}
              alt={`${property.bedrooms} bedroom ${property.propertyType} for ${property.status} in ${property.location}, ${property.city}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-wide">
              No image provided
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
              <p className="text-xs uppercase tracking-wider mb-2">Image failed to load</p>
              <button
                type="button"
                className="text-xs underline"
                onClick={() => {
                  setImageError(false);
                  setReloadKey((prev) => prev + 1);
                }}
              >
                Retry
              </button>
            </div>
          )}
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
            <h3 className="text-lg font-bold font-headline line-clamp-2 break-words hyphens-auto leading-snug" title={property.title}>{property.title}</h3>
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
