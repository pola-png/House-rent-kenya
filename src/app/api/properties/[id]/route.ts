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
  const rawId = Array.isArray(idParam) ? idParam[0] : idParam;

  // Accept either a plain UUID or a slug-with-UUID; extract the trailing UUID groups
  const resolveId = (input: string): string => {
    if (!input) return input as any;
    const parts = String(input).split('-');
    if (parts.length >= 5) {
      return parts.slice(-5).join('-');
    }
    return input;
  };
  const id = resolveId(rawId as string);

  if (!id) {
    return new NextResponse(JSON.stringify({ error: 'Missing property id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const fetchProperty = unstable_cache(
      async () => {
        // 1) Fetch property without join to avoid RLS/join issues
        const { data: prop, error: propErr } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        if (propErr) throw propErr;
        if (!prop) return null;

        // 2) Attach landlord profile if accessible; ignore errors
        let landlord: any = null;
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', (prop as any).landlordId)
            .single();
          landlord = prof || null;
        } catch {}

        // 3) Presign images
        if ('images' in prop) {
          (prop as any).images = await presignImageUrls((prop as any).images, PRESIGN_TTL);
        }

        return landlord ? { ...prop, landlord } : prop;
      },
      [`property:${id}`],
      { tags: [`property:${id}`, 'properties:list'] }
    );

    const data: any = await fetchProperty();
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
