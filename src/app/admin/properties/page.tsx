"use client";

import { PlusCircle } from "lucide-react";
import Link from 'next/link';
import { collection, query, where } from "firebase/firestore";

import { Button } from "@/components/ui/button";
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
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { PropertiesClient } from "./components/client-page";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPropertiesPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const propertiesRef = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return query(collection(firestore, 'properties'), where('landlordId', '==', user.uid));
  }, [firestore, user]);
  
  const { data: properties, isLoading } = useCollection<Property>(propertiesRef);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold font-headline">Properties</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="#">
              Export
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/properties/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Manage Properties</CardTitle>
            <CardDescription>
              View, edit, and manage all property listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : (
                <PropertiesClient data={properties || []} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
