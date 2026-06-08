import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

export async function saveBolao(
  name: string,
  groupResults: Record<string, any>,
  knockoutResults: Record<string, any>
) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase não configurado. Bolão salvo apenas localmente.');
    return { id: 'local', participant_name: name };
  }

  const { data, error } = await client
    .from('boloes')
    .insert([
      {
        participant_name: name,
        group_results: groupResults,
        knockout_results: knockoutResults,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error('Erro ao salvar bolão:', error);
    return null;
  }

  return data?.[0];
}

export async function getBoloes() {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('boloes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar bolões:', error);
    return [];
  }

  return data || [];
}
