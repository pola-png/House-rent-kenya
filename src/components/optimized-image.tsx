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
  const displaySrc = src;

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const generateAltText = (originalAlt: string, imageSrc: string) => {
    if (originalAlt && originalAlt !== 'Property image' && originalAlt !== 'Image') {
      return originalAlt;
    }
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
          src={displaySrc}
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
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse" 
          style={{ width, height }}
        />
      )}
      <Image
        src={displaySrc}
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
