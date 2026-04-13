# Dimarta Vendas

Sistema web para vendedores de loja de calcados consultarem preco, estoque, numeracao e detalhes de produtos com rapidez durante o atendimento.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
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
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vendedor_dimarta?schema=public"
AUTH_SECRET="troque-por-um-segredo-longo-e-unico"
BLOB_READ_WRITE_TOKEN="adicione-o-token-do-vercel-blob"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
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

### Usuario de teste

- E-mail: `vendedor@dimarta.com`
- Senha: `12345678`

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
3. Configure as variaveis `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` e `NEXT_PUBLIC_APP_URL`.
4. Rode a migration no banco de producao.
5. Execute o seed apenas se quiser popular o ambiente com dados de exemplo.

## Observacoes

- O build foi validado com `npm run build`.
- Para upload funcionar, o token do Vercel Blob precisa estar configurado.
- O banco precisa estar acessivel para uso das paginas protegidas e do seed.
