'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, additionalData: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          if (mounted) setUser(userProfile);
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      
      if (session?.user) {
        try {
          const userProfile = await fetchUserProfile(session.user);
          if (mounted) {
            setUser(userProfile);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } else {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: User): Promise<UserProfile> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    }

    console.log('Profile from DB:', profile);
    console.log('User metadata:', supabaseUser.user_metadata);

    const metadata = supabaseUser.user_metadata;
    const userProfile = {
      uid: supabaseUser.id,
      email: supabaseUser.email!,
      firstName: profile?.firstName || metadata?.firstName || metadata?.first_name || '',
      lastName: profile?.lastName || metadata?.lastName || metadata?.last_name || '',
      displayName: profile?.displayName || metadata?.displayName || metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
      role: profile?.role || metadata?.role || 'user',
      phoneNumber: profile?.phoneNumber || metadata?.phoneNumber || supabaseUser.phone,
      agencyName: profile?.agencyName || metadata?.agencyName,
      photoURL: profile?.photoURL || metadata?.photoURL || supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at)
    };

    console.log('Final user profile with role:', userProfile.role);
    return userProfile;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const signup = async (email: string, password: string, additionalData: Record<string, any>): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData
        }
      });
      if (error) throw error;
      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = { user, loading, login, signup, logout, loginWithGoogle };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
