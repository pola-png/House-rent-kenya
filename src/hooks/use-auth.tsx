
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { UserProfile } from '@/lib/types';
import users from '../../docs/users.json';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string, additionalData: Record<string, any>) => boolean;
  logout: () => void;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock auth implementation using localStorage
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage", error);
      localStorage.removeItem('authUser');
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string): boolean => {
    // This is a mock login. In a real app, you'd verify credentials.
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
        const userProfile = {...foundUser, createdAt: new Date(foundUser.createdAt)}
        localStorage.setItem('authUser', JSON.stringify(userProfile));
        setUser(userProfile);
        return true;
    }
    return false;
  };
  
  const loginWithGoogle = () => {
    // Mock Google login by picking the first agent
    const googleUser = users.find(u => u.role === 'agent');
    if (googleUser) {
        const userProfile = {...googleUser, createdAt: new Date(googleUser.createdAt)}
        localStorage.setItem('authUser', JSON.stringify(userProfile));
        setUser(userProfile);
    }
  }

  const signup = (email: string, pass: string, additionalData: Record<string, any>): boolean => {
    // Mock signup. Check if user exists.
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }
    // In a real app, you would create the user. Here we just log it.
    console.log("Mock signup for:", email, "with data:", additionalData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value = { user, loading, login, signup, logout, loginWithGoogle };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
