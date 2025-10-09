'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholderImages from "@/lib/placeholder-images.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Development } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
// Mock data
import developmentsData from "@/docs/developments.json";

export default function DevelopmentsPage() {
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setDevelopments(developmentsData);
    setIsLoading(false);
  }, []);
  
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">New Developments</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover the latest and most exciting new property developments in Kenya.
          </p>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                        <Skeleton className="h-60 w-full" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                         <div className="flex justify-between items-end pt-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <Skeleton className="h-10 w-28" />
                        </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developments?.map((dev) => {
                const image = placeholderImages.placeholderImages.find(img => img.id === dev.imageId);
                return (
                <Card key={dev.id} className="flex flex-col overflow-hidden group">
                    <Link href="#" className="block">
                    <div className="relative h-60 w-full">
                        {image && (
                        <Image
                            src={image.imageUrl}
                            alt={dev.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={image.imageHint}
                        />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge variant="secondary" className="absolute top-3 left-3">{dev.status}</Badge>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-2xl font-headline">{dev.title}</h3>
                            <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-1.5"/>
                                <span>{dev.location}</span>
                            </div>
                        </div>
                    </div>
                    </Link>
                    <CardContent className="p-6 flex-grow flex flex-col">
                    <p className="text-muted-foreground flex-grow mb-4">{dev.description}</p>
                    <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-muted-foreground">Starting From</p>
                                <p className="font-bold text-lg text-primary">{dev.priceRange}</p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="#">
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                    </div>
                    </CardContent>
                </Card>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
}
