
"use client";

import { notFound, useParams } from "next/navigation";
import { PropertyForm } from "../../components/property-form";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

// Mock data
import propertiesData from '@/docs/properties.json';

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
        const foundProperty = propertiesData.find(p => p.id === id);
        if (foundProperty) {
            // Convert date strings to Date objects
            const typedProperty: Property = {
                ...foundProperty,
                createdAt: new Date(foundProperty.createdAt),
                updatedAt: new Date(foundProperty.updatedAt),
            }
            setProperty(typedProperty);
        }
    } catch (e) {
        setError(e as Error);
    } finally {
        setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
        <div>
            <h1 className="text-2xl font-bold font-headline mb-4">Edit Property</h1>
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    )
  }

  if (!property && !isLoading) {
    notFound();
  }
  
  if (error) {
      console.error(error);
      return <div>Error loading property.</div>
  }

  return (
    <div>
        <h1 className="text-2xl font-bold font-headline mb-4">Edit Property</h1>
        {property && (
            <>
                <p className="text-muted-foreground mb-6">Editing property: <span className="font-semibold">{property.title}</span></p>
                <PropertyForm property={property} />
            </>
        )}
    </div>
  )
}
