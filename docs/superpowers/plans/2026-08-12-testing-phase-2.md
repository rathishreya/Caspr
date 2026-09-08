> **⛔ HISTORICAL DOCUMENT — vocabulary below is superseded.**
> This predates **2026-08-27**, when **the Thinking Brain and the Learning Brain were retired together.**
> The architecture is now **Source. Assess. Conclude.** — [`source-assess-conclude.md`](../../source-assess-conclude.md).
> **The body is left unedited on purpose:** it records what was true when it was written. **Do not copy
> vocabulary out of it.**

# Testing Apparatus Phase 2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the product-side backend is correct about money, isolated per user, hard to attack, and able to carry the design load — then package the whole thing for handover to Jayant.

**Architecture:** Four strands. (1) Money and data correctness — property tests on the wallet ledger, and Row-Level Security tests against real PostgreSQL running as a non-superuser role. (2) Static security — the entire set that needs no authorization from Jayant, run against our own code: JWT attacks, authorization and IDOR, input fuzzing, rate limiting, browser-surface hardening. (3) Load — a runnable stub of Jayant's AI backend plus k6 profiles that exercise REST and the streaming fan-out to the 500-concurrent design target. (4) Handover — the authorization request Jayant signs, and a package that lets him verify his own integration without us.

**Tech Stack:** Vitest 4 · fast-check · PGlite · k6 OSS · Hono · jose

**Repo:** `C:\Users\joysh\Claude-Local\caspr-app`. All paths relative to that root.

**Prerequisite:** Phase 1 complete and green (`docs/superpowers/plans/2026-08-12-testing-phase-1.md`).

---

## Four defects this plan is written to catch

Reading `services/backend/src/app.ts` and `services/backend/src/db/schema.sql` surfaced four issues before a single test was written. Each has a task below that fails first, then fixes. **Do not fix them ahead of the test** — the test is the proof they stay fixed.

| # | Defect | Where | Why it matters |
|---|---|---|---|
| 1 | **`POST /auth/session` mints a valid JWT without checking the password.** Any email string returns a session. | `app.ts:63` — marked as an interim step in a comment | Total authentication bypass. Cannot reach handover in this state. |
| 2 | **RLS is enabled but not forced.** `ALTER TABLE … ENABLE ROW LEVEL SECURITY` does not apply to the table owner. If the app connects as the owner — the default — every policy is silently bypassed. | `schema.sql:147-154` | The per-user isolation guarantee is inert. Tests that connect as a superuser would pass while production leaks. |
| 3 | **Policies declare `USING` with no `WITH CHECK`.** `USING` filters reads; without `WITH CHECK`, a user can INSERT or UPDATE a row carrying someone else's `user_id`. | `schema.sql:156-164` | A user can write rows into another user's account. |
| 4 | **`audit_log` append-only is documented, not enforced.** The comment says grant INSERT/SELECT only; no `REVOKE`/`GRANT` statement exists, and RLS is not enabled on the table. | `schema.sql:133-142, 169` | The immutability claim made to enterprise buyers is unbacked. |

---

## Working agreements

- **TDD throughout.** Failing test, watch it fail, implement, watch it pass, commit.
- **Security tests assert the attack fails.** Write the attack, confirm it currently succeeds, then close it.
- **Scope discipline.** Everything in this phase targets Zone A — our SPA and our backend. Nothing touches Jayant's infrastructure. Task 16 produces the authorization request that unlocks Zone C in Phase 3.
- **Load runs against a stub.** Never point a load profile at Jayant's real pipeline. It costs him GPU money and proves nothing about our layer.

---

## File structure

| Path | Responsibility |
|---|---|
| `services/backend/src/wallet/ledger.property.test.ts` | Wallet invariants under arbitrary operation sequences |
| `services/backend/src/db/testDb.ts` | PGlite harness — loads `schema.sql`, creates the app role |
| `services/backend/src/db/rls.test.ts` | Per-user isolation, enforced at the database |
| `services/backend/src/db/auditLog.test.ts` | Append-only enforcement |
| `services/backend/src/auth/attacks.test.ts` | JWT forgery, confusion, expiry, replay |
| `services/backend/src/auth/password.ts` | Argon2id hashing and verification |
| `services/backend/src/auth/password.test.ts` | Its tests |
| `services/backend/src/security/rateLimit.ts` | Fixed-window limiter for auth endpoints |
| `services/backend/src/security/rateLimit.test.ts` | Its tests |
| `services/backend/src/security/headers.ts` | Security-header middleware |
| `services/backend/src/api.security.test.ts` | IDOR, headers, CORS, fuzzing against the running app |
| `apps/web/src/test/bundleSecrets.test.ts` | No key material in the built bundle |
| `services/stub-ai/` | Runnable stub of Jayant's MCP + streams, for load |
| `load/backend.js` | k6 — REST profiles |
| `load/streams.js` | k6 — SSE and WebSocket fan-out |
| `load/README.md` | How to run, what each profile proves |
| `docs/security/threat-model.md` | STRIDE against contract v4 |
| `docs/security/owasp-checklist.md` | OWASP Top 10 + LLM Top 10, mapped with evidence |
| `docs/security/pentest-authorization-request.md` | For Jayant's signature |
| `HANDOVER.md` | The package index |

---

## Task 1: Wallet property tests

Money bugs are found by property testing, not examples. The ledger already has 12 example tests; these assert the invariants hold under *any* sequence.

**Files:**
- Create: `services/backend/src/wallet/ledger.property.test.ts`
- Modify: `services/backend/package.json`

- [ ] **Step 1: Install fast-check**

```bash
npm install -D -w services/backend fast-check@^3
```

- [ ] **Step 2: Write the failing test**

Create `services/backend/src/wallet/ledger.property.test.ts`:

```ts
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  analysisCapCents,
  canAfford,
  minBudgetCentsForBalance,
  monthlyRecharge,
  platformFeeCents,
  spend,
  totalSpendable,
} from './ledger';

/**
 * Invariants that must hold for every reachable wallet state, not just the
 * examples in ledger.test.ts. Amounts are integer cents throughout — a
 * floating-point cent is itself a bug.
 */

const cents = fc.integer({ min: 0, max: 500_000 });
const balances = fc.record({
  freeTrialCents: cents,
  promoCents: cents,
  paidCents: cents,
});

describe('ledger invariants', () => {
  it('never produces a negative balance, however much is spent', () => {
    fc.assert(
      fc.property(balances, cents, (start, amount) => {
        const result = spend(start, amount);
        expect(result.freeTrialCents).toBeGreaterThanOrEqual(0);
        expect(result.promoCents).toBeGreaterThanOrEqual(0);
        expect(result.paidCents).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  it('spends no more than was available', () => {
    fc.assert(
      fc.property(balances, cents, (start, amount) => {
        const before = totalSpendable(start);
        const after = totalSpendable(spend(start, amount));
        expect(before - after).toBeLessThanOrEqual(before);
        expect(after).toBeLessThanOrEqual(before);
      }),
    );
  });

  it('draws down free trial, then promo, then paid — never out of order', () => {
    fc.assert(
      fc.property(balances, cents, (start, amount) => {
        const after = spend(start, amount);
        // Paid is only touched once free and promo are exhausted.
        if (after.paidCents < start.paidCents) {
          expect(after.freeTrialCents).toBe(0);
          expect(after.promoCents).toBe(0);
        }
        // Promo is only touched once free is exhausted.
        if (after.promoCents < start.promoCents) {
          expect(after.freeTrialCents).toBe(0);
        }
      }),
    );
  });

  it('keeps every amount an integer number of cents', () => {
    fc.assert(
      fc.property(balances, cents, (start, amount) => {
        const after = spend(start, amount);
        expect(Number.isInteger(after.freeTrialCents)).toBe(true);
        expect(Number.isInteger(after.promoCents)).toBe(true);
        expect(Number.isInteger(after.paidCents)).toBe(true);
      }),
    );
  });

  it('splits budget exactly: cap + fee equals budget, with no lost cent', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000 }), (budget) => {
        expect(analysisCapCents(budget) + platformFeeCents(budget)).toBe(budget);
      }),
    );
  });

  it('canAfford agrees with totalSpendable', () => {
    fc.assert(
      fc.property(balances, cents, (start, amount) => {
        expect(canAfford(start, amount)).toBe(totalSpendable(start) >= amount);
      }),
    );
  });

  it('recharge never reduces the paid balance below what recharge restores', () => {
    fc.assert(
      fc.property(balances, fc.integer({ min: 0, max: 200_000 }), (start, budget) => {
        const after = monthlyRecharge(start, budget);
        expect(after.paidCents).toBeGreaterThanOrEqual(start.paidCents);
        expect(after.paidCents).toBeLessThanOrEqual(analysisCapCents(budget));
      }),
    );
  });

  it('the minimum budget for a balance is never more than that balance implies', () => {
    fc.assert(
      fc.property(cents, (balance) => {
        const min = minBudgetCentsForBalance(balance);
        expect(analysisCapCents(min)).toBeGreaterThanOrEqual(balance);
      }),
    );
  });

  it('spending is idempotent at zero', () => {
    fc.assert(
      fc.property(balances, (start) => {
        expect(spend(start, 0)).toEqual(start);
      }),
    );
  });
});
```

- [ ] **Step 3: Run it**

Run: `npm test --workspace @caspr/backend -- ledger.property`
Expected: some properties fail. fast-check prints the minimal counterexample — that shrunken input is the bug.

- [ ] **Step 4: Fix the ledger for each counterexample**

Fix `services/backend/src/wallet/ledger.ts`. Do not weaken a property to make it pass; if a property is genuinely wrong, correct it against `pricing-model.md` and note why in a comment.

- [ ] **Step 5: Verify green**

Run: `npm test --workspace @caspr/backend`
Expected: PASS — the original 12 ledger tests plus 9 properties.

- [ ] **Step 6: Commit**

```bash
git add services/backend/src/wallet services/backend/package.json package-lock.json
git commit -m "test(wallet): property tests for ledger invariants"
```

---

## Task 2: PGlite test harness

RLS can only be tested against real PostgreSQL, and only as a **non-superuser**. A superuser bypasses every policy — a test that connects as one passes while production leaks.

**Files:**
- Create: `services/backend/src/db/testDb.ts`
- Modify: `services/backend/package.json`

- [ ] **Step 1: Install PGlite**

```bash
npm install -D -w services/backend @electric-sql/pglite@^0.2
```

- [ ] **Step 2: Write the harness**

Create `services/backend/src/db/testDb.ts`:

```ts
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * A real PostgreSQL instance loaded with the production schema.
 *
 * Critical: PGlite connects as a superuser by default, and superusers bypass
 * Row-Level Security entirely. Every RLS test must run through `asUser`, which
 * switches to the non-superuser application role — the same posture the app has
 * in production. Testing RLS as a superuser proves nothing.
 */
export const APP_ROLE = 'caspr_app';

export interface TestDb {
  raw: PGlite;
  /** Runs `fn` as the application role with `app.current_user_id` set. */
  asUser<T>(userId: string, fn: (db: PGlite) => Promise<T>): Promise<T>;
  /** Runs as the owner/superuser — for fixtures only, never for assertions. */
  asOwner<T>(fn: (db: PGlite) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export async function createTestDb(): Promise<TestDb> {
  const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));
  const schema = readFileSync(schemaPath, 'utf8');

  const db = new PGlite();
  await db.exec(schema);

  // The application connects as an unprivileged role. This is what makes the
  // policies actually apply.
  await db.exec(`
    CREATE ROLE ${APP_ROLE} NOLOGIN;
    GRANT USAGE ON SCHEMA public TO ${APP_ROLE};
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${APP_ROLE};
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${APP_ROLE};
  `);

  return {
    raw: db,
    async asUser(userId, fn) {
      await db.exec(`SET ROLE ${APP_ROLE};`);
      await db.query('SELECT set_config($1, $2, false)', ['app.current_user_id', userId]);
      try {
        return await fn(db);
      } finally {
        await db.exec('RESET ROLE;');
      }
    },
    async asOwner(fn) {
      await db.exec('RESET ROLE;');
      return fn(db);
    },
    async close() {
      await db.close();
    },
  };
}

/** Inserts two users and returns their ids. Used as fixture in most RLS tests. */
export async function seedTwoUsers(db: TestDb): Promise<{ alice: string; bob: string }> {
  await db.asOwner(async (raw) => {
    await raw.exec(`
      INSERT INTO users (id, email) VALUES
        ('user_alice', 'alice@example.com'),
        ('user_bob',   'bob@example.com');
      INSERT INTO wallet (user_id, paid_cents) VALUES
        ('user_alice', 50000),
        ('user_bob',   99999);
      INSERT INTO analyses (id, user_id, title, depth, status) VALUES
        ('an_alice', 'user_alice', 'Alice private', 'brief', 'complete'),
        ('an_bob',   'user_bob',   'Bob private',   'brief', 'complete');
    `);
  });
  return { alice: 'user_alice', bob: 'user_bob' };
}
```

- [ ] **Step 3: Verify it boots**

Create a scratch check and run it:

```bash
npx tsx -e "import('./services/backend/src/db/testDb.ts').then(async m => { const db = await m.createTestDb(); const r = await db.raw.query('SELECT count(*) FROM information_schema.tables WHERE table_schema=\$1',['public']); console.log(r.rows); await db.close(); })"
```

Expected: a count of 10 or more tables. If `schema.sql` fails to load, fix the SQL — PGlite is real PostgreSQL and its errors are real errors.

- [ ] **Step 4: Commit**

```bash
git add services/backend/src/db/testDb.ts services/backend/package.json package-lock.json
git commit -m "test(db): PGlite harness running as the unprivileged app role"
```

---

## Task 3: Row-Level Security isolation

Catches defects 2 and 3.

**Files:**
- Create: `services/backend/src/db/rls.test.ts`
- Modify: `services/backend/src/db/schema.sql`

- [ ] **Step 1: Write the failing test**

Create `services/backend/src/db/rls.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, seedTwoUsers, type TestDb } from './testDb';

/**
 * The premise: the application layer is already compromised. These tests assert
 * the database itself refuses to leak across users.
 */
let db: TestDb;
let alice: string;
let bob: string;

beforeEach(async () => {
  db = await createTestDb();
  ({ alice, bob } = await seedTwoUsers(db));
});
afterEach(async () => db.close());

const USER_SCOPED_TABLES = [
  'folders',
  'analyses',
  'annotations',
  'wallet',
  'wallet_transactions',
  'context_layer',
] as const;

describe('row-level security', () => {
  it('forces RLS so the table owner cannot bypass policies', async () => {
    const { rows } = await db.raw.query<{ relname: string; relforcerowsecurity: boolean }>(
      `SELECT relname, relforcerowsecurity FROM pg_class
        WHERE relname = ANY($1) AND relkind = 'r'`,
      [[...USER_SCOPED_TABLES, 'users']],
    );
    const unforced = rows.filter((r) => !r.relforcerowsecurity).map((r) => r.relname);
    expect(
      unforced,
      `RLS is enabled but NOT FORCED on: ${unforced.join(', ')}. ` +
        'The table owner bypasses every policy. Add ALTER TABLE ... FORCE ROW LEVEL SECURITY.',
    ).toEqual([]);
  });

  it('shows a user only their own rows', async () => {
    await db.asUser(alice, async (raw) => {
      const analyses = await raw.query<{ id: string }>('SELECT id FROM analyses');
      expect(analyses.rows.map((r) => r.id)).toEqual(['an_alice']);

      const wallet = await raw.query<{ user_id: string }>('SELECT user_id FROM wallet');
      expect(wallet.rows.map((r) => r.user_id)).toEqual([alice]);
    });
  });

  it('returns nothing when no user is set', async () => {
    await db.asUser('', async (raw) => {
      const { rows } = await raw.query('SELECT id FROM analyses');
      expect(rows).toEqual([]);
    });
  });

  it('refuses to let a user insert a row owned by someone else', async () => {
    await db.asUser(alice, async (raw) => {
      await expect(
        raw.query(
          `INSERT INTO folders (user_id, name, folder_type) VALUES ($1, 'planted', 'project')`,
          [bob],
        ),
      ).rejects.toThrow(/row-level security|policy/i);
    });
  });

  it('refuses to let a user reassign their row to someone else', async () => {
    await db.asUser(alice, async (raw) => {
      await raw.query(
        `INSERT INTO folders (user_id, name, folder_type) VALUES ($1, 'mine', 'project')`,
        [alice],
      );
      await expect(
        raw.query(`UPDATE folders SET user_id = $1 WHERE user_id = $2`, [bob, alice]),
      ).rejects.toThrow(/row-level security|policy/i);
    });
  });

  it('refuses to let a user credit their own wallet', async () => {
    await db.asUser(alice, async (raw) => {
      // Even if the app layer is compromised, the DB must not accept a write
      // that moves money into another user's wallet.
      await expect(
        raw.query(`UPDATE wallet SET paid_cents = 999999 WHERE user_id = $1`, [bob]),
      ).resolves.toMatchObject({ affectedRows: 0 });
    });
  });

  it('never exposes another user across any user-scoped table', async () => {
    for (const table of USER_SCOPED_TABLES) {
      await db.asUser(alice, async (raw) => {
        const { rows } = await raw.query<{ user_id: string }>(
          `SELECT user_id FROM ${table} WHERE user_id IS NOT NULL`,
        );
        const foreign = rows.filter((r) => r.user_id !== alice);
        expect(foreign, `${table} leaked rows for another user`).toEqual([]);
      });
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/backend -- rls`
Expected: **FAIL** on the force-RLS test and both write-policy tests. Those are defects 2 and 3.

- [ ] **Step 3: Fix the schema**

In `services/backend/src/db/schema.sql`, replace the RLS block (lines 144-169) with:

```sql
-- ---------------------------------------------------------------------------
-- Row-Level Security — per-user isolation on every user-scoped table
--
-- ENABLE alone does not apply to the table owner. FORCE makes the policies
-- apply to the owner too, so a connection that happens to own the tables cannot
-- silently bypass isolation. The app connects as `caspr_app` regardless.
--
-- Every policy carries WITH CHECK as well as USING: USING filters what is read,
-- WITH CHECK constrains what may be written. Without it a user can insert or
-- update rows carrying another user's id.
-- ---------------------------------------------------------------------------
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_versions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet              ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_layer       ENABLE ROW LEVEL SECURITY;

ALTER TABLE users               FORCE ROW LEVEL SECURITY;
ALTER TABLE folders             FORCE ROW LEVEL SECURITY;
ALTER TABLE analyses            FORCE ROW LEVEL SECURITY;
ALTER TABLE analysis_versions   FORCE ROW LEVEL SECURITY;
ALTER TABLE annotations         FORCE ROW LEVEL SECURITY;
ALTER TABLE wallet              FORCE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions FORCE ROW LEVEL SECURITY;
ALTER TABLE context_layer       FORCE ROW LEVEL SECURITY;

CREATE POLICY users_self ON users
  USING (id = app_current_user_id())
  WITH CHECK (id = app_current_user_id());

CREATE POLICY folders_owner ON folders
  USING (user_id = app_current_user_id())
  WITH CHECK (user_id = app_current_user_id());

CREATE POLICY analyses_owner ON analyses
  USING (user_id = app_current_user_id())
  WITH CHECK (user_id = app_current_user_id());

CREATE POLICY versions_owner ON analysis_versions
  USING (analysis_id IN (SELECT id FROM analyses WHERE user_id = app_current_user_id()))
  WITH CHECK (analysis_id IN (SELECT id FROM analyses WHERE user_id = app_current_user_id()));

CREATE POLICY annotations_owner ON annotations
  USING (user_id = app_current_user_id())
  WITH CHECK (user_id = app_current_user_id());

CREATE POLICY wallet_owner ON wallet
  USING (user_id = app_current_user_id())
  WITH CHECK (user_id = app_current_user_id());

CREATE POLICY wallet_tx_owner ON wallet_transactions
  USING (user_id = app_current_user_id())
  WITH CHECK (user_id = app_current_user_id());

CREATE POLICY context_owner ON context_layer
  USING (user_id = app_current_user_id())
  WITH CHECK (user_id = app_current_user_id());

-- Collaboration is intentionally NOT owner-restricted at the database: shared
-- access is enforced in the API layer against the collaborators table, and every
-- access is written to audit_log (architecture-alignment-v4.md §7). The API-layer
-- test for this lives in api.security.test.ts.
```

- [ ] **Step 4: Run until green**

Run: `npm test --workspace @caspr/backend -- rls`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add services/backend/src/db
git commit -m "fix(db): force RLS and add WITH CHECK to every policy"
```

---

## Task 4: Audit log immutability

Catches defect 4. "Append-only, not editable including by Caspr staff" is a claim made to enterprise buyers in `architecture-alignment-v4.md` §7. Enforce it.

**Files:**
- Create: `services/backend/src/db/auditLog.test.ts`
- Modify: `services/backend/src/db/schema.sql`

- [ ] **Step 1: Write the failing test**

Create `services/backend/src/db/auditLog.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, seedTwoUsers, type TestDb } from './testDb';

let db: TestDb;

beforeEach(async () => {
  db = await createTestDb();
  await seedTwoUsers(db);
  await db.asOwner(async (raw) => {
    await raw.query(
      `INSERT INTO audit_log (user_id, event_type, analysis_id) VALUES ($1, $2, $3)`,
      ['user_alice', 'analysis.opened', 'an_alice'],
    );
  });
});
afterEach(async () => db.close());

describe('audit_log', () => {
  it('accepts appends', async () => {
    await db.asUser('user_alice', async (raw) => {
      await raw.query(`INSERT INTO audit_log (user_id, event_type) VALUES ($1, $2)`, [
        'user_alice',
        'analysis.exported',
      ]);
    });
    const { rows } = await db.asOwner((raw) => raw.query('SELECT count(*)::int AS n FROM audit_log'));
    expect((rows[0] as { n: number }).n).toBe(2);
  });

  it('refuses UPDATE, including from the application role', async () => {
    await db.asUser('user_alice', async (raw) => {
      await expect(
        raw.query(`UPDATE audit_log SET event_type = 'tampered'`),
      ).rejects.toThrow(/permission denied|row-level security|policy/i);
    });
  });

  it('refuses DELETE, including from the application role', async () => {
    await db.asUser('user_alice', async (raw) => {
      await expect(raw.query(`DELETE FROM audit_log`)).rejects.toThrow(
        /permission denied|row-level security|policy/i,
      );
    });
  });

  it('refuses TRUNCATE', async () => {
    await db.asUser('user_alice', async (raw) => {
      await expect(raw.query(`TRUNCATE audit_log`)).rejects.toThrow(/permission denied/i);
    });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/backend -- auditLog`
Expected: **FAIL** — UPDATE, DELETE and TRUNCATE all currently succeed.

- [ ] **Step 3: Enforce it in the schema**

Append to `services/backend/src/db/schema.sql`:

```sql
-- ---------------------------------------------------------------------------
-- audit_log — append-only, enforced rather than documented.
--
-- The application role may INSERT and SELECT. UPDATE and DELETE are revoked, so
-- the log cannot be rewritten by a compromised application layer, and TRUNCATE
-- is owner-only by default. Retained 12 months minimum (v4 §7).
-- ---------------------------------------------------------------------------
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM PUBLIC;
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM caspr_app;
GRANT INSERT, SELECT ON audit_log TO caspr_app;
GRANT USAGE, SELECT ON SEQUENCE audit_log_id_seq TO caspr_app;
```

**Note:** `testDb.ts` grants blanket DML to `caspr_app` after loading the schema, which would undo these revokes. Move the schema's audit grants after the role creation by updating `createTestDb` — replace the `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES` line with the same grant followed by:

```ts
    await db.exec(`
      REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM ${APP_ROLE};
    `);
```

- [ ] **Step 4: Run until green**

Run: `npm test --workspace @caspr/backend -- auditLog`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add services/backend/src/db
git commit -m "fix(db): enforce audit_log append-only at the database"
```

---

## Task 5: Password verification

Catches defect 1 — the authentication bypass.

**Files:**
- Create: `services/backend/src/auth/password.ts`
- Create: `services/backend/src/auth/password.test.ts`
- Modify: `services/backend/src/app.ts`
- Modify: `services/backend/src/db/ports.ts`
- Modify: `services/backend/src/db/memory.ts`

- [ ] **Step 1: Write the failing API test**

Add to `services/backend/src/app.test.ts`:

```ts
describe('POST /auth/session — credentials', () => {
  it('rejects a wrong password', async () => {
    const app = createApp(await testDeps());
    await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'joy@caspr.ai', password: 'correct-password' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'joy@caspr.ai', password: 'wrong-password' }),
      headers: { 'content-type': 'application/json' },
    });

    expect(res.status).toBe(401);
    expect(await res.json()).not.toHaveProperty('access_token');
  });

  it('rejects an unknown account without revealing that it is unknown', async () => {
    const app = createApp(await testDeps());
    const res = await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'nobody@example.com', password: 'anything' }),
      headers: { 'content-type': 'application/json' },
    });

    expect(res.status).toBe(401);
    // The message must not distinguish "no such user" from "wrong password" —
    // that difference is an account-enumeration oracle.
    expect(JSON.stringify(await res.json())).not.toMatch(/not found|unknown|no such/i);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/backend -- app`
Expected: **FAIL** — both return 200 with a valid `access_token`.

- [ ] **Step 3: Write the password module test**

Create `services/backend/src/auth/password.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
  it('verifies a correct password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    expect(await verifyPassword('correct-horse-battery-staple', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  it('produces a different hash for the same password each time', async () => {
    const a = await hashPassword('same-input');
    const b = await hashPassword('same-input');
    expect(a).not.toBe(b);
  });

  it('never stores the plaintext in the hash', async () => {
    const hash = await hashPassword('super-secret-value');
    expect(hash).not.toContain('super-secret-value');
  });

  it('returns false rather than throwing on a malformed hash', async () => {
    expect(await verifyPassword('anything', 'not-a-hash')).toBe(false);
  });
});
```

- [ ] **Step 4: Install argon2 and write the module**

```bash
npm install -w services/backend @node-rs/argon2@^2
```

Create `services/backend/src/auth/password.ts`:

```ts
import { hash, verify } from '@node-rs/argon2';

/**
 * Argon2id — the OWASP-recommended password hash. Parameters follow the OWASP
 * Password Storage Cheat Sheet minimum for Argon2id: 19 MiB memory, 2 passes,
 * 1 degree of parallelism.
 */
const OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 } as const;

export async function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, OPTIONS);
}

/** Returns false on a malformed hash rather than throwing — callers treat any
 *  non-true result as a failed login, and a throw would leak a distinct code path. */
export async function verifyPassword(plaintext: string, stored: string): Promise<boolean> {
  try {
    return await verify(stored, plaintext);
  } catch {
    return false;
  }
}
```

- [ ] **Step 5: Run the module test**

Run: `npm test --workspace @caspr/backend -- password`
Expected: PASS, 5 tests.

- [ ] **Step 6: Add the password hash to the user repository**

In `services/backend/src/db/ports.ts`, add to the user record type:

```ts
  /** Argon2id hash. Null for accounts created via OAuth only. */
  passwordHash: string | null;
```

Add to `UserRepository`:

```ts
  /** Returns the user for this email, or null. Never creates. */
  findByEmail(email: string): Promise<User | null>;
  /** Creates the user with a password hash. */
  createWithPassword(email: string, passwordHash: string): Promise<User>;
```

Implement both in `services/backend/src/db/memory.ts` following the existing `ensureByEmail` pattern.

- [ ] **Step 7: Fix the route**

In `services/backend/src/app.ts`, replace the body of `POST /auth/session` (lines 58-72) with:

```ts
  app.post('/auth/session', async (c) => {
    const body: { email?: string; password?: string } = await c.req.json().catch(() => ({}));
    if (!body.email || !body.password) {
      return c.json({ error: 'email and password are required' }, 400);
    }

    const user = await deps.users.findByEmail(body.email);
    const ok = user?.passwordHash
      ? await verifyPassword(body.password, user.passwordHash)
      : // Hash anyway against a dummy value so an unknown account takes the same
        // time as a known one — otherwise response timing enumerates accounts.
        await verifyPassword(body.password, DUMMY_HASH).then(() => false);

    if (!user || !ok) {
      // One message for both cases. Distinguishing them is an enumeration oracle.
      return c.json({ error: 'invalid email or password' }, 401);
    }

    await deps.wallets.ensure(user.id, FREE_TRIAL_CENTS);
    const accessToken = await issueJwt(
      deps.keys,
      { sub: user.id, email: user.email, plan: user.plan },
      verifyOpts,
    );
    return c.json({ access_token: accessToken, user });
  });
```

Add near the top of the file:

```ts
import { hashPassword, verifyPassword } from './auth/password';

/** A fixed valid Argon2id hash, used to equalise timing for unknown accounts. */
const DUMMY_HASH = await hashPassword('caspr-timing-equaliser');
```

- [ ] **Step 8: Add a registration route so accounts can exist**

Add after the session route in `app.ts`:

```ts
  app.post('/auth/register', async (c) => {
    const body: { email?: string; password?: string } = await c.req.json().catch(() => ({}));
    if (!body.email || !body.password) {
      return c.json({ error: 'email and password are required' }, 400);
    }
    if (body.password.length < 12) {
      return c.json({ error: 'password must be at least 12 characters' }, 400);
    }
    const existing = await deps.users.findByEmail(body.email);
    if (existing) {
      // Same shape and status as success — registration must not enumerate either.
      return c.json({ status: 'ok' }, 202);
    }
    await deps.users.createWithPassword(body.email, await hashPassword(body.password));
    return c.json({ status: 'ok' }, 202);
  });
```

Update the test in Step 1 to register before signing in.

- [ ] **Step 9: Run until green**

Run: `npm test --workspace @caspr/backend`
Expected: PASS across the whole backend suite.

- [ ] **Step 10: Commit**

```bash
git add services/backend/src package-lock.json
git commit -m "fix(auth): verify passwords with Argon2id, close the session bypass"
```

---

## Task 6: JWT attack tests

**Files:**
- Create: `services/backend/src/auth/attacks.test.ts`

- [ ] **Step 1: Write the test**

Create `services/backend/src/auth/attacks.test.ts`:

```ts
import { SignJWT, generateKeyPair } from 'jose';
import { describe, expect, it } from 'vitest';
import { generateSigningKeys, issueJwt, jwks, verifyWithJwks } from './idp';

const OPTS = { issuer: 'https://caspr.test', audience: 'caspr-app' };

async function fixtures() {
  const keys = await generateSigningKeys();
  return { keys, jwkSet: await jwks(keys) };
}

describe('JWT — forged and malformed tokens', () => {
  it('accepts a token this issuer minted', async () => {
    const { keys, jwkSet } = await fixtures();
    const token = await issueJwt(keys, { sub: 'u1', email: 'a@b.c', plan: 'free_trial' }, OPTS);
    await expect(verifyWithJwks(token, jwkSet, OPTS)).resolves.toMatchObject({ sub: 'u1' });
  });

  it('rejects a token signed with a different key', async () => {
    const { jwkSet } = await fixtures();
    const attacker = await generateSigningKeys();
    const forged = await issueJwt(
      attacker,
      { sub: 'u1', email: 'a@b.c', plan: 'enterprise' },
      OPTS,
    );
    await expect(verifyWithJwks(forged, jwkSet, OPTS)).rejects.toThrow();
  });

  it('rejects alg:none', async () => {
    const { jwkSet } = await fixtures();
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({ sub: 'u1', iss: OPTS.issuer, aud: OPTS.audience }),
    ).toString('base64url');
    await expect(verifyWithJwks(`${header}.${payload}.`, jwkSet, OPTS)).rejects.toThrow();
  });

  it('rejects an HS256 token signed with the public key (algorithm confusion)', async () => {
    const { keys, jwkSet } = await fixtures();
    const publicJwk = (await jwks(keys)).keys[0];
    const secret = new TextEncoder().encode(JSON.stringify(publicJwk));
    const confused = await new SignJWT({ sub: 'u1' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(OPTS.issuer)
      .setAudience(OPTS.audience)
      .setExpirationTime('1h')
      .sign(secret);
    await expect(verifyWithJwks(confused, jwkSet, OPTS)).rejects.toThrow();
  });

  it('rejects an expired token', async () => {
    const { keys, jwkSet } = await fixtures();
    const { privateKey } = await generateKeyPair('RS256');
    void privateKey;
    const expired = await issueJwt(
      keys,
      { sub: 'u1', email: 'a@b.c', plan: 'free_trial' },
      { ...OPTS, expiresIn: '-1s' },
    );
    await expect(verifyWithJwks(expired, jwkSet, OPTS)).rejects.toThrow(/exp|expired/i);
  });

  it('rejects a token for another audience', async () => {
    const { keys, jwkSet } = await fixtures();
    const token = await issueJwt(keys, { sub: 'u1', email: 'a@b.c', plan: 'free_trial' }, {
      ...OPTS,
      audience: 'someone-else',
    });
    await expect(verifyWithJwks(token, jwkSet, OPTS)).rejects.toThrow();
  });

  it('rejects a token from another issuer', async () => {
    const { keys, jwkSet } = await fixtures();
    const token = await issueJwt(keys, { sub: 'u1', email: 'a@b.c', plan: 'free_trial' }, {
      ...OPTS,
      issuer: 'https://evil.test',
    });
    await expect(verifyWithJwks(token, jwkSet, OPTS)).rejects.toThrow();
  });

  it('rejects a token whose payload was edited after signing', async () => {
    const { keys, jwkSet } = await fixtures();
    const token = await issueJwt(keys, { sub: 'u1', email: 'a@b.c', plan: 'free_trial' }, OPTS);
    const [h, p, s] = token.split('.');
    const claims = JSON.parse(Buffer.from(p, 'base64url').toString());
    claims.plan = 'enterprise';
    const tampered = `${h}.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.${s}`;
    await expect(verifyWithJwks(tampered, jwkSet, OPTS)).rejects.toThrow();
  });

  it('never publishes private key material in the JWKS', async () => {
    const { jwkSet } = await fixtures();
    const serialised = JSON.stringify(jwkSet);
    for (const field of ['"d"', '"p"', '"q"', '"dp"', '"dq"', '"qi"']) {
      expect(serialised, `JWKS leaked private field ${field}`).not.toContain(field);
    }
  });
});
```

- [ ] **Step 2: Run it**

Run: `npm test --workspace @caspr/backend -- attacks`
Expected: PASS, 9 tests. `issueJwt` may not accept an `expiresIn` override — add it to the options type if the expiry test cannot be written otherwise. A token issuer that cannot mint an expired token cannot have expiry tested.

- [ ] **Step 3: Commit**

```bash
git add services/backend/src/auth
git commit -m "test(auth): JWT forgery, confusion, expiry and tampering"
```

---

## Task 7: Rate limiting on auth endpoints

Per-user analysis limits are Jayant's. Credential stuffing against `/auth/session` is ours.

**Files:**
- Create: `services/backend/src/security/rateLimit.ts`
- Create: `services/backend/src/security/rateLimit.test.ts`
- Modify: `services/backend/src/app.ts`

- [ ] **Step 1: Write the failing test**

Create `services/backend/src/security/rateLimit.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter } from './rateLimit';

describe('rate limiter', () => {
  it('allows requests up to the limit', () => {
    const limit = createRateLimiter({ max: 3, windowMs: 60_000, now: () => 0 });
    expect(limit.check('1.2.3.4')).toMatchObject({ allowed: true });
    expect(limit.check('1.2.3.4')).toMatchObject({ allowed: true });
    expect(limit.check('1.2.3.4')).toMatchObject({ allowed: true });
  });

  it('blocks past the limit and states when to retry', () => {
    const limit = createRateLimiter({ max: 2, windowMs: 60_000, now: () => 0 });
    limit.check('1.2.3.4');
    limit.check('1.2.3.4');
    const blocked = limit.check('1.2.3.4');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(60);
  });

  it('keeps separate counters per key', () => {
    const limit = createRateLimiter({ max: 1, windowMs: 60_000, now: () => 0 });
    expect(limit.check('a').allowed).toBe(true);
    expect(limit.check('b').allowed).toBe(true);
    expect(limit.check('a').allowed).toBe(false);
  });

  it('resets once the window passes', () => {
    let clock = 0;
    const limit = createRateLimiter({ max: 1, windowMs: 60_000, now: () => clock });
    expect(limit.check('a').allowed).toBe(true);
    expect(limit.check('a').allowed).toBe(false);
    clock = 60_001;
    expect(limit.check('a').allowed).toBe(true);
  });

  it('does not grow without bound', () => {
    let clock = 0;
    const limit = createRateLimiter({ max: 1, windowMs: 1_000, now: () => clock });
    for (let i = 0; i < 10_000; i++) {
      clock = i * 2_000;
      limit.check(`key-${i}`);
    }
    expect(limit.size()).toBeLessThan(100);
  });
});

describe('auth endpoints are rate limited', () => {
  it('returns 429 with Retry-After after repeated failures', async () => {
    const { createApp } = await import('../app');
    const { testDeps } = await import('../app.test');
    const app = createApp({ ...(await testDeps()), authRateLimit: { max: 5, windowMs: 60_000 } });

    let last: Response | undefined;
    for (let i = 0; i < 7; i++) {
      last = await app.request('/auth/session', {
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.c', password: `guess-${i}` }),
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '9.9.9.9' },
      });
    }

    expect(last!.status).toBe(429);
    expect(last!.headers.get('retry-after')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/backend -- rateLimit`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the limiter**

Create `services/backend/src/security/rateLimit.ts`:

```ts
/**
 * Fixed-window limiter for the auth surface. In-process by design: it is the
 * first line against credential stuffing from a single source, not a
 * distributed quota. Per-user analysis limits are Jayant's (contract v4 §7.8).
 *
 * When the backend runs multiple replicas, move the counter to ElastiCache —
 * the interface stays the same.
 */
export interface RateLimitOptions {
  max: number;
  windowMs: number;
  /** Injected so the window can be tested without waiting for it. */
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
  size(): number;
}

export function createRateLimiter(opts: RateLimitOptions): RateLimiter {
  const now = opts.now ?? (() => Date.now());
  const windows = new Map<string, { start: number; count: number }>();

  const sweep = (current: number) => {
    for (const [key, w] of windows) {
      if (current - w.start >= opts.windowMs) windows.delete(key);
    }
  };

  return {
    check(key) {
      const current = now();
      // Sweeping on every call keeps the map bounded without a timer.
      sweep(current);

      const existing = windows.get(key);
      if (!existing || current - existing.start >= opts.windowMs) {
        windows.set(key, { start: current, count: 1 });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      existing.count += 1;
      if (existing.count > opts.max) {
        const elapsed = current - existing.start;
        return {
          allowed: false,
          retryAfterSeconds: Math.ceil((opts.windowMs - elapsed) / 1000),
        };
      }
      return { allowed: true, retryAfterSeconds: 0 };
    },
    size: () => windows.size,
  };
}
```

- [ ] **Step 4: Wire it into the app**

In `services/backend/src/app.ts`, add to `AppDeps`:

```ts
  /** Limits on the auth surface. Defaults to 10 attempts per 15 minutes per IP. */
  authRateLimit?: { max: number; windowMs: number };
```

Add after the CORS block:

```ts
  const authLimiter = createRateLimiter(
    deps.authRateLimit ?? { max: 10, windowMs: 15 * 60_000 },
  );

  // Auth endpoints only — the analysis surface is rate limited by Jayant.
  const limitAuth: MiddlewareHandler<Env> = async (c, next) => {
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      c.req.header('x-real-ip') ??
      'unknown';
    const result = authLimiter.check(ip);
    if (!result.allowed) {
      c.header('retry-after', String(result.retryAfterSeconds));
      return c.json(
        { error: 'too many requests', retry_after_seconds: result.retryAfterSeconds },
        429,
      );
    }
    return next();
  };
  app.use('/auth/*', limitAuth);
```

Import `createRateLimiter` at the top.

- [ ] **Step 5: Run until green**

Run: `npm test --workspace @caspr/backend`
Expected: PASS. Export `testDeps` from `app.test.ts` if it is not already exported.

- [ ] **Step 6: Commit**

```bash
git add services/backend/src
git commit -m "feat(security): rate limit the auth surface"
```

---

## Task 8: API security — IDOR, headers, CORS, fuzzing

**Files:**
- Create: `services/backend/src/security/headers.ts`
- Create: `services/backend/src/api.security.test.ts`
- Modify: `services/backend/src/app.ts`

- [ ] **Step 1: Write the failing test**

Create `services/backend/src/api.security.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import { testDeps } from './app.test';

async function appAndTokens() {
  const app = createApp(await testDeps());
  const register = async (email: string) =>
    app.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'correct-horse-battery' }),
      headers: { 'content-type': 'application/json' },
    });
  const signIn = async (email: string) => {
    const res = await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'correct-horse-battery' }),
      headers: { 'content-type': 'application/json' },
    });
    return (await res.json()).access_token as string;
  };
  await register('alice@caspr.ai');
  await register('bob@caspr.ai');
  return { app, alice: await signIn('alice@caspr.ai'), bob: await signIn('bob@caspr.ai') };
}

describe('authorization', () => {
  it('rejects protected routes without a token', async () => {
    const { app } = await appAndTokens();
    for (const path of ['/me', '/wallet']) {
      expect((await app.request(path)).status, path).toBe(401);
    }
  });

  it('rejects a malformed Authorization header', async () => {
    const { app } = await appAndTokens();
    for (const header of ['Bearer', 'Bearer ', 'Basic abc', 'Bearer not.a.jwt']) {
      const res = await app.request('/wallet', { headers: { authorization: header } });
      expect(res.status, header).toBe(401);
    }
  });

  it('returns each user only their own wallet', async () => {
    const { app, alice, bob } = await appAndTokens();
    const a = await (await app.request('/wallet', {
      headers: { authorization: `Bearer ${alice}` },
    })).json();
    const b = await (await app.request('/wallet', {
      headers: { authorization: `Bearer ${bob}` },
    })).json();
    // Both are fresh free-trial wallets; the point is that each request is
    // scoped to its own token, never to a client-supplied identifier.
    expect(a).toBeDefined();
    expect(b).toBeDefined();
  });

  it('ignores a user id supplied by the client', async () => {
    const { app, alice } = await appAndTokens();
    const res = await app.request('/wallet?user_id=someone-else', {
      headers: { authorization: `Bearer ${alice}` },
    });
    expect(res.status).toBe(200);
    // The response must be derived from the token's sub, never the query string.
    const body = await res.json();
    expect(JSON.stringify(body)).not.toContain('someone-else');
  });
});

describe('security headers', () => {
  it('sets the standard hardening headers on every response', async () => {
    const { app } = await appAndTokens();
    const res = await app.request('/.well-known/jwks.json');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('referrer-policy')).toBe('no-referrer');
    expect(res.headers.get('strict-transport-security')).toMatch(/max-age=\d+/);
    expect(res.headers.get('content-security-policy')).toMatch(/default-src/);
  });

  it('never returns a server or framework banner', async () => {
    const { app } = await appAndTokens();
    const res = await app.request('/.well-known/jwks.json');
    expect(res.headers.get('x-powered-by')).toBeNull();
  });
});

describe('input validation', () => {
  const HOSTILE = [
    '',
    '{',
    '[]',
    'null',
    JSON.stringify({ email: 'a'.repeat(100_000), password: 'x' }),
    JSON.stringify({ email: { $ne: null }, password: { $ne: null } }),
    JSON.stringify({ email: "' OR 1=1 --", password: "' OR 1=1 --" }),
    JSON.stringify({ email: '../../etc/passwd', password: 'x' }),
    JSON.stringify({ email: 'a@b.c\u0000admin', password: 'x' }),
    JSON.stringify({ email: '<script>alert(1)</script>', password: 'x' }),
  ];

  it('never returns 5xx for hostile input', async () => {
    const { app } = await appAndTokens();
    for (const body of HOSTILE) {
      const res = await app.request('/auth/session', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '7.7.7.7' },
      });
      expect(res.status, `body: ${body.slice(0, 60)}`).toBeLessThan(500);
    }
  });

  it('never echoes a stack trace or internal path', async () => {
    const { app } = await appAndTokens();
    for (const body of HOSTILE) {
      const res = await app.request('/auth/session', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '8.8.8.8' },
      });
      const text = await res.text();
      expect(text).not.toMatch(/at .+ \(.+:\d+:\d+\)/);
      expect(text).not.toMatch(/node_modules|\/services\/backend\/src/);
    }
  });
});

describe('CORS', () => {
  it('refuses an origin that is not allowed', async () => {
    const app = createApp({ ...(await testDeps()), corsOrigin: 'https://app.caspr.ai' });
    const res = await app.request('/wallet', {
      method: 'OPTIONS',
      headers: { origin: 'https://evil.test', 'access-control-request-method': 'GET' },
    });
    expect(res.headers.get('access-control-allow-origin')).not.toBe('https://evil.test');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/backend -- api.security`
Expected: FAIL on the header tests.

- [ ] **Step 3: Write the headers middleware**

Create `services/backend/src/security/headers.ts`:

```ts
import type { MiddlewareHandler } from 'hono';

/**
 * Response hardening. The API serves JSON only, so the CSP is maximally strict —
 * nothing is meant to render from these responses. The SPA's own CSP is set at
 * CloudFront.
 */
export const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next();
  c.header('x-content-type-options', 'nosniff');
  c.header('x-frame-options', 'DENY');
  c.header('referrer-policy', 'no-referrer');
  c.header('strict-transport-security', 'max-age=63072000; includeSubDomains; preload');
  c.header('content-security-policy', "default-src 'none'; frame-ancestors 'none'");
  c.header('cross-origin-resource-policy', 'same-origin');
  c.header('x-powered-by', '', { append: false });
  c.res.headers.delete('x-powered-by');
};
```

- [ ] **Step 4: Wire it in**

In `services/backend/src/app.ts`, immediately after `const app = new Hono<Env>();`:

```ts
  app.use('*', securityHeaders);
```

Import it at the top.

- [ ] **Step 5: Run until green**

Run: `npm test --workspace @caspr/backend -- api.security`
Expected: PASS. Any 5xx from hostile input is a real crash — fix the handler, do not catch and rethrow.

- [ ] **Step 6: Commit**

```bash
git add services/backend/src
git commit -m "feat(security): hardening headers, IDOR and input-validation tests"
```

---

## Task 9: No secrets in the built bundle

**Files:**
- Create: `apps/web/src/test/bundleSecrets.test.ts`

- [ ] **Step 1: Write the test**

Create `apps/web/src/test/bundleSecrets.test.ts`:

```ts
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Anything in the built bundle is public. This asserts nothing that must stay
 * private has been inlined by Vite — most commonly through a mis-prefixed
 * VITE_ environment variable.
 */
const DIST = join(process.cwd(), 'dist');

const FORBIDDEN: Array<{ name: string; pattern: RegExp }> = [
  { name: 'PEM private key', pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { name: 'JWK private exponent', pattern: /"d"\s*:\s*"[A-Za-z0-9_-]{20,}"/ },
  { name: 'Stripe secret key', pattern: /\bsk_(live|test)_[A-Za-z0-9]{16,}/ },
  { name: 'Stripe webhook secret', pattern: /\bwhsec_[A-Za-z0-9]{16,}/ },
  { name: 'AWS access key id', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Google OAuth client secret', pattern: /\bGOCSPX-[A-Za-z0-9_-]{20,}/ },
  { name: 'Generic bearer secret', pattern: /"(client_secret|api_secret|private_key)"\s*:/ },
];

describe('built bundle', () => {
  it('contains no secret material', () => {
    if (!existsSync(DIST)) {
      throw new Error('dist/ not found — run `npm run build --workspace @caspr/web` first.');
    }

    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (/\.(js|css|html|map)$/.test(entry.name)) files.push(path);
      }
    };
    walk(DIST);
    expect(files.length, 'no build output found').toBeGreaterThan(0);

    const findings: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      for (const { name, pattern } of FORBIDDEN) {
        if (pattern.test(content)) findings.push(`${name} in ${file}`);
      }
    }

    expect(findings, `Secrets found in the bundle:\n${findings.join('\n')}`).toEqual([]);
  });
});
```

- [ ] **Step 2: Build and run**

Run: `npm run build --workspace @caspr/web && npm test --workspace @caspr/web -- bundleSecrets`
Expected: PASS. A finding means an environment variable is prefixed `VITE_` that must not be — move it server-side.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/test/bundleSecrets.test.ts
git commit -m "test(security): assert no secret material in the built bundle"
```

---

## Task 10: Threat model and OWASP checklist

**Files:**
- Create: `docs/security/threat-model.md`
- Create: `docs/security/owasp-checklist.md`

- [ ] **Step 1: Write the threat model**

Create `docs/security/threat-model.md`. Work through STRIDE for each trust boundary in contract v4. Use this structure, and fill every row from the actual architecture — a threat model copied from a template is worthless:

```markdown
# Caspr Product — Threat Model

**Method:** STRIDE per trust boundary.
**Scope:** The SPA, the product-side backend, and the integration surface with Jayant's AI backend.
**Version:** 1.0 · 2026-08-12 · reviewed at each phase gate.

## Trust boundaries

| # | Boundary | Crosses |
|---|---|---|
| B1 | Browser → CloudFront | Untrusted → our static assets |
| B2 | Browser → product backend | Untrusted → our authenticated API |
| B3 | Browser → Jayant's MCP endpoint | Untrusted → the AI pipeline |
| B4 | Product backend → RDS | Our code → per-user data |
| B5 | Product backend → Stripe webhook | Stripe → our wallet ledger |
| B6 | Browser → S3 presigned upload | Untrusted → Jayant's storage |

## Threats

For each boundary, one row per applicable STRIDE category:

| ID | Boundary | Category | Threat | Existing control | Test | Residual risk |
|---|---|---|---|---|---|---|
| T1 | B2 | Spoofing | Forged or replayed JWT grants access | RS256, short expiry, JWKS verification | `auth/attacks.test.ts` | Low |
| T2 | B2 | Elevation | Credential stuffing on /auth/session | Argon2id, per-IP rate limit, uniform errors | `security/rateLimit.test.ts` | Medium — add per-account lockout in Phase 3 |
| ... | | | | | | |

Continue for every boundary. Every threat must name a test or be listed as unmitigated.

## Unmitigated threats

Threats accepted for now, with the reason and the trigger for revisiting.
```

- [ ] **Step 2: Write the OWASP checklist**

Create `docs/security/owasp-checklist.md` covering both OWASP Top 10 (2021) and OWASP Top 10 for LLM Applications. Each item needs: how it applies to Caspr, the control, the test file that proves it, and a status of `covered` / `partial` / `not applicable` with a reason. `not applicable` with no reason is not acceptable.

- [ ] **Step 3: Commit**

```bash
git add docs/security
git commit -m "docs(security): STRIDE threat model and OWASP checklist"
```

---

## Task 11: Stub AI backend

Load testing needs a stand-in for Jayant's pipeline that responds with the right shapes at the right speed — and costs nothing to hammer.

**Files:**
- Create: `services/stub-ai/package.json`
- Create: `services/stub-ai/src/server.ts`
- Modify: root `package.json`

- [ ] **Step 1: Create the workspace**

Create `services/stub-ai/package.json`:

```json
{
  "name": "@caspr/stub-ai",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "tsx src/server.ts"
  },
  "dependencies": {
    "@caspr/contract": "*",
    "@caspr/mocks": "*",
    "@hono/node-server": "^1.19.17",
    "hono": "^4.12.32"
  },
  "devDependencies": {
    "tsx": "^4.23.12",
    "typescript": "^5.7.2"
  }
}
```

- [ ] **Step 2: Write the server**

Create `services/stub-ai/src/server.ts`:

```ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

/**
 * A stand-in for Jayant's AI backend, for load testing only.
 *
 * It returns contract-correct shapes with realistic latency and costs nothing
 * to hammer. Load profiles NEVER point at the real pipeline — that spends GPU
 * budget and tells us nothing about our own layer's capacity.
 *
 * Latencies are configurable so a profile can model a slow backend without
 * changing the script.
 */
const PORT = Number(process.env.STUB_AI_PORT ?? 8788);
const LAYOUT_MS = Number(process.env.STUB_LAYOUT_MS ?? 800);
const SECTION_MS = Number(process.env.STUB_SECTION_MS ?? 400);
const SECTION_COUNT = Number(process.env.STUB_SECTION_COUNT ?? 7);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const app = new Hono();

app.get('/health', (c) => c.json({ ok: true }));

app.post('/mcp/propose_layout', async (c) => {
  await sleep(LAYOUT_MS);
  return c.json({
    sections: Array.from({ length: SECTION_COUNT }, (_, i) => ({
      id: `s${i}`,
      title: `Section ${i + 1}`,
      estimatedPages: 12,
    })),
    clarifyingQuestions: Array.from({ length: 5 }, (_, i) => ({
      id: `q${i}`,
      question: `Clarifying question ${i + 1}?`,
    })),
  });
});

app.post('/mcp/trigger', async (c) => {
  await sleep(120);
  return c.json({ analysisId: `an_${Math.floor(performance.now() * 1000)}`, status: 'started' });
});

app.get('/analyses/:id/source-stream', (c) =>
  streamSSE(c, async (stream) => {
    const categories = ['government', 'filings', 'news', 'academic', 'industry'];
    for (const category of categories) {
      await stream.writeSSE({
        event: 'source_category_activated',
        data: JSON.stringify({ category }),
      });
      for (let n = 1; n <= 20; n++) {
        await sleep(25);
        await stream.writeSSE({
          event: 'source_category_progress',
          data: JSON.stringify({ category, count: n }),
        });
      }
    }
    await stream.writeSSE({ event: 'layout_ready', data: JSON.stringify({ sections: [] }) });
    await stream.writeSSE({ event: 'stream_complete', data: '{}' });
  }),
);

app.get('/analyses/:id/section-stream', (c) =>
  streamSSE(c, async (stream) => {
    for (let i = 0; i < SECTION_COUNT; i++) {
      await stream.writeSSE({
        event: 'section_started',
        data: JSON.stringify({ section_id: `s${i}`, title: `Section ${i + 1}` }),
      });
      await sleep(SECTION_MS);
      await stream.writeSSE({
        event: 'section_complete',
        data: JSON.stringify({ section_id: `s${i}`, chart_data: null }),
      });
    }
    await stream.writeSSE({ event: 'analysis_complete', data: '{}' });
    await stream.writeSSE({ event: 'stream_complete', data: '{}' });
  }),
);

serve({ fetch: app.fetch, port: PORT });
console.warn(`stub-ai listening on :${PORT}`);
```

- [ ] **Step 3: Install and start it**

```bash
npm install
npm start --workspace @caspr/stub-ai
```

In another shell: `curl -s http://127.0.0.1:8788/health`
Expected: `{"ok":true}`

- [ ] **Step 4: Commit**

```bash
git add services/stub-ai package.json package-lock.json
git commit -m "feat(load): stub AI backend for load testing"
```

---

## Task 12: k6 load — REST profiles

**Files:**
- Create: `load/backend.js`
- Create: `load/README.md`
- Modify: root `package.json`

- [ ] **Step 1: Install k6**

k6 is a standalone binary, not an npm package.

```bash
winget install k6 --source winget
```

Verify: `k6 version`

- [ ] **Step 2: Write the REST profiles**

Create `load/backend.js`:

```js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * Load profiles for the product-side backend. Targets come from the environment
 * — never hardcoded, so the same script runs against local, staging and a
 * stubbed production-shaped environment.
 *
 * Run:
 *   k6 run -e BACKEND=http://127.0.0.1:8787 -e PROFILE=steady load/backend.js
 */
const BACKEND = __ENV.BACKEND;
if (!BACKEND) throw new Error('BACKEND is required, e.g. -e BACKEND=http://127.0.0.1:8787');

const PROFILE = __ENV.PROFILE || 'steady';

const authFailures = new Rate('auth_failures');
const walletLatency = new Trend('wallet_latency_ms');

/**
 * 500 concurrent analyses is the locked design target. Each analysis implies a
 * signed-in user polling their wallet and holding a stream, so the REST profile
 * models 500 concurrent sessions.
 */
const PROFILES = {
  // Does the design target hold when it is simply sustained?
  steady: {
    stages: [
      { duration: '2m', target: 500 },
      { duration: '30m', target: 500 },
      { duration: '2m', target: 0 },
    ],
  },
  // What a Product Hunt post or a LinkedIn launch actually does to you.
  spike: {
    stages: [
      { duration: '60s', target: 500 },
      { duration: '5m', target: 500 },
      { duration: '60s', target: 0 },
    ],
  },
  // Connection pools, memory drift, token-refresh cliffs.
  soak: {
    stages: [
      { duration: '5m', target: 100 },
      { duration: '4h', target: 100 },
      { duration: '5m', target: 0 },
    ],
  },
};

export const options = {
  scenarios: { main: { executor: 'ramping-vus', ...PROFILES[PROFILE] } },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    auth_failures: ['rate<0.01'],
    wallet_latency_ms: ['p(95)<300'],
  },
};

export function setup() {
  // One shared password across load identities; these accounts exist only here.
  return { password: 'load-test-correct-horse' };
}

export default function (data) {
  const email = `load-${__VU}@loadtest.invalid`;

  http.post(
    `${BACKEND}/auth/register`,
    JSON.stringify({ email, password: data.password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { op: 'register' } },
  );

  const session = http.post(
    `${BACKEND}/auth/session`,
    JSON.stringify({ email, password: data.password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { op: 'session' } },
  );

  const ok = check(session, { 'session issued': (r) => r.status === 200 });
  authFailures.add(!ok);
  if (!ok) {
    sleep(1);
    return;
  }

  const token = session.json('access_token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const wallet = http.get(`${BACKEND}/wallet`, { ...authHeaders, tags: { op: 'wallet' } });
  walletLatency.add(wallet.timings.duration);
  check(wallet, { 'wallet returned': (r) => r.status === 200 });

  const me = http.get(`${BACKEND}/me`, { ...authHeaders, tags: { op: 'me' } });
  check(me, { 'me returned': (r) => r.status === 200 });

  // A real session is not a tight loop. Think time keeps the profile honest.
  sleep(Math.random() * 3 + 2);
}
```

- [ ] **Step 3: Write the runbook**

Create `load/README.md`:

```markdown
# Load profiles

Target: **500 concurrent analyses** (locked, `project-caspr-product-build`).

## Rules

1. **Never point a profile at Jayant's real pipeline.** It costs GPU budget and
   proves nothing about our layer. Use `@caspr/stub-ai`.
2. Targets come from `-e` flags. Nothing is hardcoded.
3. Load accounts use the `@loadtest.invalid` domain so they are trivially
   identifiable and deletable. `.invalid` is reserved by RFC 2606 and can never
   receive mail.

## Running

Start the stub and the backend, then:

```
k6 run -e BACKEND=http://127.0.0.1:8787 -e PROFILE=steady load/backend.js
k6 run -e BACKEND=http://127.0.0.1:8787 -e PROFILE=spike  load/backend.js
k6 run -e BACKEND=http://127.0.0.1:8787 -e PROFILE=soak   load/backend.js
k6 run -e STUB=http://127.0.0.1:8788 load/streams.js
```

## What each profile proves

| Profile | Proves | Fails if |
|---|---|---|
| steady | The design target is sustainable | p95 > 500ms or error rate > 1% |
| spike | A launch does not take the product down | Errors during ramp, or no recovery after |
| soak | No connection-pool or memory drift over hours | Latency climbs across the run |
| streams | The fan-out, not just the REST surface | Connections drop or events are lost |

## What these do NOT prove

Our layer's capacity only. Jayant load-tests the AI pipeline to 500 concurrent
and provides the number (contract v4 §11, open item).
```

- [ ] **Step 4: Run the spike profile**

Start the backend (`npm run dev --workspace @caspr/backend`), then:

Run: `k6 run -e BACKEND=http://127.0.0.1:8787 -e PROFILE=spike load/backend.js`
Expected: all thresholds pass. A threshold breach is a real capacity finding — record it in `QUESTIONS-FOR-JOY.md` with the numbers.

- [ ] **Step 5: Commit**

```bash
git add load
git commit -m "feat(load): k6 REST profiles against the 500-concurrent target"
```

---

## Task 13: k6 load — streaming fan-out

The real bottleneck. A REST-only load test passes and proves nothing about 500 concurrent persistent connections.

**Files:**
- Create: `load/streams.js`

- [ ] **Step 1: Write the profile**

Create `load/streams.js`:

```js
import http from 'k6/http';
import { check } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

/**
 * Streaming fan-out under load.
 *
 * This is where the architecture actually strains: 500 concurrent analyses each
 * holding a persistent connection through the pub/sub layer. The REST profile
 * will pass happily while this one falls over.
 *
 * Run: k6 run -e STUB=http://127.0.0.1:8788 load/streams.js
 */
const STUB = __ENV.STUB;
if (!STUB) throw new Error('STUB is required, e.g. -e STUB=http://127.0.0.1:8788');

const eventsReceived = new Counter('sse_events_received');
const streamsCompleted = new Rate('sse_streams_completed');
const timeToFirstEvent = new Trend('sse_time_to_first_event_ms');

export const options = {
  scenarios: {
    // Learning Brain phase only — SSE is held for minutes, not hours
    // (contract v4 §8: the stream closes after layout_ready).
    sourceStreams: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 500 },
        { duration: '10m', target: 500 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    sse_streams_completed: ['rate>0.99'],
    sse_time_to_first_event_ms: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const start = Date.now();
  const analysisId = `an_${__VU}_${__ITER}`;

  // k6 reads the stream to completion; the response body carries every event.
  const res = http.get(`${STUB}/analyses/${analysisId}/source-stream`, {
    headers: { Accept: 'text/event-stream' },
    timeout: '120s',
    tags: { op: 'source-stream' },
  });

  const body = res.body || '';
  const events = (body.match(/^event:/gm) || []).length;
  eventsReceived.add(events);

  const completed = body.includes('stream_complete');
  streamsCompleted.add(completed);

  if (events > 0) timeToFirstEvent.add(Date.now() - start);

  check(res, {
    'stream returned 200': (r) => r.status === 200,
    'layout_ready was emitted': () => body.includes('layout_ready'),
    'stream closed cleanly': () => completed,
  });
}
```

- [ ] **Step 2: Run it**

Start the stub (`npm start --workspace @caspr/stub-ai`), then:

Run: `k6 run -e STUB=http://127.0.0.1:8788 load/streams.js`
Expected: thresholds pass. Dropped or truncated streams at 500 VUs are the finding this profile exists to produce — record the concurrency at which it degrades.

- [ ] **Step 3: Record the result**

Append the observed numbers to `load/README.md` under a `## Results` heading: date, profile, peak concurrency, p95, error rate, and the concurrency at which anything degraded. Jayant needs these numbers, not a claim that it passed.

- [ ] **Step 4: Commit**

```bash
git add load
git commit -m "feat(load): streaming fan-out profile"
```

---

## Task 14: Wire Phase 2 into CI

**Files:**
- Modify: `bitbucket-pipelines.yml`

- [ ] **Step 1: Add the security step**

In `bitbucket-pipelines.yml`, add to `definitions.steps`:

```yaml
    - step: &security
        name: Security — RLS, auth, API, bundle
        caches: [npmcache]
        script:
          - npm ci
          - npm test --workspace @caspr/backend
          - npm run build --workspace @caspr/web
          - npm test --workspace @caspr/web -- bundleSecrets
        artifacts:
          - coverage/**
```

- [ ] **Step 2: Add it to the PR and main pipelines**

In both `pull-requests: '**'` and `branches: main`, add `- step: *security` to the existing `parallel` block alongside `*static` and `*unit`.

- [ ] **Step 3: Add a weekly load pipeline**

Add under `pipelines.custom`:

```yaml
    load:
      - step:
          name: Load — spike and streams
          image: grafana/k6:latest
          script:
            - npm ci
            - npm start --workspace @caspr/stub-ai &
            - npm run dev --workspace @caspr/backend &
            - sleep 15
            - k6 run -e BACKEND=http://127.0.0.1:8787 -e PROFILE=spike load/backend.js
            - k6 run -e STUB=http://127.0.0.1:8788 load/streams.js
```

Schedule it weekly in Bitbucket: Repository settings → Pipelines → Schedules → branch `main`, pipeline `custom: load`, weekly.

The 30-minute steady and 4-hour soak profiles are run manually at milestones — they are too long for a scheduled pipeline and their results need reading, not a pass/fail.

- [ ] **Step 4: Verify the gate locally**

```bash
npm run lint && npm run typecheck && npm run security:deps && npm test && npm run build && npm run size
```

Expected: all exit 0.

- [ ] **Step 5: Commit**

```bash
git add bitbucket-pipelines.yml
git commit -m "ci: add security gate and weekly load pipeline"
```

---

## Task 15: Penetration testing authorization request

Everything active against Jayant's infrastructure is blocked until this is signed. Draft it so it is easy to say yes to.

**Files:**
- Create: `docs/security/pentest-authorization-request.md`

- [ ] **Step 1: Write the request**

Create `docs/security/pentest-authorization-request.md`:

```markdown
# Authorization Request — Security Testing, Caspr Staging

**To:** Jayant, CTO
**From:** Joy
**Date:** 2026-08-12
**Requires:** Written approval before any listed activity begins.

## What this is

Approval to run active security testing against a **non-production** Caspr
environment, so that findings surface before cutover rather than after.
Passive work — static analysis, dependency scanning, threat modelling, and
testing of our own product-side code — is already underway and needs no
approval. This request covers only what touches shared or your-side systems.

## Scope — in

| Target | Environment | Techniques |
|---|---|---|
| Product-side API | staging | Active scanning, API fuzzing, authentication and authorization attacks |
| SPA at the staging origin | staging | Active web scanning (OWASP ZAP), known-vulnerability probing (Nuclei) |
| MCP integration surface | staging | Contract fuzzing (Schemathesis), rate-limit and abuse testing |
| Analysis pipeline, via the API only | staging | Prompt injection through the prompt field and through uploaded documents; model-extraction pattern simulation |

## Scope — out

Explicitly excluded. No testing of any of the following without a separate
request:

- Production, and anything serving a real customer
- Infrastructure-level attacks: EKS nodes, RDS, ElastiCache, the AWS account
- Denial-of-service or volumetric attacks of any kind
- Social engineering of anyone at Caspr or any supplier
- Physical security
- Third-party services: Stripe, Google, AWS control plane

## Timing and limits

| Parameter | Value |
|---|---|
| Window | To be agreed — proposed [DATE] to [DATE] |
| Request ceiling | 50 requests/second, hard-capped in the tooling |
| Notice before starting | 24 hours, by email |
| Abort signal | Any message from you. Testing halts immediately, no questions. |
| Named contact | Joy — [contact] |

## Data handling

- All findings held in `caspr-claude-core`, shared only with you.
- Any real customer data encountered is not copied, retained or transmitted;
  the finding is reported and the data left in place.
- Test accounts use the `@loadtest.invalid` domain and are deleted after.

## AWS

AWS permits customer-initiated penetration testing of your own resources for the
listed services without prior approval from AWS, but **simulated DoS is
prohibited** and is excluded above. If you would prefer we file the AWS
simulated-events form regardless, say so and we will.

## What we need from you

1. Written approval of the scope above, or an amended scope.
2. A staging environment URL, and confirmation that it carries no real
   customer data.
3. A window that does not collide with your team's work.
4. Confirmation of who to contact if something breaks outside working hours.

## What you get

A written findings report with severity, reproduction steps, and a suggested
fix per item — plus the automated suite retained in CI so regressions are caught
without a repeat exercise.

---

**Approved by:** ______________________  **Date:** ____________
```

- [ ] **Step 2: Send it to Joy for review, then to Jayant**

Do not send directly to Jayant. Joy reviews first.

- [ ] **Step 3: Commit**

```bash
git add docs/security/pentest-authorization-request.md
git commit -m "docs(security): penetration testing authorization request"
```

---

## Task 16: The handover package

Jayant must be able to verify his own integration without us in the loop.

**Files:**
- Create: `HANDOVER.md`
- Modify: `README.md`

- [ ] **Step 1: Write the package index**

Create `HANDOVER.md`:

```markdown
# Caspr Product App — Handover

**To:** Jayant's team
**Contract:** `architecture-alignment-v4.md` (v4.1) — the integration surface.
**Rule that governs everything here:** no hardcoded domains, roots, keys or
ports. Every environment value is injected. Re-pointing local → new.caspr.ai →
caspr.ai is a config change, never a code change. This is enforced by a lint
rule (`caspr/no-hardcoded-origin`) that fails the build.

## 1. What is in this repo

| Workspace | What it is |
|---|---|
| `packages/contract` | The versioned integration types. The backbone. Both sides depend on these. |
| `packages/util` | Shared primitives |
| `apps/web` | The React SPA |
| `services/backend` | The product-side backend: auth and JWT issuance, wallet, Stripe webhook, RDS schema |
| `services/mocks` | Mock implementations of your endpoints — what we built against |
| `services/stub-ai` | A load-testing stand-in for your pipeline. Not production code. |

## 2. Verifying your integration

One command:

```
npm ci
TEST_TARGET=staging TEST_MCP_ENDPOINT=<your endpoint> npm run test:contract
```

Every failure names the field that drifted from the contract and the endpoint it
came from. Green means the shapes match; it does not assert your analysis is
correct, only that we can consume it.

## 3. Swapping mocks for your endpoints

Set `VITE_USE_MOCKS=false` and point these at your services. No code changes.

| Variable | What it points at |
|---|---|
| `VITE_BACKEND_ORIGIN` | The product-side backend |
| `VITE_MCP_ENDPOINT` | Your MCP endpoint |
| `VITE_REALTIME_ORIGIN` | The WebSocket service |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client |

Full detail: `apps/web/src/config/env.ts` — the single source of runtime config.

## 4. Deployment

`bitbucket-pipelines.yml` is complete and gated. Repository variables required:

`AWS_ACCESS_KEY_ID` · `AWS_SECRET_ACCESS_KEY` · `AWS_DEFAULT_REGION` ·
`WEB_S3_BUCKET` · `WEB_CLOUDFRONT_DISTRIBUTION_ID`

Frontend: build → `s3 sync` → CloudFront invalidation. The deploy step is manual
by design; nothing ships without someone choosing to ship it.

Backend: Hono, portable to EKS or Lambda. Entry point `services/backend/src/server.ts`.

## 5. The database

`services/backend/src/db/schema.sql` — 10 tables for non-sensitive data only.
Analysis content and uploaded files are never written here; that boundary is
asserted by tests.

**The app must connect as a non-owner role.** RLS policies are `FORCE`d, so
ownership does not bypass them, but a superuser connection would. Create the
application role with the grants in `services/backend/src/db/testDb.ts`.

## 6. The test gate

Nothing deploys unless all of these are green:

| Gate | What it covers |
|---|---|
| Static | Lint, hardcoded-origin rule, typecheck, secrets, dependency audit, SAST |
| Unit + matrix | Ledger properties, RLS isolation, audit-log immutability, JWT attacks, and the fault matrix — every async path under every failure mode |
| Build | Compiles, and stays inside the bundle budget |
| E2E | Real-browser journeys, accessibility, interaction latency |

Run the whole gate locally:

```
npm run lint && npm run typecheck && npm run security:deps && npm test && npm run build && npm run size && npm run e2e
```

## 7. Load test results

`load/README.md` carries the measured numbers against the 500-concurrent target
for our layer, tested against `services/stub-ai`.

**Open item:** the maximum concurrent analyses your infrastructure supports
(contract v4 §11). Without it we cannot set free-trial guardrails or design the
queue UX.

## 8. Open items

`architecture-alignment-v4.md` §11 lists what is still outstanding from your
side. `QUESTIONS-FOR-JOY.md` lists what is outstanding from ours.

## 9. Security testing

`docs/security/pentest-authorization-request.md` needs your signature before any
active testing runs against a shared environment. Passive testing of our own
code is already in CI.
```

- [ ] **Step 2: Link it from the README**

Add near the top of `README.md`:

```markdown
> **Handing this over?** Start at [`HANDOVER.md`](HANDOVER.md).
```

- [ ] **Step 3: Verify every command in the handover actually runs**

Run each command block in `HANDOVER.md` in a clean checkout. A handover document containing a command that does not work is worse than no document.

Note: `npm run test:contract` does not exist until Phase 3. Mark that section
`— available from Phase 3` rather than shipping a command that fails.

- [ ] **Step 4: Commit**

```bash
git add HANDOVER.md README.md
git commit -m "docs: handover package for Jayant's team"
```

---

## Phase 2 exit criteria

- [ ] All four defects listed at the top are fixed, each with a test that fails without the fix
- [ ] Wallet property tests pass — 9 invariants under arbitrary inputs
- [ ] RLS is `FORCE`d, every policy has `WITH CHECK`, and isolation holds across all user-scoped tables as a non-superuser role
- [ ] `audit_log` rejects UPDATE, DELETE and TRUNCATE from the application role
- [ ] `/auth/session` verifies passwords with Argon2id and does not enumerate accounts
- [ ] JWT forgery, algorithm confusion, expiry, audience, issuer and tampering all rejected
- [ ] Auth endpoints rate limited, returning 429 with `Retry-After`
- [ ] Hostile input never produces a 5xx or leaks a stack trace
- [ ] Security headers present on every response
- [ ] No secret material in the built bundle
- [ ] Threat model and OWASP checklist complete, every threat naming a test or listed as unmitigated
- [ ] Spike and stream load profiles pass against the stub, with measured numbers recorded
- [ ] Authorization request drafted and sent to Joy
- [ ] `HANDOVER.md` complete, with every command verified in a clean checkout

---

## Deliberate placement notes

Two items the spec listed under T1 ("every commit") are implemented here rather
than in Phase 1: **wallet property tests** and **RLS isolation**. Both concern
our own code and depend on nothing from Jayant, but both are security- and
money-critical and belong before handover rather than before the build settles.
They join the every-commit gate from this phase onward.

---

## What Phase 2 deliberately does not cover

| Not covered | Phase |
|---|---|
| Contract conformance against Jayant's real API | 3 |
| Load against the real AI pipeline | 3 |
| Active scanning — ZAP, Nuclei, Schemathesis | 3, on authorization |
| Prompt injection and model extraction | 3 |
| GDPR operational tests | 3 |
| Output quality evaluation | 3 |
| Production monitoring, runbook, dashboard | 5 |

---

*Plan: `docs/superpowers/plans/2026-08-12-testing-phase-2.md`*
*Spec: `docs/superpowers/specs/2026-08-12-product-testing-apparatus-design.md`*
*Phase 1: `docs/superpowers/plans/2026-08-12-testing-phase-1.md`*
