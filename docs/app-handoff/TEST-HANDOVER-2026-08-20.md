# Test Handover — 2026-08-20

**From:** Test session · **To:** Dev session
**Repo:** `caspr-ai/caspr-product` · started at `096e519`, closed at `4e9dea8` (12 commits landed during the session)
**Companion:** [`TEST-REPORT-2026-08-20.md`](TEST-REPORT-2026-08-20.md) — the chronological working log, including how each finding was reached. This document is the actionable summary.

---

## 1. Where things stand

**815 tests passing. Zero failures. Lint clean. Bundle inside budget.**

Sixteen findings were raised. **Twelve are closed** — the dev session fixed them during the session, and the tests that proved them now pass. **Four remain**, all small and specific.

| Gate | Result |
|---|---|
| `npm run lint` | Clean — including the custom `caspr/no-hardcoded-origin` rule |
| `npm run typecheck` | Clean, 7 workspaces |
| `npm test` | **815 passing**, 7 skipped (integration suite, skips without its env) |
| `npm run build` | Clean |
| `npm run security:secrets` | Clean — 346 tracked files, 9 patterns |
| `npm run security:deps` | Clean — 0 advisories |
| `npm run size` | 203.55 kB initial JS (budget 215) · 366.96 kB lazy chart chunk (390) · 15.11 kB CSS (16) |

One command runs all of it: **`npm run gate`**.

---

## 2. Pending — four items

Ordered by what I would fix first.

### P1 · A failed balance fetch tells the user they are out of money · **High**

**Where:** `apps/web/src/pages/WorkingPage.tsx:259`

```ts
balanceCents: wallet?.spendableCents ?? 0,
```

`useWallet` swallows fetch errors on purpose — *"balance is non-critical chrome"* (`useWallet.ts:31`) — and returns `null`. That is right for a header chip.

Here the null becomes **zero**. It goes to `useEditBudget`, where `budgetState(report, 0, credits)` returns `'out'`, which sets `blocked: true`, documented as *"the edge-prompt's trigger"* — the top-up prompt.

So a user with a healthy balance, whose snapshot request happened to fail, is told they cannot afford the edit and is invited to pay. **The failure leans toward spending**, which is the worst direction available.

**Why it is still open:** `balanceCents: number` cannot express "unknown", so `?? 0` looked reasonable at the call site.

**Fix:** let the budget represent an unknown balance and treat it as neither funded nor exhausted — e.g. `balanceCents: number | null`, with `budgetState` returning a third state that neither blocks nor promises. The honest reading of a failed fetch is "we do not know", and the UI should not act on money it has not seen.

**Verify:** a test that renders `WorkingPage` with a failing `wallet.getSnapshot` and asserts the edge-prompt does **not** fire. Not yet written — it needs an authenticated `WorkingPage` harness, which is why this one was found by reading rather than by test.

---

### P2 · A signed-out user is told the network is down · **Medium**

**Where:** `apps/web/src/data/transport.ts` — `authHeader` at ~:54, the catch at ~:96. Same shape in `subscribeSse`.
**Test:** `apps/web/src/data/transport.integration.test.ts` → *"turns a missing token into ApiError('unauthorized') before sending"*. Currently fails with `expected 'network_error' to be 'unauthorized'`.

`authHeader` classifies correctly:

```ts
if (!token) throw new ApiError('unauthorized', 'No session token available.');
```

But it is evaluated **inside the object literal passed to `fetch`**, which sits inside the `try`. The catch checks only whether the abort fired, then re-wraps everything else:

```ts
throw new ApiError('network_error', `${name} could not reach the service.`, error);
```

Two consequences: the user sees "could not reach the service" and a retry that will fail identically forever, and anything branching on `code === 'unauthorized'` to route to sign-in never fires. The classification is made and discarded three lines later.

Most likely on a cold load where a screen calls a tool before auth has hydrated, and after sign-out.

**Fix — the guard, not the instance:**

```ts
} catch (error) {
  if (error instanceof ApiError) throw error;   // already classified
  if (controller.signal.aborted) throw new ApiError('timeout', `${name} timed out.`);
  throw new ApiError('network_error', `${name} could not reach the service.`, error);
}
```

Hoisting `authHeader` above the `try` fixes this instance; the guard fixes the class, and protects any future classification made inside the block. Apply to `subscribeSse` as well.

**Verify:**
```
CASPR_AI_ORIGIN=http://localhost:8788 CASPR_TEST_TOKEN=<a real JWT> \
  npx vitest run --root apps/web src/data/transport.integration.test.ts
```

---

### P3 · Fixture content is presented as the user's own · **Medium**

Almost certainly known — these screens are built from frames with wiring pending. Recorded because mixing live and fixture data on one screen is the risky configuration: a live wallet balance beside a fabricated greeting lends the fixture credibility.

| Screen | Live | Fixture |
|---|---|---|
| Welcome | wallet chip ($100.00) | *"Hi, **Jayant**. Hope the pharma deal we evaluated last week is moving well"*, plus three "Recent analyses" the account does not have |
| Conversation | the prompt, and the analysis genuinely created | the **title** — `ConversationPage.tsx:56` |
| Documents | — | filter counts: Market Research **512**, Business Case **289**, Energy **412** |
| Wallet | — | `BALANCE` constant, `WalletPage.tsx:115` |

**The sharpest case.** Submitted *"Market size and competitive landscape for EV charging infrastructure in **Germany** through 2030"*. The screen titled it **"UK EV market"**. Querying the API showed the library had recorded it correctly — `"Market size and competitive landscape for EV charging infrastructure in Germany "` — so the data layer was right and only the presentation was wrong. `AnalysisSession.tsx:421` derives the title properly; `ConversationPage.tsx:56` overrides it from a hardcoded list.

**Fix:** point these at live data, or — where a screen must still render standalone for design review — make the fixture visibly a sample rather than the user's own. Greeting a real user by another person's name is the one to close first.

**Also:** the recorded title carries a trailing space from `prompt.slice(0, 80)`.

---

### P4 · `useReport.ts` is dead code · **Low**

**Where:** `apps/web/src/features/reader/useReport.ts` — referenced by nothing but itself.

It duplicates report retrieval with its own `{ status: 'error' }` state, while the live path in `AnalysisSession.tsx:285` does the job properly — typed failure, dispatched to a designed `GenerationFailed` screen, with the wallet hold released.

Harmless today. The risk is someone wiring it later believing it is the path.

**Fix:** delete it.

---

### Also worth doing, not a defect

**`FORCE ROW LEVEL SECURITY` is still absent** — 14 tables `ENABLE`, none `FORCE`.

This is now defence-in-depth rather than a live risk. `postgres.ts` has **zero direct queries**: all 17 go through `withUser` / `withAuth` in `session.ts`, which issues `SET LOCAL ROLE caspr_request` (a non-owner role), so the policies apply. `ENABLE` is sufficient *as long as that discipline holds*.

`FORCE` removes the dependency on it — one line per table, and it means a future query that bypasses the session helper fails closed instead of silently seeing everything.

---

## 3. What was tested

| Area | How | Result |
|---|---|---|
| Type safety | `tsc --noEmit`, 7 workspaces | Clean |
| Lint & house rules | ESLint 9 flat config + custom origin rule | Clean; **zero hardcoded origins in the codebase** |
| Secrets | Node scanner over `git ls-files`, 9 credential patterns | Clean; `.gitignore` correct |
| Dependencies | `npm audit` + dated allowlist | Clean; hono CORS ReDoS found and patched |
| Bundle | `size-limit`, budgets set at measured ceilings | Within budget after code-splitting |
| Database security | Read of `schema.sql`, roles, grants, session handling | Five findings, all closed |
| Failure behaviour | Fault injection at the `CasprClient` seam | Two findings, both closed |
| Stream failure | Reducer-level tests for late transport errors | Two findings, both closed |
| Transport | Real HTTP against the running reference AI, faults armed by header | Four faults verified correct; one finding open (P2) |
| Journey | Browser, real stack, signup → verify → session → prompt → layout → persisted | Works end to end; one finding open (P3) |

### Closed during the session

| # | Finding | Closed by |
|---|---|---|
| F1 | No database wired — `schema.sql` never executed | `f4d937e`, `de08a0e`, `4e9dea8` |
| F2 | RLS not forced | Mitigated — roles + `SET LOCAL ROLE`; see above |
| F3 | No policy had `WITH CHECK` | `f4d937e` — 16 now present |
| F4 | Role model existed only in comments | `f4d937e` — `caspr_request` / `caspr_auth BYPASSRLS`, 10 grants |
| F5 | Nothing set `app.current_user_id` | `f4d937e` — transaction-local `set_config` in `session.ts` |
| F6 | hono CORS ReDoS, applied to us | Patched to 4.13.3; recorded in `package.json` by `44e503a` |
| F7 | Initial bundle 573 kB gzipped | `490337b` — 579 → 206 kB on first paint |
| F8 | nanoid advisory | Not applicable; patched anyway |
| F9 | Failed library fetch shown as a working library | `useFetchFailureToast` |
| F11 | Dropped socket replaced a delivered report | `b9c8ef3` |
| F12 | Stream drop blocked the refund on a failed run | `b9c8ef3` |
| F13 | Data Room repeated F9 | Same hook |
| — | 13 lint errors | `44e503a` |

---

## 4. What was **not** tested

Stated plainly so the green results are not read as broader than they are.

| Not covered | Why |
|---|---|
| Anything against Jayant's real service | Not deployed. Everything above ran against the reference implementation. |
| Load and concurrency | k6 profiles not built. The 500-concurrent target is unverified on either side. |
| Accessibility | axe not wired. No WCAG assertion has been made. |
| Cross-browser | Chromium only. Firefox and WebKit untested — WebKit is strict about SSE and date parsing. |
| Mobile viewports | Desktop only. |
| Static analysis (SAST) | `.semgrep.yml` written; the binary is not installed locally. Needs CI. |
| Git-history secret scan | `.gitleaks.toml` written; same. The Node scanner covers the working tree only. |
| The migration | ~1,650 accounts, balances at 3.2×, password hashes. Untouched — see the Phase 4 plan. |
| Stripe live path | Sandbox only. No real charge has been made. |
| SES delivery | Deliberately avoided: the stack ran without credentials so no test mail could reach a real inbox. |
| Performance in a browser | No Lighthouse run, no interaction-latency measurement, no memory soak. |
| P1's own test | Needs an authenticated `WorkingPage` harness. |

---

## 5. Test assets left behind

| File | What it does |
|---|---|
| `eslint.config.js` · `tools/eslint-rules/` | Flat config + the `no-hardcoded-origin` rule (27 RuleTester cases) |
| `scripts/secret-scan.mjs` | Portable secret scan, no binary needed |
| `scripts/audit-check.mjs` · `audit-allowlist.json` | Dependency gate with dated, expiring exceptions |
| `.size-limit.json` · `.gitleaks.toml` · `.semgrep.yml` | Bundle budget; CI configs for the two binaries |
| `apps/web/src/test/faults.ts` (+12 tests) | Fault injection at the `CasprClient` seam, using the transport's own error types |
| `apps/web/src/data/transport.integration.test.ts` | Real transport vs the running reference AI; skips when it is not up |
| `apps/web/src/pages/DocumentsPage.failure.test.tsx` | Failed-fetch behaviour, inside the toast host |
| `apps/web/src/pages/DataRoomPage.failure.test.tsx` | The same, plus failed-fetch vs failed-upload |
| `apps/web/src/features/generate/flow.streamFailure.test.ts` | Terminal-state protection against late transport errors |

**Running the local stack for fault work** — use `start`, not `dev`, so the real `.env` is not loaded and no test signup can send mail:

```bash
BACKEND_PORT=9787 APP_ORIGIN=http://localhost:9173 CORS_ORIGIN=http://localhost:9173 \
  AUTH_JWT_ISSUER=https://auth.caspr.local AUTH_JWT_AUDIENCE=caspr-app ALLOW_SANDBOX_PAYMENTS=true \
  npm run start --workspace @caspr/backend -- --port 9787

ALLOW_FAULTS=true AUTH_ORIGIN=http://localhost:9787 CORS_ORIGIN=http://localhost:9173 \
  AUTH_JWT_ISSUER=https://auth.caspr.local AUTH_JWT_AUDIENCE=caspr-app \
  npm run start --workspace @caspr/reference-ai -- --port 9788
```

Confirm the backend logs *"NO MAILER CONFIGURED"* before signing anything up.

Faults are armed per request: `x-caspr-fault: rate_limited` (also `timeout`, `server_error`, `analysis_failed`, `stream_drop`, `stream_reset`, `render_failed`, `upload_expired`, `queued`, and the cost faults). See `services/reference-ai/src/faults.ts`.

---

## 6. Two things worth keeping

**A page-level test that omits the app-level providers tests a configuration that does not exist.** My first Documents and Data Room tests rendered each page alone, where `useToast` is a no-op. They reported a failure the user would never see, and would have kept failing after the fix landed. The browser caught it. Where the app handles a concern centrally — toasts, error boundaries, auth — check what `AppShell` wraps before asserting an absence.

**Any state derived from a fetch needs a non-optional member for "the fetch failed."** Five of the sixteen findings were one shape: the type could not represent failure, so the value became a plausible success. `DocumentsState` had no `'failed'`; `DataRoomState`'s meant a failed upload; the flow reducer could not tell a transport error from a run failure; `balanceCents: number` still cannot say "unknown" (P1). In every case the code beside the gap showed the risk was understood — the reasoning was consistently good, and what was missing was somewhere for the failure to go.

---

## 7. Suggested next

1. **P1** — it is on the money path and pushes toward spending.
2. **P2** — one guard, and the test already exists.
3. **P3** — at minimum the greeting, before anyone else sees it.
4. **P4** — a deletion.
5. `FORCE ROW LEVEL SECURITY` — one line per table, defence in depth.

Then, from the test side: axe and the browser matrix, Lighthouse budgets, and k6 against the 500-concurrent target. Those are Phase 1 and 2 of the testing plan and none of them have been started.

---

*Handover: `docs/app-handoff/TEST-HANDOVER-2026-08-20.md`*
*Working log: `docs/app-handoff/TEST-REPORT-2026-08-20.md`*
*Plans: `docs/superpowers/plans/2026-08-12-testing-phase-{1,2,3,4}.md`*
