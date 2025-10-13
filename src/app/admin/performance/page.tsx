'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, BarChart, Eye, Handshake, Target, CheckCircle } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Property, CallbackRequest } from '@/lib/types';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState, useEffect } from 'react';

// Mock data imports
import allProperties from "@/lib/docs/properties.json";
import allLeads from "@/lib/docs/callback-requests.json";

export default function PerformancePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<CallbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const typedProperties: Property[] = allProperties.map(p => ({ 
      ...p, 
      createdAt: new Date(p.createdAt), 
      updatedAt: new Date(p.updatedAt),
      status: p.status as "For Rent" | "For Sale" | "Short Let" | "Land" | "Rented" | "Sold"
    }));
    const typedLeads: CallbackRequest[] = allLeads.map(l => ({ 
      ...l, 
      id: String(l.id), 
      createdAt: new Date(l.createdAt),
      status: l.status as "pending" | "contacted"
    }));

    setProperties(typedProperties);
    setLeads(typedLeads);
    setIsLoading(false);
  }, []);

  const stats = useMemo(() => {
    if (!properties) return null;
    const activeListings = properties.filter((p) => p.status !== 'Rented').length;
    const rentedListings = properties.filter((p) => p.status === 'Rented').length;
    const totalListings = properties.length;
    const totalLeads = leads?.length || 0;
    const successRate = totalListings > 0 ? (rentedListings / totalListings) * 100 : 0;
    return { activeListings, rentedListings, totalLeads, successRate };
  }, [properties, leads]);

  const listingsByCity = useMemo(() => {
    if (!properties) return [];
    const cityCounts: { [key: string]: number } = {};
    properties.forEach((p) => {
      cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    });
    return Object.keys(cityCounts).map((city) => ({
      name: city,
      listings: cityCounts[city],
    }));
  }, [properties]);

  const leadsByDate = useMemo(() => {
    if (!leads) return [];
    const thirtyDaysAgo = subDays(new Date(), 29);
    const dateRange = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });

    const leadsPerDay = dateRange.map(date => {
        const formattedDate = format(date, 'MMM d');
        return { name: formattedDate, leads: 0 };
    });
    
    leads.forEach(lead => {
        if (lead.createdAt) {
            const leadDate = lead.createdAt;
            if (leadDate >= thirtyDaysAgo) {
                const formattedDate = format(leadDate, 'MMM d');
                const dayData = leadsPerDay.find(d => d.name === formattedDate);
                if (dayData) {
                    dayData.leads++;
                }
            }
        }
    });

    return leadsPerDay;
  }, [leads]);
  

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <AreaChart className="h-8 w-8" />
          Performance Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Analyze the performance of your listings with detailed analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16"/> : <div className="text-2xl font-bold">{stats?.activeListings}</div>}
            <p className="text-xs text-muted-foreground">Properties currently on the market</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16"/> : <div className="text-2xl font-bold">{stats?.totalLeads}</div>}
             <p className="text-xs text-muted-foreground">From callback requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Rented</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-16"/> : <div className="text-2xl font-bold">{stats?.rentedListings}</div>}
             <p className="text-xs text-muted-foreground">Total closed deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-16"/> : <div className="text-2xl font-bold">{stats?.successRate.toFixed(1)}%</div>}
            <p className="text-xs text-muted-foreground">Based on rented vs. total listings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listings by City</CardTitle>
            <CardDescription>Distribution of your properties across different cities.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-[300px] w-full"/>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={listingsByCity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        content={({ active, payload, label }) =>
                            active && payload && payload.length ? (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <p className="font-bold">{label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {`Listings: ${payload[0].value}`}
                                </p>
                            </div>
                            ) : null
                        }
                    />
                    <Bar dataKey="listings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
            <CardDescription>Callback requests received in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <Skeleton className="h-[300px] w-full"/>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={leadsByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <Tooltip
                         content={({ active, payload, label }) =>
                            active && payload && payload.length ? (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <p className="font-bold">{label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {`Leads: ${payload[0].value}`}
                                </p>
                            </div>
                            ) : null
                        }
                    />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
