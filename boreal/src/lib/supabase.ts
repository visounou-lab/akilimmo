import { createClient } from "@supabase/supabase-js";

/**
 * Supabase browser client (public anon key only — never the service role).
 * Used in later phases for storage / realtime. Returns null if unconfigured
 * so Phase 1 keeps building without environment variables.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
