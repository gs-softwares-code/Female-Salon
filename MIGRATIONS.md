# Native database migrations

The canonical edge schema uses SQLite-compatible Drizzle tables for Cloudflare D1.

```bash
npm run db:generate
npx wrangler d1 migrations apply BEAUTY_DB --local
npx wrangler d1 migrations apply BEAUTY_DB --remote
```

For a Vercel Postgres deployment, use a PostgreSQL Drizzle schema adapter and a PostgreSQL `drizzle.config.ts` with `dialect: "postgresql"` and `dbCredentials.url` set to `POSTGRES_URL`, then run:

```bash
npx drizzle-kit generate --config=drizzle.vercel.config.ts
npx drizzle-kit migrate --config=drizzle.vercel.config.ts
```

No external booking, payment, CMS, auth, or storage service is required by the application.
