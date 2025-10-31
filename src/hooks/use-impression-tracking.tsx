'use client';

import { useEffect, useRef } from 'react';
import { trackPropertyViewDebounced } from '@/lib/view-tracking';

interface UseImpressionTrackingProps {
  propertyId: string;
  threshold?: number; // Percentage of element that needs to be visible
  delay?: number; // Delay before tracking impression
}

export function useImpressionTracking({ 
  propertyId, 
  threshold = 0.5, 
  delay = 1000 
}: UseImpressionTrackingProps) {
  const elementRef = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            // Delay tracking to ensure user actually viewed the property
            setTimeout(() => {
              if (!hasTracked.current) {
                trackPropertyViewDebounced(propertyId);
                hasTracked.current = true;
              }
            }, delay);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [propertyId, threshold, delay]);

  return elementRef;
}