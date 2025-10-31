'use client';

import { useImpressionTracking } from '@/hooks/use-impression-tracking';
import { Property } from '@/lib/types';
import { PropertyCard } from './property-card';

interface PropertyCardWithTrackingProps {
  property: Property;
  className?: string;
}

export function PropertyCardWithTracking({ property, className }: PropertyCardWithTrackingProps) {
  const impressionRef = useImpressionTracking({
    propertyId: property.id,
    threshold: 0.5, // Track when 50% of card is visible
    delay: 2000 // Wait 2 seconds before tracking
  });

  return (
    <div ref={impressionRef as any}>
      <PropertyCard property={property} className={className} />
    </div>
  );
}