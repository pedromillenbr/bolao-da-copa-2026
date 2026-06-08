-- =============================================
-- Bolão Copa do Mundo 2026 - Schema do Supabase
-- =============================================
-- Execute este SQL no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query > Cole e execute

-- Tabela principal de bolões
CREATE TABLE IF NOT EXISTS boloes (
  id UUID PRIMARY KEY,                       -- gerado no cliente (auto-save por upsert)
  participant_name TEXT NOT NULL,
  group_results JSONB NOT NULL DEFAULT '{}',
  knockout_results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existia da versão anterior, garante as colunas novas:
ALTER TABLE boloes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Índice para buscas por nome
CREATE INDEX IF NOT EXISTS idx_boloes_name ON boloes (participant_name);

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_boloes_updated ON boloes (updated_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE boloes ENABLE ROW LEVEL SECURITY;

-- Políticas (DROP + CREATE para poder rodar o script mais de uma vez sem erro)
DROP POLICY IF EXISTS "Qualquer pessoa pode criar um bolão" ON boloes;
CREATE POLICY "Qualquer pessoa pode criar um bolão"
  ON boloes FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Qualquer pessoa pode atualizar um bolão" ON boloes;
CREATE POLICY "Qualquer pessoa pode atualizar um bolão"
  ON boloes FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Qualquer pessoa pode ver bolões" ON boloes;
CREATE POLICY "Qualquer pessoa pode ver bolões"
  ON boloes FOR SELECT
  USING (true);

-- Pronto! Agora configure as variáveis NEXT_PUBLIC_SUPABASE_URL e
-- NEXT_PUBLIC_SUPABASE_ANON_KEY no Vercel (e no .env.local para rodar local).
