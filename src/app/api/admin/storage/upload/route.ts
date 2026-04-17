import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || 'property-images';

export async function POST(req: Request) {
  try {
    const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!anonUrl || !anonKey || !serviceKey) {
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

    const uploadUrl = `${anonUrl.replace(/\/+$/, '')}/storage/v1/object/${bucket}/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false',
        'Cache-Control': '3600',
      },
      body: file,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text().catch(() => '');
      return NextResponse.json(
        { error: text || `Upload failed (${uploadRes.status})`, code: 'StorageApiError' },
        { status: 400 }
      );
    }

    const publicUrl = `${anonUrl.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, '')}`;
    return NextResponse.json({ publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload error' }, { status: 500 });
  }
}
