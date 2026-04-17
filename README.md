# Dimarta Vendas

Sistema web para vendedores de loja de calcados consultarem preco, estoque, numeracao e detalhes de produtos com rapidez durante o atendimento.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Supabase SSR helpers para integracoes futuras com Auth/Storage
- Autenticacao por credenciais com sessao em cookie
- Upload de imagem com Vercel Blob
- Deploy preparado para Vercel

## Funcionalidades do MVP

- Login de vendedor
- Dashboard com indicadores rapidos
- CRUD completo de produtos
- Busca textual combinada com filtros
- Estoque por numeracao
- Preco promocional opcional
- Upload de imagem
- Tela de detalhes do produto

## Estrutura principal

```text
.
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- public/demo-images/
|-- src/
|   |-- app/
|   |   |-- (auth)/login/
|   |   |-- (protected)/
|   |   |   |-- products/
|   |   |   `-- page.tsx
|   |   |-- api/
|   |   `-- not-found.tsx
|   |-- components/
|   |   |-- auth/
|   |   |-- dashboard/
|   |   |-- layout/
|   |   |-- products/
|   |   `-- ui/
|   |-- lib/
|   |   |-- auth/
|   |   |-- validations/
|   |   `-- *.ts
|   |-- server/
|   |   |-- queries/
|   |   `-- services/
|   `-- types/
|-- .env.example
`-- middleware.ts
```

## Variaveis de ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
AUTH_SECRET="troque-por-um-segredo-longo-e-unico"
BLOB_READ_WRITE_TOKEN="adicione-o-token-do-vercel-blob"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Configuracao recomendada com Supabase

- `DATABASE_URL`:
  use a Session pooler string do Supabase na porta `5432` para desenvolvimento local.
- `DIRECT_URL`:
  use a Direct connection string do Supabase na porta `5432` para comandos do Prisma CLI.
- `DATABASE_URL` na Vercel:
  use a Transaction pooler string na porta `6543` com `?pgbouncer=true&connection_limit=1`.
- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:
  usados pelos helpers em `src/utils/supabase` para browser, server e middleware.

Exemplo para Vercel:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[DB-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Como rodar localmente

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`.

## Passo A Passo Com Supabase

### 1. Criar o projeto no Supabase

1. Acesse o painel do Supabase e crie um projeto novo.
2. Aguarde o banco ficar pronto.
3. No topo do dashboard, clique em `Connect`.
4. Copie estas strings:
   `Session pooler` em `5432`
   `Transaction pooler` em `6543`
   `Direct connection` em `5432`

Observacao:
o Supabase informa que a `Session pooler` em `5432` serve para uso geral e que a `Transaction mode` em `6543` e ideal para ambientes serverless como a Vercel. A `Direct connection` e a indicada para conexoes diretas ao Postgres e para comandos do Prisma CLI.

### 2. Configurar o `.env` local

No desenvolvimento local, preencha o `.env` assim:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
AUTH_SECRET="uma-chave-bem-grande-e-segura"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN=""
```

E no `.env.local`, adicione:

```env
NEXT_PUBLIC_SUPABASE_URL="https://SEU-PROJECT-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxxxxxxxxxxxxxxxx"
```

Se a `Direct connection` nao funcionar por limitacao de rede/IPv6 na sua maquina, isso sugere um problema de conectividade local. Nesse caso, confirme a string no botao `Connect` do Supabase e teste em outra rede se necessario.

### 3. Aplicar o banco e popular os dados

Com o `.env` salvo:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Se preferir um fluxo mais simples na primeira subida do banco remoto:

```bash
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

### 4. Fazer login no sistema

Abra `http://localhost:3000` e use:

- E-mail: `anacristina@dimarta.com`
- Senha: `Dimarta2026`

### 5. Configurar a Vercel

Na Vercel, abra:

`Project > Settings > Environment Variables`

Cadastre:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `BLOB_READ_WRITE_TOKEN`

Valores recomendados na Vercel:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[DB-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://SEU-PROJECT-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_APP_URL="https://SEU-PROJETO.vercel.app"
```

Depois:

1. salve as variaveis
2. faca um novo deploy
3. rode a migration no banco de producao
4. rode o seed apenas se quiser popular com dados de exemplo

### 6. Se aparecer erro de conexao ou pool

- `prepared statement already exists`:
  confira se a URL da Vercel esta usando `pgbouncer=true`
- `max client connections reached`:
  mantenha `connection_limit=1` no ambiente serverless
- `Can't reach database server`:
  confira se voce copiou a string correta do botao `Connect`

### Usuario de teste

- E-mail: `anacristina@dimarta.com`
- Senha: `Dimarta2026`

## Scripts uteis

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` e `NEXT_PUBLIC_APP_URL`.
4. Rode a migration no banco de producao.
5. Execute o seed apenas se quiser popular o ambiente com dados de exemplo.

## Observacoes

- O build foi validado com `npm run build`.
- Para upload funcionar, o token do Vercel Blob precisa estar configurado.
- O banco precisa estar acessivel para uso das paginas protegidas e do seed.
- Este projeto agora esta preparado para Supabase com `DATABASE_URL` e `DIRECT_URL`.
- Os helpers do Supabase ficam em `src/utils/supabase` e o middleware atualiza cookies de sessao quando o Supabase Auth estiver em uso.
