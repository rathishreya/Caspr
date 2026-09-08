# Build status — what is done, and what stands between here and `new.caspr.ai/app`

**2026-08-24.** Measured against the running code, not from memory.

---

## The one-paragraph answer

**The backend is close to done and now verified against real infrastructure — 11/11 end-to-end checks passed against the production RDS instance this morning.** The frontend's *data layer* has been rebuilt alongside it and is in good shape. **The frontend's presentation layer has not been touched, and it is exactly as broken as it was when the tech team rejected it**: 836 absolute positions across 73 files, 16 semantic headings in 172 source files. That is the single largest remaining piece of work, and it is the reason this whole effort started.

Nothing can deploy yet, for a reason that is not code: **there is still no answer to where `new.caspr.ai/app` runs.**

---

## 1 · Backend — substantially complete

**30 routes, 179 tests, 84% coverage, ruff and `mypy --strict` clean.** Repo: `caspr-ai/caspr-backend`.

### Verified against the real database today

The RDS instance is provisioned and at migration head (`0004_profile`), with both non-login roles, forced row-level security on all 13 tables, and 13 policies. **Jayant's team applied the schema.** The new password works — the previous one failed because it contained a `$`, which a shell had eaten.

A full end-to-end run of the real service against that database:

| | |
|---|---|
| ✅ | Readiness reaches RDS |
| ✅ | JWKS published and verifiable |
| ✅ | Pricing public |
| ✅ | Signup writes to RDS |
| ✅ | Verification returns a session |
| ✅ | **`SET LOCAL ROLE caspr_request` works** — the one thing local tests cannot prove |
| ✅ | Profile and persona resolve |
| ✅ | Library write under RLS |
| ✅ | Commit reserves budget and freezes the analysis context |
| ✅ | Hold settles |
| ✅ | Balance deducted correctly ($100 → $20 after a Study) |

That last group is the money path working on production infrastructure.

### Built

| Area | State |
|---|---|
| Auth — signup, verify, sign-in, refresh with reuse detection | ✅ |
| Password reset — request, confirm, session revocation | ✅ |
| JWKS at `/.well-known/jwks.json`, RS256, loaded key | ✅ |
| Wallet — balance, ledger, reserve, **settle/release** | ✅ |
| The split proxy — generation and outputs through us | ✅ |
| Context envelope — frozen analysis keys, fresh person | ✅ |
| Research profile — memories, persona, engagement counters | ✅ |
| Library — documents, files, pre-gate turns | ✅ |
| Pricing — one source of truth, published | ✅ |
| SES mail — four approved emails | ✅ |
| Legacy user migration SQL (not run) | ✅ carried over |

### Not built

| Missing | Blocks | Size |
|---|---|---|
| **`/auth/oauth` with Google `id_token` verification** | Google sign-in. **Also a live hole** — the contract as written accepts an email with no token, so anyone can sign in as anyone | ~half a day |
| **`/wallet/topup` + Stripe webhook** | Paying. Keys are in hand and are test-mode | ~1 day |
| `GET /me`, account management (name, phone, email change, devices) | The Account screen | ~1 day |
| Server-side hold reconciliation | A browser closed mid-run leaves money held. Needs Jayant's service to call us on completion or expose a pollable status — **neither exists** | blocked |
| **Dockerfile + CI** | Deploying at all | ~half a day |

---

## 2 · Frontend — data layer rebuilt, presentation layer untouched

Repo: `caspr-ai/caspr-frontend`. Typechecks and builds clean.

### Rebuilt

The client seam is now correct: money calls route through the proxy, `client_knowledge: {}` is replaced by a resolved user context, prices are read rather than hardcoded, the profile and memories moved behind the API, and the entry-path ICP is captured at signup instead of being discarded.

### Not rebuilt — and this is the headline

Measured today, in `apps/web/src`:

| | Count | Was |
|---|---:|---|
| Uses of `absolute` in TSX | **836** | 836 |
| Files with hardcoded pixel coordinates (`left-[…px]`) | **73** | 73 |
| Semantic headings (`<h1>`–`<h6>`) across 172 source files | **16** | 16 |
| TanStack Query | not installed | — |
| `@/` alias | absent | — |
| `router.dev.tsx` (the ~40 review routes still on the product router) | absent | — |

**None of the design work has been applied.** Still outstanding from `DEV-PROMPT-ROUND-3.md` and the pixel passes:

- the fluid shell to the corrected §10b declaration (measured and verified, not yet built)
- contrast tokens and the never-as-text lint
- the `brand/black` lint
- the spacing scale as tokens
- focus ring at 1.5px, keyboard model
- checkbox hit areas → 24×24
- the six layout patterns as components
- one header/footer implementation (four hand-built copies today, three identical and one already drifted)
- AI-disclosure metadata in the export pipeline
- the five god files (813 · 753 · 628 · 617 · 336 lines) thinned into feature screens

**Honest sizing: this is the bulk of the remaining work — days, not hours**, across 62 routes and 43 page files.

---

## 3 · Deployment — nothing exists

| | |
|---|---|
| Dockerfile (backend) | ❌ none |
| CI targeting GitHub | ❌ the only pipeline file is `bitbucket-pipelines.yml`, and the repos are on GitHub |
| Where `new.caspr.ai/app` runs | ❌ **unanswered since first asked** |
| How code gets there | ❌ unanswered |

---

## 4 · What is actually blocking

**One thing, and it is not code: the deploy target.** Everything else is work I can do.

| | Item | Owner |
|---|---|---|
| 1 | ~~Postgres + credentials~~ | ✅ **Resolved 2026-08-24** |
| 2 | **Where `new.caspr.ai/app` deploys, and how code gets there** | Jayant — still open |
| 3 | Which URL the Stripe webhook is registered against | Jayant — the secret is in hand, but a webhook secret is per *endpoint*, and without (2) we do not know what endpoint it belongs to |
| 4 | ~~Does Google sign-in need to work~~ | ✅ Answered by supplying a client ID — yes |

---

## 5 · The order I would build in

1. **Google `id_token` verification** — it is a live authentication hole, not just a missing feature.
2. **Stripe top-up + webhook** — completes the money path end to end.
3. **Dockerfile + CI** — so that the moment (2) is answered, deploying is a push.
4. **The frontend presentation rebuild** — the largest piece, and the one the tech team will judge.

Items 1–3 are roughly two days. Item 4 is the real number, and it is the one worth being honest about rather than optimistic: the previous build failed because coordinates were transcribed instead of a responsive system being built, and doing it properly is not a fast pass over the same files.
