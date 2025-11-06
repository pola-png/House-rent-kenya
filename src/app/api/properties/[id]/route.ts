import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presignImageUrls } from '@/lib/image-presign';

const PRESIGN_TTL = 900; // 15 minutes

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const params = 'params' in context && typeof (context as any).params?.then === 'function'
    ? await (context as { params: Promise<{ id: string }> }).params
    : (context as { params: { id: string } }).params;
  const { id } = params;
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    data.images = await presignImageUrls(data.images, PRESIGN_TTL);

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
