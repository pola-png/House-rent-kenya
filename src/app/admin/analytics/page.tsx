"use client";

import { useEffect, useState } from "react";
import { useAutoRetry } from "@/hooks/use-auto-retry";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Building, DollarSign, Eye, MapPin, Calendar, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Analytics {
  totalUsers: number;
  totalAgents: number;
  totalProperties: number;
  totalRevenue: number;
  activeListings: number;
  featuredListings: number;
  totalViews: number;
  conversionRate: number;
  topCities: { city: string; count: number }[];
  topAgents: { name: string; listings: number; revenue: number }[];
  recentActivity: { type: string; description: string; time: string }[];
  monthlyGrowth: { month: string; users: number; properties: number; revenue: number }[];
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryTick, retryNow] = useAutoRetry(isLoading || !user, [user]);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/admin/dashboard");
      return;
    }
    fetchAnalytics();
  }, [user, router, retryTick]);

  const fetchAnalytics = async () => {
    try {
      const [usersRes, propertiesRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("properties").select("*"),
        supabase.from("payment_requests").select("*").eq("status", "approved"),
      ]);

      const users = usersRes.data || [];
      const properties = propertiesRes.data || [];
      const payments = paymentsRes.data || [];

      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

      const cityCounts = properties.reduce((acc: any, p) => {
        acc[p.city] = (acc[p.city] || 0) + 1;
        return acc;
      }, {});

      const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const agentStats = properties.reduce((acc: any, p) => {
        if (!acc[p.landlordId]) {
          const agent = users.find((u) => u.id === p.landlordId);
          acc[p.landlordId] = {
            name: agent?.displayName || "Unknown",
            listings: 0,
            revenue: 0,
          };
        }
        acc[p.landlordId].listings++;
        return acc;
      }, {});

      const topAgents = Object.values(agentStats)
        .sort((a: any, b: any) => b.listings - a.listings)
        .slice(0, 5);

      setAnalytics({
        totalUsers: users.length,
        totalAgents: users.filter((u) => u.role === "agent").length,
        totalProperties: properties.length,
        totalRevenue,
        activeListings: properties.filter((p) => p.status === "For Rent" || p.status === "For Sale").length,
        featuredListings: properties.filter((p) => p.featured).length,
        totalViews,
        conversionRate: properties.length > 0 ? (payments.length / properties.length) * 100 : 0,
        topCities,
        topAgents: topAgents as any,
        recentActivity: [],
        monthlyGrowth: [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== "admin" || !analytics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights and metrics</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From approved payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{analytics.totalAgents} agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProperties}</div>
            <p className="text-xs text-muted-foreground">{analytics.activeListings} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{analytics.featuredListings} featured</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="locations" className="text-xs sm:text-sm">Locations</TabsTrigger>
          <TabsTrigger value="agents" className="text-xs sm:text-sm">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conversion Rate</span>
                  <Badge>{analytics.conversionRate.toFixed(2)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Revenue per Property</span>
                  <Badge>Ksh {(analytics.totalRevenue / analytics.totalProperties || 0).toFixed(0)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Featured Listings</span>
                  <Badge>{analytics.featuredListings}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Listings</span>
                  <Badge>{analytics.activeListings}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Agents</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(analytics.totalAgents / analytics.totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analytics.totalAgents}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Regular Users</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${((analytics.totalUsers - analytics.totalAgents) / analytics.totalUsers) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analytics.totalUsers - analytics.totalAgents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Cities</CardTitle>
              <CardDescription>Properties by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCities.map((city, index) => (
                  <div key={city.city} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{city.city}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{city.count} properties</div>
                      </div>
                    </div>
                    <div className="w-full sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(city.count / analytics.totalProperties) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
              <CardDescription>By number of listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topAgents.map((agent, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary font-bold text-sm sm:text-base">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{agent.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{agent.listings} listings</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs sm:text-sm">{agent.listings} properties</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
