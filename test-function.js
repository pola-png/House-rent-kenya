const { createClient } = require('@supabase/supabase-js');

async function testFunction() {
  const supabase = createClient(
    'https://mntibbsrnylgsuaeekmr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udGliYnNybnlsZ3N1YWVla21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTQxMDksImV4cCI6MjA3NTA3MDEwOX0.AfKCv7fgz4swlbS6SZ9N5ZHV1J39lgtCqrWUaS_VNqo'
  );

  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, views')
      .limit(1);

    const property = properties[0];
    console.log('Before:', property.views);

    const { data, error } = await supabase
      .rpc('increment_property_views', { property_id: property.id });

    console.log('Function result:', data, 'Error:', error);

    const { data: after } = await supabase
      .from('properties')
      .select('views')
      .eq('id', property.id)
      .single();

    console.log('After:', after.views);
  } catch (error) {
    console.error('Error:', error);
  }
}

testFunction();