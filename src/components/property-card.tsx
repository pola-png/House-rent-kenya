'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize, Eye, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createPropertyUrl } from '@/lib/utils-seo';
import { OptimizedImage } from '@/components/optimized-image';
import { toWasabiProxyPath } from '@/lib/wasabi';
import { useImpressionTracking } from '@/hooks/use-impression-tracking';

type PropertyCardProps = {
  property: Property;
};

const MAX_IMAGE_RETRIES = 3;

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const images = Array.isArray(property.images) ? property.images : [];
  const proxiedImages = images.map((img) => toWasabiProxyPath(img)).filter((img) => Boolean(img));
  const mainImageUrl = proxiedImages.length > 0 ? proxiedImages[0] : null;
  const agentPhotoUrl = property.agent?.photoURL;

  const impressionRef = useImpressionTracking({
    propertyId: property.id,
    threshold: 0.6,
    delay: 2000,
  });

  const propertyUrl = createPropertyUrl(property.id, property.title);

  useEffect(() => {
    try { router.prefetch(propertyUrl); } catch {}
  }, [router, propertyUrl]);

  useEffect(() => {
    setImageError(false);
    setRetryCount(0);
    setReloadKey(0);
  }, [mainImageUrl]);

  const handleImageFailure = () => {
    if (retryCount < MAX_IMAGE_RETRIES - 1) {
      setRetryCount((prev) => prev + 1);
      setReloadKey((prev) => prev + 1);
      return;
    }
    setImageError(true);
  };

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
              onError={handleImageFailure}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-wide">
              No image provided
            </div>
          )}
          {property.isPremium && (
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
                <Star className="h-3 w-3 mr-1" />
                PRO
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1">
                VERIFIED
              </Badge>
            </div>
          )}
          {imageError && retryCount >= MAX_IMAGE_RETRIES && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
              <p className="text-xs uppercase tracking-wider mb-2">Image failed to load</p>
              <button
                type="button"
                className="text-xs underline"
                onClick={(event) => {
                  event.preventDefault();
                  setImageError(false);
                  setRetryCount(0);
                  setReloadKey((prev) => prev + 1);
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex-grow">
            <div className="text-xl font-bold text-primary">
              Ksh {property.price.toLocaleString()}
              {property.status === 'For Rent' && (
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              )}
            </div>
            <h3 className="text-lg font-bold font-headline line-clamp-2 break-words hyphens-auto leading-snug" title={property.title}>
              {property.title}
            </h3>
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
                <span>{property.area.toLocaleString()} ftÂ²</span>
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


