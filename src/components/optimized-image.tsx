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
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false, 
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if image is from Wasabi
  const isWasabiImage = src.includes('wasabisys.com');

  // Fallback image for properties
  const fallbackSrc = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center";

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
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
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={imageError ? fallbackSrc : src}
          alt={optimizedAlt}
          fill
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse" 
          style={{ width, height }}
        />
      )}
      <Image
        src={imageError ? fallbackSrc : src}
        alt={optimizedAlt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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