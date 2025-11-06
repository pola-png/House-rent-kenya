import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presignImageUrls } from '@/lib/image-presign';
import type { NextRequest } from 'next/server';
// Infer the context type without importing unstable RouteContext
type Params = { id: string };
type HandlerContext = { params: Params };

const PRESIGN_TTL = 900; // 15 minutes

export async function GET(_request: NextRequest, { params }: HandlerContext) {
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
