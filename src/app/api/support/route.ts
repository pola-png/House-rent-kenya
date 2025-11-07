import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

type Body = {
  subject?: string
  message?: string
  email?: string
  phone?: string
  priority?: 'low' | 'normal' | 'high'
  attachments?: any[]
}

async function getUserFromBearer(request: Request) {
  try {
    const authz = request.headers.get('authorization') || ''
    const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
    if (!token) return null
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    if (!url || !anon) return null
    const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data } = await supabase.auth.getUser(token)
    return data?.user || null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body
    const subject = (body.subject || '').trim()
    const message = (body.message || '').trim()
    const email = (body.email || '').trim() || null
    const phone = (body.phone || '').trim() || null
    const priority = (body.priority || 'normal') as 'low' | 'normal' | 'high'
    const attachments = Array.isArray(body.attachments) ? body.attachments : []

    if (subject.length < 3 || message.length < 10) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const user = await getUserFromBearer(request)
    const userId = user?.id || null

    // Insert via service key to avoid client‑side RLS complexity
    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert([{
        user_id: userId,
        userId: userId as any,
        email,
        phone,
        subject,
        message,
        lastMessage: message,
        priority,
        attachments,
        status: 'open',
        created_at: now,
        updated_at: now,
        createdAt: now as any,
        updatedAt: now as any,
      }])
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    return NextResponse.json({ ok: true, ticket: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}
