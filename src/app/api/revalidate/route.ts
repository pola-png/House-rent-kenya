import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const secret = process.env.REVALIDATE_SECRET;
    const token = request.headers.get('x-revalidate-token') || '';
    if (!secret || token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const tags = Array.isArray(body?.tags) ? body.tags as string[] : [];
    if (tags.length === 0) {
      return NextResponse.json({ ok: false, error: 'No tags provided' }, { status: 400 });
    }

    // Allow only a safe subset of tags
    const allowed = tags.filter(
      (t) => t === 'properties:list' || t.startsWith('property:')
    );
    for (const t of allowed) revalidateTag(t);
    return NextResponse.json({ ok: true, revalidated: allowed });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'revalidate failed' }, { status: 500 });
  }
}

