'use client';

import { useState, useEffect } from 'react';
import { supabase } from './client';

export function useProperties(filters?: any) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let query = supabase.from('properties').select('*');
        
        if (filters?.type) query = query.eq('type', filters.type);
        if (filters?.location) query = query.ilike('location', `%${filters.location}%`);
        if (filters?.minPrice) query = query.gte('price', filters.minPrice);
        if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
        if (filters?.featured) query = query.eq('featured', filters.featured);
        if (filters?.limit) query = query.limit(filters.limit);
        
        const { data, error } = await query;
        if (error) throw error;
        setProperties(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  return { properties, loading, error };
}