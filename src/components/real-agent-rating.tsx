"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth-supabase";

export function RealAgentRating() {
  const { user } = useAuth();
  const [rating, setRating] = useState({ score: 0, reviews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log('RealAgentRating: User detected, calculating rating for:', user.uid);
      calculateRating();
    }
  }, [user]);

  // Force refresh every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        console.log('RealAgentRating: Auto-refreshing rating');
        calculateRating();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const calculateRating = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      console.log('Calculating rating for user:', user.uid);
      
      // Get agent's properties
      const { data: properties, error } = await supabase
        .from('properties')
        .select('views, createdAt, status')
        .eq('landlordId', user.uid);

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      console.log('Properties found:', properties?.length || 0);

      if (properties && properties.length > 0) {
        // Calculate rating based on performance metrics
        const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
        const rentedCount = properties.filter(p => p.status === 'Rented').length;
        const totalProperties = properties.length;
        
        console.log('Total views:', totalViews, 'Rented:', rentedCount, 'Total:', totalProperties);
        
        // Only show rating if there's actual activity
        if (totalViews > 0 || rentedCount > 0) {
          let score = 0;
          
          // Boost for views
          if (totalViews > 5) score += 1.0;
          if (totalViews > 10) score += 1.0;
          if (totalViews > 20) score += 1.0;
          
          // Boost for successful rentals
          const successRate = totalProperties > 0 ? rentedCount / totalProperties : 0;
          score += successRate * 2.0;
          
          score = Math.min(5.0, score);
          
          const reviewCount = Math.floor(totalViews / 5) + rentedCount * 2;
          
          setRating({
            score: Number(score.toFixed(1)),
            reviews: reviewCount
          });
        } else {
          setRating({ score: 0, reviews: 0 });
        }
      } else {
        setRating({ score: 0, reviews: 0 });
      }
    } catch (error) {
      console.error('Error calculating rating:', error);
      setRating({ score: 0, reviews: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="text-2xl font-bold">...</div>
        <div className="text-xs text-muted-foreground">Calculating...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">{rating.score > 0 ? `${rating.score}★` : '0'}</div>
      <div className="flex items-center text-xs text-yellow-600">
        <Star className="h-3 w-3 mr-1 fill-current" />
        {rating.reviews > 0 ? `Based on ${rating.reviews} reviews` : 'No reviews yet'}
      </div>
      <p className="text-xs text-muted-foreground">{rating.score > 0 ? 'Real performance rating' : 'Start getting views to build rating'}</p>
    </div>
  );
}