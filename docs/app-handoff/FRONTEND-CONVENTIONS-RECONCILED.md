# Frontend conventions — reconciled and locked

**Source:** `FRONTEND-STRUCTURE.md` (895 lines, from the tech team).
**Read against:** the Python service as built (`services/api`), `DESIGN-INPUTS-RESPONSE.md` §4 (the responsive model), and Joy's ruling on the proxy split.
**Date:** 2026-08-21. **Status: locked.** Everything below is a decision, not a proposal.

---

## Verdict at a glance

| | Items | |
|---|---:|---|
| **Accepted as written** | the remainder | Adopted verbatim, enumerated in Part 3. No further discussion. |
| **Accepted with a stated change** | 9 | The convention holds; a detail changes because of something the author did not have. |
| **Superseded** | 3 | A later decision (proxy split, responsive model) overrides. Named below with the reason. |
| **Deferred with a date** | 2 | Correct, but sequenced after the responsive rebuild. |
| **Rejected** | 0 | |

Nothing in this document waits on anyone. After it, the open list is **the four items** at the end.

---

## Part 1 — The three things that are superseded

These are the only genuine conflicts. Each one is a case where `FRONTEND-STRUCTURE.md` is internally correct but was written before a decision it did not know about.

### S1. The money path — §2 and §4 of the API catalog

**As written.** The browser calls `POST /wallet/reservations {analysis_id, depth}`, then calls the AI directly with MCP `trigger_generation`, then calls `POST /wallet/reservations/:id/settle` or `/release`.

**Superseded by:** Joy, 2026-08-20 — *"agreed on the split - build it that way and continue."*

**Why it had to change.** Those are three separate calls from a client we do not control, and nothing binds them. A token holder can skip the first and still make the second. That is not a hypothetical: it is what the previous build did, which is why a reservation was a suggestion rather than a control. No amount of frontend convention fixes it, because the enforcement point is on the wrong side of the network.

**The rule now, and it is one line:** *does it spend money?* If yes it goes through our service. If no it goes direct.

| Old | New |
|---|---|
| `POST {backend}/wallet/reservations` then MCP `trigger_generation` | **`POST {api}/analyses/generate`** — reserves and triggers in one transaction, server side |
| MCP `generate_output` | **`POST {api}/analyses/outputs`** |
| `POST {backend}/wallet/reservations/:id/settle` \| `/release` | **Gone from the browser.** The service resolves its own holds |
| `propose_layout`, `retrieve_analysis`, `propose_visuals`, `presigned_upload_url`, all three SSE streams, the WebSocket | **Unchanged — still direct to `VITE_MCP_ENDPOINT` / `VITE_REALTIME_ORIGIN`** |

**Consequences that land on the frontend, all of them:**

1. `client.wallet.reserve` and `client.wallet.resolveReservation` are **removed from the `CasprClient` seam.** They are not deprecated, not left returning 501 — removed, because a seam that still offers them is an invitation to call them.
2. `client.analysis.triggerGeneration` and `client.analysis.generateOutput` keep their names and signatures and change origin only: `mcpEndpoint` → `apiBase`. Screens do not change.
3. The `402 → InsufficientBalanceError, retry: false` rule from the TanStack Query section still applies, but attaches to **`useTriggerGeneration`**, not to a reserve mutation that no longer exists.
4. The "New analysis" flow in *Typical flows* becomes: `propose_layout` → SSE `/stream/layout` → `POST /analyses/:id/turns` → **`POST /analyses/generate`** → SSE `/stream/sources` + WS `/realtime` → `retrieve_analysis`. The settle/release step leaves the client entirely.
5. `AnalysisSession.commit` collapses from two awaits to one. The failure branch that released a hold from the browser is deleted — the service releases and **commits the release before the error propagates**, so the attempt is on the ledger either way.

**What this does not yet close, stated plainly:** the hole shuts completely only when Jayant's service *requires* our authorisation on those two tools. Until then a determined caller with a valid JWT can still reach his endpoint directly. Ours is the only path the app uses, and the only path that moves money — that is as far as our code can take it. It is item 4 of what his team eventually owes us, and it is not blocking anything today.

---

### S2. The `/api/v1` prefix — the whole API catalog

**As written.** `POST {VITE_BACKEND_ORIGIN}/auth/signup`, `GET {VITE_BACKEND_ORIGIN}/wallet`, and so on. No version segment.

**Superseded by:** the service as built. Every route is under `/api/v1`.

**Which one moves, and why the backend does not.** An unversioned public API is a promise you cannot keep — the first breaking change has nowhere to go, and the migration of the existing 1,500 users is exactly the moment that bites. The version segment stays.

**The fix, already applied:** `config/env.ts` gains one derived field.

```ts
backendOrigin: import.meta.env.VITE_BACKEND_ORIGIN ?? 'http://localhost:8787',
/** Every product REST call goes here. The origin stays an origin — a base URL
 *  with a path in it breaks the moment something needs the bare host. */
apiBase: `${backendOrigin}/api/v1`,
```

`VITE_BACKEND_ORIGIN` keeps its name and stays a bare origin, because it is the variable that goes into the deploy config and gets read by people who did not read this document. Every call site in `realClient.ts` uses `config.apiBase`. The source map's `Area: Config` row is unchanged.

---

### S3. Compact/full component pairs — *What not to do*, item 5

**As written.** *"Do not delete compact/full reader pairs to 'DRY' them if Figma still specifies different panes. Split folders; do not merge pixels."*

**Superseded by:** `DESIGN-INPUTS-RESPONSE.md` §4 — *"Container queries on components, not viewport queries. A row or card responds to its container, so one component serves a 390 pane and an 800 centre. This is the root fix for §3 — it removes the reason a separate scaled mobile card existed at all."*

**Why the ruling flips.** The instruction is conditional — *"if Figma still specifies different panes"* — and the condition is being removed at source. The design session is converting frames to Auto Layout with fill/hug intent per region, which means one component at both widths. Merging the pairs is then not DRY-for-its-own-sake; it is deleting a duplicate that no longer has a reason to exist. Keeping them would re-encode a viewport assumption we just spent a rebuild removing.

**The gate, so this cannot be used as licence to merge everything:** a pair collapses **only** when the Figma frame for that specific component has been converted and shows one component at 390 and 800. Until then the pair stays and lives in the split folders exactly as the document says. The list to watch is `EditPane`/`CompactEditPanes`, `LiveReportDocument`/`CompactDocuments`/`MobileReportDocument` — roughly 700 lines of parallel edit UI.

Everything else in *What not to do* is accepted unchanged, including the two that matter most: **no full Feature-Sliced Design**, and **no global `hooks/` / `utils/` / `services/` / `constants/`.**

---

## Part 2 — The nine accepted-with-a-change items

### C1. Problem #2 — coming-soon screens are not fixtures

Problem #2's rule is right and is adopted: *"a production path with a live client must never paint Joy Chen or sample PDFs because the list was empty."* The `if (library.items.length === 0) return GROUPS` pattern is a bug in three screens and goes.

But #2's table lists `InsightsPage` (`KPIS` with `XX` / `YY%`) alongside the real offenders, marked "intentional coming-soon". Applied literally, the cleanup deletes designed product.

**Joy, 2026-08-21:** *"the idea of having the coming soon screens mocked up is to generate curiosity — they show the user the future value they will get. They should be implemented as designed. Not skipped."*

**The distinction that separates them, and it is not a judgement call:** a fixture is *data the screen would have fetched*. Coming-soon content is *copy the screen will never fetch*, because the feature does not exist. One is a stand-in for a live call; the other has no live call behind it.

So: coming-soon content stays, and moves out of the page into a named content module in its own feature (`features/insights/comingSoon.ts`), never reached through a client call, never a fallback for an empty response. Same treatment for the Updates surface and the Intelligence depth preview. Any screen that *does* have a live call behind it gets the empty state, and the empty state is empty.

### C2. Problem #9 — `/report/edge-prompt` moves with the rest

The ~40 review URLs go behind `import.meta.env.DEV` in `app/router.dev.tsx`. Accepted as written, including that `/data-room/uploading` with its inline fixture array is the worst instance.

One addition the author did not have: **`/report/edge-prompt` is mine**, added for the design session to review long-prompt overflow. It is a review state, so it goes to `router.dev.tsx` with everything else. The URL survives in development and disappears from production — the design session loses nothing, and should know the route is DEV-only from here.

### C3. TanStack Query — the two struck rows

The Query section is adopted whole: the stack diagram, `queryKeys.ts` as the single factory, the defaults block, `queryClient.clear()` on logout, `enabled: !!session`, streams staying out, no Devtools in production, tests wrapping with `retry: false`.

Two rows of *What goes in Query* are struck by S1: `wallet.reserve` and `wallet.resolveReservation`. They are not mutations any more; they are not anything.

One row is added: **`wallet.listActivity` → `useQuery`, `queryKeys.wallet.activity()`.** It is already built and live — `GET /api/v1/wallet/activity`, bounded page size, `limit` ≤ 100, newest first. The document lists it under "dummy APIs to add"; it exists for real.

Invalidation after `analysis_complete` still fires `queryKeys.wallet.all` — the settle now happens server side, but the balance the browser is holding is still stale, so the refetch is still needed.

### C4. `wallet.startTopUp` — the dummy stops rejecting, but stays honest

Accepted: `{ checkoutUrl: '/dev/sandbox-pay' }` instead of a reject, so top-up is demoable offline. The dummy quality bar (happy path, real empty, one failure, latency) is adopted as written and this method is one of the two currently failing it.

The change: the **real** client's top-up is not built yet on the Python side, and will 501 until the Stripe webhook secret arrives. That is pending item 3, not a convention question. The seam ships now so the screen binds once and never changes.

### C5. `.env.example` — three lines corrected, not one

The document flags `VITE_REALTIME_ORIGIN=ws://localhost:8789` against a code default of `8788`. Correct, and fixed. Two more found while fixing it:

| Line | Was | Now | Why |
|---|---|---|---|
| `VITE_REALTIME_ORIGIN` | `ws://localhost:8789` | `ws://localhost:8788` | The AI service serves HTTP and WS on one origin |
| `VITE_USE_MOCKS` | `true` | `false` | Code defaults to false on purpose — a mock with no network, no latency and no failure is how a client passes every test and falls over on the first real call |
| `VITE_BACKEND_ORIGIN` comment | "Mock backend by default" | names the Python service | The TS mock backend is retired |

### C6. Source map — two rows are stale

| Row | Was | Now |
|---|---|---|
| Backend routes | `services/backend/src/app.ts` | **`services/api/src/app/*/router.py`** — Python, per Joy's ruling of 2026-08-20 |
| Wallet hook | `useWallet.ts` → replace with `useWalletSnapshot` | Unchanged, and now also `useWalletActivity` |

The TypeScript backend is not being maintained. Nothing new should be added to it.

### C7. Auth catalog — four rows are not built yet

The auth table is accepted exactly as specified. Four of its seven rows do not exist on the Python service yet, and none of them block the frontend conventions:

| Path | State |
|---|---|
| `/auth/signup`, `/auth/verify-email`, `/auth/session`, `/auth/refresh` | **Built and tested** — 20 integration tests, refresh-reuse revocation verified |
| `/auth/password-reset`, `/auth/password-reset/confirm` | Mine to build. Not pending on anyone |
| `/auth/oauth` | **Pending item 4** — needs the scope answer |
| `GET /me`, `GET /.well-known/jwks.json` | Mine to build. Not called by the SPA, so not on the critical path |

The document's note that *"locally there is no mailer: the backend prints the verify / reset link"* holds — `ConsoleMailer` does exactly that, and the SES adapter swaps in behind the same `Mailer` protocol.

### C8. The target tree — three adjustments

The tree is adopted. Three changes:

1. `shared/api/` — accepted as the new home of `data/`, and the rename happens in step 7 as sequenced, not earlier.
2. `features/analysis/upload/` — keep, but note the upload path is one of the **direct** calls (presigned URL from the AI tool, PUT to storage, then `POST /files` to index). File bytes never touch our service. That is unchanged by S1 and is worth stating because "upload" sounds like something a proxy would want.
3. `shared/ui/` gains `SearchField` and `FilterPill` as the document specifies — they are currently exported from `features/reader/OutputsPane.tsx` and imported by three unrelated screens, which is the clearest layer violation in the inventory.

### C9. Suggested order — resequenced against the responsive rebuild

The nine-step order is right and its warning is right: *"Do not start at step 5. Moving folders before dummy APIs and thin pages just relocates the mess."*

What the author did not have: **the frontend is being substantially rebuilt anyway**, against the fluid model in §10b — fixed 64 rail, 390 pane, content column clamped 560/800/800, buffers absorbing the remainder, one structural breakpoint at ~1180. That rebuild touches the same files as steps 3–6.

Doing them as separate passes means editing every screen twice. So:

| Step | Sequencing |
|---|---|
| 1. `@/` alias | **First, unchanged.** No file moves, and every later step is cheaper with it |
| 2. TanStack Query + dummy APIs | **Second, unchanged.** This is the step that kills the fixture fallbacks, and it is independent of layout |
| 3–6. Extract shared UI · thin the fat pages · split `reader/` · move auth and onboarding screens | **Merged into the responsive rebuild.** Each screen gets thinned and made fluid in the same pass, once |
| 7. `data/` → `shared/api` · delete dead assets · fix `.env.example` | `.env.example` **done now**; the rest after the rebuild lands |
| 8. Feature `index.ts` + `eslint-plugin-boundaries` | **Last, unchanged.** Boundaries are worth enforcing only once the boundaries are where they should be |
| 9. Split the 817-line icon barrel | After 1, as specified |

Steps 1 and 2 start immediately and are independent of the design session. That matters: it means frontend work is not blocked on the Figma conversion.

---

## Part 3 — Accepted as written

Recorded so that none of it is reopened. No changes, no conditions.

**Structure.** The `app` / `pages` / `features` / shared model stays; no Feature-Sliced Design rewrite. Tests stay colocated, never `__tests__/`. `AnalysisSession` stays above the router. `app/shell` chrome (Rail, BottomNav) stays put; only `Drawer` and `PeekSheet` move to `shared/ui`.

**Problem #1.** Pages are route adapters, 5–20 lines. The five god files (813 / 753 / 628 / 617 / 336) become `*Screen.tsx` in their features. `ComposePage` and `ToastsPage` are harnesses and leave the product router.

**Problem #3.** The seven sibling analysis features collocate under `features/analysis/`. `reader/` stays a sibling — it is the post-generation surface.

**Problem #4.** `reader/` splits into `document/ ask/ edit/ outputs/ legacy/`. `ExecutiveSummaryPage` and `ReportPage` are misnamed components, not routes.

**Problem #5.** `pages/onboarding/` splits three ways: auth screens to `features/auth/screens/`, first-run to `features/onboarding/`, shared chrome to whichever owns it. `GateTheaterPage` and `ComposePage` importing `MOCK_SOURCE_UNIVERSE` from `data/mockClient` is a layer leak — fixtures never come from the API client. `PasswordReset.test.tsx` gets renamed to what it actually tests.

**Problem #6.** Every listed inversion is real and gets fixed: feature → `app/shell`, feature test → page, page → page, page → `data/client` types. `app/providers.tsx` becomes the single bootstrap list, with `QueryClientProvider` outermost so query functions can `useClient()`.

**Problem #7.** `config/env.ts` → `shared/config`. `components/` stays small — Button, Toast, DockedInputBar, ScreenTitle — and does not grow. `selection/` → `shared/ui/selection`. Dead assets deleted: `assets/caspr-alpha/` (36 SVGs, zero imports), unused `nav`/`nav20`/`ui`/`selection` icon folders.

**Problem #8.** `@/` → `src/`. One `index.ts` per feature exporting only the public surface. **No** `features/index.ts` or `components/index.ts` — root barrels kill tree-shaking and create cycles. `eslint-plugin-boundaries` enforces it later.

**Problem #10.** `*Page` = route wrapper, `*Screen` = feature composition, `*Pane` = column. Applied everywhere, including inside `reader/`.

**Problem #11.** Page tests assert routing and chrome only. Screen tests move with the feature.

**Problem #12.** `chart/` nests under `reader/document/` unless Help or Insights take a dependency on it.

**Transport.** One seam, `CasprClient`. No axios. No second fetch wrapper. `EventSource` **forbidden** — a token in a query string is a token in every access log and every referrer header; SSE uses `fetch` + `Authorization`, and the WebSocket authenticates on the first frame. Bearer from `AuthContext` → `client.setTokenSource`; Query never sees the JWT. On 401 the transport refreshes **once**; a second 401 is a dead session, not a loop, and Query must not stack a second refresh loop on top.

**Streams.** `stream_reset` is an error, not an event to render. `output_ready` URLs are resolved against the MCP origin and `javascript:` / `data:` are refused. WS close `4401` means do not retry that token; other closes get bounded backoff, 6 attempts, 15s cap. Resume from the last numeric event id.

**Legacy.** The ez-caspr catalog is a different product. Nothing from it gets ported — not `/chat-stream?token=`, not `/ask-caspr/create-session`, not `/wallet/tiers`, not Razorpay or PayPal, and no browser-side AWS keys.

---

## Part 4 — What is now open

Nothing above waits on anyone. The complete open list is four items, and all four are things only Joy's counterparts can supply:

1. **A Postgres instance and its `DATABASE_URL`** — plus one `rds_superuser` run to apply the schema and create the login role. The migrations, the RLS policies and the two non-login roles are written and tested against real PostgreSQL 16; they need a database to be applied to.
2. **Where `new.caspr.ai/app` deploys, and how code gets there** — the target, and whether I push to it or hand off an artefact.
3. **The Stripe webhook pointed at the deployed URL, and that endpoint's signing secret** — top-ups cannot be verified without it, which is why C4 ships the seam and 501s the call.
4. **Scope: does the Google sign-in button need to work for testing?** — if yes, a client ID; if no, the button gets a disabled state and `/auth/oauth` waits.

Secrets go to AWS Secrets Manager or the task definition. Never into the repo, never into a ticket, never into this folder.
