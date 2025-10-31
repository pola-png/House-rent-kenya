import { supabase } from './supabase';

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh error:', error);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error('Session refresh failed:', error);
    return false;
  }
};

export const ensureValidSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session check error:', error);
      return false;
    }
    
    if (!session) {
      return false;
    }
    
    // Check if session is about to expire (within 5 minutes)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;
    
    if (timeUntilExpiry < 300) { // Less than 5 minutes
      return await refreshSession();
    }
    
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
};

// Wrapper for API calls that ensures valid session
export const withValidSession = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  const isValid = await ensureValidSession();
  
  if (!isValid) {
    throw new Error('Invalid or expired session');
  }
  
  return apiCall();
};