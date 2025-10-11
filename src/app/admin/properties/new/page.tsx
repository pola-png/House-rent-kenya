"use client";

import { PropertyForm } from "../components/property-form";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin/properties/new");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
        <h1 className="text-2xl font-bold font-headline mb-2">Post a Property</h1>
        <p className="text-muted-foreground mb-6">Showcase your property to thousands of potential tenants and buyers.</p>
        <PropertyForm />
    </div>
  )
}
