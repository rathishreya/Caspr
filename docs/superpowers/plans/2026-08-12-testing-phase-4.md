# Testing Apparatus Phase 4 — Pre-Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehearse the cutover until it is boring, and produce a go/no-go decision backed by evidence rather than confidence.

**Architecture:** Four strands. (1) **The migration** — ~1,600–1,700 real accounts, their passwords, and their money, rehearsed end to end against a copy of production data until it runs twice with identical results. (2) **The cutover checklist** — the seven steps in `CONFIGURATION.md` §4 turned into executable assertions that fail loudly rather than being ticked by hand. (3) **Reversibility** — a backup restored, a frontend rolled back, and a migration undone, each proven rather than assumed. (4) **The decision** — a scored go/no-go instrument with named owners and explicit blockers.

**Tech Stack:** PostgreSQL · Vitest 4 · Playwright · k6 · the existing conformance suite

**Repos:** Plans and evidence live in `G:\My Drive\Caspr\caspr-claude-core`. Code and migration SQL live in the local `caspr-app` repo (`services/backend/migration/`).

**Prerequisite:** Phases 1–3 complete. Jayant's AI service deployed and the conformance suite green with zero skips.

---

## What changed since this plan was scoped

Work in a parallel session moved several things from open to decided. This plan is written against the current state, not the state at the time the spec was written.

| Was open | Now |
|---|---|
| **Item 19 — `caspr.ai/signup` routing** | Resolved. The website is being reworked to create login and signup paths. Task 14 asserts they resolve and that nothing else on the site regresses. |
| Auth bypass on `POST /auth/session` | Closed (BUILD-STATUS §43): scrypt hashing, real password verification, emailed verification links, password reset. **Verify at execution — do not assume.** |
| Existing-user migration | Fully specified in `MIGRATION-README.md` with four re-runnable SQL scripts. This is now the centre of Phase 4. |
| Cutover procedure | Exists as `CONFIGURATION.md` §4, seven ordered steps. |
| Conformance against Jayant | Suite exists: `CONFORMANCE_TOKEN=<jwt> npm run conformance -- --origin <AI_ORIGIN>`. The stated gate is **all green and zero skips**. |
| SES | Domain verified, account out of the sandbox (`JAYANT-ENV-NOTES.md`). |
| Stripe | Test keys and a webhook exist, subscribed to `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.deleted`. **Live keys still outstanding.** |
| Legacy reports | Location known: `s3://caspr-dev-s3/caspr_reports_dev/2026/`. Decision: **archive, not convert.** |

---

## Assumptions stated explicitly

Three things this plan assumes. If any is wrong, the tasks it touches need revising.

1. **The website rework creates `/login` and `/signup` paths that route to the product app**, with all other marketing routes continuing to serve from Vercel. Task 14 tests this shape.
2. **The old database can be dumped and restored into a disposable environment.** Every migration rehearsal below depends on it. Without a copy of real data the migration cannot be rehearsed, only hoped for.
3. **`004-deliverables.sql` runs at cutover, not before** — per `MIGRATION-README.md`, because archive rows without S3 read credentials show a library full of files that will not open.

---

## Working agreements

- **Rehearse on a copy. Never on production.** Every migration step runs against a restored dump in a disposable database.
- **Twice, identically.** The migration claims re-runnability by construction. Prove it: run, snapshot, run again, diff. A difference is a defect.
- **Money gets eyeballed.** The balance credit has no cap by design. A human reads the twenty largest before any real run.
- **Evidence, not ticks.** Every go/no-go line item cites a test run, a log, or a named person. "Looks fine" is not evidence.

---

## File structure

| Path | Responsibility |
|---|---|
| `services/backend/migration/rehearse.mjs` | Restores a dump, runs the scripts, captures a fingerprint |
| `services/backend/migration/fingerprint.sql` | The deterministic post-migration state summary |
| `services/backend/src/migration/legacyPassword.test.ts` | Legacy hash verification and silent re-hash |
| `services/backend/src/migration/balances.test.ts` | The 3.2× rule and ledger placement |
| `scripts/cutover-check.mjs` | The seven checklist steps as executable assertions |
| `e2e/cutover/smoke.spec.ts` | The first-thirty-minutes production smoke |
| `e2e/cutover/website.spec.ts` | Marketing-site non-regression |
| `docs/cutover/go-no-go.md` | The decision record |
| `docs/cutover/rehearsal-log.md` | What each rehearsal produced |
| `docs/cutover/rollback.md` | The rollback procedure, per failure mode |

---

## Task 1: The rehearsal harness

Everything downstream needs a repeatable way to restore real data into a disposable database and run the migration against it.

**Files:**
- Create: `services/backend/migration/rehearse.mjs`
- Create: `services/backend/migration/fingerprint.sql`

- [ ] **Step 1: Confirm the migration files exist and read them**

```bash
ls services/backend/migration/
```

Expected: `legacy-schema.sql`, `001-users.sql`, `002-balances.sql`, `003-conversations.sql`, `004-deliverables.sql`, `README.md`.

Read all four migration scripts before writing anything. This plan describes them from `MIGRATION-README.md`; the SQL is the authority.

- [ ] **Step 2: Write the fingerprint query**

Create `services/backend/migration/fingerprint.sql`. This is the deterministic summary used to prove the migration produces identical results on a re-run.

```sql
-- Deterministic post-migration state. Ordered and aggregated so two runs of the
-- same input produce byte-identical output. Any difference between runs is a
-- re-runnability defect.
SELECT 'users'                AS entity, count(*)::text AS value FROM users
UNION ALL SELECT 'credentials_with_password', count(*)::text FROM user_credentials WHERE password_hash IS NOT NULL
UNION ALL SELECT 'credentials_verified',      count(*)::text FROM user_credentials WHERE email_verified_at IS NOT NULL
UNION ALL SELECT 'wallets',                   count(*)::text FROM wallet
UNION ALL SELECT 'free_trial_cents_total',    coalesce(sum(free_trial_cents),0)::text FROM wallet
UNION ALL SELECT 'promo_cents_total',         coalesce(sum(promo_cents),0)::text      FROM wallet
UNION ALL SELECT 'paid_cents_total',          coalesce(sum(paid_cents),0)::text       FROM wallet
UNION ALL SELECT 'analyses',                  count(*)::text FROM analyses
UNION ALL SELECT 'analyses_draft',            count(*)::text FROM analyses WHERE status = 'draft'
UNION ALL SELECT 'wallet_transactions',       count(*)::text FROM wallet_transactions
-- A checksum over the money, so a single changed cent is visible.
UNION ALL SELECT 'wallet_checksum',
  md5(string_agg(user_id || ':' || free_trial_cents || ':' || promo_cents || ':' || paid_cents, '|' ORDER BY user_id))
  FROM wallet
ORDER BY entity;
```

- [ ] **Step 3: Write the harness**

Create `services/backend/migration/rehearse.mjs`:

```js
/**
 * Migration rehearsal.
 *
 * Restores a legacy dump into a disposable database, applies this app's schema,
 * runs the migration scripts in order, and captures a deterministic fingerprint.
 *
 * Run it twice against the same input: the two fingerprints must be identical.
 * The scripts claim re-runnability by construction — this is what proves it.
 *
 * NEVER point this at production. It creates and drops databases.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

const DUMP = process.env.LEGACY_DUMP;
const ADMIN_URL = process.env.REHEARSAL_ADMIN_URL;
const DB = process.env.REHEARSAL_DB ?? 'caspr_rehearsal';
const LABEL = process.env.REHEARSAL_LABEL ?? 'run';

if (!DUMP || !ADMIN_URL) {
  console.error('LEGACY_DUMP (path to the dump) and REHEARSAL_ADMIN_URL are required.');
  process.exit(1);
}

if (/prod|production/i.test(ADMIN_URL)) {
  console.error('REHEARSAL_ADMIN_URL looks like production. Refusing.');
  process.exit(1);
}

const psql = (url, args) =>
  execFileSync('psql', ['--no-psqlrc', '-v', 'ON_ERROR_STOP=1', url, ...args], {
    encoding: 'utf8',
  });

const targetUrl = ADMIN_URL.replace(/\/[^/]*$/, `/${DB}`);

console.warn(`Dropping and recreating ${DB}...`);
psql(ADMIN_URL, ['-c', `DROP DATABASE IF EXISTS ${DB}`]);
psql(ADMIN_URL, ['-c', `CREATE DATABASE ${DB}`]);

console.warn('Restoring the legacy dump into schema "legacy"...');
execFileSync('pg_restore', ['--no-owner', '--dbname', targetUrl, DUMP], { stdio: 'inherit' });
psql(targetUrl, ['-c', 'ALTER SCHEMA public RENAME TO legacy']);
psql(targetUrl, ['-c', 'CREATE SCHEMA public']);

console.warn("Applying the app's own schema...");
psql(targetUrl, ['-f', 'services/backend/src/db/schema.sql']);

// 004 is deliberately excluded: MIGRATION-README says it runs at cutover, once
// the legacy S3 read credentials exist. Task 7 covers it separately.
const SCRIPTS = ['001-users.sql', '002-balances.sql', '003-conversations.sql'];
for (const script of SCRIPTS) {
  console.warn(`Running ${script}...`);
  const out = psql(targetUrl, ['-f', `services/backend/migration/${script}`]);
  mkdirSync('rehearsal-output', { recursive: true });
  writeFileSync(`rehearsal-output/${LABEL}-${script}.log`, out);
}

console.warn('Capturing fingerprint...');
const fingerprint = psql(targetUrl, [
  '--tuples-only',
  '--no-align',
  '-f',
  'services/backend/migration/fingerprint.sql',
]);
writeFileSync(`rehearsal-output/${LABEL}-fingerprint.txt`, fingerprint);

console.warn(`\nFingerprint (${LABEL}):\n${fingerprint}`);
```

- [ ] **Step 4: Run it once**

```bash
LEGACY_DUMP=./legacy.dump REHEARSAL_ADMIN_URL=$REHEARSAL_ADMIN_URL REHEARSAL_LABEL=first \
  node services/backend/migration/rehearse.mjs
```

Expected: a fingerprint at `rehearsal-output/first-fingerprint.txt`. Append `rehearsal-output/` to `.gitignore` — it contains counts derived from real user data.

- [ ] **Step 5: Commit**

```bash
git add services/backend/migration/rehearse.mjs services/backend/migration/fingerprint.sql .gitignore
git commit -m "feat(migration): rehearsal harness with deterministic fingerprint"
```

---

## Task 2: Prove re-runnability

`MIGRATION-README.md` says re-running is "safe, by construction". Construction arguments are how re-runnability bugs survive to production.

**Files:**
- Create: `docs/cutover/rehearsal-log.md`

- [ ] **Step 1: Run the migration a second time against the same database**

Without dropping, run `001` → `002` → `003` again and capture a second fingerprint:

```bash
REHEARSAL_LABEL=second node services/backend/migration/rehearse-rerun.mjs
```

Write `rehearse-rerun.mjs` as a copy of `rehearse.mjs` with the drop/create/restore block removed — it runs the scripts against the already-migrated database.

- [ ] **Step 2: Diff the fingerprints**

```bash
diff rehearsal-output/first-fingerprint.txt rehearsal-output/second-fingerprint.txt
```

Expected: **no difference.** Specifically:
- `free_trial_cents_total` unchanged — the trial must never be re-gifted
- `promo_cents_total` unchanged — the balance credit must never be applied twice
- `wallet_checksum` identical — not one cent moved

A difference in any money row is a **blocking** defect. Fix the SQL, drop the database, and start the rehearsal again from a clean restore.

- [ ] **Step 3: Simulate the returning-user case**

The README makes a specific claim: a user who has signed in since the last run does not get their upgraded hash replaced by the old one. Test it directly.

```sql
-- After the first run, simulate a sign-in that upgraded the hash.
UPDATE user_credentials
   SET password_hash = '$scrypt$upgraded-by-app$...'
 WHERE user_id = (SELECT id FROM users ORDER BY id LIMIT 1);
```

Re-run `001-users.sql`, then confirm the upgraded hash survived:

```sql
SELECT password_hash FROM user_credentials
 WHERE user_id = (SELECT id FROM users ORDER BY id LIMIT 1);
```

Expected: still the upgraded value. If the migration overwrote it, every user who signed in between the rehearsal and the real run would be silently reverted to their old hash — which works, but discards a security upgrade without anyone knowing.

- [ ] **Step 4: Record the run**

Create `docs/cutover/rehearsal-log.md` and record: date, dump date, both fingerprints, the diff result, and the returning-user check. Every subsequent rehearsal appends here. This log is evidence for the go/no-go.

- [ ] **Step 5: Commit**

```bash
git add docs/cutover/rehearsal-log.md services/backend/migration/rehearse-rerun.mjs
git commit -m "test(migration): prove re-runnability produces identical state"
```

---

## Task 3: The password scheme

The one open question in `MIGRATION-README.md`. Until it is answered, a legacy sign-in returns 500 by design — the alternative, a 401, would tell every migrated user their working password is wrong.

**Files:**
- Create: `services/backend/src/migration/legacyPassword.test.ts`

- [ ] **Step 1: Determine the scheme**

Run the counting query from `MIGRATION-README.md` against the restored legacy schema:

```sql
SELECT
  CASE
    WHEN password_hash LIKE '$2%'       THEN 'bcrypt'
    WHEN password_hash LIKE '$argon2%'  THEN 'argon2'
    WHEN password_hash LIKE '$pbkdf2-%' THEN 'pbkdf2 (passlib)'
    WHEN password_hash LIKE 'pbkdf2:%'  THEN 'pbkdf2 (werkzeug)'
    ELSE 'something else'
  END AS scheme,
  count(*)
FROM legacy.users
GROUP BY 1;
```

Record the result in `docs/cutover/rehearsal-log.md`. A mixed table is fine — the app reads the prefix per row.

- [ ] **Step 2: Wire the verifier the counts require**

Per the README: PBKDF2 needs nothing; bcrypt needs `bcryptjs`; argon2 needs `@node-rs/argon2`. Wire whichever appears, into `createApp({ legacyPasswords: { … } })`.

If the query returns `something else`, stop and send the first twelve characters of a sample hash to whoever built the old app. Do not guess a scheme.

- [ ] **Step 3: Write the test**

Create `services/backend/src/migration/legacyPassword.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { testDeps } from '../app.test';

/**
 * Legacy sign-in and silent re-hash.
 *
 * The whole point of carrying hashes across is that ~1,650 people sign in with
 * the password they already have and never know a migration happened. These
 * tests are what make that claim true rather than intended.
 */
describe('legacy password sign-in', () => {
  it('accepts a correct legacy password', async () => {
    const app = createApp(await testDeps({ withLegacyUser: true }));
    const res = await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'legacy@example.invalid', password: 'their-real-password' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(res.status).toBe(200);
  });

  it('rejects a wrong password against a legacy hash', async () => {
    const app = createApp(await testDeps({ withLegacyUser: true }));
    const res = await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'legacy@example.invalid', password: 'wrong' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(res.status).toBe(401);
  });

  it('silently re-hashes to the app scheme on first successful sign-in', async () => {
    const deps = await testDeps({ withLegacyUser: true });
    const app = createApp(deps);

    const before = await deps.users.findByEmail('legacy@example.invalid');
    expect(before?.passwordHash).not.toMatch(/^\$scrypt\$/);

    await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'legacy@example.invalid', password: 'their-real-password' }),
      headers: { 'content-type': 'application/json' },
    });

    const after = await deps.users.findByEmail('legacy@example.invalid');
    expect(after?.passwordHash).toMatch(/^\$scrypt\$/);
  });

  it('the re-hashed password still works on the next sign-in', async () => {
    const deps = await testDeps({ withLegacyUser: true });
    const app = createApp(deps);
    const signIn = () =>
      app.request('/auth/session', {
        method: 'POST',
        body: JSON.stringify({ email: 'legacy@example.invalid', password: 'their-real-password' }),
        headers: { 'content-type': 'application/json' },
      });

    expect((await signIn()).status).toBe(200);
    expect((await signIn()).status).toBe(200);
  });

  it('answers 500, not 401, when no verifier is wired for the stored scheme', async () => {
    // A 401 here would tell a migrated user their working password is wrong,
    // and send ~1,650 people to the reset flow this migration exists to avoid.
    const deps = await testDeps({ withLegacyUser: true, legacyPasswords: {} });
    const app = createApp(deps);
    const res = await app.request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email: 'legacy@example.invalid', password: 'their-real-password' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 4: Run until green**

Run: `npm test --workspace @caspr/backend -- legacyPassword`
Expected: PASS, 5 tests. Extend `testDeps` with a `withLegacyUser` option seeding a user whose hash uses the scheme found in Step 1.

- [ ] **Step 5: Commit**

```bash
git add services/backend/src/migration package.json package-lock.json
git commit -m "feat(migration): legacy password verification and silent re-hash"
```

---

## Task 4: The money

The balance credit is 3.2× what these users actually paid, has no cap by design, and lands in the promo ledger so it is spendable but never refundable. Every one of those properties needs proving.

**Files:**
- Create: `services/backend/src/migration/balances.test.ts`

- [ ] **Step 1: Confirm the multiplier**

Run `002-balances.sql` §4(a) against the rehearsal database.

Expected: **exactly 3.20.** `MIGRATION-README.md` is explicit — anything else means the per-batch rates are not what we think and nothing should have been written. If it is not 3.20, stop, and do not proceed to any other task until it is understood.

Record the printed value in the rehearsal log.

- [ ] **Step 2: Read the twenty largest credits**

Run `002-balances.sql` §4(c). A human reads this list. There is no cap, so this is the only protection against a single anomalous legacy row producing an enormous credit.

Record the top twenty in the rehearsal log, and get Joy's explicit sign-off on the largest before any real run.

- [ ] **Step 3: Write the placement test**

Create `services/backend/src/migration/balances.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, type TestDb } from '../db/testDb';

/**
 * The migration credit is 3.2x what these users actually paid. That is only
 * safe because it lands in the promo ledger, which is spendable but never
 * refundable — otherwise someone who spent $25 could ask for $80 back in cash.
 */
let db: TestDb;
beforeEach(async () => { db = await createTestDb(); });
afterEach(async () => db.close());

describe('migration credit placement', () => {
  it('applies the 3.2x rule exactly', () => {
    const credit = (outstandingDollars: number) =>
      Math.round(outstandingDollars * 100 * 80 / 25);
    expect(credit(25)).toBe(8000);
    expect(credit(1)).toBe(320);
    expect(credit(0)).toBe(0);
    // Rounding is to the cent, never up to the dollar.
    expect(credit(0.01)).toBe(3);
  });

  it('lands the credit in promo, never paid', async () => {
    await db.asOwner(async (raw) => {
      await raw.exec(`
        INSERT INTO users (id, email) VALUES ('u1', 'legacy@example.invalid');
        INSERT INTO wallet (user_id, free_trial_cents, promo_cents, paid_cents)
          VALUES ('u1', 10000, 8000, 0);
      `);
    });

    const { rows } = await db.asOwner((raw) =>
      raw.query<{ promo_cents: number; paid_cents: number }>(
        'SELECT promo_cents, paid_cents FROM wallet WHERE user_id = $1',
        ['u1'],
      ),
    );
    expect(rows[0].promo_cents).toBe(8000);
    expect(rows[0].paid_cents, 'migration credit must never be refundable').toBe(0);
  });

  it('still gifts the standard $100 free trial alongside the credit', async () => {
    await db.asOwner(async (raw) => {
      await raw.exec(`
        INSERT INTO users (id, email) VALUES ('u2', 'bonus-only@example.invalid');
        INSERT INTO wallet (user_id, free_trial_cents, promo_cents, paid_cents)
          VALUES ('u2', 10000, 0, 0);
      `);
    });
    const { rows } = await db.asOwner((raw) =>
      raw.query<{ free_trial_cents: number }>(
        'SELECT free_trial_cents FROM wallet WHERE user_id = $1',
        ['u2'],
      ),
    );
    // Users whose only balance was SIGNUP_BONUS or BONUS get no credit — they
    // are covered by the trial, which is worth more than the old bonus was.
    expect(rows[0].free_trial_cents).toBe(10000);
  });
});
```

- [ ] **Step 4: Verify what counts as outstanding**

Against the rehearsal database, confirm the script's scope matches the documented rule — paid batches only (TOPUP and SUBSCRIPTION), expired batches excluded, bonus batches excluded:

```sql
SELECT batch_type, count(*), sum(amount)
FROM legacy.token_batches
GROUP BY 1 ORDER BY 1;
```

Cross-check against what `002-balances.sql` actually credited. A batch type appearing in the credit that should not be there is a money defect.

- [ ] **Step 5: Run §4(e) — the referral check**

The README says referrals have never been used. §4(e) counts unpaid holders, which is how we would find out if that stopped being true. Run it and record the count. Non-zero means a conversation with Joy before proceeding.

- [ ] **Step 6: Commit**

```bash
git add services/backend/src/migration/balances.test.ts docs/cutover/rehearsal-log.md
git commit -m "test(migration): balance credit rule and ledger placement"
```

---

## Task 5: Collisions and duplicates

Two documented edge cases that abort or silently alter the run.

- [ ] **Step 1: List the email collisions**

Against the rehearsal database:

```sql
SELECT lower(btrim(u.email)) AS email
FROM legacy.users u
JOIN users n ON n.email = lower(btrim(u.email)) AND n.id <> u.id;
```

These are people who already signed up in the new app under the same address. Their new account wins and the legacy row is skipped — which means **their old password will not work.**

Record the list. If it is more than a handful, that is an email Joy needs to send before cutover, not a support ticket afterwards.

- [ ] **Step 2: List the case duplicates**

```sql
SELECT lower(btrim(email)), count(*) FROM legacy.users
GROUP BY 1 HAVING count(*) > 1;
```

The new app treats these as one person, so `migrated` will be lower than `legacy_users`. Confirm the difference in the landing check equals the number of duplicates found here. If the numbers do not reconcile, users are being dropped for some other reason.

- [ ] **Step 3: Verify the guard actually holds**

Insert a deliberate collision into the rehearsal database, re-run `001-users.sql`, and confirm it completes rather than aborting on the unique constraint — and that the new-app account is the one left standing.

- [ ] **Step 4: Record both lists**

Append to `docs/cutover/rehearsal-log.md`. Both are pre-cutover communications tasks, not just test results.

- [ ] **Step 5: Commit**

```bash
git add docs/cutover/rehearsal-log.md
git commit -m "docs(cutover): record migration collisions and duplicates"
```

---

## Task 6: Conversations and drafts

- [ ] **Step 1: Run 003 and count**

After `003-conversations.sql`, confirm unfinished conversations landed as drafts:

```sql
SELECT status, count(*) FROM analyses GROUP BY 1;
```

Cross-check the draft count against the legacy source count.

- [ ] **Step 2: Open one in the app**

Point a local app instance at the rehearsal database, sign in as a migrated user with a draft, and open it. Confirm it renders as a draft the user can resume — not an error, and not an empty analysis.

- [ ] **Step 3: Confirm no analysis content crossed the boundary**

Re-run the Phase 3 boundary test against the rehearsal database:

```bash
npm test --workspace @caspr/backend -- boundary
```

Expected: PASS. The migration is the most likely moment for analysis content to end up in the product-side layer by accident. This is the check that catches it.

- [ ] **Step 4: Commit**

```bash
git add docs/cutover/rehearsal-log.md
git commit -m "test(migration): conversations land as resumable drafts"
```

---

## Task 7: The archive

`004-deliverables.sql` runs at cutover, once the legacy S3 read credentials exist. Rehearse it separately, with the credentials, before the real run.

- [ ] **Step 1: Confirm read-only credentials**

`LEGACY_S3_BUCKET`, `LEGACY_S3_REGION`, and credentials that can read and **not** write. Verify the restriction rather than trusting it:

```bash
aws s3 cp ./test.txt s3://caspr-dev-s3/caspr_reports_dev/test.txt --region $LEGACY_S3_REGION
```

Expected: **AccessDenied.** A migration credential that can write is a migration credential that can destroy the thing it is migrating.

- [ ] **Step 2: Run 004 against the rehearsal database**

Then confirm the row count matches the object count under the documented prefix:

```
s3://caspr-dev-s3/caspr_reports_dev/2026/MM/DD/{user_id}_{user_slug}/{chat_id}_{title_slug}/report_{report_id}/v{version}/report/{title}.{extension}
```

- [ ] **Step 3: Open an archived report end to end**

In the app pointed at the rehearsal database: sign in as a user with archived reports, open the library, and download one. Confirm the signed URL resolves and the PDF or PPTX opens.

Then confirm the negative case — a signed URL for another user's report must be refused.

- [ ] **Step 4: Confirm archives are labelled as archives**

The library must make clear these are original-format files, not native analyses. A user clicking an archived report expecting the new reader is a support ticket that could have been a label.

- [ ] **Step 5: Commit**

```bash
git add docs/cutover/rehearsal-log.md
git commit -m "test(migration): archived deliverables download end to end"
```

---

## Task 8: The cutover checklist, executable

`CONFIGURATION.md` §4 is seven ordered steps. A checklist ticked by hand at 2am is a checklist with a step missed.

**Files:**
- Create: `scripts/cutover-check.mjs`

- [ ] **Step 1: Write the checker**

Create `scripts/cutover-check.mjs`:

```js
/**
 * The cutover checklist from CONFIGURATION.md §4, as executable assertions.
 *
 * Run it against the target environment immediately before cutover. Every
 * failure names the step it came from. Ticking a box is not evidence; this is.
 */
const failures = [];
const notes = [];

function check(name, condition, detail) {
  if (condition) notes.push(`  ok    ${name}`);
  else failures.push(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
}

const env = process.env;

// 1 — JWT issuer and audience must match Jayant's service exactly.
check('AUTH_JWT_ISSUER set', !!env.AUTH_JWT_ISSUER);
check('AUTH_JWT_AUDIENCE set', !!env.AUTH_JWT_AUDIENCE);
check(
  'JWT values confirmed against Jayant',
  env.JWT_VALUES_CONFIRMED === 'true',
  'set JWT_VALUES_CONFIRMED=true only after reading them back to Jayant',
);

// 2 — SES.
check('SES_REGION set', !!env.SES_REGION);
check('SES_SENDER set', !!env.SES_SENDER);
check(
  'SES_CONFIGURATION_SET set',
  !!env.SES_CONFIGURATION_SET,
  'without it a bounce is a user who never got their link and cannot tell us',
);

// 3 — Stripe live, sandbox off.
check(
  'Stripe key is live',
  (env.STRIPE_SECRET_KEY ?? '').startsWith('sk_live_'),
  'the key is the only thing that decides test or live',
);
check('STRIPE_WEBHOOK_SECRET set', !!env.STRIPE_WEBHOOK_SECRET);
check(
  'ALLOW_SANDBOX_PAYMENTS unset',
  !env.ALLOW_SANDBOX_PAYMENTS,
  'a fake gateway in production takes fake money',
);

// 4 — VITE_ values are baked at build time.
check('VITE_MCP_ENDPOINT set', !!env.VITE_MCP_ENDPOINT);
check('VITE_REALTIME_ORIGIN set', !!env.VITE_REALTIME_ORIGIN);
check(
  'VITE_REALTIME_ORIGIN is a websocket origin',
  (env.VITE_REALTIME_ORIGIN ?? '').startsWith('wss://'),
  'wss:// not https:// — an http origin produces a link no browser opens',
);
check(
  'web app rebuilt after the VITE_ values were set',
  env.WEB_REBUILT_AFTER_CONFIG === 'true',
  'these are compiled in; changing one needs a rebuild, not a restart',
);
check('VITE_USE_MOCKS not enabled', env.VITE_USE_MOCKS !== 'true', 'never a deployment');

// 5 — Legacy S3 read access.
check('LEGACY_S3_BUCKET set', !!env.LEGACY_S3_BUCKET);
check('LEGACY_S3_REGION set', !!env.LEGACY_S3_REGION);

// 6/7 — migration and conformance are run steps, recorded not inferred.
check(
  'migration rehearsed twice with identical fingerprints',
  env.MIGRATION_REHEARSED === 'true',
  'see docs/cutover/rehearsal-log.md',
);
check(
  'conformance suite green with zero skips',
  env.CONFORMANCE_ZERO_SKIPS === 'true',
  'all green AND zero skips is the integration gate',
);

// Origins.
check('APP_ORIGIN set', !!env.APP_ORIGIN);
check('CORS_ORIGIN set', !!env.CORS_ORIGIN);
check(
  'APP_ORIGIN is a single origin',
  !(env.APP_ORIGIN ?? '').includes(','),
  'CORS_ORIGIN is a list; APP_ORIGIN is one address a browser is sent to',
);

console.warn('\nCutover checklist\n');
for (const n of notes) console.warn(n);
for (const f of failures) console.error(f);

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed. Cutover is not ready.\n`);
  process.exit(1);
}
console.warn('\nAll checks passed.\n');
```

- [ ] **Step 2: Run it against staging**

Expected: failures for anything genuinely outstanding — Stripe live keys most likely. That is the point; it makes the outstanding list explicit rather than remembered.

- [ ] **Step 3: Add the script**

In root `package.json`: `"cutover:check": "node scripts/cutover-check.mjs"`

- [ ] **Step 4: Commit**

```bash
git add scripts/cutover-check.mjs package.json
git commit -m "feat(cutover): the CONFIGURATION.md checklist as executable assertions"
```

---

## Task 9: Stripe live mode

- [ ] **Step 1: Verify the mode boundary**

With live keys in a staging deployment, confirm:

- `ALLOW_SANDBOX_PAYMENTS` unset — the sandbox gateway must not be reachable
- The webhook at `{BACKEND_ORIGIN}/webhooks/stripe` is registered against the **live** dashboard, not test
- It is subscribed to `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.deleted`
- An unsigned request to the webhook is refused, not trusted

- [ ] **Step 2: One real low-value transaction**

Run a genuine minimum top-up on a real card. Confirm end to end: Checkout completes, the webhook fires, the wallet credits by the right amount, the ledger records it as paid, and the user is returned to `APP_ORIGIN`.

Then refund it in the dashboard and confirm the product handles the reversal correctly.

This is the only way to know the live path works. A test-mode pass proves the code, not the account.

- [ ] **Step 3: Confirm the payout destination**

Per the treasury decision: a Singapore Stripe account cannot pay out to a US bank. Confirm a Singapore-domiciled USD account is configured as the payout destination **before** taking real money, not after.

- [ ] **Step 4: Old subscriptions**

`MIGRATION-README.md` flags this as commercial, not SQL: active card-on-file subscriptions with the old provider must be cancelled there, not re-pointed at Stripe.

Confirm with Joy that every legacy subscription is cancelled, and record the count. A migrated user still being charged by the old provider is the worst possible cutover outcome.

- [ ] **Step 5: Record**

Append results to `docs/cutover/rehearsal-log.md`.

---

## Task 10: SES in production

- [ ] **Step 1: Confirm out of sandbox**

`JAYANT-ENV-NOTES.md` states the account is out of the sandbox and `caspr.ai` is verified. Confirm independently rather than relying on the note:

```bash
aws ses get-account-sending-enabled --region $SES_REGION
aws sesv2 get-account --region $SES_REGION
```

- [ ] **Step 2: Send to a real, unverified inbox**

Sign up with an address on a domain nobody has verified — a personal Gmail works. Confirm the verification email arrives, lands in the inbox rather than spam, the link works once, and it expires after a day.

This is the single most likely silent failure at cutover: SES appears configured, signup appears to work, and nobody receives anything.

- [ ] **Step 3: Confirm bounce routing**

Send to a deliberately invalid address and confirm the bounce reaches wherever `SES_CONFIGURATION_SET` points. A bounce nobody sees is a user who never got their link and has no way to tell us.

- [ ] **Step 4: Check the four copy strings**

`QUESTIONS-FOR-JOY.md` §F lists the verify, reset, changed and welcome emails plus the `/verify` failure-state copy as Joy's. Confirm all five are final and in the build.

- [ ] **Step 5: Record**

---

## Task 11: The conformance gate

- [ ] **Step 1: Run it against the live AI service**

```bash
CONFORMANCE_TOKEN=<a real JWT> npm run conformance -- --origin <AI_ORIGIN>
```

The stated gate is **all green and zero skips.** A skip is not a pass — it is a test that did not run, and at cutover the difference matters.

- [ ] **Step 2: Enumerate any skips**

If anything skips, list what and why. Each is either a feature not yet implemented on Jayant's side or a test that cannot run in this environment. Both need a decision, not a shrug.

- [ ] **Step 3: Run the Phase 3 suites too**

```bash
TEST_TARGET=production npm run test:contract
npm test --workspace @caspr/eval -- injection documentInjection
```

Contract conformance and the injection corpus against the live service. The injection run needs authorization to cover production — check `security/authorization.json` scope first.

- [ ] **Step 4: Record**

---

## Task 12: Disaster recovery drill

Backups nobody has restored are not backups.

- [ ] **Step 1: Restore an RDS snapshot to a new instance**

Take the most recent automated snapshot and restore it to a fresh instance. Time it — the restore duration is your actual RTO, and it is usually longer than people assume.

- [ ] **Step 2: Verify the restored data**

Run `fingerprint.sql` against the restored instance and compare against the same query on the live database at snapshot time. Wallet checksums must match.

- [ ] **Step 3: Confirm the app runs against the restore**

Point a backend instance at the restored database and confirm sign-in and wallet read work. A restore that produces a database the app cannot use is not a recovery.

- [ ] **Step 4: Record RTO and RPO**

Restore duration is RTO. Snapshot frequency is RPO. Write both in `docs/cutover/go-no-go.md` — if the real numbers are worse than assumed, that is a finding worth having before an incident rather than during one.

- [ ] **Step 5: Tear down the restored instance**

---

## Task 13: Rollback rehearsal

**Files:**
- Create: `docs/cutover/rollback.md`

- [ ] **Step 1: Rehearse the frontend rollback**

Deploy a deliberately broken build to staging, then roll back to the previous S3 version and invalidate CloudFront. Time it. Confirm the previous version is fully restored, including that `index.html` is `no-cache` so the rollback takes effect immediately rather than when caches expire.

- [ ] **Step 2: Decide the migration rollback**

The migration writes into live tables. There is no undo script. Write down the honest answer to "what if `002-balances` credits wrong?" — most likely a restore from the pre-migration snapshot, which means **taking a snapshot immediately before the migration runs is mandatory**, not optional.

- [ ] **Step 3: Write the rollback document**

Create `docs/cutover/rollback.md` covering each failure mode: bad frontend build, bad backend deploy, bad migration, Jayant's service unavailable, Stripe misconfigured. Each with the trigger, the action, who executes it, and the expected time to recover.

- [ ] **Step 4: Confirm the pre-migration snapshot step is in the runbook**

If it is not in `CONFIGURATION.md` §4, add it — before step 6.

- [ ] **Step 5: Commit**

```bash
git add docs/cutover/rollback.md
git commit -m "docs(cutover): rollback procedures, rehearsed"
```

---

## Task 14: Website non-regression

The marketing site is being reworked to create the login and signup paths. It also carries the SEO and CRO that everything upstream depends on.

**Files:**
- Create: `e2e/cutover/website.spec.ts`

- [ ] **Step 1: Capture the current state before the rework lands**

Record, for every one of the 39 marketing routes: HTTP status, canonical URL, title, meta description, and H1. This is the baseline the rework is measured against.

- [ ] **Step 2: Write the non-regression test**

Create `e2e/cutover/website.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

/**
 * The marketing site carries the SEO and CRO everything upstream depends on.
 * The rework adds login and signup paths; it must change nothing else.
 */
const BASE = process.env.WEBSITE_BASE_URL;
test.skip(!BASE, 'WEBSITE_BASE_URL is required');

const ROUTES = [
  '/', '/pricing', '/enterprise', '/security', '/privacy', '/terms', '/refund',
  '/about', '/customers', '/samples', '/blog',
  '/consulting', '/strategy', '/investors', '/agencies', '/startups',
  '/academic', '/market-research', '/category-managers', '/corporate-dev',
  '/analyses/brief', '/analyses/study', '/analyses/intelligence',
  '/use-cases/business-case', '/use-cases/competitive-analysis',
  '/use-cases/due-diligence', '/use-cases/investment-thesis',
  '/use-cases/market-research', '/use-cases/rfp-response',
  '/vs/chatgpt', '/vs/perplexity', '/vs/consulting-firms', '/vs/gartner',
  '/vs/statista', '/vs/mintel', '/vs/euromonitor', '/vs/ibisworld', '/vs/pitchbook',
];

for (const route of ROUTES) {
  test(`${route} still serves with its SEO intact`, async ({ page }) => {
    const response = await page.goto(`${BASE}${route}`);
    expect(response?.status(), `${route} status`).toBe(200);

    await expect(page.locator('title')).not.toBeEmpty();
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
    await expect(page.locator('h1').first()).toBeVisible();
  });
}

test('sitemap and robots still serve', async ({ page }) => {
  expect((await page.goto(`${BASE}/sitemap.xml`))?.status()).toBe(200);
  expect((await page.goto(`${BASE}/robots.txt`))?.status()).toBe(200);
});

test('login and signup paths resolve to the product app', async ({ page }) => {
  for (const path of ['/login', '/signup']) {
    const response = await page.goto(`${BASE}${path}`);
    expect(response?.status(), `${path} status`).toBeLessThan(400);
    // The product app renders its own auth surface, not a marketing 404.
    await expect(page.locator('[data-testid="not-found"]')).toHaveCount(0);
    await expect(page.getByLabel(/email/i)).toBeVisible();
  }
});

test('every CTA on the homepage resolves', async ({ page }) => {
  await page.goto(BASE!);
  const links = await page.getByRole('link').all();
  const hrefs = (await Promise.all(links.map((l) => l.getAttribute('href'))))
    .filter((h): h is string => !!h && (h.startsWith('/') || h.startsWith(BASE!)));

  for (const href of [...new Set(hrefs)]) {
    const url = href.startsWith('/') ? `${BASE}${href}` : href;
    const response = await page.goto(url);
    expect(response?.status(), `${href} returned ${response?.status()}`).toBeLessThan(400);
  }
});
```

- [ ] **Step 3: Run against the reworked site on staging**

Expected: PASS on all 39 routes plus the auth paths. Any route that regressed is a ranking loss, and rankings are slow to come back.

- [ ] **Step 4: Verify the full marketing-to-product journey**

With the login and signup paths live, walk it end to end on staging: homepage → CTA → signup → verification email → first analysis. This is the journey the re-engagement campaign depends on, and it has never been testable before now.

- [ ] **Step 5: Commit**

```bash
git add e2e/cutover/website.spec.ts
git commit -m "test(cutover): marketing site non-regression and auth path routing"
```

---

## Task 15: Production smoke

**Files:**
- Create: `e2e/cutover/smoke.spec.ts`

- [ ] **Step 1: Write the smoke test**

Create `e2e/cutover/smoke.spec.ts` — a fast, read-mostly pass over the critical paths, safe to run against production immediately after cutover:

```ts
import { expect, test } from '@playwright/test';

/**
 * The first thirty minutes. Fast, read-mostly, safe against production.
 * Runs immediately after cutover and every 15 minutes for the first two hours.
 */
const BASE = process.env.PROD_BASE_URL;
const API = process.env.PROD_API_BASE;
test.skip(!BASE || !API, 'PROD_BASE_URL and PROD_API_BASE are required');

test('the app loads with no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE!);
  await expect(page.locator('body')).toBeVisible();
  expect(errors, errors.join(' | ')).toHaveLength(0);
});

test('JWKS is published and contains no private key material', async ({ request }) => {
  const res = await request.get(`${API}/.well-known/jwks.json`);
  expect(res.status()).toBe(200);
  const body = await res.text();
  for (const field of ['"d"', '"p"', '"q"', '"dp"', '"dq"', '"qi"']) {
    expect(body, `JWKS leaked ${field}`).not.toContain(field);
  }
});

test('protected routes reject unauthenticated requests', async ({ request }) => {
  for (const path of ['/me', '/wallet']) {
    expect((await request.get(`${API}${path}`)).status(), path).toBe(401);
  }
});

test('a migrated user can sign in and see their wallet', async ({ page }) => {
  // Credentials for a designated migration canary account, set at cutover.
  await page.goto(`${BASE}/login`);
  await page.getByLabel(/email/i).fill(process.env.CANARY_EMAIL!);
  await page.getByLabel(/password/i).fill(process.env.CANARY_PASSWORD!);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByTestId('wallet-balance')).toBeVisible({ timeout: 15_000 });
});

test('the security headers are present', async ({ request }) => {
  const res = await request.get(`${API}/.well-known/jwks.json`);
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
  expect(res.headers()['strict-transport-security']).toMatch(/max-age=\d+/);
});
```

- [ ] **Step 2: Nominate a migration canary**

Pick one migrated account — ideally a real one with a known password, with the holder's agreement — as the canary. It is the fastest possible signal that the migration worked for real people rather than for the fingerprint.

- [ ] **Step 3: Run against staging first**

Never let the first execution of a smoke test be during a cutover.

- [ ] **Step 4: Commit**

```bash
git add e2e/cutover/smoke.spec.ts
git commit -m "test(cutover): production smoke for the first thirty minutes"
```

---

## Task 16: The go/no-go record

**Files:**
- Create: `docs/cutover/go-no-go.md`

- [ ] **Step 1: Write the decision record**

Create `docs/cutover/go-no-go.md`:

```markdown
# Cutover — Go / No-Go

**Decision date:** ______   **Decision:** ☐ GO  ☐ NO-GO  ☐ GO WITH CONDITIONS
**Present:** ______

Every line needs evidence — a test run, a log, or a named person. "Looks fine"
is not evidence. Any BLOCKING line unmet means no-go, regardless of the rest.

## Blocking

| # | Criterion | Evidence | Owner | Met |
|---|---|---|---|---|
| B1 | Conformance suite green, **zero skips**, against the live AI service | run output | | ☐ |
| B2 | Migration rehearsed twice, fingerprints identical, wallet checksum unchanged | rehearsal-log.md | | ☐ |
| B3 | Balance multiplier reads exactly **3.20** | 002 §4(a) output | | ☐ |
| B4 | Twenty largest credits reviewed and signed off | rehearsal-log.md + Joy | Joy | ☐ |
| B5 | Legacy password scheme identified and verifier wired; legacy sign-in works | legacyPassword tests | | ☐ |
| B6 | Pre-migration RDS snapshot taken | snapshot id | | ☐ |
| B7 | `npm run cutover:check` passes | run output | | ☐ |
| B8 | Stripe **live** keys in, sandbox off, one real charge and refund verified | dashboard + log | | ☐ |
| B9 | Payout destination is a Singapore-domiciled USD account | treasury | Joy | ☐ |
| B10 | Old-provider subscriptions cancelled; count recorded | Joy | Joy | ☐ |
| B11 | SES verified, out of sandbox, real inbox delivery confirmed, bounces routed | send log | | ☐ |
| B12 | Full Phase 1–3 suite green | CI run | | ☐ |
| B13 | Marketing site non-regression passes on all 39 routes | website.spec run | | ☐ |
| B14 | `/login` and `/signup` resolve to the product app | website.spec run | | ☐ |
| B15 | Rollback rehearsed: frontend rolled back and restored on staging | rollback.md | | ☐ |
| B16 | Backup restored and verified; RTO and RPO recorded | DR drill | | ☐ |
| B17 | Zero critical findings open in `docs/security/findings.md` | findings.md | | ☐ |
| B18 | Sensitive-data boundary test passes against the migrated database | boundary test | | ☐ |

## Non-blocking, decided in the room

| # | Criterion | Status | Accepted by |
|---|---|---|---|
| N1 | External penetration test | Deferred — automated scanning + threat model in place | Joy |
| N2 | SOC 2 Type I | In progress; `/security` dates need revising either way | Joy |
| N3 | EU residency for analysis content | Deferred — Enterprise is a separate deployment | Joy |
| N4 | Archived reports not converted to native analyses | Accepted — archive, not convert | Joy |
| N5 | Load to 500 concurrent against the real AI pipeline | Jayant's own testing | Jayant |

## Known open at cutover

Anything conceded rather than closed. Each with an owner and a date.

| Item | Why accepted | Owner | Revisit |
|---|---|---|---|
| | | | |

## Conditions (if GO WITH CONDITIONS)

| Condition | Owner | By when |
|---|---|---|

## Post-cutover watch

- Smoke test at T+0, then every 15 minutes for two hours
- Canary sign-in confirmed at T+0
- First real migrated user sign-in observed and confirmed
- Wallet balances spot-checked against pre-migration values for five accounts
- Error rate watched against the pre-cutover baseline
- Rollback decision point at **T+2 hours**: if the error rate has not returned
  to baseline, roll back rather than continue debugging in production

**Signed:** ______
```

- [ ] **Step 2: Walk it with Joy before cutover day**

Every blocking line either has evidence or does not. The purpose of writing it down beforehand is that nobody discovers a missing item at the moment of decision.

- [ ] **Step 3: Commit**

```bash
git add docs/cutover/go-no-go.md
git commit -m "docs(cutover): go/no-go decision record"
```

---

## Phase 4 exit criteria

- [ ] Migration rehearsed at least twice against real data with identical fingerprints
- [ ] The 3.2× multiplier confirmed at exactly 3.20 and the top twenty credits signed off
- [ ] Legacy password scheme identified, verifier wired, silent re-hash proven
- [ ] Email collisions and case duplicates listed and communicated
- [ ] Archived reports download end to end with read-only credentials
- [ ] `npm run cutover:check` passes against the target environment
- [ ] Stripe live path verified with a real charge and refund
- [ ] SES delivers to a real unverified inbox and routes bounces
- [ ] Conformance suite green with zero skips
- [ ] Backup restored and verified; RTO and RPO recorded
- [ ] Frontend rollback rehearsed; migration rollback documented; pre-migration snapshot in the runbook
- [ ] Marketing site non-regression green on all 39 routes; auth paths resolve
- [ ] Smoke test run against staging and ready for production
- [ ] Go/no-go record complete, every blocking line with evidence, signed

---

*Plan: `docs/superpowers/plans/2026-08-12-testing-phase-4.md`*
*Spec: `docs/superpowers/specs/2026-08-12-product-testing-apparatus-design.md`*
*Depends on: `docs/app-handoff/MIGRATION-README.md` · `docs/app-handoff/CONFIGURATION.md` §4 · `docs/app-handoff/JAYANT-ENV-NOTES.md` · `docs/app-handoff/JAYANT-ASKS.md`*
