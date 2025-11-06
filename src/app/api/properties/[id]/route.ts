import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presignImageUrls } from '@/lib/image-presign';
// Use standard Fetch API Request type and inline context typing

const PRESIGN_TTL = 900; // 15 minutes

export async function GET(_request: Request, { params }: { params: { id: string } }) {
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
