import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — full database/storage access, bypassing
 * Row Level Security entirely. Only ever import this inside a createServerFn
 * handler (or another server-only module reached exclusively from one);
 * never from a component or a plain route loader, or the key would end up
 * in the client bundle.
 */
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured.");
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export const PRODUCT_IMAGES_BUCKET = "product-images";
