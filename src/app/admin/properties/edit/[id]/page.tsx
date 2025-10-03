"use client";

import { notFound, useParams } from "next/navigation";
import { PropertyForm } from "../../components/property-form";
import { useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const propertyRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'properties', id);
  }, [firestore, id]);

  const { data: property, isLoading, error } = useDoc<Property>(propertyRef);

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
