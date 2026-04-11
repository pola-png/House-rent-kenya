import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { normalizeImageArray } from '@/lib/media';
import { unstable_cache } from 'next/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const featured = searchParams.get('featured');
    const landlordId = searchParams.get('landlordId');
    const status = searchParams.get('status');
    const q = (searchParams.get('q') || '').trim();

    const cacheKey = `properties:list:${searchParams.toString()}`;
    const loadList = unstable_cache(
      async () => {
        let query = supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .order('createdAt', { ascending: false })
          .range(from, to);

        if (featured != null) {
          query = query.eq('featured', featured === 'true' || featured === '1');
        }
        if (landlordId) {
          query = query.eq('landlordId', landlordId);
        }
        if (status) {
          query = query.eq('status', status);
        }
        if (q) {
          query = query.or(
            `title.ilike.%${q}%,location.ilike.%${q}%,city.ilike.%${q}%`
          );
        }

        const { data, error, count } = await query;
        if (error) throw error;

        const items = (data || []).map((item: any) => ({
          ...item,
          images: normalizeImageArray(item.images),
        }));

        return { page, limit, total: count || 0, items };
      },
      [cacheKey],
      { tags: ['properties:list'] }
    );

    const payload = await loadList();

    const res = NextResponse.json(payload);
    // Short browser cache, a bit longer on CDN for list data
    res.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=120');
    res.headers.set('CDN-Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
    res.headers.set('x-next-cache-tags', 'properties:list');
    return res;
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Failed to load properties' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
