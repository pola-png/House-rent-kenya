"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Heart, MapPin, Star } from "lucide-react";
import { PropertyCard } from "./property-card";
import type { Property } from "@/lib/types";

interface AIRecommendationsProps {
  userPreferences?: {
    budget: number;
    location: string;
    propertyType: string;
    bedrooms: number;
  };
  viewedProperties?: string[];
}

export function AIRecommendations({ userPreferences, viewedProperties = [] }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState<'similar' | 'trending' | 'budget'>('similar');

  useEffect(() => {
    // Simulate AI recommendation logic
    const generateRecommendations = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock recommendations based on type
        const mockRecommendations: Property[] = [
          // This would be replaced with actual AI-generated recommendations
        ];
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1000);
    };

    generateRecommendations();
  }, [recommendationType, userPreferences, viewedProperties]);

  const recommendationTypes = [
    { key: 'similar', label: 'Similar Properties', icon: Heart },
    { key: 'trending', label: 'Trending Now', icon: TrendingUp },
    { key: 'budget', label: 'Budget Friendly', icon: Star }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Smart Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommendation Type Selector */}
        <div className="flex gap-2 overflow-x-auto">
          {recommendationTypes.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={recommendationType === key ? "default" : "outline"}
              size="sm"
              onClick={() => setRecommendationType(key as any)}
              className="flex-shrink-0"
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900">AI Insight</h4>
              <p className="text-sm text-purple-700 mt-1">
                {recommendationType === 'similar' && "Based on your viewing history, you prefer modern apartments in Westlands area with 2-3 bedrooms."}
                {recommendationType === 'trending' && "These properties are getting 40% more views this week and are likely to be rented quickly."}
                {recommendationType === 'budget' && "These properties offer the best value for money in your preferred locations."}
              </p>
            </div>
          </div>
        </div>

        {/* Personalized Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-xs text-green-700">Match Score</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">15min</div>
            <div className="text-xs text-blue-700">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">4.8★</div>
            <div className="text-xs text-purple-700">Agent Rating</div>
          </div>
        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recommendations available yet.</p>
                <p className="text-sm">Browse more properties to get personalized suggestions!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {recommendations.map((property) => (
                  <div key={property.id} className="relative">
                    <PropertyCard property={property} />
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                      AI Pick
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Smart Alerts */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Smart Alerts</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>New property matching your criteria in Kilimani</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Price drop alert: 3 properties reduced by 10%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Market trend: Westlands prices up 5% this month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}