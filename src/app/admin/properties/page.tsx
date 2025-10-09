
"use client";

import { PlusCircle } from "lucide-react";
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

// Mock Data
import propertiesData from "../../../docs/properties.json";
import usersData from "../../../docs/users.json";


export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching and joining
    const agentMap = new Map(usersData.map(user => [user.uid, user]));
    
    const typedProperties: Property[] = propertiesData.map(p => {
        const agent = agentMap.get(p.landlordId) || usersData.find(u => u.role === 'agent'); // Fallback to first agent
        return {
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            // Ensure agent is not undefined
            agent: agent ? {
                uid: agent.uid,
                firstName: agent.firstName,
                lastName: agent.lastName,
                displayName: agent.displayName,
                email: agent.email,
                role: 'agent',
                agencyName: agent.agencyName,
                createdAt: new Date(agent.createdAt)
            } : { // Provide a default fallback agent object
                uid: 'default-agent',
                firstName: 'Default',
                lastName: 'Agent',
                displayName: 'Default Agent',
                email: 'agent@default.com',
                role: 'agent',
                agencyName: 'Default Agency',
                createdAt: new Date()
            }
        };
    });
    setProperties(typedProperties);
    setIsLoading(false);
  }, []);

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
