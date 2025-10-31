'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth-supabase';
import { useToast } from '@/hooks/use-toast';

export function SessionMonitor() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    let activityTimer: NodeJS.Timeout;
    let warningShown = false;

    const resetTimer = () => {
      clearTimeout(activityTimer);
      warningShown = false;
      
      // Set timer for 90 seconds of inactivity
      activityTimer = setTimeout(() => {
        if (!warningShown) {
          warningShown = true;
          toast({
            title: "Session Warning",
            description: "Your session will expire soon due to inactivity. Click anywhere to stay active.",
            duration: 10000,
          });
        }
      }, 90000); // 90 seconds
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(activityTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, toast]);

  return null; // This component doesn't render anything
}