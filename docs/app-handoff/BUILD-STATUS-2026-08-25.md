# Build status — what is done, and what stands between here and `new.caspr.ai/app`

**2026-08-25.** Measured against the running code, not from memory. Supersedes `BUILD-STATUS-2026-08-24.md`, which was written before the frontend rebuild and describes a presentation layer that no longer exists.

---

## The one-paragraph answer

**Both repositories are feature-complete for launch and verified.** The backend is 40 routes, 242 tests, 81% coverage, `ruff` and `mypy --strict` clean, checked end to end against the production RDS instance. The frontend is 598 unit tests plus 41 layout tests running in real Chromium, with the positional-absolute count down from 836 across 73 files to 51 across 23.

**The work of the last two days was not layout — it was finding that six live screens were showing invented data**, including money, the user's own name, and analyses they had never run. All six are now wired to the server. One of those finds was not cosmetic: the memory system was writing to `localStorage` only, so the persona sent to the analysis engine on every run was composed from an empty table.

**Deployment is blocked on five values only Jayant's team can supply.** No code is waiting on us for it.

---

## 1 · What changed since the 24th

### The wallet was the last fixture on a live path — and wiring it found three real defects

`features/wallet/data.ts` held a $186 budget, a 31-day cycle, a `Sep 1` recharge, four ledger rows nobody had run and a `Visa •••• 4242` receipt for a payment nobody had made. It is deleted. On the way out:

| Found | Why no test caught it |
|---|---|
| **`getSnapshot` cast the response instead of converting it.** The server sends `spendable_cents`; the type declares `spendableCents`. Every field was `undefined`, and the app header renders the balance from it — so it read **`$NaN` on every screen** against the real API | The mock happened to be written in camelCase. `res.json() as WalletSnapshot` compiles cleanly; a cast is a claim, not a conversion |
| **`POST /wallet/reservations` did not exist.** `WalletService.reserve` was written, reviewed and covered — nothing was ever mounted in front of it, so the gate's commit (the only action that spends money) posted into a 404 | Ours tested the service object directly; theirs ran against a mock that answered. **A seam tested only from each side in isolation is a seam nobody has tested** |
| **A settled analysis rendered twice** — its hold above its charge, reading as being billed twice for one report | Nothing rendered the ledger against real rows until now |

Also fixed: 402 now carries `required_cents` and `spendable_cents`, so a client can offer a top-up for the right amount instead of saying "not enough" and leaving the user to work out by how much.

### The platform fee was computing $557.99

`60000 * 0.93` is `55799.999…` in binary; truncation took the last cent, so the Business plan's budget was a penny short of what the price list promises. It is integer basis points now. A test asserting the published figure is the only reason this is a footnote rather than a support ticket.

### The memory system was not connected to the memory system

`useProfile`, `useRemember` and `useForget` were written, typed and covered, and **no code path called any of them.** Every memory the engagement engine recorded went to `localStorage` and stopped.

The visible cost was a user losing everything Caspr had learned on a device change. The invisible cost is the one that matters: `app/profile/persona.py` composes the `user_persona` sent to the analysis engine out of `user_memories` rows nothing was writing. **Personalisation was not degraded — it was absent**, and no test on either side could have found it, because each side was correct on its own.

`profileSync.ts` joins them. Server wins on memories (a union would resurrect memories the user deleted elsewhere, and the ✕ is a promise); fatigue counters take the higher of the two (losing a count asks somebody a question they already ignored; over-counting only asks less often). `localStorage` stays as the read path, because the engine chooses what to offer *synchronously* and cannot await a promise inside that decision.

### Five more screens were showing invented data

The same pattern each time — a fixture set as a **prop default that nothing ever overrode**:

| Screen | Was showing |
|---|---|
| **Home (`/`)** | *"Hope the pharma deal we evaluated last week is moving well"*, three analyses nobody had run, `see more (5)` for reports that did not exist — **beside a live wallet balance** |
| **Account** | `Joy Chen`, `joy@caspr.ai`, `+44 7700 900 123` — the founder's identity, to every user, on the one screen whose purpose is "this is you" |
| **Account → Devices** | `MacBook Pro · Chrome · London · current session` and `iPhone 15`. A device list is a security surface: somebody scanning it for a session they did not recognise was being shown two they had never used |
| **Conversation pane** | Four analyses pinned beside the current one as the user's own recent work |
| **Layout canvas** | `Market sizing & competitive landscape.` rendered **inside a user bubble** — Caspr quoting the user saying something they never said |

All now read the account's own data. `emptyIsEmpty.test.tsx` covers five screens and would fail if any fixture returned.

**Three things were removed rather than emptied**, because there is no backend behind them and an unusable control is a promise the product does not keep:

- **PHONE** on Account — no column exists, and an `Edit` that cannot save is worse than an absent row
- **The device list** is one row, "This browser". The backend issues refresh tokens but does not record where they were used, so the only session this app can honestly name is its own
- **"Password · 3 months ago"** and **"Codes sent to +44 •••• ••7123"** — masking an invented number does not make it less invented

### A cycle that does not exist is not drawn

The free trial is $100 against a 90-day expiry, not a budget that recharges. So `billing_anchor` is null for it, and the wallet drops the pace chart, the month framing and the next-top-up line rather than defaulting them to the calendar month. **That is most accounts at launch.** A pace chart implies a deadline the trial does not have.

The next-recharge estimate is omitted rather than guessed: quoting it means knowing the platform fee, which is internal. That figure is the billing system's to state, and it does not state it yet.

---

## 2 · Backend — complete

**40 routes · 242 tests · 81% coverage · `ruff` and `mypy --strict` clean.** Repo: `caspr-ai/caspr-backend`.

New since the 24th:

- `POST /wallet/reservations` — hold the price of an analysis. Idempotent per analysis; the client names the depth and the **server** looks up the price, because a price the client sends is a price the client sets
- `POST /wallet/reservations/{id}/{settle|release}` — distinct URLs rather than a body field, because they move money in opposite directions and a typo in a body key should not be able to pick the wrong one
- `GET /wallet` now carries `plan`, `budget_cents` (nullable) and `billing_anchor`
- `GET /pricing` now carries the subscription milestones

`budget_cents` is nullable on purpose: a screen that cannot name the budget must say so rather than substitute the Professional figure beside a real balance.

Verified against production RDS on the 24th: 11/11 end-to-end checks, migration head `0004_profile`, forced row-level security on all 13 tables.

---

## 3 · Frontend — complete for launch

**598 unit tests · 41 Chromium layout tests · `tsc` and ESLint clean.** Repo: `caspr-ai/caspr-frontend`.

Positional absolutes: **836 across 73 files → 51 across 23**. The remainder are legitimate — pinned furniture like the `+ New` button, and overlays.

The layout audit runs in real Chromium across 11 routes at three widths and checks three things jsdom structurally cannot: text that overflows its declared box, siblings whose boxes intersect, and horizontal page overflow. **That instrument is why the previous build's 829 passing tests meant nothing** — jsdom has no layout engine, so `getBoundingClientRect()` returns zeros.

---

## 4 · What stands between here and deploy

### Blocked on Jayant's team — five values, no code

Both pipelines are already parameterised on GitHub variables and secrets. Nothing is waiting on us.

| | Where it goes |
|---|---|
| IAM role ARN for GitHub OIDC | `secrets.AWS_DEPLOY_ROLE_ARN` |
| ECR repository URIs (one per repo) | deployment manifests |
| EKS cluster name | `vars.EKS_CLUSTER_NAME` |
| Kubernetes namespace | deployment manifests |
| Confirmation that Secrets Manager entries exist | `caspr-api-secrets` |

**No stored AWS keys** — deployment authenticates through GitHub OIDC, so there is no long-lived credential to leak or rotate.

### Blocked on Jayant's service — one integration

**Server-side hold reconciliation.** A browser closed mid-run never sends the resolve call, so the hold stays until something server-side clears it. That needs their service to either call us on completion or expose a status we can poll. Neither exists. The client half is built and idempotent; this is the honest half of the mechanism, not the whole of it.

### Needs a decision from Joy — two

1. **Email-change copy** is drafted and unapproved, with no entry in `EMAIL-AND-VERIFY-COPY.md`.
2. **Account's 2FA, notifications and preferences sections have no backend at all** — not unwired, unbuilt. Their toggles will not persist. Options: render them as unavailable, cut them from the screen for launch, or build the endpoints. This is scope, not work in progress.

### Known and flagged, not blocking

- `WorkingPane` pagination is hidden behind `PaneSwitcher`
- `SignOutCard` centres only at 1440×900
- White-on-accent fill is 3.93:1 — passes WCAG AA only for large or bold text. On the ESLint ratchet; the list may shrink and may never grow
- A memory recorded while offline is not retried, and the next sync removes it locally because the server wins. The right fix is an outbox, not softening the merge rule

---

## 5 · The pattern worth naming

Six screens showed invented data, and in every case the code was reviewed, typed and covered. The tests passed because each side was internally consistent: the frontend tested against a mock that answered, the backend tested its service objects directly, and nothing tested the seam between them with real shapes.

**Three habits came out of it, and they are now enforced by tests rather than by intention:**

1. **A cast is not a conversion.** Anywhere a response body crosses into a typed shape there is a mapping function, or there is a lie that compiles.
2. **A fixture is never a prop default.** It is reachable only when a caller explicitly asks for it — which is what makes the review routes safe and the live paths honest.
3. **Empty is empty, and unknown is unknown.** `$0.00` on a wallet that failed to load is a confident wrong answer, not a safe default.
