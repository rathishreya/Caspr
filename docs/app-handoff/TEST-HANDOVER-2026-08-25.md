# Test handover — 2026-08-25

For the dev session. Findings ordered by what to fix first. Working log with the
reasoning behind each is in `TEST-REPORT-2026-08-25.md`.

**Convention, unchanged:** the test session finds and reports; the dev session
fixes. Every finding below has a failing test committed alongside it. **No
application file was edited this session, in either repository.**

| | |
|---|---|
| Frontend baseline | `caspr-ai/caspr-frontend` @ `c257989` |
| Backend baseline | `caspr-ai/caspr-backend` @ `8f18fce` — **green**, 242 tests, 81.38% |
| Findings | **8** — 2 High, 4 Medium, 2 Low |
| New test files | 5, all new paths (§6 lane split respected) |
| Failing tests | 8 |
| Commits | frontend `0a642f0`, `27bc942` · backend `544761b`, `0191af4` |

## Status at the time of writing — read this first

**Most of §0–§3 and §5–§6 below were already being fixed as this was written.**
The dev session was working in the same tree; by the end of the session
`git status` showed uncommitted changes to `realClient.ts` (a new `pageAll()`
helper), `AnalysisSession.tsx` (plus a new `inFlight.ts`), `AccountPage.tsx`
(plus a new `dualHalfParity.test.tsx`), `SettingsCard.tsx`, `eslint.config.js`,
`lazy.bundle.test.ts`, and both `services/*` manifests.

Re-running all three round-1 suites against that work: **7 of 7 now pass.**

So treat §1, §2, §3, §5, §6 and §0a/§0c as *verify, do not re-fix* — confirm the
change is committed and the gate is green. **§4, §7 and §8 are still open**, and
§8 is new and time-critical.

**Two things are genuinely outstanding and neither is in the list above:**

- **§8 — an empty mail secret reads as configured.** New this round, found while
  building the journey harness, and it will bite the EKS deploy specifically.
- **§4 — the two dead cross-wire tests.** The manifests were touched but the
  substantive question (revive against the Python backend, or skip) is a
  decision, not an edit.

## What is new and worth having: the journey suite

`apps/web/src/data/backend.journey.test.ts` + `tests/e2e/serve_for_journey.py`
(backend) run the **real client against the real API over real HTTP** — the join
§5.2 said nothing covered. **11 of 11 pass**, which is good news worth stating:
the seam that produced `$NaN`, a 404 gate and the pagination truncation is
correct today on the money path, including the double-charge case.

```bash
uv run python tests/e2e/serve_for_journey.py --port 8799 --mailbox /tmp/mbox.jsonl
```

```bash
CASPR_BACKEND_ORIGIN=http://127.0.0.1:8799 CASPR_JOURNEY_MAILBOX=/tmp/mbox.jsonl npx vitest run --root apps/web src/data/backend.journey.test.ts
```

**Read the launcher's docstring before pointing it anywhere shared.** It is
worth thirty seconds: `Settings` declares `env_file=".env"` resolved against the
working directory, so a process started from the repo root inherits production
SES and an ordinary signup probe sends real email. That happened to me once
during this session — one message to an `example.com` address, which bounces and
counts against the sending reputation. The launcher now carries three guards
against it and the third one fired for real. The production database was never
touched.

---

## 0 · Before anything else: the gate is red on `main`

`npm run gate` fails at three of its eight stages. It has been failing since
before this brief was written, which means nothing is currently blocking on it.

**This is the first thing to fix, because every finding below is invisible until
the gate is green enough to notice a new failure.**

| Stage | Failure |
|---|---|
| `lint` | 3 errors (below) |
| `typecheck` | 6 errors — 2 root causes |
| `test` | 2 suites fail to load — same root cause |

### 0a · Lint — `apps/web/playwright.config.ts:29` and `:42`

`caspr/no-hardcoded-origin` on `http://localhost:5173`.

**My bug, from 2026-08-20.** `eslint.config.js:107` exempts `'e2e/**'`. Flat
config resolves globs relative to the config file at the repo root, and the only
e2e directory is `apps/web/e2e` — so the pattern has never matched anything.

Fix: `'e2e/**'` → `'**/e2e/**'`, and add `'**/playwright.config.ts'` to the same
`ignores` list, next to `'**/vite.config.ts'`. It is build config on the same
footing.

### 0b · Lint — `apps/web/public/config.js:13`

`no-undef: 'window' is not defined`. The browser-globals block is scoped to
`apps/web/**/*.{ts,tsx}` and this is `.js`. Widen that block's `files`, or add a
small block for `apps/web/public/*.js`.

### 0c · Typecheck + test — `@caspr/backend` no longer exists

Deleted at `45c9ec0`. Two files still import it, fail at import, and therefore
never run:

- `services/conformance/src/oracle.test.ts`
- `services/reference-ai/src/e2e.test.ts`

Also still listed as a devDependency in both `services/conformance/package.json`
and `services/reference-ai/package.json`.

**Do not just delete these.** See Finding 4 — they are the two most valuable
tests in the repo and they need reviving against the Python backend, not
removing. If reviving is not happening this week, `describe.skip` them with a
comment naming this handover, so the gate goes green *and* the loss stays
visible. Deleting them makes the gap permanent and silent.

---

## 1 · HIGH — A page reload permanently strands the wallet hold

**Where:** `apps/web/src/features/generate/AnalysisSession.tsx:309–322`
**Test:** `apps/web/src/features/generate/holdLifecycle.test.tsx` — 1 of 2 fails

A user commits an $80 Study, reloads the page (or the tab crashes, or they
navigate away) while it runs. The hold is never discharged. Their spendable
balance drops by $80 and nothing that exists can give it back.

The client resolves holds through `POST /wallet/reservations/{id}/{settle|release}`,
keyed on the reservation id. That id lives in a `useReducer` and
`AnalysisSession.tsx` persists nothing — no `localStorage`, no `sessionStorage`.
The resolve effect opens `if (!reservationId) return;`.

**The fix already exists and is unused.** `POST /wallet/resolve`
(`wallet/router.py:163`) takes the **analysis id**, is idempotent, and refuses a
contradictory second call. `wallet/service.py:237` says why it is keyed that way:

> **Keyed on the analysis, not the reservation.** […] requiring it to have kept
> a reservation id from a response twenty minutes earlier would mean **a page
> reload between commit and completion loses the money**.

Nothing in the frontend calls it. `realClient.ts` has no method for it.

**Suggested fix:** add `wallet.resolveForAnalysis(analysisId, outcome)` to the
client, and call it — the analysis id survives the reload in the library, so a
completed-or-failed analysis carrying an unresolved hold is recoverable on load.
Keep `resolveReservation` for the in-flight case; the two are complementary.

**Still open after that fix,** and worth a decision rather than a patch: a run
that never completes (user closes the tab, server finishes later) still needs a
server-side reconciler. The backend names this as a known limitation. It needs
Jayant's service to call us on completion or expose a pollable status, and
neither exists yet — this belongs on the ask list, not the fix list.

Failing assertion:

```
$80.00 is still held against analysis "an_1" after the run finished. The
reservation id was lost with the page, so no call the client can make will ever
discharge it.
```

> The sibling test — the same run completing inside one mount — **passes**. The
> harness is sound; the second case is the product.

---

## 2 · HIGH — Every collection silently stops at twenty rows

**Where:** `apps/web/src/data/realClient.ts:596`, `:622`, `:639`
**Test:** `apps/web/src/data/pagination.test.ts` — 3 of 3 fail

`core/pagination.py` gives every collection route `limit` (default **20**, max
100). The client passes a limit to none of the three library routes, so the
server applies its default. The response envelope has no `total` and no
`next_offset`, and there is no "load more" — so nothing, in code or on screen,
can tell a full library from a truncated one.

| Call | Cost |
|---|---|
| `listFiles()` | **Worst.** `AnalysisSession.tsx:185` builds the paid run's `file_ids` from this call. A user with 21+ files in the Data Room pays full price for an analysis that silently never reads the rest of their data |
| `listDocuments()` | The library shows at most 20 analyses and looks complete |
| `listTurns()` | Route serves **oldest-first**, so resuming a 21+ turn draft recovers the *oldest* twenty — the user resumes into a conversation missing what they said last |

**Suggested fix:** pass an explicit `limit` (the cap is 100) and page where a
collection can exceed it. `listFiles()` in the commit path should page to
exhaustion rather than take a page — it is deciding what the user paid for. If
paging the UI is out of scope now, at minimum add `total` to the page envelopes
so a truncated list can say so.

Related, not yet biting: `listActivity` does pass `limit = 50`, under the cap, so
it works — but the Activity list has no paging either.

---

## 3 · MEDIUM — Two controls are dead on the compact half of Account

**Where:** `apps/web/src/pages/AccountPage.tsx:794–810` and `:812`
**Test:** `apps/web/src/pages/AccountPage.compact.test.tsx` — 2 of 2 fail

`AccountPage` draws both halves into the DOM and hides one with CSS. The
2026-08-25 rewiring landed on the desktop half only.

| | Desktop | Compact |
|---|---|---|
| **Password change** | `:672–700` — `value`, `onChange`, `autoComplete`, `disabled`, commit button | `:794–810` — three bare `CardField`s. No `value`, no `onChange`, **no submit control at all**. A password cannot be changed on a phone |
| **Delete account** | `:721` — `onRow={(id) => id === 'delete' && setOpenModal(id)}` | `:812` — `<SettingsCard rows={DEVICES} />`, no `onRow`. The button fires into `undefined` |

The password one is the same defect `CardField`'s docstring records as fixed on
2026-08-25 — *"every one of them was scenery"*. It is still scenery on mobile.
Delete account is the control the GDPR obligation rests on.

**Why nothing caught it:** no existing test scopes to `[data-half="compact"]`,
so every query resolves against the desktop half. The new test uses `within()`
on that subtree. **Worth applying the same scoping to the other dual-half
screens** — this is unlikely to be the only pair that drifted.

---

## 4 · MEDIUM — The two tests that cross the wire have not run since the split

**Where:** `services/conformance/src/oracle.test.ts`,
`services/reference-ai/src/e2e.test.ts`
**Test:** they *are* the test. Both fail at import (see §0c).

Same root cause as §0c, listed separately because the fix is different: §0c is
"make the gate green", this is "get the coverage back".

`oracle.test.ts` is the conformance suite's self-test — the thing that stops the
suite making a false accusation at Jayant's team. Its docstring: *"the suite is
worthless the moment that happens."* It has not run since `45c9ec0`.

`e2e.test.ts` is the only test in the repo that crosses a real socket — CORS, a
real `Authorization` header, chunked SSE framing, a WebSocket handshake.

**This is the answer to §5.2 of the brief.** "Nothing runs the two services
against each other" is not an oversight; the thing that did was killed by a
dependency deletion, and because it fails at import it reads as a build error
rather than as lost coverage.

Reviving `oracle.test.ts` against the Python backend is most of the harness the
§5.2 functional suite would need. Recommend doing that first and building the
journey suite on top of it.

---

## 5 · LOW — `SettingsCard`'s danger row ignores `pending`

**Where:** `apps/web/src/features/account/SettingsCard.tsx:122`

The `plain` + `danger` row renders the whole row as a `<button>` and is the only
control in the component that does not take `disabled={pending}`. No caller
currently pairs a danger row with `pending`, so nothing is broken today — but
this is the row kind reserved for account deletion, and the gap is a trap for
whoever adds the next one.

One-line fix while the file is open.

---

## 6 · LOW — `lazy.bundle.test.ts` only runs under npm

**Where:** `apps/web/src/features/chart/lazy.bundle.test.ts:35`

`execFileSync('npm', …)` without `shell: true` throws `spawnSync npm ENOENT` on
Windows outside an npm lifecycle script. Passes under `npm test`, fails under
`npx vitest run --root apps/web`.

CI is unaffected (Linux, via `npm test`), but running a single file directly is
the documented way to work here, and this looks like a real failure when it is
not. Add `shell: true`.

---

## 8 · MEDIUM — An empty mail secret reads as a configured one · **NEW, and it targets the EKS deploy**

**Where:** `src/app/core/settings.py:94` (`MailSettings.configured`)
**Test:** `tests/e2e/test_deployment_config.py` (backend, new) — 2 of 4 fail

```python
return self.access_key_id is not None and self.secret_access_key is not None
```

An empty string parses to `SecretStr("")`, which is not `None`. Demonstrated:

```
absent       -> mail.configured = False
empty string -> mail.configured = True   access_key_id = SecretStr('')
```

A deployment supplying `MAIL__ACCESS_KEY_ID: ""` therefore gets `SesMailer`
holding empty AWS credentials. Every verification email fails inside boto3, so
**signup answers 500** rather than falling back to the console path that exists
for exactly this case. The settings docstring claims *"False means links are
printed, never sent — and it says so loudly"*; that is not true of the empty
string.

**Why now.** Blanking an optional value is how Helm and Kubernetes Secrets say
"we do not have one of these yet", and the deploy is waiting on five values from
Jayant's team. This is the single most likely way it gets misconfigured, and the
symptom looks like an application bug rather than a configuration one — which is
the expensive kind of wrong.

Stripe already handles its own empty webhook secret, but at *verification* time
inside `StripeGateway`. Mail has no equivalent check and `configured` is the only
gate in front of it.

**Suggested fix:** treat empty and whitespace-only as absent — a validator that
maps `""` to `None`, applied to every `SecretStr | None` field rather than to
mail alone. The test pins the half-configured case too, because the obvious fix
is to test truthiness on one field and it is easy to lose the conjunction.

---

## 9 · Two things the journey suite proved correct

Worth recording so they are not re-litigated. Both were reasoned about in round 1
and are now demonstrated against a live server:

- **`reserve` really is idempotent per analysis.** A repeated commit returns the
  same reservation id and moves no money. The double-charge case is closed by
  evidence, not by reading the constraint.
- **Settling does not double-count the hold.** `reservedCents` falls by the
  price and `spendableCents` is untouched, because spendable already excluded it.

## 10 · A note on `client.ts`, for whoever next adds a type there

Three response types in one file, two casing conventions:

| Type | Casing | Crosses by |
|---|---|---|
| `WalletSnapshot` | camelCase | `toWalletSnapshot` mapper |
| `PricingPlan` | camelCase | `toPricing` mapper |
| `LedgerEntry` | **snake_case** | direct cast, correctly |

All three are right — a cast is safe exactly where the type is written in the
wire's own casing. But the first draft of the journey suite asserted
`settle.amountCents`, failed on `undefined`, and looked precisely like the `$NaN`
bug until the type was read. If a convention is ever chosen for the file, that
class of confusion goes away; until then the mapper-or-not decision is load
bearing and worth a comment at each type.

---

## 7 · Checked and correct — do not spend time here again

- **Stripe webhook**, including the empty-key case the brief flagged.
  `test_a_deployment_with_no_webhook_secret_credits_nothing` signs with the
  empty key, and its docstring records the earlier version that signed with the
  real secret and could never fail. 14 webhook/top-up tests.
- **RLS on the two new reservation routes.** Covered by
  `test_reservations.py::test_another_account_cannot_resolve_your_hold` and
  `test_resolve.py::test_one_account_cannot_resolve_the_hold_of_another`, on top
  of 9 tests in `test_tenant_isolation.py`.
- **Hold idempotency on the server.** `reserve` is idempotent per analysis by
  database constraint; `resolve_for_analysis` is idempotent and refuses a
  *contradictory* second call. A re-commit will not double-charge.
- **The Phase 1.5 coming-soon cards are properly locked.** `pending` genuinely
  `disabled`s link, action and toggle controls; `CardButton disabled` locks the
  footer. Notifications, Preferences, Two-factor all pass. (Except §5 above.)
- **Last session's P1 is closed.** `WorkingPage.tsx:264` is
  `wallet?.spendableCents ?? null`, and a sweep found no remaining live instance
  of money defaulted to zero.
- **The §5.1 cast audit is complete and yielded nothing.** Every cast in
  `realClient.ts` was checked against the backend's Pydantic model.
  `CasprUser`/`UserRead` and `UserProfile`/`ProfileRead` match field for field,
  as do all four page envelopes. The rule that emerged: *a cast is safe exactly
  where the type is written in the wire's own casing.* `WalletSnapshot` was
  camelCase, which is what made its cast a lie; these are snake_case, which
  makes the cast and the conversion the same thing.

---

## 8 · Not tested — do not read the above as coverage

- **The §5.2 functional suite across both services was not built.** It remains
  the highest-value outstanding item. Finding 4 is its prerequisite.
- **Nothing was run against a live stack.** No servers started. Findings 1 and 2
  are both reproducible in a browser and worth confirming there once
  `new.caspr.ai/app` is up.
- **`AI__BASE_URL` 503 degradation** — not asserted; needs the stack running.
- **Never run:** axe/accessibility, any browser but Chromium, Lighthouse
  budgets, k6 load to 500 concurrent, Semgrep/gitleaks in CI, the Phase 4
  migration rehearsal, anything against Jayant's real service.
- **Backend coverage is 81.38% overall but `wallet/service.py` is 51% and
  `profile/service.py` is 66%** — the two newest modules, handling money and
  personalisation. Above the floor, below where those two specifically should
  be.
- **The §5.5 flagged-not-fixed list** (WorkingPane pagination, SignOutCard
  centring, the white-on-accent ratchet, the offline-memory outbox) was not
  re-examined and is all still open.

---

## 9 · Method note, for the next session

Findings 1 and 4 both came from **reading a docstring that explained why
something existed, then checking whether anything used it.** Neither is
reachable by looking at a screen, and neither would have been found by testing
what the code does — only by testing whether the thing the code was built for
ever happens.

The brief's four shapes — *a client method with no route, a route with no
caller, a type that disagrees with the wire, a prop default nothing overrides* —
are worth a fifth: **a mechanism whose author documented the failure it
prevents, wired to nothing.** Those docstrings are the most reliable bug
detector in this codebase, because they were written by someone who had already
thought the failure through.
