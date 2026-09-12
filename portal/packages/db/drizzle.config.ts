import { defineConfig } from 'drizzle-kit';

/**
 * Migrations live in the repo — build spec §5. The URL does not: it is injected from
 * Secrets Manager for a migration run, exactly as it is for the application.
 */
export default defineConfig({
  schema: './packages/db/src/schema.ts',
  out: './packages/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});
