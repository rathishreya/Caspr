# Test session brief — 2026-08-25

Paste everything below the line into a fresh test session.

---

You are the **test session** for Caspr's product app. A dev session is working in parallel on the same two repositories, so read §6 before touching a file — the lanes are divided deliberately and overlapping them will cost us both an hour of merge conflicts.

## 1 · The repositories

**The repo split since the last test handover.** `caspr-ai/caspr-product` no longer exists under that name — Jayant renamed it, and the Python backend then moved out into its own repository. Anything in `TEST-HANDOVER-2026-08-20.md` that says `caspr-product` means the frontend only.

| | Remote | Start at |
|---|---|---|
| Frontend — the SPA, `packages/*`, the reference AI service | `https://github.com/caspr-ai/caspr-frontend.git` | `c257989` |
| Backend — the Python API | `https://github.com/caspr-ai/caspr-backend.git` | `8f18fce` |

Both are pushed and current as of this brief. **Pull before you start** — the dev session is still committing.

Local clones, if you are on Joy's machine: `C:\Users\joysh\Claude-Local\caspr-app` and `C:\Users\joysh\Claude-Local\caspr-backend`.

### Running things

```bash
npm ci && npm run gate
```

`gate` is lint → typecheck → secret scan → dependency audit → unit tests → tools tests → build → bundle size. It does **not** include Playwright; run that separately with `npx playwright test` from `apps/web`. CI runs both as separate jobs, so both gate a deploy.

Backend: `uv run pytest` (or `.venv/Scripts/python.exe -m pytest` on Windows, where `uv` may not be on PATH). It uses `pgserver` — a real PostgreSQL 16 in-process, no Docker. 242 tests, 80% coverage floor, `ruff` and `mypy --strict` must be clean.

**Docs go on Google Drive, never in a repo.** `G:\My Drive\Caspr\caspr-claude-core\docs\app-handoff\`. The repos hold code, tests, config, migration SQL and their own READMEs — nothing else. This is a hard rule and it exists because two live copies of a document is a fork, not a backup.

## 2 · Why you are being started now

The app deploys to `https://new.caspr.ai/app` as soon as Jayant's team supplies five values and confirms six cluster prerequisites (`DEPLOY-ASK-EKS-2026-08-25.md`). Joy will then do functional testing herself.

**Your job is to be ahead of her.** Everything below is what changed in the last two days, and none of it has been exercised by anything except the unit tests written alongside it.

## 3 · What changed, and the pattern behind all of it

Six live screens were showing invented data. In every case the code was reviewed, typed and covered, and the tests passed — because **each side of the seam was internally consistent and nothing tested the join.** The frontend tested against a mock that answered; the backend tested its service objects directly.

**That pattern is your highest-value hunting ground.** Three concrete instances found so far:

- `getSnapshot` did `res.json() as WalletSnapshot`. The server sends `spendable_cents`, the type declares `spendableCents`. Every field was `undefined` and the app header rendered **`$NaN` on every screen** against the real API. A cast is a claim, not a conversion — it compiles either way.
- `POST /wallet/reservations` **did not exist**. `WalletService.reserve` was written, reviewed and covered; nothing was ever mounted in front of it, so the gate's commit — the only action that spends money — posted into a 404.
- `useProfile` / `useRemember` / `useForget` were written, typed, covered and **called by nothing**. Every memory stopped at `localStorage`, so the `user_persona` the analysis engine receives was composed from an empty table. Personalisation was absent, not degraded.

Look for more of the same shape: **a client method with no route, a route with no caller, a type that disagrees with the wire, a prop default nothing overrides.**

## 4 · Files that changed — and the tests I already updated

Do not redo these; check whether they are *sufficient*.

### Backend — `8f18fce`

| File | What changed | Tests |
|---|---|---|
| `src/app/wallet/router.py` | **New:** `POST /wallet/reservations`, `POST /wallet/reservations/{id}/{settle\|release}`. `GET /wallet` now composes plan + budget + anchor | `tests/integration/test_reservations.py` — **new**, 10 tests |
| `src/app/wallet/schemas.py` | `WalletRead` gains `plan`, `budget_cents` (nullable), `billing_anchor` | as above |
| `src/app/wallet/schemas_resolve.py` | **New:** `ReserveRequest` (`extra="forbid"`), `ReservationRead` | as above |
| `src/app/wallet/service.py` | `plan_of()`; 402 now carries `required_cents` / `spendable_cents` | as above |
| `src/app/pricing.py` | **New:** `Plan` dataclass, `PLANS`, `budget_for_charge`, `budget_cents_for_plan`. Platform fee is now integer basis points | `tests/integration/test_pricing.py` — 2 added |
| `src/app/api.py` | `GET /pricing` publishes `plans` | as above |
| `src/app/auth/emails.py` | Email-change copy approved and recorded | — |

### Frontend — `c257989`

| File | What changed | Tests |
|---|---|---|
| `apps/web/src/features/wallet/cycle.ts` | **New.** All wallet arithmetic: cycle derivation from `billing_anchor`, spend from the ledger, plan cards | `cycle.test.ts` — **new**, 13 tests |
| `apps/web/src/features/wallet/queries.ts` | `useWalletLedger` split out; `useWalletActivity` is now a projection; resolved holds filtered | `WalletPage.test.tsx` |
| `apps/web/src/pages/WalletPage.tsx` | Fully rewired. `features/wallet/data.ts` **deleted** | `WalletPage.test.tsx` — rewritten, 9 tests |
| `apps/web/src/data/realClient.ts` | **New mappers:** `toWalletSnapshot`, `toPricing`; `toReservation` corrected | thin — **see §5.1** |
| `apps/web/src/data/mockClient.ts` | Snapshot and pricing shapes updated to match the wire | — |
| `packages/contract/src/wallet.ts` | `WalletSnapshot` gains `plan`, `billingAnchor`; `researchBudgetCents` now nullable | — |
| `apps/web/src/features/engagement/profileSync.ts` | **New.** Server ↔ localStorage join for memories | `profileSync.test.ts` — **new**, 7 tests |
| `apps/web/src/features/engagement/useEngagement.ts` | `persist` now mirrors to the server | `useEngagement.test.tsx` — 2 added |
| `apps/web/src/app/AppShell.tsx` | Calls `useProfileHydration()` | — |
| `apps/web/src/pages/AccountPage.tsx` | Identity from session; PHONE removed; devices = one row; Phase 1.5 sections drawn as coming-soon | `AccountPage.test.tsx` — updated, 9 tests |
| `apps/web/src/features/account/SettingsCard.tsx` | New `pending` prop — every control genuinely `disabled` | as above |
| `apps/web/src/pages/WelcomePage.tsx` | Continuity line, recent list, `moreCount` all from the library | `emptyIsEmpty.test.tsx` |
| `apps/web/src/pages/ConversationPage.tsx` | Analyses list from the library; fixture deleted | `emptyIsEmpty.test.tsx` |
| `apps/web/src/pages/LayoutCanvasPage.tsx` | `angle` no longer defaults — it renders in a user bubble | `LayoutCanvasPage.test.tsx` — 1 added |
| `apps/web/src/pages/emptyIsEmpty.test.tsx` | Now covers five screens | — |

## 5 · Where I would start

Ordered by where I think the next real bug is.

### 5.1 · The wire mappers have almost no tests — **start here**

`toWalletSnapshot`, `toPricing` and `toReservation` in `realClient.ts` are the exact layer that produced `$NaN`, and they are covered only indirectly. Every other method on `realClient` still casts.

**Audit every method for a cast where a conversion belongs.** `res.json() as T` compiles for any `T`. Grep for `as Promise<` and `as ` against response bodies, then check each against the backend's actual response model. This is a finite list and I expect it to yield.

### 5.2 · Nothing runs the two services against each other

`tests/e2e/` in the backend contains only `__init__.py`. The frontend's Playwright specs cover layout geometry, not journeys.

**The highest-value thing you could build is a functional suite that runs the real frontend against the real backend** — signup → verify → sign in → commit an analysis → hold appears → resolve → ledger row → wallet reflects it. Every bug listed in §3 would have been caught by the first ten minutes of that suite and by nothing else we have.

Note `AI__BASE_URL` will not resolve, so the two spending calls answer `503`. That is the designed degradation and it is itself worth asserting.

### 5.3 · Money paths that only exist on one side

- **Hold reconciliation is knowingly incomplete.** A browser closed mid-run never resolves its hold. Confirm the money is *held*, not *lost*, and that a subsequent commit for the same analysis is idempotent rather than double-charging.
- **The Stripe webhook** verifies the signature before parsing, constant-time, 300s tolerance. Test a replayed webhook, a wrong-secret webhook, and one signed with an *empty* key — that last one is the actual attack, and an earlier version of that test signed with the real secret and so could never fail.
- **RLS.** Every table is `ENABLE` + `FORCE`. `tests/integration/test_tenant_isolation.py` exists; check it covers the two new reservation routes.

### 5.4 · The coming-soon state

Notifications, preferences and two-factor ship visible and `disabled` (Phase 1.5, built after handover). Verify **nothing inside those cards is operable** — the previous state was a toggle that looked live and did nothing, which reads as a bug in something that was never built.

### 5.5 · Things I flagged and did not fix

- `WorkingPane` pagination is hidden behind `PaneSwitcher`
- `SignOutCard` centres only at 1440×900
- White-on-accent is 3.93:1 — passes AA only for large or bold text. On the ESLint ratchet; **the list may shrink and may never grow**
- A memory recorded offline is not retried, and the next sync removes it locally because the server wins. Needs an outbox
- `npm run gate` does not include Playwright, though CI runs it as a separate job

## 6 · Lane split — read before editing

The dev session is still hunting in **application code and its unit tests.** To avoid collisions:

**Yours.** `apps/web/e2e/**`, `tests/e2e/**` in the backend, any new functional or integration suite, `apps/web/src/test/**`, and the audit in §5.1. New files anywhere are yours by default.

**Not yours without saying so.** Any `src/**` application file, and the unit tests listed in §4 — the dev session may be mid-edit in them. If a fix belongs in application code, **write the failing test and report it** rather than fixing it; that is the handover convention from `TEST-HANDOVER-2026-08-20.md` and it worked (12 of 16 findings closed during that session).

Pull frequently. Both sessions are on `main`.

## 7 · Output

Follow the existing convention:

- `TEST-REPORT-2026-08-25.md` — the chronological working log, including **how each finding was reached**. Wrong turns are worth recording; the reasoning is the asset.
- `TEST-HANDOVER-2026-08-25.md` — the actionable summary: findings ordered by what to fix first, each with file, line, severity, and the failing test that demonstrates it.

Both on Drive, in `docs/app-handoff/`.

**A finding without a failing test is an opinion.** Write the test first, then report it.

## 8 · The standard to hold

Three habits came out of the last two days and they are now enforced by tests rather than intention. Hold them, and check that the code does:

1. **A cast is not a conversion.** Anywhere a response body crosses into a typed shape there is a mapping function, or there is a lie that compiles.
2. **A fixture is never a prop default.** It is reachable only when a caller explicitly asks for it.
3. **Empty is empty, and unknown is unknown.** `$0.00` on a wallet that failed to load is a confident wrong answer, not a safe default.
