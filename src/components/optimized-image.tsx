"use client";

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onError?: () => void;
  onLoad?: () => void;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false, 
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fit = 'cover',
  onError,
  onLoad,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fallback image for properties
  const fallbackSrc = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center";

  // Check if image is from Wasabi (direct) or via our proxy
  const isWasabiImage = src.includes('wasabisys.com') || src.startsWith('/api/image-proxy');
  
  // Convert Wasabi URL to proxy URL; if already proxied, keep as-is
  const getProxiedUrl = (url: string) => {
    if (!isWasabiImage) return url;
    if (url.startsWith('/api/image-proxy')) return url;
    // If this is an already presigned Wasabi URL, we can keep it as-is
    if (/X-Amz-Signature=|X-Amz-Algorithm=/.test(url)) return url;
    const idx = url.indexOf('.com/');
    const path = idx !== -1 ? url.slice(idx + 5) : url;
    return `/api/image-proxy?path=${encodeURIComponent(path)}`;
  };
  
  const displaySrc = getProxiedUrl(src);
  const displayFallback = fallbackSrc;

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Generate descriptive alt text if not provided or generic
  const generateAltText = (originalAlt: string, imageSrc: string) => {
    if (originalAlt && originalAlt !== 'Property image' && originalAlt !== 'Image') {
      return originalAlt;
    }
    
    // Extract property details from URL or context if possible
    if (imageSrc.includes('bedroom')) {
      return 'Modern bedroom interior with natural lighting';
    }
    if (imageSrc.includes('kitchen')) {
      return 'Contemporary kitchen with modern appliances';
    }
    if (imageSrc.includes('living')) {
      return 'Spacious living room with comfortable seating';
    }
    if (imageSrc.includes('bathroom')) {
      return 'Clean modern bathroom with quality fixtures';
    }
    
    return 'Property interior view showing modern amenities and design';
  };

  const optimizedAlt = generateAltText(alt, src);

  if (fill) {
    if (isWasabiImage) {
      return (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={imageError ? displayFallback : displaySrc}
            alt={optimizedAlt}
            className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} absolute inset-0 w-full h-full object-${fit} object-center`}
            onError={handleError}
            onLoad={handleLoad}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </>
      );
    }
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={imageError ? displayFallback : displaySrc}
          alt={optimizedAlt}
          fill
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} object-${fit} object-center`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
          quality={85}
          unoptimized
        />
      </>
    );
  }

  if (isWasabiImage) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {isLoading && (
          <div 
            className="absolute inset-0 bg-muted animate-pulse" 
            style={{ width, height }}
          />
        )}
        <img
          src={imageError ? displayFallback : displaySrc}
          alt={optimizedAlt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} object-${fit} object-center`}
          onError={handleError}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    );
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse" 
          style={{ width, height }}
        />
      )}
      <Image
        src={imageError ? displayFallback : displaySrc}
        alt={optimizedAlt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} object-${fit} object-center`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes}
        quality={85}
        unoptimized
      />
    </div>
  );
}
