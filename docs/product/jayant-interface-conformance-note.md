# Proposal: a reference implementation + conformance suite for the AI interface

**To:** Jayant (CTO) · **From:** Joy · **Date:** 2026-08-11
**Re:** `architecture-alignment-v4.md` (v4.1) §7 integration contract, §11 open items

---

## The short version

We're building the entire product — front-end and the product-side backend — against a **running reference implementation of your AI interface**. Rather than hand you a document and integrate later, we'd like to hand you:

1. **A deployable reference service** that implements the agreed interface end-to-end (MCP tools, streams, payload shapes), including realistic latency and failure behaviour.
2. **A conformance test suite** you can run against *your* service. One command; all green means you are drop-in compatible.
3. **An integration runbook** — set three environment variables, run the suite, deploy.

Your team implements the contract and deploys. Nothing in our code changes when we switch from the reference service to yours — the endpoint is injected via config, never hard-coded.

**This does not change the division of work in v4.1.** It makes it executable instead of interpretive.

---

## Why we think this is worth it for your team

- **No spec interpretation.** Ambiguity in a written contract usually surfaces during integration, under time pressure. A reference implementation removes the interpretation step — you can call it, read its responses, and diff.
- **A definitive compatibility check.** The conformance suite tells you, per field and per event, exactly where an implementation diverges. No round-tripping through us to find out.
- **We can test the product before your AI is ready.** Load testing to the 500-concurrent guardrail and the third-party penetration test can both run against the complete product, so those findings land early rather than at cutover.
- **A clean seam if anything changes later.** Contract changes become test changes, visible to both sides.

---

## The one decision we need from you

The interface shape is still open on our side (v4.1 §11). Two ways forward:

**Option A (our recommendation).** We publish the reference implementation as the proposed interface, and your service implements to it. We're the consumer, and as far as we know there's no existing front-end contract on your side that this would break.

**Option B.** You send us your schemas and we build the reference implementation to match.

Either works. **A is faster and we can start immediately** — we only need your confirmation that you're willing to implement to the published contract, so that we're not building a precise implementation of the wrong interface.

---

## Specifics we still need (unchanged from v4.1 §11)

Whichever option you pick, these remain open:

1. **JWT verification** — confirm you'll verify our product-issued JWTs via our JWKS endpoint (`{AUTH_ORIGIN}/.well-known/jwks.json`). Caspr is the identity provider; you verify, you don't mint.
2. **MCP interface** — transport (Streamable HTTP or SSE), endpoint URL, the full tool catalogue with input/output schemas, and how the JWT is passed at session init.
3. **Async layout** — delivery channel for the draft layout and its live updates: streamed result of the layout tool, or a separate stream/push?
4. **Ask Caspr** — request/response shape for free-form follow-ups; is it streamed?
5. **Infographic** — confirm structured data + layout, not a rendered image.
6. **Rate limiting** — confirm the standard 429 shape (`Retry-After` header + `{ reason, retry_after_seconds }` body) so the client can distinguish a soft cooldown from a queue state.
7. **Product-backend hosting** — EKS service or API Gateway + Lambda in the shared AWS account, given your ops and IAM preferences.

---

## What stays yours regardless

To be explicit, so the boundary is unambiguous: the Learning and Thinking Brains, generation, analysis and file storage, model security and GPU infrastructure, the source corpus — and deployment into your AWS account (IAM, secrets, WAF, DNS, scaling). We can hand over infrastructure-as-code and the pipeline definition, but the account and runtime are yours.

---

## Ask

Confirm **Option A or B**, and — if A — that you're willing to implement to the published contract. If any of the seven items above already has an answer on your side, send it and we'll build to it rather than propose.

*Companion documents: `architecture-alignment-v4.md` (v4.1) — the integration contract · `DEV-HANDOVER.md` — the build handover.*
