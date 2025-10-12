"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Camera, Video, VolumeX, Volume2, Maximize, RotateCcw } from "lucide-react";
import Image from "next/image";

interface VirtualTourProps {
  propertyId: string;
  images: string[];
  title: string;
}

export function VirtualTour({ propertyId, images, title }: VirtualTourProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const startTour = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      nextImage();
    }, 3000);
    
    setTimeout(() => {
      clearInterval(interval);
      setIsPlaying(false);
    }, images.length * 3000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Virtual Tour - {title}
          </CardTitle>
          <Badge variant="secondary">360° View Available</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video'} rounded-lg overflow-hidden`}>
          {images.length > 0 && (
            <Image
              src={images[currentImageIndex]}
              alt={`${title} - Room ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-all duration-500"
              unoptimized
            />
          )}
          
          {/* Tour Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={isPlaying ? () => setIsPlaying(false) : startTour}
                >
                  <Play className="h-4 w-4 mr-1" />
                  {isPlaying ? 'Pause Tour' : 'Start Tour'}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setCurrentImageIndex(0)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsFullscreen(!isFullscreen)}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            →
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentImageIndex ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>

        {/* Tour Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Image {currentImageIndex + 1} of {images.length}</span>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              <Video className="h-3 w-3 mr-1" />
              HD Quality
            </Badge>
            <Badge variant="outline">
              <Camera className="h-3 w-3 mr-1" />
              360° Available
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}