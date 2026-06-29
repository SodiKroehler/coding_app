import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side client with service role key — bypasses RLS
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Browser-side client with anon key — subject to RLS
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
