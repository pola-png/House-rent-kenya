import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

type PropertyUpdateBody = {
  featured?: boolean
  featuredExpiresAt?: string | null
  isPremium?: boolean
  status?: string
}

async function authenticateAdmin(request: Request) {
  const authz = request.headers.get('authorization') || ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''

  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!anonUrl || !anonKey) {
    return { error: NextResponse.json({ error: 'Server misconfigured: missing Supabase envs' }, { status: 500 }) }
  }

  const supabase = createClient(anonUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userRes, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userRes?.user) {
    return { error: NextResponse.json({ error: 'Invalid session' }, { status: 401 }) }
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userRes.user.id)
    .single()

  if (profileErr || profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { supabaseAdmin }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateAdmin(request)
    if ('error' in auth) return auth.error

    const { id } = await context.params
    const body = (await request.json().catch(() => ({}))) as PropertyUpdateBody

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (typeof body.featured === 'boolean') updates.featured = body.featured
    if (body.featuredExpiresAt !== undefined) updates.featuredExpiresAt = body.featuredExpiresAt
    if (typeof body.isPremium === 'boolean') updates.isPremium = body.isPremium
    if (typeof body.status === 'string' && body.status.trim()) updates.status = body.status.trim()

    if (Object.keys(updates).length === 1) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const { data, error } = await auth.supabaseAdmin
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    revalidateTag('properties:list')
    revalidateTag(`property:${id}`)

    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Update error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateAdmin(request)
    if ('error' in auth) return auth.error

    const { id } = await context.params

    const { error } = await auth.supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    revalidateTag('properties:list')
    revalidateTag(`property:${id}`)

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Delete error' }, { status: 500 })
  }
}
