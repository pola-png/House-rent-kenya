import { supabase } from './supabase';

// Track single property view (for property detail pages)
export const trackPropertyView = async (propertyId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('increment_property_views', {
      property_id: propertyId
    });
    
    if (error) {
      console.error('View tracking error:', error);
      // Fallback: directly increment views if RPC is missing
      const { data: current } = await supabase
        .from('properties')
        .select('views')
        .eq('id', propertyId)
        .single();
      const next = (current?.views || 0) + 1;
      const { error: upErr } = await supabase
        .from('properties')
        .update({ views: next })
        .eq('id', propertyId);
      if (upErr) {
        console.error('Views fallback update failed:', upErr);
        return 0;
      }
      return next;
    }
    
    return data || 0;
  } catch (error) {
    console.error('View tracking failed:', error);
    return 0;
  }
};

// Track multiple property views (for homepage impressions)
export const trackMultiplePropertyViews = async (propertyIds: string[]): Promise<void> => {
  if (propertyIds.length === 0) return;
  
  try {
    const { error } = await supabase.rpc('increment_multiple_property_views', {
      property_ids: propertyIds
    });
    
    if (error) {
      console.error('Bulk view tracking error:', error);
      // Fallback: increment each property sequentially to avoid RPC dependency
      for (const id of propertyIds) {
        try {
          const { data: current } = await supabase
            .from('properties')
            .select('views')
            .eq('id', id)
            .single();
          const next = (current?.views || 0) + 1;
          await supabase
            .from('properties')
            .update({ views: next })
            .eq('id', id);
        } catch (e) {
          console.error('Views fallback (multiple) failed for', id, e);
        }
      }
    }
  } catch (error) {
    console.error('Bulk view tracking failed:', error);
  }
};

// Debounced view tracking to prevent spam
const viewTrackingQueue = new Set<string>();
let viewTrackingTimeout: NodeJS.Timeout | null = null;

export const trackPropertyViewDebounced = (propertyId: string) => {
  viewTrackingQueue.add(propertyId);
  
  if (viewTrackingTimeout) {
    clearTimeout(viewTrackingTimeout);
  }
  
  viewTrackingTimeout = setTimeout(async () => {
    const propertyIds = Array.from(viewTrackingQueue);
    viewTrackingQueue.clear();
    
    if (propertyIds.length === 1) {
      await trackPropertyView(propertyIds[0]);
    } else if (propertyIds.length > 1) {
      await trackMultiplePropertyViews(propertyIds);
    }
  }, 1000); // Wait 1 second before tracking
};
