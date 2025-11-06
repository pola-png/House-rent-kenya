import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractWasabiKey, getPresignedGetUrl } from '@/lib/wasabi';

const PRESIGN_TTL = 900; // 15 minutes

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data.images && data.images.length > 0) {
      const presignedImages = await Promise.all(
        data.images.map(async (imageUrl: string) => {
          try {
            const key = extractWasabiKey(imageUrl);
            return await getPresignedGetUrl(key, PRESIGN_TTL);
          } catch (e) {
            console.error('Error generating presigned URL:', e);
            return imageUrl; // Fallback to original URL on error
          }
        })
      );
      data.images = presignedImages;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
