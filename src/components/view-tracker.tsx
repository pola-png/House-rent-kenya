"use client";

import { useState, useEffect } from "react";
import { Eye, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface ViewTrackerProps {
  propertyId: string;
  initialViews?: number;
}

export function ViewTracker({ propertyId, initialViews = 0 }: ViewTrackerProps) {
  const [views, setViews] = useState(initialViews);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Set up real-time subscription for view updates
    const channel = supabase
      .channel(`property-${propertyId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${propertyId}`
        },
        (payload) => {
          if (payload.new && typeof payload.new.views === 'number') {
            setViews(payload.new.views);
            setIsLive(true);
            // Reset live indicator after 2 seconds
            setTimeout(() => setIsLive(false), 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Eye className={`h-4 w-4 ${isLive ? 'text-green-600' : ''}`} />
        <span className={isLive ? 'text-green-600 font-medium' : ''}>
          {views.toLocaleString()} views
        </span>
      </div>
      {isLive && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          Live
        </Badge>
      )}
    </div>
  );
}