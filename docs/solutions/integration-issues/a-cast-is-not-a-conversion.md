---
title: A cast is not a conversion
date: 2026-08-25
category: integration-issues
module: client-seam
problem_type: integration_issue
component: payments
symptoms:
  - The wallet balance in the app header rendered as $NaN on every screen against the real API
  - Every field of the parsed response was undefined, and TypeScript reported nothing
  - A reservation came back with an empty id and a zero amount
root_cause: missing_validation
resolution_type: code_fix
severity: critical
tags: [typescript, type-assertion, wire-format, snake-case, contract-drift, react, fastapi]
---

# A cast is not a conversion

## Problem

`client.wallet.getSnapshot` in `apps/web/src/data/realClient.ts` handed the response body to TypeScript as a `WalletSnapshot` with an `as` cast instead of converting it. The Python backend serves snake_case (`spendable_cents`, `free_trial_cents`, `reserved_cents`); the interface declares camelCase (`spendableCents`, nested `balances.freeTrialCents`). A cast performs no runtime work, so every field on the object the app used was `undefined`.

## Symptoms

**`$NaN` where the balance should be, on every screen.** The header balance is shell chrome, not a wallet-screen detail — `apps/web/src/app/AppShell.tsx:58`:

```ts
const balance = wallet ? formatUsd(wallet.spendableCents) : undefined;
```

`wallet` is a truthy object, so the guard passes. `wallet.spendableCents` is `undefined`. `formatUsd(undefined)` renders `$NaN`, and `AppShell` wraps every route.

**Nothing threw, anywhere.** The failure had no exception, no 500, no console error, no failed request. `GET /wallet` returned 200 with a correct body.

**Invisible to the whole suite.** 829 tests green. The bug appeared only against the real backend, which no automated test exercised.

**Two siblings in the same file, both worse in kind.** `toReservation` read `body.reservation` — an envelope the server does not send — and then `row['analysisId']` and `row['amountCents']`, camelCase keys the server does not use. Every reservation came back with an empty id and a zero amount, on the object that represents *committed money*. It stayed silent because the defensive fallbacks made it silent: `String(undefined ?? '')` is a valid string and `Number(undefined ?? 0)` is a valid number. `getPricing` cast too, and happened to be correct only because its keys were single words — `currency`, `depths`, `offered`, `outputs` — which is why it looked fine right up until a `charge_cents` field was added to the plan rows.

## What Didn't Work

**Trusting the type system to catch it.** This is the substantive failure, and it is structural rather than careless. `WalletSnapshot` was declared, imported, and used at every call site; `tsc` was clean and strict. None of that constrains what the server sends, because `as` is an assertion about a value the compiler cannot see. `res.json()` is typed `Promise<any>`, and `any` satisfies every assertion, so the cast met no resistance at all — not a weak check, no check.

**Taking the passing mock as evidence the client was correct.** `mockClient.ts` is hand-written, and its wallet snapshot is a camelCase object literal:

```ts
getSnapshot: () =>
  delay({
    balances: { freeTrialCents: 10_000, promoCents: 0, paidCents: 0 },
    spendableCents: 10_000,
    reservedCents: 0,
```

That satisfies `WalletSnapshot` by construction. Every test that rendered a balance asserted against the mock, so every test proved the mock was written in camelCase — a fact about the fixture, not about `realClient.ts`. The two implementations of the seam were never compared to each other, and the only oracle for wire casing was the running backend.

**Neither suite was positioned to see it.** As `apps/web/src/data/AGENTS.md` now records: ours runs against a mock that answers, theirs tests service objects directly. A field-name disagreement lives in the gap between them and is invisible from both sides.

## Solution

Explicit mapping functions at the seam. Every method that returns a typed object now names each wire key as a string.

**Before:**

```ts
return res.json() as Promise<WalletSnapshot>;
```

**After** — `realClient.ts:779`:

```ts
getSnapshot: async (accessToken) => {
  const res = await fetch(`${config.apiBase}/wallet`, {
    headers: accessToken ? { authorization: `Bearer ${accessToken}` } : {},
  });
  if (!res.ok) throw new ApiError('wallet_failed', `/wallet failed: ${res.status}`, null, res.status);
  return toWalletSnapshot(await res.json());
},
```

`realClient.ts:93` — the mapper:

```ts
function toWalletSnapshot(body: unknown): WalletSnapshot {
  const row = (body ?? {}) as Record<string, unknown>;
  const budget = row['budget_cents'];
  return {
    balances: {
      freeTrialCents: Number(row['free_trial_cents'] ?? 0),
      promoCents: Number(row['promo_cents'] ?? 0),
      paidCents: Number(row['paid_cents'] ?? 0),
    },
    spendableCents: Number(row['spendable_cents'] ?? 0),
    reservedCents: Number(row['reserved_cents'] ?? 0),
    // Null passes through as null rather than becoming 0. A budget of zero and
    // a budget we cannot name are different facts, and the screen draws them
    // differently — zero is a spent plan, null is no denominator at all.
    researchBudgetCents: budget == null ? null : Number(budget),
    plan: String(row['plan'] ?? 'free_trial'),
    billingAnchor: row['billing_anchor'] == null ? null : String(row['billing_anchor']),
  };
}
```

The null branch is not defensiveness, it is fidelity to the wire. `caspr-backend/src/app/wallet/schemas.py` declares `budget_cents: int | None` and says why: *"a screen that cannot name the budget must say so, and defaulting to the Professional figure would put a confident wrong number beside a real balance."* Collapsing null to 0 in the mapper would have thrown that away at the last possible moment.

**`toReservation` — `realClient.ts:44`**, envelope removed and keys corrected:

```ts
function toReservation(body: unknown): Reservation {
  const row = (body ?? {}) as Record<string, unknown>;
  return {
    id: String(row['id'] ?? ''),
    analysisId: String(row['analysis_id'] ?? ''),
    amountCents: Number(row['amount_cents'] ?? 0),
    status: (row['status'] as Reservation['status']) ?? 'held',
  };
}
```

**`toPricing` — `realClient.ts:62`** converts the two-word keys inside `plans` that the cast had been silently dropping:

```ts
plans: plans.map((p) => ({
  id: String(p['id'] ?? ''),
  name: String(p['name'] ?? ''),
  chargeCents: Number(p['charge_cents'] ?? 0),
  budgetCents: Number(p['budget_cents'] ?? 0),
  unlocks: Array.isArray(p['unlocks']) ? (p['unlocks'] as string[]) : [],
})),
```

## Why This Works

**`as` is a claim; a function is an obligation.** A type assertion is checked only for sufficient overlap between the source and target types, and it emits nothing — the compiled JavaScript for `res.json() as Promise<WalletSnapshot>` is `res.json()`. With `any` or `unknown` on the left there is no overlap test to fail, so the assertion is unconditionally accepted. It is the programmer telling the compiler to stop asking, on the one boundary where the compiler had no information to begin with.

A function declared `(body: unknown): WalletSnapshot` inverts that. The return type is now structurally checked against a literal the compiler *can* see: every property must be present, with the right type, or the build fails. What the compiler still cannot verify is whether `'spendable_cents'` is the right string — but that string is now written down in one place, greppable, reviewable, and checkable by a tool. The cast left nothing to check.

**Why the mock made the suite blind.** The mock and the real client are two independent implementations of one interface, and the tests only ever ran one of them. Because the mock is authored as TypeScript object literals, it necessarily conforms to the interface — a camelCase mock and a camelCase interface agree by construction, and their agreement carries no information about the wire. `realClient.ts` was the only code that had to know what the server actually sends, and it was the only code no test executed. The suite was measuring the fixture.

**Why nothing failed loudly.** JavaScript reads a missing property as `undefined` rather than throwing, and every downstream consumer converted that into something printable: `formatUsd(undefined)` into `$NaN`, `String(undefined ?? '')` into `''`, `Number(undefined ?? 0)` into `0`. The wallet case was survivable because `$NaN` is visibly wrong. The reservation case was the dangerous one — `0` is not visibly wrong.

## Prevention

**1. A written rule at the seam.** `apps/web/src/data/AGENTS.md` now opens its local contracts with it:

> **A cast is not a conversion — this is the rule this directory exists for.**
>
> ```ts
> return res.json() as Promise<WalletSnapshot>;   // ✗ compiles, and lies
> return toWalletSnapshot(await res.json());      // ✓
> ```
>
> **Every method that returns a typed object needs a mapping function.**

The same reasoning is carried on the type itself, `packages/contract/src/wallet.ts`, so a reader arriving from either direction meets it: *"camelCase here, snake_case on the wire."*

**2. `$0.00` is now a forbidden string.** `apps/web/src/pages/emptyIsEmpty.test.tsx` renders the wallet with a snapshot call that never resolves — the state every real user is in for the first few hundred milliseconds — and fails if a plausible number appears:

```ts
const WALLET_GIVEAWAYS = [
  /\$51\.00/,
  /\$186/,
  /Visa •••• 4242/,
  /CSP-4F92A1/,
  /\$0\.00/,
  /NEXT TOP-UP/,
];
```

`$0.00` is in that list for the reason recorded beside it: *"an unknown balance rendered as zero is not a safe default, it is a confident wrong answer"* — indistinguishable from a real empty account. This catches the fallback-shaped variant of the bug, the one `$NaN` was lucky enough not to be.

**3. A conformance check that reproduces this exact bug class.** `conformance/contract-parity.mjs` diffs the backend's OpenAPI schema against the TypeScript contract package and treats casing as its own axis — the one, by name, *"that produced $NaN"*:

```js
// 2 · casing — the axis that produced $NaN
const asSnake = snake(tsKey);
if (Object.prototype.hasOwnProperty.call(wireFields, asSnake)) {
  findings.push({
    axis: 'casing', severity: 'critical', type: tsName, wire: wireName, field: tsKey, file,
    detail: `wire sends "${asSnake}", the type declares "${tsKey}". Every read is undefined unless a mapper converts it — a cast will not`,
  });
```

Run in CI as a blocking job:

```bash
node conformance/contract-parity.mjs --openapi backend-openapi.json --contract packages/contract/src
```

It exits 1 on any blocking finding. Its self-test asserts the reproduction directly — *given a wire sending `spendable_cents` and a type declaring `spendableCents`, it reports **CRITICAL · casing** and exits 1* — and checks that `spendableCents` specifically is among the flagged fields. Caveat carried from `conformance/README.md`: the harness was authored from specifications against synthetic fixtures and has not yet run against Caspr source, so expect calibration on the first real run. The parity detector is the part with a proven reproduction.

**Finding the remaining casts.** Run this from `apps/web/src`:

```bash
grep -rnE '\.json\(\)[[:space:]]*as|as[[:space:]]+Promise<' --include=*.ts --include=*.tsx .
```

As of this fix it returns six live hits, all in `realClient.ts`: five `as Promise<UserProfile>` (lines 731, 741, 751, 767, 774) and the auth body at line 297. **None of them is currently wrong, and all of them are the same latent defect.** They work because those TypeScript shapes were deliberately declared in wire casing — `UserProfile` carries `icp_source`, `persona_hash`, `persona_keys` (`client.ts:300`), the nested `StoredMemory` carries `created_at`, `EngagementCounters` carries `features_used` and `consecutive_ignored`, and the auth body carries `access_token` / `refresh_token`. They are assertions that happen to be true today. The moment one camelCase field is added to either shape, they fail exactly as the wallet did, at runtime, silently, with a clean build and a green suite.

**The detection signature, for next time:** a typed value crossing the wire with no function between it and `res.json()`, plus a hand-written mock that satisfies the same interface. Wherever both are present the tests cannot see the boundary, and the first observer is a user looking at a number.
