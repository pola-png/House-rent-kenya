import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presignImageUrls } from '@/lib/image-presign';

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
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return new NextResponse(JSON.stringify({ error: 'Property not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if ('images' in data) {
      (data as any).images = await presignImageUrls((data as any).images, PRESIGN_TTL);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
