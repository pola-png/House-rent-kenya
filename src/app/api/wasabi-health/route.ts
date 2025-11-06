import { NextResponse } from 'next/server';
import { extractWasabiKey, getPresignedGetUrl } from '@/lib/wasabi-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlOrKey = searchParams.get('path') || searchParams.get('url');
    if (!urlOrKey) {
      return NextResponse.json({ ok: false, error: 'Missing ?path=' }, { status: 400 });
    }
    let key: string;
    try {
      key = urlOrKey.startsWith('http') ? extractWasabiKey(urlOrKey) : urlOrKey;
    } catch (e: any) {
      return NextResponse.json({ ok: false, step: 'extract', error: e?.message || 'extract failed' }, { status: 400 });
    }

    try {
      const signed = await getPresignedGetUrl(key, 60);
      return NextResponse.json({ ok: true, key, signed });
    } catch (e: any) {
      return NextResponse.json({ ok: false, step: 'presign', key, error: e?.message || 'presign failed' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'health error' }, { status: 500 });
  }
}

