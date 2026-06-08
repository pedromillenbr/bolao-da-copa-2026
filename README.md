# ⚽ Bolão Copa do Mundo 2026

Site de bolão para a Copa do Mundo FIFA 2026. Cada participante digita seu nome, faz os palpites de todos os 104 jogos (fase de grupos até a final) e ao concluir pode baixar uma imagem com todos os seus palpites.

## Funcionalidades

- 48 seleções em 12 grupos oficiais da FIFA
- Fase de Grupos — preencha placares dos 72 jogos, classificação calculada automaticamente
- Mata-mata dinâmico — Rodada de 32, Oitavas, Quartas, Semifinais, 3º lugar e Final
- Chaveamento automático — times avançam com base nos placares que você preencheu
- Exportar como imagem — baixe um PNG com todos os seus palpites
- Salvar no banco — dados persistidos no Supabase

## Setup Rápido

### 1. Clone e instale

```bash
git clone https://github.com/SEU-USUARIO/bolao-copa-2026.git
cd bolao-copa-2026
npm install
```

### 2. Configure o Supabase

1. Acesse supabase.com e crie um projeto
2. No SQL Editor, execute o conteúdo de supabase-migration.sql
3. Copie a URL e Anon Key do projeto (Settings > API)
4. Crie o arquivo .env.local:

```bash
cp .env.local.example .env.local
```

5. Preencha com suas credenciais:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Rode localmente

```bash
npm run dev
```

Acesse http://localhost:3000

### 4. Deploy na Vercel

1. Suba o projeto no GitHub
2. Acesse vercel.com e importe o repositório
3. Adicione as variáveis de ambiente
4. Deploy!

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- html2canvas (exportar imagem)
