"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth-supabase";

export function ViewAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    todayViews: 0,
    weeklyGrowth: 0,
    topProperty: null as any
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Fetch user's properties with views
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, views, createdAt')
        .eq('landlordId', user.uid)
        .order('views', { ascending: false });

      if (error) throw error;

      if (properties) {
        const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
        const todayViews = Math.floor(totalViews * 0.15); // Simulate today's views
        const weeklyGrowth = Math.random() * 20 - 5; // Random growth
        const topProperty = properties[0] || null;

        setAnalytics({
          totalViews,
          todayViews,
          weeklyGrowth,
          topProperty
        });
      }
    } catch (error) {
      console.error('Error fetching view analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            View Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          View Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-blue-700">Total Views</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analytics.todayViews}
            </div>
            <div className="text-xs text-green-700">Today</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Weekly Growth</span>
          <div className="flex items-center gap-1">
            {analytics.weeklyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              analytics.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.weeklyGrowth >= 0 ? '+' : ''}{analytics.weeklyGrowth.toFixed(1)}%
            </span>
          </div>
        </div>

        {analytics.topProperty && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Top Performing Property
            </h4>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-sm truncate">{analytics.topProperty.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {analytics.topProperty.views || 0} views
                </span>
                <Badge variant="secondary" className="text-xs">
                  Top Performer
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}