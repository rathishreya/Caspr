# Test Report — Static Gate

**Run:** 2026-08-20 · **Repo:** `caspr-ai/caspr-product` @ `096e519` on `main`, clean tree
**Scope:** Static gate only — typecheck, existing test suite, build, dependency audit, secret scan, hardcoded-origin scan, database security review
**By:** Test session. **For:** Dev session.

**Division of labour:** this session finds and reports. The dev session fixes. Nothing in this document has been fixed by the reporter except where explicitly stated in §4, which needs owning.

---

## 1. Verdict

**The build is in good shape. One finding changes what the green results mean, and it should be stated before any external review rather than discovered during one.**

723 tests pass, typecheck is clean across all seven workspaces, the build succeeds, no secrets are committed, and — notably — there is not a single hardcoded origin in application source. That last point matters: it was a specific past complaint and it has been genuinely honoured.

The finding is that **the backend has no database.** It runs entirely on in-memory repositories. `schema.sql` — including the whole Row-Level Security layer — has never been executed by anything. That is very likely known and scheduled rather than a surprise, but it must be explicit in a review, because it changes what "723 tests passing" certifies.

---

## 2. What passed

| Check | Result |
|---|---|
| `npm run typecheck` | Clean — 7 workspaces, 0 errors |
| `npm test` | **723 passed / 723**, 80 test files, 0 failures |
| `npm run build` | Clean, 808 modules transformed |
| Secrets in tracked files | None. `.gitignore` covers `.env` and `.env.*` with a correct `!.env.example` negation |
| Hardcoded origins in `src` | **Zero.** Every origin resolves through config |
| `npm audit` | Clean after §4 — was 1 high, 1 moderate |

Per-workspace: contract 10 · util 13 · web 434 · backend 166 · conformance 4 · mocks 32 · reference-ai 64.

---

## 3. Findings

Severity reflects impact if the code shipped as-is. Every finding names the file and line.

### F1 · No database is wired · **Blocker for review context**

**Where:** `services/backend/src/server.ts:112-113`; `services/backend/package.json`; `services/backend/src/db/`

**What:**

- Backend dependencies are `@caspr/contract`, `@caspr/util`, `@hono/node-server`, `hono`, `jose`. **There is no Postgres client** — no `pg`, no `pglite`, no `postgres.js`.
- `server.ts` constructs the app with `createInMemoryUsers()` and `createInMemoryWallets()`.
- `services/backend/src/db/` contains `memory.ts`, `ports.ts`, `schema.sql` — no Postgres repository implementation.
- `schema.sql` is referenced by exactly one thing in the codebase: a comment in `ports.ts`.

**Why it matters:**

1. **All user data, wallets and analyses are lost on process restart.** Fine for development; it is not a persistence layer.
2. **`schema.sql` has never run.** Its 14 tables, 11 RLS policies and the role model described in its comments are untested by construction — not lightly tested, never executed.
3. **It changes what the test suite certifies.** 723 passing tests exercise in-memory repositories. They say nothing about SQL correctness, RLS behaviour, transaction semantics, constraint enforcement, or concurrency. That distinction will be the first thing a reviewer asks about, and it is much better coming from us.

**Recommendation:** wire a Postgres repository against `ports.ts`, and add PGlite-backed tests that execute the real `schema.sql`. Findings F2–F5 cannot be verified until this exists — though all four are fixable in the SQL today.

**Note:** this is probably known and scheduled rather than an oversight. It is reported at this severity because of what it means for interpreting the green suite, not because the work is late.

---

### F2 · Row-Level Security is enabled but not forced · **High**

**Where:** `services/backend/src/db/schema.sql:249-259`

Eleven tables carry `ALTER TABLE … ENABLE ROW LEVEL SECURITY`. **None carries `FORCE`.**

`ENABLE ROW LEVEL SECURITY` does not apply to the table's owner. If the application connects as the role that owns the tables — the default in most setups — **every policy is silently bypassed** and per-user isolation does not exist. There is no error and no log line; queries simply return everything.

This is also a testing trap: a test that connects as a superuser passes while production leaks. Any test written for this must run as a non-owner, non-superuser role.

**Recommendation:** add `ALTER TABLE … FORCE ROW LEVEL SECURITY` for all eleven tables.

---

### F3 · No policy has a `WITH CHECK` clause · **High**

**Where:** `services/backend/src/db/schema.sql:261-276`

Eleven policies, all `USING (…)` only, none with `WITH CHECK`.

`USING` constrains what a row-level query can **read**. Without `WITH CHECK`, it does not constrain what can be **written**. A user can INSERT or UPDATE a row carrying another user's `user_id` — including into `wallet` and `wallet_transactions`.

**Recommendation:** add a matching `WITH CHECK` to every policy. For `versions_owner` the check mirrors the same subquery as its `USING`.

---

### F4 · The role model exists only in comments · **High**

**Where:** `services/backend/src/db/schema.sql:262-265, 279-283` — and, decisively, nowhere else in the repository

The schema's comments describe a careful and correct two-role design:

> *"granted to the auth role alone and denied to the request role"*
> *"audit_log is append-only: grant INSERT/SELECT only, never UPDATE/DELETE"*
> *"user_credentials and email_verifications are reached only by the auth role, which BYPASSRLS covers; the request role must have no grant on either"*

A repository-wide search for `CREATE ROLE`, `GRANT`, `REVOKE` and `BYPASSRLS` returns **only that last comment**. No role is created. No grant is issued. No revoke exists.

Three consequences:

- `CREATE POLICY credentials_none ON user_credentials USING (false)` is the entire protection on the credentials table, and it depends on a request role that does not exist.
- **`audit_log` has no RLS and no grants at all.** Its append-only property — a claim made to enterprise buyers in `architecture-alignment-v4.md` §7 — is enforced by nothing.
- Three of fourteen tables have no RLS: `email_verifications`, `collaborators`, `audit_log`. Two are explained in comments; `audit_log` is explained by a grant model that was never written.

The design is sound. It simply has not been implemented.

**Recommendation:** create the two roles and their grants alongside the schema, and `REVOKE UPDATE, DELETE, TRUNCATE ON audit_log` from the application role.

---

### F5 · Nothing sets `app.current_user_id` · **High**

**Where:** `schema.sql:14` defines `app_current_user_id()`; no TypeScript sets it

Every policy filters on `app_current_user_id()`, which reads `current_setting('app.current_user_id', true)`. A repository-wide search for `set_config` and `SET LOCAL` returns **nothing**.

The function therefore returns NULL on every request, `user_id = NULL` evaluates to NULL, and every policy matches zero rows. That direction is fail-closed and therefore safe — but it means the policies as written would make the application return nothing at all, which in turn implies that when Postgres is wired the connection would have to be an owner or superuser for anything to work. Combined with F2, that is precisely the configuration in which isolation silently does not apply.

**Recommendation:** set `app.current_user_id` per request from the verified JWT `sub`, inside the same transaction as the query, using `set_config(…, true)` so it is transaction-local and cannot leak between pooled connections.

---

### F6 · hono CORS ReDoS — applies to us · **Medium** · *patched, see §4*

**Where:** `services/backend/src/app.ts:186`, `services/reference-ai/src/app.ts:70`

`hono@4.12.32` carries four advisories. Three do not apply — `memo()`, the proxy helper and the language middleware are not imported. **One does:** ReDoS in the CORS middleware via `Access-Control-Request-Headers`.

It applies squarely. `cors()` runs on the only internet-facing service, on every request including preflights, and the payload is a request header — no authentication required to reach it.

**Recommendation:** already patched to `4.13.3`. Verify and own the change.

---

### F7 · Initial JS bundle is heavy · **Medium**

**Where:** `apps/web/dist/assets/index-*.js`

**1,832 kB raw / 560 kB gzipped**, plus 73 kB / 15 kB CSS.

For a single-page app this is heavy, and it lands directly on the metric the business cares about most. Time-to-first-report starts with time-to-first-paint, and 560 kB of gzipped JavaScript on a mid-range connection is several seconds before anything is interactive. Given that activation — not acquisition — is the identified funnel problem, this is worth treating as a product issue rather than a technical nicety.

ECharts is the likely bulk and is only needed once a report renders.

**Recommendation:** measure the composition (`rollup-plugin-visualizer`), lazy-load the chart engine behind the report route, and set a bundle budget so it cannot regress silently.

---

### F8 · nanoid advisory — does not apply · **Informational** · *patched, see §4*

Reached only through `vite → postcss` at build time, never present in the shipped bundle, and the vulnerability requires a custom generator with size zero, which postcss does not do. Patched because it was free, not because it was a risk.

---

## 4. Changes made by this session — need owning

Two files are modified and **uncommitted** in the working tree:

- `services/backend/package.json`
- `package-lock.json`

`npm audit fix` was run, taking `hono` 4.12.32 → **4.13.3** and `nanoid` 3.3.16 → **3.3.18**. `npm audit` now reports zero vulnerabilities, and the full suite was re-run after the bump: **723 tests still pass, build still clean.**

This was a fix, and fixes are the dev session's remit. It is flagged here rather than committed. Either adopt it or revert it — but F6 is real, so it should not simply be dropped.

---

## 5. What this run did *not* cover

Stated so the green results are not read as broader than they are.

| Not tested | Why |
|---|---|
| SQL correctness, RLS behaviour, constraints, transactions | No database is wired (F1) |
| Functional journeys in a browser | Playwright not yet installed — test session's next work |
| Failure behaviour — timeouts, 500s, 429s, dropped streams | Fault matrix not yet built |
| Performance, LCP, interaction latency, memory | Lighthouse and timing harness not yet built |
| Load and concurrency | k6 profiles not yet built |
| Accessibility | axe not yet wired |
| Static security analysis | Semgrep not yet configured |
| Secret scanning as a gate | Manual grep only; gitleaks not yet configured |
| The hardcoded-origin rule as a gate | Manual grep only; ESLint not yet configured |
| Anything against Jayant's real backend | Not deployed |

No lint configuration exists anywhere in the repository. The root `lint` script delegates to workspaces, none of which define one.

---

## 6. Suggested order

Ordered by what a reviewer would raise first, not by effort.

| # | Work | Finding |
|---|---|---|
| 1 | Wire a Postgres repository against `ports.ts`; PGlite tests that execute the real `schema.sql` | F1 |
| 2 | `FORCE ROW LEVEL SECURITY` on all eleven tables | F2 |
| 3 | `WITH CHECK` on all eleven policies | F3 |
| 4 | Create the two roles and their grants; revoke UPDATE/DELETE/TRUNCATE on `audit_log` | F4 |
| 5 | Set `app.current_user_id` per request, transaction-local, from the verified JWT `sub` | F5 |
| 6 | Adopt or revert the dependency bump | F6, F8 |
| 7 | Bundle composition, lazy-load ECharts, set a budget | F7 |

Items 2–5 are all edits to one file and are best done together — each is individually cheap and collectively they are what makes tenant isolation real. Item 1 is what allows any of them to be verified.

---

## 7. Next from the test session

Building the gate tooling that turns this one-off run into something that runs on every commit: ESLint with a custom rule that fails the build on a hardcoded origin, gitleaks, Semgrep, a dependency-audit gate with a documented allowlist, and a bundle budget.

Then the Phase 2 security suites — RLS isolation as a non-superuser role, wallet ledger property tests, JWT attack coverage. **Those tests will fail on arrival**, and that is intended: they encode F2–F5, and they turn green when the dev session fixes them.

---

---

# Part 2 — The gate is now installed

Added after Part 1, same day. The checks in Part 1 were run by hand; these run on demand and can run in CI.

## 8. What was added

| File | What it does |
|---|---|
| `eslint.config.js` | Flat config across all 7 workspaces — typescript-eslint, react-hooks for the web app |
| `tools/eslint-rules/no-hardcoded-origin.js` | The custom rule |
| `tools/eslint-rules/no-hardcoded-origin.test.js` | 27 RuleTester cases |
| `scripts/secret-scan.mjs` | Portable secret scan — no binary needed |
| `scripts/audit-check.mjs` | Dependency gate with a dated allowlist |
| `audit-allowlist.json` | Currently empty — nothing is being excused |
| `.size-limit.json` | Bundle budget, set at today's measured ceiling |
| `.gitleaks.toml` · `.semgrep.yml` | CI configs — neither binary is installed locally |

One command runs everything: **`npm run gate`** — lint → typecheck → secrets → deps → tests → build → size. Lint alone takes 11s.

## 9. The origin rule earns its place

First draft flagged **33 problems**. Reading every one showed the code was right and the rule was blunt: it flagged `process.env.APP_ORIGIN ?? 'http://localhost:5173'`, which is precisely the pattern we want.

The rule now allows an origin **only as the fallback of a config read** — `process.env.X`, `import.meta.env.X`, or an injected option. That change alone removed 15 false positives without a single exemption. Three more were fixed by teaching it that `.invalid` / `.test` / `.example` are RFC 2606 reserved and can never resolve, and that in `` `https://${host}${path}` `` the host is interpolated and therefore already overridable.

**Result: zero hits across the entire repository, zero false positives.** The codebase genuinely contains no hardcoded origins, and now it cannot acquire one silently.

Worth correcting Part 1: the "zero hardcoded origins" claim there was partly an artifact of a grep that excluded `localhost`. The rule gives the fuller picture, and the answer is still clean.

## 10. New findings — 13 lint errors

All genuine, all trivial, none functional. `npm run gate` fails on them today.

| Rule | Count | Where |
|---|---|---|
| `no-unused-vars` | 11 | `GenerationPage.tsx` (×4), `reservations.test.ts` (×2), `DataRoomPage.tsx`, `useVisualProposals.test.tsx`, `AccountPage.test.tsx`, `app.test.ts`, `player.test.ts` |
| `prefer-const` | 1 | `signup.test.ts:213` |
| `no-console` | 1 | `verification.ts:191` |

The four in `GenerationPage.tsx` looked like a functional gap — `EngagementCarousel` imported but unused — but it isn't. The carousel moved to `WorkingPane.tsx` in a refactor and `GenerationPage` kept the imports and the `intent` state. Dead code, nothing missing.

Everything else in the gate passes: typecheck, 723 tests, build, secrets, dependencies, and the bundle budget.

## 11. Note on `@size-limit/preset-app`

The obvious package for bundle budgets pulls in `@size-limit/time`, which brought **8 high-severity advisories** — it launches a headless browser to estimate load time. Adding eight advisories to a security gate to measure a file size is a bad trade. Swapped for `@size-limit/file`: zero advisories, and file size is all that was wanted.

## 12. Coordination — two sessions in one working tree

Worth flagging, because it produced a real artefact.

While Part 1's checks were running, the dev session was committing in the same tree. HEAD moved from `096e519` to `7421401` mid-run. Two consequences:

**The lint work was committed mid-flight.** Commit `7421401` — "Lint setup: eslint 9 flat config and the no-hardcoded-origin rule" — contains the **first draft** of the rule, the one that produced 33 false positives. The corrections in §9 are uncommitted in the working tree. As committed, the rule will flag `https://example.invalid/...` fixtures and `` `https://${host}${path}` ``. **The working-tree version is the correct one and should be committed over it.**

**The hono fix landed, but only in the lock.** `package-lock.json` at HEAD pins `hono@4.13.3`, so `npm ci` installs the patched version and the ReDoS is genuinely fixed. But `services/backend/package.json` still declares `^4.12.32`. Since 4.13.3 satisfies that range the behaviour is correct — the *intent* just isn't recorded, so a future lock regeneration could quietly drop back. Recommend raising it to `^4.13.3`.

Neither is serious. Both are the predictable result of two sessions writing to one tree, and worth a convention before it produces something that matters.

## 13. Still not covered

Unchanged from §5, minus the static gate. Semgrep and gitleaks have configs but no local binary — they need CI or a local install. Next from the test session: Playwright, the fault matrix, and the Phase 2 security suites that encode findings F2–F5.

---

# Part 3 — Failure behaviour

The fault-injection harness, and the first defect it found.

## 14. The harness

`apps/web/src/test/faults.ts` (+ 12 tests). It wraps `CasprClient` so any operation can be made slow, time out, 500, rate-limit, go offline, lose its session, or — for streams — drop after opening.

One design decision worth stating: it injects the transport's **own** error types (`ApiError` with the real codes, `RateLimitError` with `retryAfterSeconds`), not invented ones. A harness with its own error shapes would prove the UI handles errors that never happen while missing the ones that do.

`transport.ts` turned out to be well built — abort-based timeouts, 429 read from both body and `Retry-After` header, 401 refresh-once, capped exponential backoff on the socket, and a documented rule that streams report failure through `onError` rather than going quiet. So the question the harness answers is not *does the transport handle faults* — it does — but **does every screen render something for each error the transport can throw.**

## 15. F9 · A failed library fetch is shown as a working, empty library · **High**

**Where:** `apps/web/src/pages/DocumentsPage.tsx:184` (the type) and `:297-307` (the derivation)
**Test:** `apps/web/src/pages/DocumentsPage.failure.test.tsx` — 2 of 3 assertions fail today

`useList` in `useLibrary.ts` is careful about exactly this, and says so:

> *"Deliberately NOT 'empty'. An empty library is a fact about the user; a failed fetch is a fact about the network, and conflating them tells someone their research is gone."*

It sets `status: 'failed'` and captures the message. `DocumentsPage` carries a matching comment saying `failed` must not fall through to `empty`.

Then the derivation is:

```
library.status === 'loading'  ? 'loading'
: library.status === 'empty'  ? 'empty'
: q.narrowed && no results    ? 'no-results'
:                               'library'
```

and the type is `DocumentsState = 'library' | 'empty' | 'no-results' | 'loading'` — **`'failed'` has nowhere to land.** It falls through to `'library'`.

The measured result is worse than the comment feared. The page does *not* show the empty-library copy — it renders the **full library chrome with zero documents**: filter pane, project counts, sort controls, all asserting a working library that happens to contain nothing. No error, no retry, and `reload()` — which `useLibrary` already returns for this case — is never surfaced. The only recovery is a page refresh.

For a user whose connection blinked, their entire research library appears to have been deleted.

**Recommendation:** add `'failed'` to `DocumentsState`, derive it before `empty`, and render a state that says the fetch failed and calls `reload()`. The hook already provides everything needed.

**Note:** `DataRoomStates.tsx` has the same `Empty` / `NoResults` / `Loading` trio and no error state. The same defect very likely exists on the Data Room screen — untested so far.

## 16. F10 · `useReport.ts` is dead code · **Low**

**Where:** `apps/web/src/features/reader/useReport.ts`

Nothing imports it. It duplicates report retrieval with its own `{ status: 'error' }` state, while the live path in `AnalysisSession.tsx:285` does the job properly — typed failure, dispatched to a designed `GenerationFailed` screen, with the wallet hold released.

Harmless now; the risk is someone wiring it later believing it is the path.

**Recommendation:** delete it.

## 17. What the live generation path gets right

Worth recording, because it is the standard the rest should meet. `AnalysisSession.tsx` branches on `RateLimitError` and `InsufficientBalanceError` by type, dispatches failures to a designed `GenerationFailed` screen, and releases the wallet hold when the service says the failure was ours — with a comment noting that an unrefunded failed Study is the most expensive support ticket the product can generate.

That is the model. F9 exists because the Documents screen was not held to it.

## 18. Streams — two defects from one missing guard

**Where:** `apps/web/src/features/generate/flow.ts:301-302`
**Test:** `apps/web/src/features/generate/flow.streamFailure.test.ts` — 3 of 5 assertions fail

All four stream subscriptions handle `onError`, and thoughtfully — a dropped layout-refinement stream warns rather than fails, because the layout the user already has is still usable. The defect is not a missing handler. It is a missing guard in the reducer.

`applyGenerationEvent` protects a terminal state from being rewound:

```
// Replay after a reconnect can deliver events the reducer already saw, and
// events that predate a terminal state. Neither may rewind the analysis.
if (TERMINAL.includes(state.phase) && event.event !== 'output_ready' && …) return state;
```

`flow.test.ts` pins that from both directions — *"does not let a late event rewind a delivered report"* and *"keeps a failure even if events keep arriving"*.

The `fail` action has no equivalent:

```
case 'fail':
  return { ...state, phase: 'failed', failure: action.failure };
```

Unconditional. Events cannot rewind a terminal state; errors can. Two consequences follow.

### F11 · A dropped socket replaces a delivered report with a failure screen · **High**

`AnalysisSession.tsx` keeps the generation stream subscribed through the `complete` phase, deliberately:

> *"a PPTX asked for from a finished report arrives on this channel seconds later, and a channel torn down at completion would drop it silently."*

That reasoning is right. But it means the subscription's normal lifetime extends well past delivery, so any ordinary disconnection — wifi blip, server restart, idle timeout — calls `onError`, which dispatches `fail`, which is unconditional. **The delivered report is replaced by a failure screen.**

The money is safe here: the hold resolves once per reservation and settles on `complete` before the drop, so a later `failed` cannot re-resolve it. This is UI integrity — a user who paid and received their report being told it failed.

### F12 · A stream drop can block the refund on a genuinely failed run · **Critical**

The same missing guard costs money in a different order.

A run fails server-side and the socket drops at roughly the same moment — the likely pairing, since whatever broke the run may well be what broke the connection. If the transport error wins the race:

1. `fail` sets `phase: 'failed'` with a **non-refundable** failure. Transport errors carry no refundable flag; nothing went wrong server-side as far as the client knows.
2. The real `analysis_failed` event arrives carrying `refundable: true` — and `applyGenerationEvent` **refuses it**, because the phase is already terminal and it is not an output event.
3. The wallet effect requires `failure.refundable` to release, so it returns early **without** marking the reservation resolved.

**The hold is never released.** The user paid for a Study that failed and does not get it back — the precise outcome `AnalysisSession.tsx` names as *"the most expensive support ticket the product can generate"*.

The test demonstrating it (`lets the real, refundable failure land even if the stream dropped first`) fails on `expected false to be true`.

### Recommendation — one guard fixes both

Give `fail` the same terminal protection the events have. Two rules:

- A `fail` arriving when the phase is already `complete` is a transport event about a finished run. It should not change the phase; a warning is the honest treatment.
- A `fail` arriving when the phase is already `failed` must not overwrite the existing failure — the first one is the true one, and it is the one that carries `refundable`.

`flow.test.ts` already models the shape of this guard for events. This is the same guard, applied to the other door into the same state.

## 19. The other screens

Swept every hook that can fail against the screen that consumes it.

### F13 · The Data Room repeats F9, and hides it behind a name collision · **High**

**Where:** `apps/web/src/pages/DataRoomPage.tsx:162-172`
**Test:** `apps/web/src/pages/DataRoomPage.failure.test.tsx` — 2 of 3 fail

Same defect as F9, on the same `useList`. What makes this one worth calling out separately is why it is invisible on inspection — two different things are called `failed`:

| Name | Means | Reachable? |
|---|---|---|
| `DataRoomState = 'failed'` | A failed **upload**. Has designed frames `1809:2` / `1824:197`, and a fixture row reading *"Upload failed — file exceeded 25 MB limit"*. | Yes, via `stateProp` |
| `LibraryStatus = 'failed'` | The **fetch** failed. Set by `useList`. | **No** |

The derivation tests `room.status` for `'loading'` and `'empty'` only, so a failed fetch falls through to `'library'`. A reader scanning the file sees a `'failed'` state declared in the type and used in the render path, and reasonably concludes failure is handled. It is — just a different failure.

Measured: the room renders its normal chrome with no files, no error, no retry.

**Recommendation:** fix as F9, and rename one of the two. `'upload-failed'` and `'load-failed'` cannot be confused; two things called `failed` in one file always will be.

### F14 · A failed balance fetch tells the user they are out of money · **High**

**Where:** `apps/web/src/features/wallet/useWallet.ts:31` and `apps/web/src/pages/WorkingPage.tsx:259`
**Test:** not yet written — needs an authenticated `WorkingPage` harness. Found by reading.

`useWallet` swallows fetch errors deliberately:

```
() => { /* balance is non-critical chrome; ignore fetch errors */ }
```

That is right for the header chip, and `WalletBadge` honours it — `if (!wallet) return null`, so a balance it cannot fetch is a balance it does not show.

`WorkingPage` does something different with the same null:

```
balanceCents: wallet?.spendableCents ?? 0,
```

**Unknown becomes zero.** That value goes to `useEditBudget`, where `budgetState(report, 0, credits)` returns `'out'`, which sets `blocked: true`, which is documented as *"the edge-prompt's trigger"* — the top-up prompt.

So a user with a healthy balance, whose snapshot request happened to fail, is told they cannot afford the edit and is invited to pay. The failure mode pushes toward spending, which is the worst direction for it to lean.

**Recommendation:** let the budget represent an unknown balance and treat it as neither funded nor exhausted — the honest reading of a failed fetch. `balanceCents: number` currently cannot express it, which is why `?? 0` looked reasonable at the call site.

### What is clean

- **Top-up** — `useTopUp` catches, exposes `error`, and `TopUpModal` renders it.
- **Auth screens** — sign-in, sign-up, reset all surface their errors inline.
- **File upload** — `useFileUpload` sets a message and `FileUpload` renders it.
- **The generation path** — typed error branching, a designed `GenerationFailed` screen, wallet release on refundable failure.

### Not wired yet

`WalletPage` renders a hardcoded `BALANCE` fixture rather than the user's real balance (`:115`). Presumably known — the screen is built from frames and the wiring is pending — but recorded so it is not mistaken for working.

## 20. The pattern

Five of these are the same shape, and it is worth naming because it predicts where the next one will be.

| Finding | The model cannot represent… |
|---|---|
| F9 | `DocumentsState` has no `'failed'` |
| F13 | `DataRoomState`'s `'failed'` means something else |
| F11 / F12 | The reducer cannot tell a transport error from a run failure |
| F14 | `balanceCents: number` cannot express "unknown" |

In every case the code *next to* the gap shows the author understood the risk — `useLibrary` explains why a failed fetch must not read as empty, `applyGenerationEvent` guards terminal state, `WalletBadge` hides a balance it could not fetch. The reasoning is consistently good. What is missing is a type that can hold the failure, so the value has nowhere to go and quietly becomes a successful-looking one.

Worth a rule: **any state derived from a fetch needs a member for "the fetch failed", and it must not be optional.** A union that omits it forces every call site to invent something, and the invented value is always a plausible success.

## 21. Against a running stack

Ran the full local stack on non-default ports (backend 9787, reference-ai 9788) to avoid colliding with the dev session's, started via `npm run start` rather than `dev` so the real `.env` was **not** loaded — no SES credentials, no Stripe keys. The backend confirmed it: *"NO MAILER CONFIGURED — verification and reset links will be PRINTED, not sent."* No test signup could reach a real inbox.

Walked signup → printed verification link → verify → session → `/me` → `/wallet`. All correct, including the $100 free-trial wallet on a new account.

### The reference AI's fault injection works, and the transport agrees with it

`services/reference-ai/src/faults.ts` provides ten header-armed deterministic faults (`x-caspr-fault`), refused unless the service starts with `ALLOW_FAULTS`. Its own doc comment names the gap this closes:

> *"The client has designed states for a dropped stream, a rate limit, a failed generation, an expired upload and a render failure. Today every one of them is reachable only by typing its URL, which means none of them is ever exercised by the code path that actually produces it."*

New suite: `apps/web/src/data/transport.integration.test.ts`. It runs the **real** transport against the **real** service and skips silently when the services are not up, so it never breaks a normal `npm test`.

**6 of 7 pass.** The transport handles the faults correctly:

| Fault | Service returns | Transport produces | |
|---|---|---|---|
| `rate_limited` | 429 + `retry-after: 30` + body | `RateLimitError('global_capacity', 30)` | ✓ |
| `server_error` | 500 + JSON-RPC error envelope | `ApiError` with `status: 500` | ✓ |
| `timeout` | never responds | `ApiError('timeout')` in ~3s on the client's own timer | ✓ |
| `stream_drop` | SSE closes mid-flight | resolves via `onError` or `onClose` — never goes quiet | ✓ |

The rate-limit path is belt-and-braces on both sides: the service sends the delay in the header *and* the body, and the transport reads the body first with the header as fallback. That is the one the UI needs to render a cooldown, and it survives the round trip intact.

The `stream_drop` result also settles a question F11 raised — `subscribeSse` retries once with `Last-Event-ID` and then resolves cleanly. The stream layer honours its own rule. F11 and F12 remain, but they live in the reducer, not the transport.

### F15 · A signed-out user is told the network is down · **Medium**

**Where:** `apps/web/src/data/transport.ts:54-57` and `:84-101` (and the same shape in `subscribeSse`)
**Test:** `transport.integration.test.ts` — *"turns a missing token into ApiError('unauthorized') before sending"*, fails with `expected 'network_error' to be 'unauthorized'`

`authHeader` classifies the failure correctly:

```
if (!token) throw new ApiError('unauthorized', 'No session token available.');
```

But it is called **inside the object literal passed to `fetch`**, which is inside the `try`. The `catch` checks only whether the abort fired, and re-wraps everything else:

```
throw new ApiError('network_error', `${name} could not reach the service.`, error);
```

So a call made with no session reports as a network failure. Two consequences:

1. The user is shown "could not reach the service" and offered a retry that will fail identically every time, because the problem is not the network.
2. Anything branching on `code === 'unauthorized'` to route to sign-in never fires — the classification was made and then discarded three lines later.

Most likely on a cold load where a screen calls a tool before auth has hydrated, and after sign-out.

**Recommendation:** re-throw an already-classified error rather than re-wrapping it —

```
} catch (error) {
  if (error instanceof ApiError) throw error;   // already classified
  if (controller.signal.aborted) throw new ApiError('timeout', …);
  throw new ApiError('network_error', …);
}
```

which also protects any future classification made inside the `try`. Hoisting `authHeader` above the `try` fixes this instance; the guard fixes the class.

## 22. The suite is now intentionally red

`npm test` fails on two new files. That is the handoff: the tests state the requirement, the dev session makes them pass.

| File | Fails | Finding |
|---|---|---|
| `apps/web/src/pages/DocumentsPage.failure.test.tsx` | 2 of 3 | F9 |
| `apps/web/src/pages/DataRoomPage.failure.test.tsx` | 2 of 3 | F13 |
| `apps/web/src/features/generate/flow.streamFailure.test.ts` | 3 of 5 | F11, F12 |

Nothing else regressed — typecheck, build, secrets, dependencies and the bundle budget all still pass, and the existing 723 tests are unaffected.

## 20. Findings so far, by severity

| # | Finding | Severity |
|---|---|---|
| F12 | Stream drop can block the refund on a genuinely failed run | **Critical** |
| F1 | No database wired — `schema.sql` has never executed | Blocker for review context |
| F2 | RLS enabled but not forced | High |
| F3 | No policy has `WITH CHECK` | High |
| F4 | The role model exists only in comments | High |
| F5 | Nothing sets `app.current_user_id` | High |
| F9 | Failed library fetch renders as a working, empty library | High |
| F11 | Dropped socket replaces a delivered report with a failure screen | High |
| F13 | Data Room repeats F9, hidden by a `failed` name collision | High |
| F14 | Failed balance fetch tells the user they are out of money | High |
| F15 | A signed-out user is told the network is down | Medium |
| F6 | hono CORS ReDoS | Medium — patched |
| F7 | Initial JS bundle 573 kB gzipped | Medium |
| F10 | `useReport.ts` is dead code | Low |
| F8 | nanoid advisory — does not apply | Informational — patched |

Plus 13 lint errors (§10), all trivial.

---

# Part 4 — Browser run, and the state at close

## 23. The journey, against the real stack

Web app on 9173 in a `faulttest` Vite mode pointed at the test-session stack, so it shared no state with the dev session's on 8787/8788.

Signed in as a real account and submitted a real prompt. The integration works end to end: `propose_layout` over MCP → layout SSE opened → analysis recorded via `POST /documents` → conversation turn persisted. CORS preflights clean, console clean, wallet chip showing the real $100 trial balance.

### F16 · Fixture content is presented as the user's own · **Medium**

Three screens mix live data and frame fixtures, with the fixture in the more prominent position.

| Screen | Real | Fixture |
|---|---|---|
| Welcome | wallet chip ($100.00, live) | *"Hi, **Jayant**. Hope the pharma deal we evaluated last week is moving well"*, and three "Recent analyses" the account does not have |
| Conversation | the prompt text, and the analysis genuinely created | the title, shown as **"UK EV market"** from a hardcoded list at `ConversationPage.tsx:56` |
| Documents | — | filter counts: Market Research **512**, Business Case **289**, Energy **412** |
| Wallet | — | `BALANCE` constant at `WalletPage.tsx:115` |

The title case is the sharpest. Asked for *"Market size and competitive landscape for EV charging infrastructure in **Germany** through 2030"*; the screen said **"UK EV market"**. Checking the API, the library had recorded it correctly — `"Market size and competitive landscape for EV charging infrastructure in Germany "` — so the data layer was right and only the presentation was wrong. `AnalysisSession.tsx:421` derives the title properly; `ConversationPage.tsx:56` overrides it with a fixture.

Very likely known — these screens are built from frames and wiring is pending, as with `WalletPage`. Recorded because mixing them is the risky configuration: a live wallet balance beside a fabricated greeting lends the fixture credibility. And a user greeted by someone else's name on first load is a bad first impression to ship by accident.

Minor: the recorded title carries a trailing space from `prompt.slice(0, 80)`.

## 24. Correction — F9 and F13, and a flaw in my own tests

**The finding was right when written. My tests for it were not, and would have gone on failing after the fix.**

`DocumentsPage.failure.test.tsx` and `DataRoomPage.failure.test.tsx` rendered each page on its own. Failure is surfaced app-wide by `useFetchFailureToast` through a `ToastProvider` that `AppShell` supplies. Without that provider `useToast` is a documented no-op, so the tests asserted against a configuration the app never has — and reported a failure no user would ever see.

The browser caught it: with `/documents` failing, a toast reading *"Couldn't load your library."* with a working **Try again** was plainly on screen, while my unit test insisted nothing was.

Both files now render inside a `ToastProvider` and pass, along with two cases the browser run suggested — that the notice persists rather than auto-dismissing, and that a failed *fetch* is not shown using the failed-*upload* treatment.

**The lesson is general enough to keep:** a page-level test that omits the app-level providers tests a configuration that does not exist. Where an app handles a concern centrally — toasts, error boundaries, auth — a test that renders below that layer will report absences that are not real. Worth checking any future page test against what `AppShell` actually wraps.

## 25. Status at close

Everything green: **808 tests pass**, 7 skipped (the integration suite, correctly skipping without its env vars). Lint clean. Bundle 203.55 kB initial against a 215 kB budget, with the chart engine lazy at 366.96 kB.

| # | Finding | Status |
|---|---|---|
| F1 | No database wired | **Fixed** — `f4d937e` *"The schema has never run. Now it runs, and its security model is real."* |
| F2–F5 | RLS not forced · no `WITH CHECK` · role model in comments only · `app.current_user_id` unset | **Fixed** — same commit |
| F6 | hono CORS ReDoS | **Fixed** — patched, and `package.json` now records it |
| F7 | Bundle 573 kB gzipped | **Fixed** — `490337b`, 579 → 206 kB on first paint |
| F9 | Failed library fetch shown as a working library | **Fixed** — `useFetchFailureToast`; see §24 |
| F11 | Dropped socket replaced a delivered report | **Fixed** — `b9c8ef3`; my 5 tests now pass |
| F12 | Stream drop blocked the refund on a failed run | **Fixed** — same commit |
| F13 | Data Room repeated F9 | **Fixed** — same hook |
| — | 13 lint errors | **Fixed** — `44e503a` |
| **F10** | `useReport.ts` dead code | **Open** — still referenced only by itself |
| **F14** | Failed balance fetch says "out of money" | **Open** — `WorkingPage.tsx:259` still `?? 0` |
| **F15** | Signed-out user told the network is down | **Open** — the catch still re-wraps unconditionally |
| **F16** | Fixture content presented as the user's own | **Open** — likely known |

Three of the four open items are small and specific. F14 is the one worth prioritising: it fires on the money path and pushes the user toward paying.

### Test assets left behind

| File | What it does |
|---|---|
| `apps/web/src/test/faults.ts` (+12 tests) | Fault injection at the `CasprClient` seam, using the transport's own error types |
| `apps/web/src/data/transport.integration.test.ts` | The real transport against the running reference AI; skips when it is not up |
| `apps/web/src/pages/DocumentsPage.failure.test.tsx` | Failed-fetch behaviour, inside the toast host |
| `apps/web/src/pages/DataRoomPage.failure.test.tsx` | The same, plus the failed-fetch vs failed-upload distinction |
| `apps/web/src/features/generate/flow.streamFailure.test.ts` | Terminal-state protection against late transport errors |
| `eslint.config.js`, `tools/eslint-rules/`, `scripts/`, `.size-limit.json`, `.gitleaks.toml`, `.semgrep.yml` | The static gate — `npm run gate` |

To run the integration suite:

```
CASPR_AI_ORIGIN=http://localhost:9788 CASPR_TEST_TOKEN=<a real JWT>   npx vitest run --root apps/web src/data/transport.integration.test.ts
```

`apps/web/.env.faulttest.local` is a temporary, gitignored file pointing the web app at the test stack. Delete it when it is no longer wanted.

---

*Plan: `docs/superpowers/plans/2026-08-12-testing-phase-1.md` (static gate) · `-phase-2.md` (security and money)*
*Report: `docs/app-handoff/TEST-REPORT-2026-08-20.md`*
