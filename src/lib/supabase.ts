import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** O sistema funciona sem Supabase (modo local). Com as variáveis, migra para a nuvem. */
export const supabaseAtivo = Boolean(url && chave);

let cliente: SupabaseClient | null = null;
export function obterSupabase(): SupabaseClient | null {
  if (!supabaseAtivo) return null;
  if (!cliente) cliente = createClient(url!, chave!, { auth: { persistSession: true, autoRefreshToken: true } });
  return cliente;
}
