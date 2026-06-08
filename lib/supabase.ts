import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MatchResult } from './types';

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

// Whether Supabase credentials are present (so the UI can show status).
export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}

type Results = Record<string, MatchResult>;

// Upsert a bolão: creates the row on first call, then updates that same row on
// every subsequent call (keyed by the client-generated `id`). This is what
// powers auto-save — each palpite updates the existing record instead of
// inserting a duplicate.
export async function upsertBolao(
  id: string,
  name: string,
  groupResults: Results,
  knockoutResults: Results
) {
  const client = getSupabase();
  if (!client) {
    // No credentials configured — localStorage still has everything, so this
    // is non-fatal. Surface it so callers/UI can reflect "not saved to cloud".
    return { ok: false, reason: 'not-configured' as const };
  }

  const { error } = await client
    .from('boloes')
    .upsert(
      {
        id,
        participant_name: name,
        group_results: groupResults,
        knockout_results: knockoutResults,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Erro ao salvar bolão no Supabase:', error);
    return { ok: false, reason: 'error' as const, error };
  }

  return { ok: true as const, id };
}

export async function getBoloes() {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('boloes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar bolões:', error);
    return [];
  }

  return data || [];
}
