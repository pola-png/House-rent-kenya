import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using the service role key.
// Do NOT expose this key to the browser.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!url) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL')
}
if (!serviceKey) {
  // We deliberately throw here so misconfiguration is obvious in logs
  throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

