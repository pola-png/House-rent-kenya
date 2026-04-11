'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth-supabase';
import { useToast } from '@/hooks/use-toast';
import { forceSessionRefresh } from '@/lib/session-utils';

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

    // Handle page visibility changes (switching tabs/apps)
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        // Page became visible again, force refresh session
        const refreshed = await forceSessionRefresh();
        if (!refreshed) {
          // Session refresh failed, reload page
          window.location.reload();
        }
        resetTimer();
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also listen for window focus (when switching back to the tab/window)
    window.addEventListener('focus', handleVisibilityChange);
    
    // Handle page unload/reload to ensure session is saved
    const handleBeforeUnload = () => {
      // Force save session state before leaving
      supabase.auth.getSession();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Start the timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(activityTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, toast]);

  return null; // This component doesn't render anything
}