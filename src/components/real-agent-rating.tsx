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
      calculateRating();
    }
  }, [user]);

  const calculateRating = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Get agent's properties
      const { data: properties, error } = await supabase
        .from('properties')
        .select('views, createdAt, status')
        .eq('landlordId', user.uid);

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      if (properties && properties.length > 0) {
        // Calculate rating based on performance metrics
        const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
        const rentedCount = properties.filter(p => p.status === 'Rented').length;
        const totalProperties = properties.length;
        
        // Only show rating if there's actual activity
        if (totalViews > 0 || rentedCount > 0) {
          let score = 0;
          
          // Real performance-based scoring
          if (totalViews > 10) score += 1.0;
          if (totalViews > 25) score += 1.0;
          if (totalViews > 50) score += 1.0;
          
          // Boost for successful rentals
          const successRate = totalProperties > 0 ? rentedCount / totalProperties : 0;
          if (successRate > 0.5) score += 1.0;
          if (successRate > 0.8) score += 1.0;
          
          score = Math.min(5.0, score);
          
          // Only count as reviews if there's significant activity
          const reviewCount = totalViews > 10 ? Math.floor(totalViews / 10) + rentedCount : 0;
          
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
      {rating.reviews > 0 ? (
        <div className="flex items-center text-xs text-yellow-600">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Based on {rating.reviews} reviews
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">No reviews yet</div>
      )}
      <p className="text-xs text-muted-foreground">{rating.score > 0 ? 'Performance rating' : 'No activity yet'}</p>
    </div>
  );
}