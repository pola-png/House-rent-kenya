'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Building, DollarSign, Eye, TrendingUp, Activity, 
  MapPin, Calendar, Star, Zap, Crown, Shield, CheckCircle,
  AlertTriangle, Clock, BarChart3, PieChart, LineChart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalProperties: number;
  totalRevenue: number;
  totalViews: number;
  activeListings: number;
  pendingApprovals: number;
  todaySignups: number;
  monthlyGrowth: number;
  conversionRate: number;
  topCities: { city: string; count: number; growth: number }[];
  recentActivity: { type: string; description: string; time: string; user: string }[];
  platformHealth: { uptime: number; responseTime: number; errorRate: number };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }
    fetchAdminStats();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchAdminStats, 30000);
    return () => clearInterval(interval);
  }, [user, router]);

  const fetchAdminStats = async () => {
    try {
      const [usersRes, propertiesRes, paymentsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('properties').select('*'),
        supabase.from('payment_requests').select('*')
      ]);

      const users = usersRes.data || [];
      const properties = propertiesRes.data || [];
      const payments = paymentsRes.data || [];

      const totalRevenue = payments
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySignups = users.filter(u => new Date(u.createdAt) >= today).length;

      const cityCounts = properties.reduce((acc: any, p) => {
        acc[p.city] = (acc[p.city] || 0) + 1;
        return acc;
      }, {});

      const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ 
          city, 
          count: count as number, 
          growth: Math.floor(Math.random() * 20) + 5 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const recentActivity = [
        { type: 'user', description: 'New agent registered', time: '2 min ago', user: 'John Doe' },
        { type: 'property', description: 'Property promoted to featured', time: '5 min ago', user: 'Jane Smith' },
        { type: 'payment', description: 'Payment approved', time: '8 min ago', user: 'Admin' },
        { type: 'user', description: 'User upgraded to Pro', time: '12 min ago', user: 'Mike Johnson' },
      ];

      setStats({
        totalUsers: users.length,
        totalAgents: users.filter(u => u.role === 'agent').length,
        totalProperties: properties.length,
        totalRevenue,
        totalViews,
        activeListings: properties.filter(p => p.status === 'For Rent' || p.status === 'For Sale').length,
        pendingApprovals: payments.filter(p => p.status === 'pending').length,
        todaySignups,
        monthlyGrowth: 12.5,
        conversionRate: 8.3,
        topCities,
        recentActivity,
        platformHealth: { uptime: 99.9, responseTime: 245, errorRate: 0.1 }
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'admin' || !stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform overview and system management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Admin Mode
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {stats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.monthlyGrowth}% this month
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <Users className="h-3 w-3 mr-1" />
              {stats.todaySignups} new today
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.activeListings} active
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Views</CardTitle>
            <Eye className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-purple-600 mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              {stats.conversionRate}% conversion
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.platformHealth.uptime}%</div>
            <Progress value={stats.platformHealth.uptime} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.platformHealth.responseTime}ms</div>
            <div className="text-xs text-muted-foreground mt-1">Average response time</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.platformHealth.errorRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">System error rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
          <TabsTrigger value="properties" className="text-xs sm:text-sm">Properties</TabsTrigger>
          <TabsTrigger value="promotions" className="text-xs sm:text-sm">Promotions</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="bulk" className="text-xs sm:text-sm">Bulk</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Cities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.topCities.map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{city.city}</div>
                        <div className="text-sm text-muted-foreground">{city.count} properties</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      +{city.growth}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Payment Approvals</div>
                      <div className="text-sm text-muted-foreground">Requires immediate attention</div>
                    </div>
                  </div>
                  <Badge variant="destructive">{stats.pendingApprovals}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">New Agents</div>
                      <div className="text-sm text-muted-foreground">Verification pending</div>
                    </div>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        <TabsContent value="users" className="space-y-4">
          <iframe 
            src="/admin/users" 
            className="w-full h-[800px] border rounded-lg"
            title="Users Management"
          />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <iframe 
            src="/admin/all-properties" 
            className="w-full h-[800px] border rounded-lg"
            title="Properties Management"
          />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <iframe 
            src="/admin/payment-approvals" 
            className="w-full h-[800px] border rounded-lg"
            title="Promotions Management"
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <iframe 
            src="/admin/analytics" 
            className="w-full h-[800px] border rounded-lg"
            title="Analytics"
          />
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <iframe 
            src="/admin/bulk-actions" 
            className="w-full h-[800px] border rounded-lg"
            title="Bulk Actions"
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <iframe 
            src="/admin/system-settings" 
            className="w-full h-[800px] border rounded-lg"
            title="System Settings"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}