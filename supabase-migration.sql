-- =============================================
-- Bolão Copa do Mundo 2026 - Schema do Supabase
-- =============================================
-- Execute este SQL no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query > Cole e execute

-- Tabela principal de bolões
CREATE TABLE IF NOT EXISTS boloes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_name TEXT NOT NULL,
  group_results JSONB NOT NULL DEFAULT '{}',
  knockout_results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscas por nome
CREATE INDEX IF NOT EXISTS idx_boloes_name ON boloes (participant_name);

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_boloes_created ON boloes (created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE boloes ENABLE ROW LEVEL SECURITY;

-- Política que permite qualquer pessoa inserir (sem auth)
CREATE POLICY "Qualquer pessoa pode criar um bolão"
  ON boloes FOR INSERT
  WITH CHECK (true);

-- Política que permite qualquer pessoa ler todos os bolões
CREATE POLICY "Qualquer pessoa pode ver bolões"
  ON boloes FOR SELECT
  USING (true);

-- Pronto! Agora volte ao site e configure o .env.local com suas credenciais.
