import { supabase } from './supabase';
import type { Property, UserProfile } from './types';

// Properties
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, landlord:profiles(*)');
  
  if (error) throw error;
  return data;
};

export const getFeaturedProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, landlord:profiles(*)')
    .eq('featured', true)
    .limit(6);
  
  if (error) throw error;
  return data;
};

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, landlord:profiles(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createProperty = async (property: any) => {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProperty = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Articles
export const getArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Developments
export const getDevelopments = async () => {
  const { data, error } = await supabase
    .from('developments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Profiles
export const getProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Callback Requests
export const createCallbackRequest = async (request: any) => {
  const { data, error } = await supabase
    .from('callback_requests')
    .insert(request)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCallbackRequests = async (agentId: string) => {
  const { data, error } = await supabase
    .from('callback_requests')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
