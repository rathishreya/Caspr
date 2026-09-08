# Test report — 2026-08-25

The chronological working log. `TEST-HANDOVER-2026-08-25.md` is the actionable
summary; this file records **how each finding was reached**, including the turns
that went nowhere, because the reasoning is the part worth keeping.

**Session scope:** test only. Findings are reported, not fixed. Five new test
files were written (all new paths, per the §6 lane split); **no application file
was edited in either repository.**

Two rounds. Round 1 is the static and unit-level hunt (Parts 0–7). Round 2 built
the cross-service journey suite the brief's §5.2 asked for (Parts 8–11), and
includes the session's one real mistake in Part 8.

| | |
|---|---|
| Frontend | `caspr-ai/caspr-frontend` — baseline `c257989`, findings measured there |
| Backend | `caspr-ai/caspr-backend` — baseline `8f18fce`, green throughout |
| Findings | **8** — 2 High, 4 Medium, 2 Low |
| Failing tests written | 8, across 5 new files |
| Cross-service journey | **11 of 11 pass** — see Part 10 |

> **Read every round-1 result as measured against `0a642f0`.** The dev session
> was working in the same tree throughout and had, by the end of round 2, closed
> Findings 1, 2, 3, 5, 6 and both halves of 0 in uncommitted changes. Part 11
> records what was verified closed and what was not.

---

## Part 0 · Baseline, before hunting anything

The brief says `npm run gate` is the deploy gate. The first thing worth knowing
is whether it passes. It does not, and it has not for some time.

### `npm run lint` — 3 errors, 128 warnings

```
apps/web/playwright.config.ts:29:14  caspr/no-hardcoded-origin  "http://localhost:5173"
apps/web/playwright.config.ts:42:10  caspr/no-hardcoded-origin  "http://localhost:5173/"
apps/web/public/config.js:13:1       no-undef                   'window' is not defined
```

Two of the three are **my own rule's config being wrong**, from the 2026-08-20
session. `eslint.config.js:107` exempts `'e2e/**'`. Flat-config globs resolve
relative to the config file, which sits at the repo root — and the only e2e
directory is `apps/web/e2e`. So the pattern has never matched anything, and
`playwright.config.ts` was never exempt in the way `vite.config.ts` is.

`public/config.js` is a browser file that no `languageOptions` block covers; the
browser-globals block is scoped to `apps/web/**/*.{ts,tsx}` and this is `.js`.

The 128 warnings are the colour ratchet working as designed — pre-existing
files, warn not error. Not a finding.

### `npm run typecheck` — 6 errors

```
services/conformance/src/oracle.test.ts(10,8)  TS2307 Cannot find module '@caspr/backend'
services/reference-ai/src/e2e.test.ts(11,8)    TS2307 Cannot find module '@caspr/backend'
  (+ 4 consequent implicit-any errors in the same two files)
```

### `npm test` — 2 suites fail to load

```
FAIL services/conformance/src/oracle.test.ts  Cannot find package '@caspr/backend'
FAIL services/reference-ai/src/e2e.test.ts    Cannot find package '@caspr/backend'
```

`@caspr/backend` was deleted at `45c9ec0` ("Delete the retired TypeScript
backend") when the Python service moved out. Two files still import it. They are
still listed as devDependencies in `services/conformance/package.json` and
`services/reference-ai/package.json`.

**Why this is more than tidy-up.** Read what the two dead files are:

`services/conformance/src/oracle.test.ts` is the conformance suite's self-test.
Its own docstring:

> It also protects the suite itself. A check that is subtly wrong shows up here
> as a failure against a known-good implementation, rather than as a false
> accusation pointed at Jayant's team — which is the failure mode that would
> make them stop trusting the suite, and the suite is worthless the moment that
> happens.

The conformance suite is the instrument that will hold Jayant's team to the
contract. Its only guard against being wrong has not run since the repo split.

`services/reference-ai/src/e2e.test.ts` is the only test in the frontend repo
that crosses a real socket:

> Every other test in this package calls `app.request`, which never crosses a
> network — and a client that has only ever been tested that way has never
> exercised CORS, a real `Authorization` header, chunked SSE framing, or a
> WebSocket handshake.

§5.2 of the brief says "nothing runs the two services against each other." This
is *why*: the thing that did was silently killed by a dependency deletion, and
because it fails at import rather than at assertion, it reads as a build problem
rather than as lost coverage.

### Backend — green

`242 tests, exit 0, coverage 81.38%` against the 80% floor.

Two modules sit well below that line and both are new and both handle money or
personalisation: `wallet/service.py` **51%**, `profile/service.py` **66%**.
Noted, not itself a finding.

**Conclusion of Part 0:** the gate is red at three of its eight stages on `main`.
Whatever CI is currently doing, it is not blocking on this.

---

## Part 1 · §5.1 — the cast audit

The brief predicted this would yield, on the strength of the `$NaN` bug:
`res.json() as WalletSnapshot` where the server sends `spendable_cents`.

I enumerated every cast in `realClient.ts` (790 lines, 24 hits) and checked each
against the backend's Pydantic response model. **It did not yield, and the
reason is worth recording** — the negative result is load-bearing for how much
of this layer still needs attention.

| Cast cluster | Lines | Verdict |
|---|---|---|
| `as CasprUser` | 297, 373, 378, 410 | **Clean.** `auth/schemas.py::UserRead` matches `packages/contract/src/auth.ts::CasprUser` field for field |
| `as UserProfile` | 673, 683, 693, 709, 716 | **Clean.** `profile/schemas.py::ProfileRead` matches `client.ts::UserProfile`, including the nested `UserContext` and `StoredMemory`/`MemoryRead` |
| `{ documents: … }` / `{ files: … }` / `{ turns: … }` | 622, 639, 596 | **Key names clean** — `DocumentPage.documents`, `FilePage.files`, `TurnPage.turns` all match |
| `{ entries: LedgerEntry[] }` | 745 | **Clean.** `LedgerPage.entries` |

The reason these are safe where `WalletSnapshot` was not: `CasprUser` and
`UserProfile` are **deliberately wire-shaped** — snake_case in the TypeScript
type, so a cast and a conversion are the same thing. `WalletSnapshot` was
camelCase, which is what made its cast a lie. That distinction is the actual
rule, and it is more useful than "never cast": *a cast is safe exactly where the
type is written in the wire's own casing, and nowhere else.*

**But the audit found something the cast lens could not see.** Checking the page
envelopes meant reading `core/pagination.py`, and that is where Finding 2 came
from — the shapes agree, and the *contents* are truncated. See Part 2.

### The reverse direction: routes with no caller

The brief's §3 names "a route with no caller" as one of the four shapes to hunt.
I extracted all 35 backend routes and all 44 client call sites and diffed them.

Every path the client calls exists on the server. One route has no caller:
**`POST /wallet/resolve`**. That turned out to be Finding 1, and it is not dead
code — it is the fix for a live money bug, sitting unused. See Part 2.

---

## Part 2 · Finding 1 — a page reload strands the money

This is the one I would fix first, and it came from following the dead route
rather than from any screen.

`wallet/router.py:163` mounts `POST /wallet/resolve`. Its docstring is unusually
emphatic about why it exists:

> **This is what makes a reservation temporary.** Without it a hold is created
> at commit and never resolved, so a user who runs three analyses successfully
> has three amounts held against a balance they can no longer spend — the money
> is neither theirs nor ours, and the wallet slowly stops working.

And `wallet/service.py:237`, on why it is keyed the way it is:

> **Keyed on the analysis, not the reservation.** The client knows which
> analysis finished; requiring it to have kept a reservation id from a response
> twenty minutes earlier would mean **a page reload between commit and
> completion loses the money**.

The frontend does not call it. It resolves through the *other* route —
`POST /wallet/reservations/{id}/{settle|release}` — from
`AnalysisSession.tsx:318`, keyed on the reservation id.

**Which is the exact key the backend warns does not survive a reload.**

I checked whether it survives anyway. It does not:

- `state.reservationId` lives in a `useReducer`. In-memory.
- `resolved` is a `useRef`. In-memory.
- `AnalysisSession.tsx` persists nothing — no `localStorage`, no
  `sessionStorage`. Confirmed by grep; the file has no persistence at all.
- The resolve effect opens `if (!reservationId) return;` (line 309).

So after a reload the client has lost the reservation id **and** the analysis
id, while the run continues server-side and the hold stands. The analysis itself
survives — it is written to the library via `recordDocument` — so the analysis
id *is* recoverable, which is precisely the key `/wallet/resolve` takes.

There is no reconciler. The client's own comment at line 320 says "The backend
keeps the hold, so it is recoverable" — recoverable in principle, by nothing
that exists.

**Test:** `apps/web/src/features/generate/holdLifecycle.test.tsx` (new).

Two tests against a modelled wallet that reproduces the backend's real semantics
(idempotent per analysis, discharged only by naming the reservation):

1. *"is discharged when the run completes inside one mount"* — **passes.** This
   one matters: it proves the model and the driving are right, so the second
   test's failure is the product, not the harness.
2. *"is discharged when the page reloads between the commit and the completion"*
   — **fails:**

```
$80.00 is still held against analysis "an_1" after the run finished. The
reservation id was lost with the page, so no call the client can make will ever
discharge it: `resolveReservation` needs an id that no longer exists, and
`POST /wallet/resolve` — which is keyed on the analysis id precisely so it
survives a reload — has no caller. The money is neither the user's nor ours.
```

**A wrong turn worth recording.** My first read was that `/wallet/resolve` was
simply dead code — an unused endpoint, low severity, tidy it up. That was wrong
and the docstring is what corrected it. The route is not redundant with
`/reservations/{id}/{action}`; it is the *reload-safe* one of the pair, and the
client picked the other. Reading the two routes as "duplicates" would have
filed a Low where a High was.

---

## Part 3 · Finding 2 — every collection stops at twenty

Found while checking page-envelope key names for Part 1.

`core/pagination.py` gives every collection route `limit` (default **20**, max
100) and `offset`, via `PageDep`. Confirmed on all three library routes —
`list_documents`, `list_files`, `list_turns` all take `page: PageDep` and slice
by it.

The client requests none of them with a limit:

```
realClient.ts:622   walletGet('/documents')
realClient.ts:639   walletGet('/files')
realClient.ts:596   walletGet(`/analyses/${id}/turns`)
```

So the server applies its default and answers with twenty rows. The response
envelope carries **no `total` and no `next_offset`** — `DocumentPage` is
`{documents: [...]}` and nothing else — so no caller can distinguish a full
library from a truncated one. There is no "load more" in the UI.

Ranked by what it costs:

1. **`listFiles()` — a paid analysis silently ignores the user's data.**
   `AnalysisSession.tsx:185` builds the run's `file_ids` from exactly this call.
   A user with 21+ files in the Data Room commits an $80 Study that reads the
   first 20 and never mentions the rest. This is the one that damages trust in
   the output, which is the product's whole proposition.
2. **`listDocuments()`** — the library shows at most 20 analyses and looks
   complete.
3. **`listTurns()`** — the route serves **oldest-first**, so resuming a draft
   with 21+ turns recovers the *oldest* twenty and drops the most recent. The
   user resumes into a conversation missing what they said last.

Related, lower: `listActivity` does pass `limit = 50` — under the cap, so it
works, but the Activity list has no paging either and will truncate for an
active account.

**Test:** `apps/web/src/data/pagination.test.ts` (new). A fetch double that
pages exactly as FastAPI does — reads `?limit=`/`?offset=` off the URL, defaults
to 20. All three fail at 20 of 25. Modelled rather than mocked deliberately:
the truncation happens on the server, so a mock client that returns everything
it holds can never show it.

---

## Part 4 · §5.4 — the coming-soon state, and what was underneath it

The brief asked me to verify nothing inside the Phase 1.5 cards is operable.
**They are correctly locked.** `SettingsCard`'s `pending` prop genuinely
`disabled`s the link, action and toggle controls, and `CardButton disabled`
locks the footer commit. Notifications, Preferences and Two-factor all pass.

Checking *how* `pending` is implemented turned up two things it does not cover.

### One latent gap in the component

`SettingsCard.tsx:122` — the `plain` + `danger` row renders its whole row as a
`<button>` and is the **only control that does not take `disabled={pending}`**.
No current caller pairs a danger row with `pending`, so nothing is broken today.
It is a trap for the next person who adds one, on the row kind reserved for
account deletion.

### Two live gaps on the compact half — Finding 3

`AccountPage` draws both halves into the DOM and lets CSS hide one
(`data-half="compact"` + `shell:hidden`). The 2026-08-25 rewiring was applied to
the desktop half. The compact half renders the same components with the props
left off:

| | Desktop | Compact |
|---|---|---|
| Password form | `AccountPage.tsx:672–700` — `value`, `onChange`, `autoComplete`, `disabled`, and a commit button | `:794–810` — three bare `CardField`s. No `value`, no `onChange`, **no submit control at all** |
| Delete account | `:721` — `onRow={(id) => id === 'delete' && setOpenModal(id)}` | `:812` — `<SettingsCard rows={DEVICES} />`, no `onRow`. The button fires into `undefined` |

The password one is the same defect `CardField`'s own docstring records as
fixed:

> **Controlled, since 2026-08-25.** It had no `value`, no `onChange` and no
> `name`, so nothing could read what was typed into it — the password form was
> three inputs and a button, and every one of them was scenery.

It is still scenery on a phone. And Delete account is the control the GDPR
obligation rests on.

**Why no existing test caught it:** every current assertion resolves against
whichever half answers first, and that is the desktop one. Nothing scopes to
`[data-half="compact"]`. This is the same shape as the `ToastProvider` lesson
from 2026-08-20 — *the harness was in a configuration the app never has*, except
inverted: here the harness is in a configuration the app has half the time, and
the query silently picks the working half.

**Test:** `apps/web/src/pages/AccountPage.compact.test.tsx` (new). Scopes every
query to the compact subtree with `within()`. Both fail.

---

## Part 5 · What I checked and found correct

Recording these so nobody spends the time twice.

**The Stripe webhook (§5.3) is properly covered — including the case the brief
warned about.** `test_a_deployment_with_no_webhook_secret_credits_nothing`
signs with the **empty key**, not the real secret, and its docstring records the
earlier flawed version that "signed with the real secret, which fails against an
empty-key HMAC anyway, so deleting the guard broke nothing." Fourteen webhook
and top-up tests: unsigned, wrong secret, tampered body, replayed, duplicate
delivery, unpaid session, irrelevant event, unconfigured deployment.

**RLS covers the new reservation routes (§5.3).**
`test_tenant_isolation.py` has 9 tests including `FORCE` on every table, the
request role being unable to reach the auth tables, and identity not surviving
the transaction. Cross-tenant refusal is covered specifically on both new
surfaces: `test_reservations.py::test_another_account_cannot_resolve_your_hold`
and `test_resolve.py::test_one_account_cannot_resolve_the_hold_of_another`.

**Hold idempotency is right on the server (§5.3).** `reserve` is idempotent per
analysis by database constraint; `resolve_for_analysis` is idempotent and
*refuses a contradictory* second call. A re-commit for the same analysis will
not double-charge. The gap is Finding 1 — not the semantics, the caller.

**Last session's P1 is closed, and closed well.** `WorkingPage.tsx:264` now
reads `wallet?.spendableCents ?? null`, and `features/wallet/editCredits.ts:88`
carries the reasoning — "`unknown` neither blocks nor promises". A sweep for
money defaulted to zero across `apps/web/src` found no remaining live instance.

---

## Part 6 · Finding 5 — a test that only runs under npm

`src/features/chart/lazy.bundle.test.ts` passes under `npm test` and fails under
`npx vitest run --root apps/web`:

```
Error: spawnSync npm ENOENT
  ❯ ensureBuilt src/features/chart/lazy.bundle.test.ts:35
```

`execFileSync('npm', …)` without `shell: true` cannot resolve `npm.cmd` on
Windows outside an npm lifecycle script. Low severity — CI runs via `npm test`
on Linux and is unaffected — but running one file directly is the documented way
to work here (`transport.integration.test.ts`'s own docstring says so), and this
produces a failure that looks like a real one.

---

## Part 7 · Not done, and why

Stated plainly so the gaps are not mistaken for clean results.

- **§5.2, the functional suite across both services — not built.** This is the
  brief's highest-value item and I did not get to it. What I did instead was
  establish *why* it is missing (Part 0: the one test that crossed the wire was
  killed by the repo split) and clear the four highest-yield static targets. The
  suite is still the right next piece of work, and Finding 4 is a prerequisite —
  reviving `oracle.test.ts` against the Python backend is most of the harness it
  would need.
- **Nothing was run against a live stack.** No servers were started this
  session; every finding is from source, unit-level tests, or the two repos'
  own suites. Finding 1 and Finding 2 are both reproducible in a browser and
  worth confirming there once the deploy lands.
- **Not started at all:** axe/accessibility, the browser matrix (nothing beyond
  Chromium has ever run), Lighthouse budgets, k6 load to 500 concurrent,
  Semgrep/gitleaks in CI, the Phase 4 migration rehearsal, anything against
  Jayant's real service.
- **`AI__BASE_URL` 503 degradation (§5.2) — not asserted.** Requires the stack
  running.
- **The §5.5 flagged-not-fixed list** (WorkingPane pagination, SignOutCard
  centring, the white-on-accent ratchet, the offline-memory outbox) was not
  re-examined. All still open as far as this session knows.

---

# Round 2 — the cross-service journey

Round 1 ended with §5.2 undone: *"nothing runs the two services against each
other."* This round built it. It is the most valuable thing produced today, and
it also produced the session's one real mistake, recorded here in full.

## Part 8 · The mistake: a real email through production SES

**What happened.** To run the frontend client against the real API I wrote
`tests/e2e/serve_for_journey.py`, which starts a throwaway PostgreSQL via
`pgserver`, points `DB__DSN` at it, and serves the app. That worked. What I did
not check first was `core/settings.py:128`:

```python
model_config = SettingsConfigDict(env_file=".env", ...)
```

`env_file` resolves against the **working directory**. The launcher ran from the
repo root. `os.environ` outranks `env_file`, so every key I set explicitly was
mine — and every key I did not think to set fell through to the repository's
real `.env`. That included `MAIL__ACCESS_KEY_ID` and `MAIL__SECRET_ACCESS_KEY`.

A single signup probe therefore went through the real `SesMailer`. `ses.py:89`
logs `mail_sent` only after `send_email` returns without raising, and the log
line is there:

```json
{"subject": "Confirm your address", "to_domain": "example.com",
 "event": "mail_sent", "logger": "app.adapters.ses", ...}
```

**Blast radius, established rather than assumed:**

| | |
|---|---|
| Emails actually dispatched | **1 confirmed** to `probe2@example.com`; a probable second to `probe@example.com` on an earlier run whose log was not captured |
| Consequence | `example.com` is IANA-reserved and has no MX record, so these **bounce**, and bounce rate counts against the SES sending reputation |
| Production database | **Not touched.** `os.environ` outranks `env_file`, and the alembic log shows a fresh `0001 → 0004` schema built on the throwaway instance |
| Stripe | Never called — no top-up was attempted |

**Why it is worth recording rather than quietly fixing.** The asymmetry is the
lesson: the database was safe *because I overrode it*, and the mailer was unsafe
*because I did not think to*. A guard that protects only the thing you were
already thinking about is not a guard. The launcher now has three, and its
docstring says not to remove any of them:

1. `chdir` out of the repo before settings load, so `.env` is not found;
2. `os.environ.pop` every credential group — **`pop`, not `= ""`**, for the
   reason that became Finding 8;
3. assert `settings.mail.configured is False` and refuse to start otherwise.

Defence 3 is not decoration. It fired on the first run after I added it, because
defence 2 was initially written as `= ""` and that does not work.

## Part 9 · Finding 8 — an empty secret reads as a configured one

Found by defence 2 failing. `MailSettings.configured` is:

```python
return self.access_key_id is not None and self.secret_access_key is not None
```

An empty string parses to `SecretStr("")`, which is not `None`. Demonstrated
directly:

```
absent       -> mail.configured = False
empty string -> mail.configured = True   access_key_id = SecretStr('')
```

So a deployment supplying `MAIL__ACCESS_KEY_ID: ""` gets `SesMailer` holding
empty AWS credentials. Every verification email then fails inside boto3 and
**signup answers 500**, instead of falling back to the console path that exists
precisely for this case. The settings docstring claims *"False means links are
printed, never sent — and it says so loudly"*; that property does not hold for
the empty string.

**Why it matters this week.** Blanking an optional value is how Helm and
Kubernetes Secrets express "we do not have one of these yet", and the EKS deploy
is waiting on five values from Jayant's team. This is the most likely single way
it gets deployed wrong, and the symptom — signup 500s — looks like an
application bug rather than a config one.

Stripe gets the same class of thing right, but at a different layer:
`StripeGateway` checks for an empty webhook secret at *verification* time.
Mail has no equivalent, and `configured` is the only gate in front of it.

**Test:** `tests/e2e/test_deployment_config.py` (new, backend). Four tests.
Absent and half-configured pass today and are pinned, because the obvious fix
is to test truthiness on one field and it is easy to lose the conjunction while
doing it. Empty-string and whitespace-only fail.

## Part 10 · The journey suite, and what it proved

`apps/web/src/data/backend.journey.test.ts` (new) drives the **real
`realClient.ts`** over **real HTTP** against the **real API** on a real
PostgreSQL. Eleven assertions across the money path:

signup → verify → sign in → wallet snapshot → price list → reserve → *reserve
again* → settle → ledger row → library round trip → profile envelope.

**Result: 11 of 11 pass.** That is a genuinely good outcome and worth stating
plainly — the seam that produced `$NaN`, a 404 gate and the pagination
truncation is, on the money path, correct today. Specifically confirmed against
a live server rather than a mock:

- every field of `WalletSnapshot` arrives as a finite number, asserted
  arithmetically rather than by type;
- `reserve` for an analysis that already has a hold **returns the same
  reservation and moves no money** — the double-charge case, proven rather than
  reasoned about;
- settling reduces `reservedCents` by the price and leaves `spendableCents`
  untouched, so the hold is not counted twice;
- the settle leaves a negative-signed ledger row the Activity list can render.

**One wrong turn, and it is instructive.** The ledger assertion initially failed
on `settle.amountCents` being `undefined`, which looks exactly like the `$NaN`
bug. It was my error: `LedgerEntry` is *deliberately* the wire shape —
`amount_cents` — while `WalletSnapshot` and `PricingPlan` are camelCase and go
through real mappers. Three types in one file, two conventions. The suite caught
my mistake rather than a product defect, which is the right behaviour, but the
mixed convention inside `client.ts` is itself the soil the `$NaN` class grows in.

## Part 11 · Findings 1–3 confirmed, then closed while the session ran

Extending the journey suite to prove Finding 2 against the real server produced
a surprise: it **passed**, returning all 25 files where the model predicted 20.

Two possibilities: my finding was wrong, or the code had changed. I checked
rather than assumed, with a raw request against a fresh user:

```
GET /files            -> 20 rows
GET /files?limit=100  -> 25 rows
```

The server truncates exactly as reported. The finding was right. What had
changed was the working tree: `git status` showed the dev session **actively
editing, uncommitted**, with a new `pageAll()` helper in `realClient.ts` and a
comment quoting this handover's own wording back.

Re-running all three round-1 suites against their in-flight work:

```
Test Files  3 passed (3)
     Tests  7 passed (7)
```

**All seven failing tests now pass.** Findings 1, 2, 3, 5, 6 and both halves of
Finding 0 are being closed as this was written — the working tree also carries
edits to `eslint.config.js`, `SettingsCard.tsx`, `AnalysisSession.tsx`, the two
`services/*` package manifests, and two new files of their own
(`inFlight.ts`, `dualHalfParity.test.tsx`).

**Read every round-1 result as measured against `0a642f0`, not against the
current working tree.** The fixes are real but uncommitted at the time of
writing, and none of them has been through the gate.
