import { createClient } from '@supabase/supabase-js'

/**
 * Static Supabase Client
 * 
 * Use this for:
 * - Public data that doesn't need authentication
 * - generateStaticParams (build-time)
 * - generateMetadata (build-time)
 * - Server components that fetch public data
 * 
 * DO NOT use for:
 * - User-specific data (favorites, accounts, etc.)
 * - Operations that need authentication
 * 
 * For authenticated operations, use createServerSupabaseClient from lib/supabase-server.ts
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createStaticSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Alias for convenience
export const getStaticSupabaseClient = createStaticSupabaseClient
