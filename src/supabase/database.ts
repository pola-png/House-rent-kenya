'use client';

import { supabase } from './client';
import type { Property, User } from '@/lib/types';

// Properties
export const getProperties = async (filters?: any) => {
  let query = supabase.from('properties').select('*');
  
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters?.minPrice) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
  if (filters?.bedrooms) query = query.eq('bedrooms', filters.bedrooms);
  if (filters?.bathrooms) query = query.eq('bathrooms', filters.bathrooms);
  if (filters?.featured) query = query.eq('featured', filters.featured);
  if (filters?.status) query = query.eq('status', filters.status);
  else query = query.eq('status', 'active');
  
  if (filters?.limit) query = query.limit(filters.limit);
  
  return await query.order('created_at', { ascending: false });
};

export const getProperty = async (id: string) => {
  return await supabase.from('properties').select('*').eq('id', id).single();
};

export const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
  return await supabase.from('properties').insert({
    ...property,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).select().single();
};

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  return await supabase.from('properties').update({
    ...updates,
    updated_at: new Date().toISOString()
  }).eq('id', id).select().single();
};

export const deleteProperty = async (id: string) => {
  return await supabase.from('properties').delete().eq('id', id);
};

// Users
export const getUsers = async (filters?: { role?: string }) => {
  let query = supabase.from('users').select('*');
  if (filters?.role) query = query.eq('role', filters.role);
  return await query;
};

export const getUser = async (id: string) => {
  return await supabase.from('users').select('*').eq('id', id).single();
};

export const createUser = async (user: Omit<User, 'created_at' | 'updated_at'>) => {
  return await supabase.from('users').insert({
    ...user,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).select().single();
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  return await supabase.from('users').update({
    ...updates,
    updated_at: new Date().toISOString()
  }).eq('id', id).select().single();
};

// Agents
export const getAgents = async () => {
  return await supabase.from('users').select('*').eq('role', 'agent');
};

// Search
export const searchProperties = async (searchTerm: string, filters?: any) => {
  let query = supabase.from('properties').select('*');
  
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
  }
  
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.minPrice) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
  
  return await query.eq('status', 'active').order('created_at', { ascending: false });
};