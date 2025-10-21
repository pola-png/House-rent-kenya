"use client";

import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function CanonicalUrl() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Create canonical URL by removing low-value parameters
    const params = new URLSearchParams(searchParams);
    
    // Keep only high-value parameters for canonical URL
    const keepParams = ['q', 'type', 'property_type', 'beds', 'city'];
    const canonicalParams = new URLSearchParams();
    
    keepParams.forEach(param => {
      const value = params.get(param);
      if (value) {
        canonicalParams.set(param, value);
      }
    });

    // Remove pagination, sorting, and other low-value params
    const removeParams = ['page', 'sort', 'view', 'limit', 'offset'];
    removeParams.forEach(param => {
      canonicalParams.delete(param);
    });

    // Build canonical URL
    const baseUrl = 'https://houserentkenya.co.ke';
    const canonicalUrl = canonicalParams.toString() 
      ? `${baseUrl}${pathname}?${canonicalParams.toString()}`
      : `${baseUrl}${pathname}`;

    // Add new canonical link
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonicalUrl;
    document.head.appendChild(link);

    return () => {
      const linkToRemove = document.querySelector('link[rel="canonical"]');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [searchParams, pathname]);

  return null;
}