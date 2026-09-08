# Open Inputs — Consolidated

**To:** Jayant, CTO
**From:** Joy
**Date:** 2026-08-12
**Supersedes:** the open-item lists in `architecture-alignment-v4.md` §11 and `jayant-interface-conformance-note.md`. This is the single list.

---

## What this is

Everything still outstanding from your side, in one place, deduplicated. Nineteen items. **Twelve are yes/no confirmations** — those should take a few minutes. The rest need a decision, a value, or a signature.

They're grouped by what they block, not by topic, so you can answer the top group first and unblock the most work.

Item 19 is a question we hadn't asked before. It has a launch-date consequence and I'd flag it as the one to read first if you only read one.

**Nothing here changes the division of work.** Everything remains as agreed in v4.1: you own the Learning and Thinking Brains, generation, analysis and file storage, model security, GPU infrastructure, the source corpus, and deployment into your AWS account. We own the entire product surface and the non-AI backend.

---

## Group A — Blocks the build now

Without these we are implementing against a guess.

### A1 · The approach decision 🔵 *decision*

We're building against a **running reference implementation** of the AI interface, plus a conformance suite you can run against your own service — one command, all green means drop-in compatible. Detail in `jayant-interface-conformance-note.md`.

Two ways to get the interface shape:

- **Option A (recommended).** We publish the reference implementation as the proposed interface; your service implements to it. We're the consumer, and as far as we know there's no existing front-end contract this would break.
- **Option B.** You send us your schemas and we build the reference implementation to match.

A is faster and we can start immediately. We need only your confirmation that you're willing to implement to the published contract.

> **Answer:**

### A2 · MCP interface 🟡 *needs detail*

Four things:

1. Transport — Streamable HTTP or SSE?
2. Endpoint URL
3. Full tool catalogue with input/output schemas
4. How the JWT is passed at session init

This is the largest single blocker. Our entire data seam is written and tested against mocks; wiring it to you is a config change *once we know these four*.

> **Answer:**

### A3 · JWT verification ✅ *confirm*

Confirm you'll verify our product-issued JWTs via our JWKS endpoint (`{AUTH_ORIGIN}/.well-known/jwks.json`). Caspr is the identity provider; you verify, you don't mint. This drops any parallel auth for this app.

> **Confirm (Y/N):**

### A4 · Async layout delivery ✅ *confirm*

Delivery channel for the draft layout and its live updates as it refines: streamed result of the layout tool, or a separate stream/push?

> **Answer:**

### A5 · Ask Caspr shape 🟡 *needs detail*

Request/response shape for free-form follow-ups, and whether it's streamed. The red-dot inline explanation is already handled (no round-trip); this is only the free-form thread.

> **Answer:**

### A6 · Infographic format ✅ *confirm*

Confirm you emit structured data + layout, not a rendered image. We render into the branded template so every version is saved and revertible.

> **Confirm (Y/N):**

### A7 · The 429 contract ✅ *confirm*

Confirm you adopt: HTTP 429 + `Retry-After` header + body `{ "reason": string, "retry_after_seconds": number }`.

We need the machine-readable body to branch the UX per surface — a soft cooldown on Ask Caspr looks different from a queued state on an analysis. Without it every rate limit renders as the same generic error.

> **Confirm (Y/N):**

### A8 · Product-backend hosting 🔵 *decision*

EKS service, or API Gateway + Lambda in the shared AWS account? Your call given your ops and IAM preferences — we'll build to either. The service is Hono and portable.

> **Answer:**

---

## Group B — Blocks testing against your backend

We have three phases of automated testing built and ready to point at you. These four inputs unblock it.

### B1 · Staging environment 🟡 *needs detail*

A staging URL for the AI backend, **plus written confirmation that it holds no real customer data.** The second half matters: our fuzzing and injection testing must never touch a real customer's analysis, and we'd rather have that in writing than assume it.

> **Answer:**

### B2 · Penetration-testing authorization 🔴 *signature*

A signed authorization before any active security testing runs against a shared environment. Scope, window, request ceiling and abort signal are all drafted — the document is `docs/security/pentest-authorization-request.md`, written to be easy to say yes to.

Scope is staging only. Denial-of-service, infrastructure-level attacks, social engineering and anything touching production are explicitly excluded.

Our tooling refuses to run without this file present and in-window. That's enforced in code, not policy.

> **Signed (Y/N):**

### B3 · Maximum concurrent analyses 🟡 *needs a number*

The maximum concurrent analyses your infrastructure supports without degraded performance.

This determines three things we currently cannot set: free-trial guardrails, the queue UX, and whether we throttle signups at launch. We've built and load-tested our own layer to the agreed 500-concurrent target against a stub. We need your number for the other half.

> **Answer:**

### B4 · Real-pipeline load ceiling ✅ *confirm*

We want one small-N load run against the live pipeline — around 20 concurrent for 10 minutes — to confirm the seam behaves as our stub modelled. It costs you GPU time, so we won't run it without agreement on the number.

Everything above that stays on the stub. You load-test to 500 yourself; we're not proposing to spend your compute proving your capacity.

> **Confirm ceiling:**

---

## Group C — Blocks cutover

### C1 · Where the product app lives, and how caspr.ai routes to it 🔴 *decision — see item 19*

Covered in full as item 19 below. It's in this group because it blocks cutover, but it's flagged separately because it may also block the re-engagement campaign.

### C2 · DNS and TLS execution ✅ *confirm*

The account and runtime are yours, so the cutover is executed by your team. We need:

- Who runs it, and the rollback procedure if the first ten minutes look wrong
- Confirmation that TLS 1.3 is enforced at both CloudFront and the ALB
- Whether we get a rehearsal on a non-production hostname first

We'd strongly prefer a rehearsal. A cutover you've already done once is a different risk from one you haven't.

> **Answer:**

### C3 · Pre-production checklist ✅ *confirm*

The checklist in `architecture-alignment-v4.md` §8 — model serving with no public IP, weights encrypted at rest with a customer-managed key, Secrets Manager in use, WAF active, CloudTrail and EKS audit logging on, JWT middleware deployed, TLS 1.3 enforced, dependency audit complete.

Confirm each is done before we connect to production traffic. A one-line "all green" is fine; if any are outstanding, we'd like to know which.

> **Confirm:**

### C4 · EU data residency 🟡 *needs status*

Is EU residency for **analysis content and inference** live today, or Phase 2?

Our data layer in `eu-central-1` is a configuration choice and it's handled. Yours is the load-bearing half — analysis content and the inference itself. This is a claim we make publicly and it appears in enterprise security reviews, so we need to know exactly what's true today rather than what's planned.

> **Answer:**

### C5 · Retention enforcement ✅ *confirm*

Confirm the windows in `security-posture.md` §4 are actually enforced, not just documented: research outputs 90 days, uploaded documents 1 year from last access.

Same reasoning as C4 — these are published commitments. We'd rather find a gap now than have a customer find it.

> **Confirm (Y/N):**

---

## Group D — Needed soon, not blocking

### D1 · Stripe history 🟡 *needs detail*

Is Stripe already integrated on the existing caspr.ai, and are there live subscriptions on it? We have around two paying users; if they sit in an existing Stripe account we need to plan for them rather than stranding them.

Our integration is Singapore-entity, USD, hosted Checkout + Customer Portal, currently in test mode.

> **Answer:**

### D2 · Knowledge-graph build spec 🟡 *Joy to locate first*

Whether there's anything the front-end or data layer must support. This one is on me to find the file — flagging it so it isn't lost.

> **Answer:**

### D3 · External penetration test 🟡 *needs status*

`security-posture.md` §6 says an external pentest is planned for Q3 2026, and §1 says the SOC 2 Type I report is expected Q3 2026. It's now August. Both claims are live on the `/security` page and in our enterprise objection-handling script.

Are they on track, or do the published dates need revising? Either is fine — a stale date on the security page is the thing I want to avoid, because that's exactly where a prospect will check.

> **Answer:**

---

## 19 · The routing question 🔴 *new — please read*

**The marketing site is frozen, and it contains nine hardcoded links to `https://caspr.ai/signup`.**

The marketing site is Next.js on Vercel at `caspr.ai`, and it owns 39 routes — `/`, `/pricing`, `/enterprise`, all the ICP pages, all the `/vs/*` comparison pages, the legal pages. It's live, it's ranking, and the instruction on it is that nothing changes, including SEO and CRO.

The new product app is a React SPA on S3 + CloudFront, currently targeted at `new.caspr.ai`.

Those two facts don't yet reconcile. Every call-to-action on the marketing site sends users to `caspr.ai/signup` as an absolute URL. After cutover that path must reach the new product app — but `caspr.ai` itself must keep serving the marketing site from Vercel.

So one of three things has to happen, and it's your call which:

| Option | What it means | Cost |
|---|---|---|
| **Path-based routing at the edge** | `caspr.ai/signup` and the app paths route to CloudFront; every other path continues to Vercel | Edge routing config; no code change either side. **Our preference.** |
| **App on a subdomain** | Product app at `app.caspr.ai`; marketing site's nine CTAs are re-pointed | Touches the frozen repo — nine link changes, but a change to a frozen asset nonetheless |
| **App replaces the current signup path** | Whatever serves `caspr.ai/signup` today is swapped for the new app | Depends entirely on what's there now — which we don't know |

**Two things follow from this that I'd like your read on:**

**First — it affects the re-engagement campaign.** Re-activating the 1,500 existing signups is our highest-priority marketing work, and it's currently blocked behind this. Those emails will send people to a login. If those accounts don't authenticate against the same system the new app uses, the campaign sends 1,500 people to a broken door. So: **do the existing 1,500 signups live in the auth system the new product app will use?** If not, what happens to them at cutover?

**Second — it limits what we can test.** Because the CTAs are absolute URLs, we cannot test the full marketing-to-product journey on `new.caspr.ai` — the buttons always point at production. Path-based routing fixes this too, since we can test the same routing rules on a staging hostname.

> **Answer:**

---

## Summary

| Group | Items | Blocks |
|---|---|---|
| A — Interface | A1–A8 | The build, now |
| B — Testing | B1–B4 | Validation against your backend |
| C — Cutover | C1–C5 | Go-live |
| D — Soon | D1–D3 | Nothing yet |
| **19** | Routing | **Cutover, and possibly the re-engagement campaign** |

Twelve are yes/no. The four that need real thought are **A1** (the approach), **A2** (the MCP interface), **B3** (your concurrency number), and **19** (routing).

If it's easier to talk than to write, a call works — I'll take notes and send them back for confirmation.

---

*Document: `docs/product/jayant-open-inputs.md`*
*Owner: Joy Sharma · 2026-08-12*
*Sources consolidated: `architecture-alignment-v4.md` §8 §11 · `jayant-interface-conformance-note.md` · `security-posture.md` §1 §4 §6 · testing plans, phases 2 and 3*
