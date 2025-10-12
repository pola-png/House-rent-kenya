"use client";

import { PropertyForm } from "../components/property-form";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin/properties/new");
    }
  }, [user, loading, router]);

  // Check if user has phone number
  if (user && !user.phoneNumber) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Number Required
            </CardTitle>
            <CardDescription>
              You need to add your phone number before posting properties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your phone number helps potential tenants and buyers contact you directly about your properties.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/profile">
                Add Phone Number
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
