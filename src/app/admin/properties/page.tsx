"use client";

import { PlusCircle, FileUp } from "lucide-react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import { PropertiesClient } from "./components/client-page";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [retryTick, setRetryTick] = useState(0);
  const [startedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/admin/properties");
      return;
    }
    fetchProperties();
  }, [user, authLoading, retryTick]);

  // If loading takes too long, auto-retry and also retry when network comes back
  useEffect(() => {
    const t = setTimeout(() => {
      if ((isLoading || authLoading) && Date.now() - startedAt > 7000) {
        setRetryTick((x) => x + 1);
      }
    }, 7500);
    const onOnline = () => setRetryTick((x) => x + 1);
    try { window.addEventListener('online', onOnline); } catch {}
    return () => {
      clearTimeout(t);
      try { window.removeEventListener('online', onOnline); } catch {}
    };
  }, [isLoading, authLoading, startedAt]);

  const fetchProperties = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlordId', user.uid)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const typedProperties: Property[] = (data || []).map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        agent: {
          uid: user.uid,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          agencyName: user.agencyName,
          photoURL: user.photoURL,
          createdAt: user.createdAt
        }
      }));

      setProperties(typedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold font-headline">Properties</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="#">
              <FileUp className="h-4 w-4 mr-2" />
              Export
            </Link>
          </Button>
          <Button size="sm" asChild className="w-full sm:w-auto">
            <Link href="/admin/properties/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Properties</CardTitle>
            <CardDescription>
              View, edit, and manage all property listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || authLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setRetryTick((x) => x + 1)}>Reload now</Button>
                      <span className="text-xs text-muted-foreground">If this takes too long, click Reload.</span>
                    </div>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="font-semibold mb-2">No properties yet</p>
                  <p className="text-sm mb-4">Start by posting your first property listing.</p>
                  <Button asChild>
                    <Link href="/admin/properties/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Post a Property
                    </Link>
                  </Button>
                </div>
            ) : (
                <PropertiesClient data={properties} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
