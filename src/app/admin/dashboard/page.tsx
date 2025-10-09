
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Home, Package, Users, List, Building, MapPin, Bed, Bath, Maximize } from "lucide-react";
import type { Property, CallbackRequest } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import placeholderImages from "@/lib/placeholder-images.json";
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data imports
import allProperties from "../../../../docs/properties.json";
import allLeads from "../../../../docs/callback-requests.json";

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<CallbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const typedProperties: Property[] = allProperties.map(p => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) }));
    const typedLeads: CallbackRequest[] = allLeads.map(l => ({ ...l, id: String(l.id), createdAt: new Date(l.createdAt) }));
    
    setProperties(typedProperties);
    setRecentProperties(typedProperties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5));
    setLeads(typedLeads);
    setIsLoading(false);
  }, []);

  const stats = useMemo(() => {
    if (!properties) return null;
    const activeListings = properties.filter(p => p.status !== 'Rented');
    const totalProperties = properties.length;
    const estMonthlyIncome = activeListings.reduce((sum, p) => sum + p.price, 0);

    return {
      totalProperties,
      activeRentals: activeListings.length,
      estMonthlyIncome,
    };
  }, [properties]);

  const totalLeads = useMemo(() => leads?.length || 0, [leads]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-headline tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalProperties}</div>}
            <p className="text-xs text-muted-foreground">All properties you manage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.activeRentals}</div>}
            <p className="text-xs text-muted-foreground">Properties currently on the market</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalLeads}</div>}
            <p className="text-xs text-muted-foreground">From callback requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">
                Ksh {stats?.estMonthlyIncome.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Based on active listings</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
            <CardDescription>An overview of the latest properties you've added.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : recentProperties && recentProperties.length > 0 ? (
                <div className="space-y-4">
                    {recentProperties.map(property => {
                        const image = placeholderImages.placeholderImages.find(img => img.id === property.images[0]);
                        return (
                             <Link key={property.id} href={`/property/${property.id}`} className="block">
                                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                        {image ? (
                                            <Image src={image.imageUrl} alt={property.title} fill className="object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-secondary flex items-center justify-center">
                                                <Building className="h-6 w-6 text-muted-foreground"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold truncate">{property.title}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {property.location}, {property.city}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1"><Bed className="h-3 w-3"/>{property.bedrooms}</span>
                                            <span className="flex items-center gap-1"><Bath className="h-3 w-3"/>{property.bathrooms}</span>
                                            <span className="flex items-center gap-1"><Maximize className="h-3 w-3"/>{property.area} ft²</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <Badge variant={property.status === 'Rented' ? 'destructive' : 'default'}>{property.status}</Badge>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {formatDistanceToNow(property.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <List className="h-12 w-12 mx-auto mb-4" />
                <p className="font-semibold">No recent listings found.</p>
                <p className="text-sm">Add a new property to see it here.</p>
                 <Button size="sm" asChild className="mt-4">
                    <Link href="/admin/properties/new">Post a Property</Link>
                 </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
