import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presignImageUrls } from '@/lib/image-presign';

function toArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }
  return [];
}

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
      // Basic text filter on title/location/city
      query = query.or(
        `title.ilike.%${q}%,location.ilike.%${q}%,city.ilike.%${q}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const items = data || [];

    // Presign only the first image per property for listing performance
    const TTL = 900;
    await Promise.all(
      items.map(async (item: any) => {
        const imgs = toArray(item.images);
        if (imgs.length > 0) {
          try {
            const signedArr = await presignImageUrls([imgs[0]], TTL);
            const signed = signedArr?.[0];
            if (signed) imgs[0] = signed;
          } catch {}
        }
        item.images = imgs;
      })
    );

    const res = NextResponse.json({
      page,
      limit,
      total: count || 0,
      items,
    });
    res.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=120');
    return res;
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Failed to load properties' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
