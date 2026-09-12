/**
 * Database client.
 *
 * ⛔ No credential is ever read from a file in this repo. `DATABASE_URL` is injected at
 * runtime from AWS Secrets Manager (build spec §7, CLAUDE.md Rule 7). `.env.example`
 * carries the *name* of the variable and never a value.
 *
 * The client is lazy on purpose: the console renders every screen in this build from the
 * in-memory adapter while the upstream feeds are unbuilt (build spec §0), so importing
 * this module must not require a reachable database.
 */

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export * from './schema';
export { schema };

export type Database = PostgresJsDatabase<typeof schema>;

let cached: Database | undefined;

/** True when the process has a database to talk to. */
export function isDatabaseConfigured(): boolean {
  return typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.length > 0;
}

export function getDatabase(): Database {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. It is injected from Secrets Manager at runtime; it is never committed.',
    );
  }

  // Aurora Serverless v2 scales connections down aggressively, so the pool is small and
  // idle sockets are closed rather than held open across a scale-to-zero window.
  const sql = postgres(url, { max: 5, idle_timeout: 20, prepare: false });
  cached = drizzle(sql, { schema });
  return cached;
}
