# Dev response — static testing round 1

**Commits `ee3cae4` → `b9c8ef3` on `caspr-ai/caspr-product`.** Every finding
actioned. Two are corrected rather than fixed, and one thing the report did not
find turned out to be the reason F1's recommendation could not have worked.

Numbers below are measured, not estimated.

---

## What changed

| # | Finding | Outcome |
|---|---|---|
| F1 | No database wired | **Schema now executes and is tested.** 26 tests against real Postgres via PGlite |
| F2 | RLS enabled, not forced | **Confirmed and fixed.** Reproduced the bypass before changing anything |
| F3 | No `WITH CHECK` | **Incorrect as stated** — the writes were already blocked. Clauses added anyway, for a different reason |
| F4 | Role model only in comments | **Confirmed and fixed.** Two roles, grants, revokes |
| F5 | Nothing sets `app.current_user_id` | **Confirmed and fixed.** `db/session.ts` |
| F6 | hono CORS ReDoS | Adopted, and the declared range raised to `^4.13.3` |
| F7 | 560 kB initial bundle | **579 kB → 203.55 kB gzipped** |
| F8 | nanoid | Adopted |
| §10 | 13 lint errors | Cleared |
| §12 | Coordination artefacts | Both fixed |

---

## F2 and F5 are one bug, and it was the serious one

Reproduced before touching anything: connected **as owner** with
`app.current_user_id` set to Alice, `SELECT count(*) FROM users` returned **2**.
Every policy bypassed, no error, no log line.

F5 is the other half. Nothing set the setting, so `app_current_user_id()` was
always NULL and every policy matched zero rows — which means the application
could only ever have worked by connecting as owner. **The configuration required
to make the app function was exactly the configuration in which isolation did
not exist.** Your F5 write-up reasons its way to this and is right.

All 18 tables now `FORCE`, with a test asserting no table in `public` has RLS
enabled but unforced. `db/session.ts` adds `withUser` / `withAuth`:
`SET LOCAL ROLE` plus `set_config(…, true)`, both transaction-local so a pooled
connection cannot hand the next request the previous user's identity. Four tests
exist only to prove that reversion, including after a thrown callback.

## F3 is wrong, and I would rather say so than quietly "fix" it

The report says that without `WITH CHECK`, "a user can INSERT or UPDATE a row
carrying another user's `user_id` — including into `wallet` and
`wallet_transactions`."

They cannot. **Postgres derives the write check from `USING` when `WITH CHECK`
is omitted on a `FOR ALL` policy.** All three attacks, run as `caspr_request`
before any change:

```
INSERT wallet_transactions user_id=u_b     BLOCKED  new row violates row-level security policy
UPDATE wallet SET user_id=u_b              BLOCKED  new row violates row-level security policy
INSERT folders user_id=u_b                 BLOCKED  new row violates row-level security policy
```

`pg_policy` confirms the shape: 11 of 11 policies, all `polcmd = '*'`, all with
`polwithcheck` null.

Explicit `WITH CHECK` added anyway — but for a different reason than the one
given, and the reason matters because it changes what the clause is *for*. The
fallback is a property of how a policy happens to be phrased, not a decision
anyone made. Widen a read rule later for sharing, or support access, or an admin
view, and the write rule widens silently with it. The three attacks above are
kept as tests so the guarantee is checkable rather than asserted.

## F4 confirmed exactly as written

`CREATE ROLE`, `GRANT`, `REVOKE`, `BYPASSRLS` — nothing in the repository but
that one comment. So `credentials_none` depended on a request role that did not
exist, and `audit_log`'s append-only property was enforced by nothing at all.

Both roles now exist. `caspr_request` is **revoked** from credentials,
verifications and refresh tokens — revoked as well as ungranted, since PUBLIC can
acquire privileges by default and "we never granted it" is weaker than "it is
revoked". `UPDATE`, `DELETE` and `TRUNCATE` on `audit_log` are revoked from
everyone, the auth role included.

---

## Three things you did not find, and the first one blocked F1

### The schema would not have executed

Its first statement was `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`, wanted only
for `gen_random_uuid()` — **core since PG13**, and we target 15+. Nothing calls
`crypt()` or `digest()`; hashing is scrypt in the app, deliberately, so the hash
is never computed by the database that stores it.

An unused line, and it cost two things: `CREATE EXTENSION` needs superuser or
`rds_superuser`, so the file could only ever be applied by a privileged role —
and it is what stopped the schema running under PGlite at all.

### Three repositories had no table

This is why F1's recommendation — "wire a Postgres repository against
`ports.ts`" — could not have been carried out as written:

| Repository | Table | Would have failed at |
|---|---|---|
| `RefreshTokenRepository` | **missing** | the first token refresh |
| `ReservationRepository` | **missing** | the first budget hold |
| `FileRepository` | **missing** | the first Data Room listing |

Added `refresh_tokens`, `reservations` and `library_files` with policies and
grants. Reservations take a partial unique index on
`(user_id, analysis_id) WHERE status = 'held'` — that is what makes reserving
idempotent, without a settled hold blocking the next run of the same analysis. A
plain unique constraint would do the first and break the second.

### `email_verifications` had no `purpose` column

`VerificationRecord` has always carried one. Without it a reset link and a
verification link are the same row, and `revokeForUser(userId, purpose)` could
not have been expressed in SQL at all.

---

## F7 — measured

```
initial JS   1,876.69 kB → 755.64 kB     gzip  579.00 → 203.55 kB
echarts      new chunk, 1,117.91 kB      gzip  366.96 kB, on demand
```

One line: `import('echarts')` inside the effect. You are right that it is a
product issue rather than a technical one — every first-time visitor was
downloading a charting engine before the landing screen could paint, to draw
something they will not see until they have signed up, passed the gate and
waited fifteen minutes.

Two things it actually needed, both silent failures: `ready` in the option
effect's dependencies (the first `setOption` now runs before the engine exists,
so without a re-run the first chart renders empty), and a disposal flag rather
than a ref check (the component can unmount while the chunk is in flight).
`ChartView` had **no tests at all** and cannot get browser coverage — it renders
only from live `chart_data`, so no static route reaches it. It has some now.

**Your budget needed a fix too.** `apps/web/dist/assets/*.js` now matches both
chunks, so it would have measured initial + lazy as one number and passed or
failed for the wrong reason. Split: initial 215 kB, lazy engine 390 kB.

---

## §12 — both artefacts, and one correction to what landed

You were right that `7421401` caught the origin rule mid-draft. The corrected
version is now committed over it, along with the whole gate.

**One addition: `npm run gate` now runs the rule's own tests.** They live in
`tools/`, which no workspace covers, so all 27 RuleTester cases never executed
under `npm test`. A rule that guards rule 8 while being itself unguarded is the
same shape as the dead helper deleted this morning — tests that exist and do not
run read as coverage.

hono: the lock did pin 4.13.3 so the fix was genuinely installed, but both
`package.json` files still declared `^4.12.32`. Raised, so a lock regeneration
cannot walk it back.

**One correction to myself.** My first pass at your `prefer-const` finding
matched loosely and converted a `clock` that *is* reassigned four lines later,
turning "refuses a link older than a day" red. Caught by running the suite,
reverted, and only the site the rule actually flagged is `const`.

---

## The fault matrix — three green, four blocked on your harness

Your new tests landed while I was working. The reasoning in them is good and
they found real defects.

**Fixed — and this one is the most serious thing either of us found today.**
`flow.streamFailure.test.ts` is right: `fail` was unconditional, so a socket
dropping minutes after delivery replaced a paid-for report with a failure
screen. And your second point is the one that costs money — if the transport
error won the race it set `refundable: false`, the terminal guard then refused
the real `analysis_failed` carrying `refundable: true`, and the wallet releases a
hold only on that flag. A failed Study nobody refunds. A failure can now be
upgraded from non-refundable to refundable, and only in that direction.

**Fixed, but your two page tests still fail — the behaviour is there.** They
render the pages without a `ToastProvider`, where `useToast` is a documented
no-op. `AppShell` always provides one, so that configuration never occurs in the
app. Wrap the render and they should pass:

```tsx
render(
  <MemoryRouter>
    <ToastProvider>
      <ClientProvider client={failingClient()}>
        <DocumentsPage />
      </ClientProvider>
    </ToastProvider>
  </MemoryRouter>,
);
```

Two notes on that. The viewport draws desktop and compact stacks as siblings and
hides one by Tailwind breakpoint, which jsdom does not apply — so every toast
appears **twice**; use `findAllByRole`. And your third assertion in each file
already passed: the failed state does not render the empty-library copy, which
is the part that would have told someone their research was gone.

Why a toast and not an error screen: **there is no Figma frame for a failed
fetch** on either surface. Documents draws Empty, No-results and Loading; the
Data Room's `failed` state is a per-file *upload* failure, a different thing.
Building one would be inventing a design. The toast is what the system already
has — error variant, `role="alert"`, and per its own spec *"anything with an
action does not auto-dismiss."* A designed inline state would be better and is
logged for the design session.

---

## Where this leaves F1

Half done, and the half that was blocking.

**Done:** the schema executes, has every table its repositories need, forces RLS,
carries real roles and grants, and has a per-request session seam. 26 tests, all
against real Postgres in-process — no Docker, no daemon, so they run in the
ordinary `npm test`. A security suite that needs infrastructure is one that gets
skipped.

**Not done:** the Postgres repository implementations. Still in-memory at
runtime, deliberately — no repository is swapped and no behaviour changes, so
nothing destabilises while you are mid-flight on the fault matrix. That is the
next commit, and it is now a mechanical job rather than a blocked one.

So your §1 framing still holds and should still be said out loud in any review:
**the 723 green tests certify in-memory repositories.** What is new is that the
SQL is no longer uncertified — 26 tests now execute it, as a non-owner role,
which is the specific trap your F2 write-up names.

---

## For your Phase 2

The RLS suites you were going to write against F2–F5 largely exist now, in
`services/backend/src/db/schema.rls.test.ts`. Worth reading before duplicating —
though an independent second set is not waste on this particular subject.

Two things there that would be easy to miss:

- **Connect as `caspr_request`.** Your own F2 note makes the point and it is the
  whole trap: every isolation assertion passes trivially as owner or superuser.
- **Fail-closed is pinned deliberately.** With no user set, every policy matches
  zero rows. That direction is safe, and it is worth a test, because the
  alternative direction of the same bug returns everything.

*Dev session · 2026-08-20.*
