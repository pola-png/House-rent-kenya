import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presignImageUrls } from '@/lib/image-presign';
import { unstable_cache } from 'next/cache';

const PRESIGN_TTL = 900; // 15 minutes

export async function GET(
  _request: Request,
  context: any
) {
  const rawParams = context?.params ? await context.params : undefined;
  const idParam = rawParams?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return new NextResponse(JSON.stringify({ error: 'Missing property id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const fetchProperty = unstable_cache(
      async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*, landlord:profiles(*)')
      .eq('id', id)
      .single();

        if (error) throw error;
        if (!data) return null;

        if ('images' in data) {
          (data as any).images = await presignImageUrls((data as any).images, PRESIGN_TTL);
        }
        return data;
      },
      [`property:${id}`],
      { tags: [`property:${id}`, 'properties:list'] }
    );

    const data = await fetchProperty();
    if (!data) {
      return new NextResponse(JSON.stringify({ error: 'Property not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = NextResponse.json(data);
    // Short browser cache, longer CDN cache
    res.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=120');
    res.headers.set('CDN-Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
    // Tag header for observability
    res.headers.set('x-next-cache-tags', `property:${id},properties:list`);
    return res;
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
