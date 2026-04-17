import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || 'property-images';

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    if (!anonUrl || !anonKey) {
      return NextResponse.json({ error: 'Server misconfigured: missing Supabase envs' }, { status: 500 });
    }

    const authz = req.headers.get('authorization') || '';
    const token = authz.startsWith('Bearer ') ? authz.slice(7) : '';
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient(anonUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const path = String(form.get('path') || '');
    const bucket = String(form.get('bucket') || DEFAULT_BUCKET);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }
    if (!path.trim()) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // Service-role storage operations bypass storage RLS entirely.
    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, arrayBuffer, {
      cacheControl: '3600',
      contentType: file.type || undefined,
      upsert: false,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.name || 'StorageApiError' },
        { status: 400 }
      );
    }

    const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    const publicUrl = publicData.publicUrl;
    return NextResponse.json({ publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload error' }, { status: 500 });
  }
}
