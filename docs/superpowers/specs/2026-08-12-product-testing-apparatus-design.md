> **⛔ HISTORICAL DOCUMENT — vocabulary below is superseded.**
> This predates **2026-08-27**, when **the Thinking Brain and the Learning Brain were retired together.**
> The architecture is now **Source. Assess. Conclude.** — [`source-assess-conclude.md`](../../source-assess-conclude.md).
> **The body is left unedited on purpose:** it records what was true when it was written. **Do not copy
> vocabulary out of it.**

# Caspr Product Testing Apparatus — Design

**Owner:** Joy Sharma
**Date:** 2026-08-12
**Status:** Approved design — implementation plan to follow
**Applies to:** `caspr-app` (product SPA + product-side backend). The marketing site `caspr-web` is out of scope and frozen.

---

## 1. Purpose

Define the complete testing, monitoring and reporting apparatus for the Caspr product app, covering five needs:

1. Functional testing against mock APIs, once the build is complete
2. A second validation round after Jayant wires the live APIs and deploys
3. Regression testing on every subsequent change before it goes live
4. Continuous production monitoring, with automatic remediation where possible and structured escalation where not
5. A dashboard reporting product performance and utilisation

Across five quality dimensions: functional correctness, performance, load, information security and privacy compliance, and resistance to deliberate attack.

Two constraints govern every decision: **minimum human effort** and **minimum token consumption**.

---

## 2. Ownership zones

The apparatus must respect the division of work in `architecture-alignment-v4.md`. This is not an organisational nicety — it determines who is legally and practically able to test what.

| Zone | Owner | What we may test | Constraint |
|---|---|---|---|
| **A. SPA + product-side backend** | Us | Everything, without restriction | None. Our code, our repo, our pipeline. |
| **B. Integration surface** (MCP tools, JWT verification, presigned uploads) | Shared | Conformance to the contract, error handling, timeouts | Behavioural testing only. We assert the shape, not the internals. |
| **C. AI pipeline + AWS infrastructure** | Jayant | Nothing active without written authorization | Active scanning and exploitation attempts on Zone C require signed authorization. Load testing consumes his GPU budget. |

**Consequences accepted:**

- Auto-remediation is bounded by the access granted in Zone C. Confirmed available: read access to CloudWatch and logs, plus a narrow set of pre-approved runbook actions.
- Full-fidelity load testing runs against a **stubbed** AI backend. Jayant load-tests his own pipeline to the 500-concurrent target.
- Adversarial security testing is split: passive and static work begins immediately; active work waits for authorization (§10).

---

## 3. Core architecture

### One corpus, five contexts

A single layered test corpus is authored once and executed against different targets.

```
                    ┌─────────────────────────────────┐
                    │      ONE TEST CORPUS            │
                    │  T0 static · T1 unit/contract   │
                    │  T2 journey · T3 perf · T4 load │
                    │  T5 security · T6 output eval   │
                    └───────────────┬─────────────────┘
                                    │
       ┌────────────┬───────────────┼───────────────┬────────────────┐
       ▼            ▼               ▼               ▼                ▼
   vs MOCKS     vs STAGING       every PR      vs PRODUCTION    vs GOLDEN SET
   (need 1)     (need 2)         (need 3)      (need 4, thin)   (need 6, added)
```

The marginal cost of contexts 2 and 4 approaches zero if context 1 is built correctly. Building them as separate efforts pays three times for one asset.

### Environment targeting

Every suite takes its target from environment configuration only — never from code. This is already a hard project rule (`BUILD-STATUS.md` §16) and the test apparatus must not be the thing that breaks it.

| Variable | Purpose |
|---|---|
| `TEST_TARGET` | `mocks` \| `local` \| `staging` \| `production` |
| `TEST_API_BASE` | Product backend base URL |
| `TEST_MCP_ENDPOINT` | Jayant's MCP endpoint |
| `TEST_ALLOW_ACTIVE_SECURITY` | Defaults `false`. Guards Zone C active scanning. |
| `TEST_ALLOW_WRITE` | Defaults `false` when target is `production`. Guards destructive probes. |

Production synthetic probes run under a dedicated, permanently rate-limited service account with a $0 wallet balance, so a runaway probe cannot generate paid analyses.

---

## 4. Cost model

### Token cost

The controlling rule: **the LLM is never in the run loop.**

| Activity | Token cost | Frequency |
|---|---|---|
| Authoring a test | One-time, moderate | Once per test |
| Running a test | **Zero** | Thousands of times |
| Triaging a failure | Low — reads the artifact bundle, not the codebase | Only when red |
| Adversarial / exploratory pass | Moderate | Milestones only |
| LLM-judge output eval | Low — 25 reports | Weekly |

Four specific economies:

1. **Generated, not hand-written.** The fault-injection matrix (§5.3) produces ~48 tests from a ~60-line table. Contract validators are derived from `packages/contract` types, not maintained by hand.
2. **Artifact-first triage.** Every CI failure emits a bundle: Playwright trace, video, network HAR, console log, and the failing assertion. Triage reads the bundle. This cuts triage cost by roughly an order of magnitude versus re-reading source to reason about a failure.
3. **Batched evaluation.** LLM-judged quality runs weekly, not per-commit.
4. **Unattended nightlies.** Deep suites run without supervision. Attention is spent only on red.

### Money cost

Budget: under $100/month, no external pentest vendor at this stage.

| Tool | Purpose | Cost |
|---|---|---|
| Bitbucket Pipelines | CI (existing) | Existing plan |
| Playwright | Journey + synthetic monitoring | Free |
| Lighthouse CI | Performance budgets | Free |
| k6 OSS | Load | Free |
| Semgrep OSS · gitleaks · osv-scanner | Static security | Free |
| OWASP ZAP · Nuclei · Schemathesis | Active security (post-authorization) | Free |
| Sentry | Error + RUM | Free tier (5k errors/mo) |
| Grafana Cloud | Dashboard | Free tier (10k series, 50GB logs) |
| BetterStack or UptimeRobot | External uptime probes | Free tier |
| **Total** | | **$0–20/mo** |

Deferred to first enterprise deal or funding: external penetration test ($8–15k), Datadog/Checkly synthetics, Snyk paid, private bug bounty.

---

## 5. The nine tiers

### T0 — Static gate

**Runs:** every commit. **Duration:** ~60s. **Blocking:** yes.

| Check | Tool | Rationale |
|---|---|---|
| Type check | `tsc --strict` | Exists |
| Lint | ESLint | Exists |
| **No hardcoded domains, URLs, ports, or absolute roots** | Custom ESLint rule | Project rule 16. This was a direct complaint from Jayant. Encode it as a build failure, not a review comment. |
| No secrets in source or bundle | gitleaks | |
| Dependency vulnerabilities | `npm audit` + osv-scanner | With an allowlist file documenting each accepted exception and why — currently the two react-router RSC-mode CSRF advisories, non-applicable to a plain SPA |
| SAST | Semgrep OSS (`react`, `typescript`, `owasp-top-ten`) | |
| Bundle size budget | `size-limit` | A bundle regression is a latency regression |

### T1 — Unit and contract

**Runs:** every commit. **Duration:** ~90s. **Blocking:** yes.

**Existing:** 139 tests accrued during the build (TDD). These are the build's output, not the apparatus's — they carry forward unchanged.

**Added by this apparatus:**

**Contract conformance — the highest-leverage single item.** `packages/contract` already holds the complete v4 TypeScript types. Derive runtime validators from them and run one identical suite against two targets:

```
contract.spec.ts  ──▶ @caspr/mocks        (must pass from day one)
                  ──▶ Jayant's real API   (must pass at handover)
```

When Jayant's response drifts from the contract, the test names the field that moved. This collapses need 2 — the post-wiring validation round — from a multi-day manual exercise into a pipeline run, and it is the artifact handed to Jayant so he sees precisely what broke.

Validated invariants beyond raw shape:
- every exec-summary insight and question carries a `section_id` that exists in the returned sections
- every red-dot anchor in section content resolves to a source
- `chart_data` shape is valid for its declared chart type
- error responses conform to the standard contract (§7.8 of v4), including 429 with `Retry-After`

**Wallet property tests** (fast-check). Money bugs are found by property testing, not examples:
- balance never goes negative under any operation sequence
- `A = B − F` holds exactly at every budget level
- spend order is always free → promo → paid
- `reserve` then `release` is an identity operation
- concurrent reservations cannot double-spend
- `monthlyRecharge` delta logic matches `pricing-model.md` §3.2 examples A–D under arbitrary prior balances

**RLS isolation tests** against real PostgreSQL (pglite, using the actual `schema.sql`). The premise is that the application layer is already compromised: with `app.current_user_id` set to user A, assert that no query can return user B's rows across all ten tables. Assert `audit_log` rejects UPDATE and DELETE.

### T2 — Journey

**Runs:** every PR. **Duration:** ~5 min. **Blocking:** yes. **Tool:** Playwright.

**Happy-path journeys** — each asserted for state, not just absence of error:

| Journey | Covers |
|---|---|
| Signup → phone OTP → onboarding → first prompt → layout proposal → refinement → gate → Theater → report delivered | The activation path. The one that matters. |
| Report interaction: red dot opens inline (asserting **zero network calls**), chart type switch, contents navigation, Ask Caspr | |
| Wallet: free trial $100 → Brief ($15) → balance $85 → insufficient funds → Stripe Checkout → return → balance restored | |
| Auth: sign in, session persistence, expiry, refresh, sign out, session revocation | |
| Documents: upload, validation limits, categorisation, use in analysis | |
| Export: PDF and PPTX generation, version pinning | |
| Coming-soon surfaces: Intelligence, Insights, Updates render their designed state — no dead links | Build rule 8 |

**Fault-injection matrix** — the highest-value functional work in this plan.

Rationale: the product's functional definition is already well covered by the build's own TDD. What is not covered — and what the funnel data implicates — is behaviour under failure. A hung state does not error; it does not appear in logs; the user simply closes the tab. This is the mechanism by which 1,500 signups produce 2 paid customers.

A table of every network call crossed with every failure mode, expanded by a loop:

| Network calls (~8) | Failure modes (6) |
|---|---|
| sign-in · wallet fetch · layout propose · generate trigger · source stream · section stream · file upload · Ask Caspr | 3s delay · 30s timeout · HTTP 500 · HTTP 429 with `Retry-After` · mid-stream disconnect · offline |

≈48 generated tests, each asserting three things:

1. **The UI reaches a designed state.** The 15 empty/error/loading frames from the Figma dev-readiness pass are the reference. Never an unresolving spinner, never a blank pane.
2. **A recovery action is available.** Retry, go back, or a clear next step.
3. **No money moved for work that did not happen.** Wallet balance unchanged, or reservation released.

Additionally asserted for the streaming paths: mid-stream disconnect must resume or fail cleanly, and a refresh during compose must not lose the user's typed prompt.

**Accessibility and browser matrix** (added — not in the original brief):
- axe-core assertions on every journey; WCAG 2.2 AA as the target
- Chromium, Firefox, WebKit
- Viewports: desktop 1440, tablet 768, mobile 390 — the mobile frames exist and must be covered

### T3 — Performance

**Runs:** PR (budgets) + nightly (deep). **Blocking:** PR budgets only.

Joy's requirement: *"no lag, no dead states."* Dead states are T2. Lag is here.

| Check | Budget | Tool |
|---|---|---|
| Largest Contentful Paint | < 2.0s | Lighthouse CI |
| Cumulative Layout Shift | < 0.05 | Lighthouse CI |
| Total Blocking Time | < 200ms | Lighthouse CI |
| JS bundle (initial) | Budget set at first measurement, ratchet down only | size-limit |
| Drawer open / pane transition | < 100ms to first paint | Playwright timing |
| Compose → layout proposal visible (skeleton) | < 300ms | Playwright timing |
| Chart re-render on type switch | < 200ms | Playwright timing |
| Red dot open | **0 network calls**, < 50ms | Playwright + network assertion |
| Theater animation | Sustained 60fps, no frame drops > 5% | Playwright trace |

**Memory leak soak** (nightly): a 30-minute continuous Theater session with heap sampling. The Theater is an SVG animation loop driven by a reducer — a classic leak site. Assert heap growth stays flat after warm-up.

### T4 — Load

**Runs:** milestones (pre-handover, post-wiring, pre-cutover) then monthly. **Tool:** k6 OSS.

Target from locked decision: **500 concurrent analyses.**

| Profile | Shape | Proves |
|---|---|---|
| **Steady state** | 500 concurrent analyses held for 30 min | The design target holds |
| **Spike** | 0 → 500 in 60s | Survives a launch. A Product Hunt post or a LinkedIn post does exactly this. |
| **Soak** | 100 concurrent for 4 hours | No connection-pool exhaustion, no memory drift, no token-refresh cliff |

**Critical scope note:** the load test must exercise the **WebSocket and SSE fan-out**, not only REST. The real bottleneck is 500 concurrent analyses each holding a persistent WebSocket connection fed through ElastiCache Redis pub/sub. A REST-only load test will pass and prove nothing.

Independently load-tested: the product-side backend (auth, JWKS, wallet, Stripe webhook). It is ours and sits on the critical path of every request.

**Cost boundary:** full-fidelity load runs against a **stubbed** AI backend, proving our layer. A small real-pipeline run (~20 concurrent) validates the integration. Jayant load-tests his pipeline to 500 — running it ourselves burns his GPU budget for no information we can act on.

### T5 — Security

Split by authorization status so that work begins immediately.

#### 5a. No authorization required — starts at Phase 1

| Area | Tests |
|---|---|
| **Threat model** | STRIDE analysis against the v4 architecture, written and maintained. Feeds every other security decision. |
| **JWT** | Tampered payload, expired, wrong audience, wrong issuer, wrong signing key, `alg: none` confusion, `RS256`→`HS256` confusion, replay after sign-out, replay after session revocation |
| **Authorization** | Every endpoint rejects absent, malformed and expired tokens. Horizontal privilege escalation: user A cannot read, modify, share, or delete user B's resources by ID substitution. |
| **RLS** | Covered in T1, re-asserted here at the API layer |
| **Input validation** | Fuzzing against our own backend: oversized payloads, malformed JSON, unicode and null-byte injection, SQL metacharacters, path traversal in filenames, content-type mismatch on upload |
| **Headers** | CSP present and restrictive, HSTS, X-Content-Type-Options, X-Frame-Options / frame-ancestors, Referrer-Policy |
| **CORS** | Only permitted origins accepted; credentials handling correct |
| **Secrets** | No key material in the client bundle; JWKS exposes public keys only, never private |
| **Rate limiting** | Our own backend's limits fire, return 429 with `Retry-After`, and the UI degrades gracefully (overlaps T2) |
| **OWASP Top 10 + OWASP LLM Top 10** | Checklist mapped to our surface, with an owner and evidence per item |

#### 5b. Requires written authorization from Jayant

Draft the authorization request as a Phase 2 deliverable. It should specify scope, target environment (staging only), time window, techniques permitted and excluded, rate ceilings, a named contact, and an abort signal.

| Area | Tool |
|---|---|
| Active web scanning | OWASP ZAP |
| Known-vulnerability probing | Nuclei |
| API fuzzing against the real contract | Schemathesis |
| Rate-limit and abuse testing | k6 with adversarial profiles |

#### 5c. Model protection — the reverse-engineering concern

This addresses Joy's stated experience of attempted reverse engineering, and maps to the threat model already in `architecture-alignment-v4.md` §8.

**Prompt injection corpus.** Delivered through **two** vectors:

1. The prompt field — the obvious one
2. **Uploaded documents** — a poisoned PDF or DOCX containing instructions aimed at the Thinking Brain. This is the more dangerous vector and the one that typically goes untested.

Assertions — the output must never reveal:

- system prompts or instruction text
- token probabilities, logits, confidence scores, or internal model state
- infrastructure detail, file paths, or internal service names
- **model identity or provider name.** This is a commercial risk as much as a security one. `security-posture.md` §2 deliberately does not name the Tier 2 providers in public-facing material. A model that identifies itself by name in output is an enterprise-sales incident.

**Model extraction simulation.** Systematically varied prompts at volume from a single account and a single IP, asserting that per-user, per-IP and per-account rate limiting actually fires and that anomaly detection flags the pattern — rather than merely existing in a design document.

**Output hygiene.** Automated assertion that no API response carries confidence scores, logits or model metadata, per the v4 output controls.

#### 5d. Privacy and compliance — operational tests

Compliance claims are testable. These are the ones that appear in enterprise vendor reviews:

| Claim | Test |
|---|---|
| DSAR fulfilment | Submit a request; assert data export completes and is complete |
| Deletion within 30 days | Trigger deletion; assert all user rows, files and vectors are gone; assert the signed deletion certificate is issued |
| EU data residency | An EU-region user's data writes to Frankfurt, not us-east-1 |
| Retention windows | Records past their retention window are purged on schedule |
| Audit log immutability | UPDATE and DELETE are rejected, including by a privileged role |
| Audit log completeness | Every event class in v4 §7 produces exactly one entry |
| Sensitive-data boundary | Assert no analysis content and no uploaded file content is ever written to the product-side RDS tables — a schema-level and runtime assertion. This is the claim the entire security page rests on. |

### T6 — Output quality evaluation

**Runs:** nightly (structural) + weekly (LLM-judged). Begins once real APIs are wired.

Rationale: functional tests confirm the product renders what it receives. They cannot confirm the analysis is any good. *"Zero hallucinations. Every insight cited to source"* is the core product claim and the reason the ICP would pay. It needs continuous evidence.

**Golden set:** ~25 fixed prompts spanning the eight ICPs and both launch depths (Brief, Study). Fixed, versioned, and never changed without recording the change — otherwise trend data is meaningless.

**Structural scoring (deterministic, nightly, cheap):**

| Check | Assertion |
|---|---|
| Citation resolvability | Every red-dot anchor resolves to a source with a reachable URL |
| Provenance separation | Cited findings never draw from `crowd_sourced`; Signal blocks never draw from `curated` (Phase 2 feature, test scaffolded now) |
| Link integrity | Every exec-summary insight and question has a `section_id` present in the response |
| Completeness | No empty sections; page count within tolerance of the depth's promise |
| Numeric self-consistency | Figures in the exec summary appear in the sections they reference |
| Chart validity | `chart_data` satisfies the shape constraints of its declared type |
| Latency SLO | Brief and Study complete within their promised windows — the "15 minutes" claim, measured |

**LLM-judged (weekly, ~25 reports):** the residue that structure cannot capture — does the conclusion follow from the evidence presented; is the register consistent with the selected style (MBB, Big 4, academic, PE); is anything asserted without support.

**Treated as a trend signal, never a release gate.** LLM judging carries a false-positive rate. Structural checks are the gate.

### T7 — Production monitoring

**Runs:** continuously, from Phase 5.

**External (black-box) — proves the product works for a real user:**

- Multi-region uptime probes (3+ regions), 1-minute interval — BetterStack or UptimeRobot free tier
- **One full Playwright synthetic journey every 15 minutes**: sign in → compose → layout proposal returns. A real browser running a real journey. A `/health` endpoint returning 200 while the app is unusable is the standard failure of naive monitoring.
- TLS certificate expiry monitoring
- DNS and CloudFront edge reachability

**Internal (white-box) — under the granted read access:**

- Sentry: JS errors, unhandled rejections, and RUM, with enough context to identify *which* user hit *which* dead state
- CloudWatch alarms on error rates, latency percentiles, RDS CPU and connections, ElastiCache memory, WebSocket pod health
- Product backend structured logs with correlation IDs threaded through to Jayant's requests

**SLOs — so that "is it up?" has a numeric answer** (added; not in the original brief):

| SLO | Target | Error budget |
|---|---|---|
| Availability (synthetic journey succeeds) | 99.5% | ~3.6 hrs/month |
| p95 page load | < 2.5s | |
| p95 API response (product backend) | < 500ms | |
| Analysis completion rate | > 98% of started analyses reach `complete` | |
| Time-to-first-report (activation proxy) | median < 20 min | |

Error-budget burn drives the release decision. Budget exhausted means the next change is a fix, not a feature.

**Auto-remediation runbook.** Scoped honestly to what the granted access permits. Four actions, each with a rate limit, a kill switch, and an audit entry:

| Trigger | Automated action | Guardrail |
|---|---|---|
| Stale asset / cache mismatch detected by synthetic | CloudFront invalidation | Max 2/hour |
| Frontend error rate spike > 5× baseline for 5 min | Roll back S3 to previous versioned deploy | Max 1/hour; notify immediately |
| Analysis job stuck beyond 2× expected duration | Retry once, then release the wallet reservation | Max 1 retry per job |
| WebSocket reconnect storm | Apply backoff, shed load, alert | Alert always |

**Everything else escalates.** The escalation is not an alert — it is a diagnostic bundle: what broke, when, the failing synthetic trace, correlated logs, affected user count, and the matching runbook entry if one exists. Routed to Jayant's team via webhook. The value proposition to his team is that they receive a diagnosis, not a ticket.

**Explicitly not claimed:** this is not self-healing infrastructure. Four bounded actions plus fast, well-evidenced escalation is what the access model permits, and overselling it would be a disservice.

### T8 — Dashboard

**Platform:** Grafana Cloud free tier. Two panes, because the audiences differ.

**Pane 1 — Operations:** availability against SLO, error-budget burn, p50/p95/p99 latency by endpoint, synthetic journey status by region, active incidents, auto-remediations fired in the last 24h, infrastructure health (RDS, ElastiCache, WebSocket pods), error rate by type with Sentry links.

**Pane 2 — Product and utilisation:**

| Metric | Why |
|---|---|
| **Signups → first report generated (activation rate)** | The single most important number. Currently unknown. §Funnel of CLAUDE.md names measuring it as an immediate priority — the dashboard should answer it on day one. |
| Time-to-first-report, median and p90 | The Aha! moment, quantified |
| Analyses started / completed / failed, by depth | |
| Reports by ICP category | Which segment actually uses the product |
| Wallet: balance distribution, spend rate, top-up conversion | |
| Trial → paid conversion | Target 3–5%, from ~0.1% |
| Concurrent analyses vs the 500 capacity ceiling | Early warning before the ceiling is hit |
| Feature usage: red dot opens, chart switches, exports, Ask Caspr | Which parts of the product earn their build cost |

Fed by CloudWatch, synthetic results, Sentry, and a small product-events endpoint on our backend.

---

## 6. Phasing

Nothing begins until the build is complete and committed to git. Unit tests accruing during the build are the build's output, not this apparatus.

| Phase | Trigger | Deliverables |
|---|---|---|
| **0** | Now | This spec + implementation plan. No test code. |
| **1** | Build complete and committed | T0 static gate · T2 journeys and fault matrix · T3 performance budgets · CI wiring |
| **2** | Pre-handover | T4 load (stubbed) · T5a static security · authorization request drafted · **handover package for Jayant** |
| **3** | Jayant wires live APIs | T1 contract vs real · T4 real-pipeline validation · T5b active (on authorization) · T5c model protection · T6 output eval |
| **4** | Pre-cutover | Full suite green · DR and backup-restore drill · rollback rehearsal · **go/no-go decision** |
| **5** | Live | T7 monitoring and runbook · T8 dashboard · observability MCP wiring |

---

## 7. Handover package for Jayant

Produced in Phase 2. The objective is that Jayant can verify his own integration without us in the loop.

1. **Contract conformance suite**, runnable standalone against his endpoint with a single command. Failures name the field that drifted.
2. **Integration notes**: the mock → real swap procedure, the environment variables, what changes and what does not.
3. **Deployment instructions** per the agreed AWS architecture, aligned to the existing `bitbucket-pipelines.yml`.
4. **Test gate specification**: what must be green before a deploy proceeds.
5. **The authorization request** for active security testing, ready to sign.
6. **Open items**: the outstanding §11 questions from v4, plus his concurrent-analysis capacity number, which the load profile depends on.

---

## 8. Tooling

### Test stack

| Layer | Tool | Rationale |
|---|---|---|
| Unit, contract | Vitest + fast-check | Already in use |
| Journey, synthetic | Playwright | Already available via MCP; one tool serves both PR journeys and production probes |
| Performance | Lighthouse CI + Playwright timings | |
| Load | k6 OSS | Native WebSocket and SSE support — required, given the real bottleneck |
| Static security | Semgrep OSS, gitleaks, osv-scanner | |
| Active security | OWASP ZAP, Nuclei, Schemathesis | Post-authorization |
| Database | pglite | Real PostgreSQL semantics, including RLS, without a container |

### MCP servers — for low-effort incident triage

Purpose: diagnose a production incident from a conversation without a human pulling logs by hand. This is what makes need 4 low-effort in practice.

Registry search returned no results at time of writing, so these are specified by published source and **must be verified at install time (Phase 5)** rather than assumed available:

| Server | Source | Gives us |
|---|---|---|
| Sentry MCP | Sentry official (hosted remote, OAuth) | Query errors, issues and RUM data directly |
| Grafana MCP | `grafana/mcp-grafana` (self-hosted binary) | Query dashboards, alerts, metrics |
| AWS CloudWatch MCP | `awslabs/mcp` suite | Query logs, metrics, alarms under the granted read access |

### Project skills to author

| Skill | Purpose |
|---|---|
| `caspr-triage` | Encodes the runbook, escalation rules and diagnostic-bundle format, so triage does not re-derive them each time |
| `caspr-release-check` | The pre-push gate: which suites must run against which target before a change ships |

---

## 9. Tradeoffs and accepted risks

| # | Tradeoff | Consequence | Mitigation |
|---|---|---|---|
| 1 | No external penetration test before cutover | Cannot claim "independently penetration tested" in a vendor security review. A materially weaker answer for the enterprise ICP. | Automated scanning, documented threat model, written security posture. Revisit at first enterprise deal or funding. |
| 2 | Load testing our layer, not the AI pipeline | Proves our layer scales; says nothing about Jayant's | Jayant load-tests to 500 and provides the number. Small real-pipeline run validates the seam. |
| 3 | Auto-remediation limited to four actions | Not self-healing | Fast, well-evidenced escalation for everything else. Scope stated honestly rather than oversold. |
| 4 | LLM-judged evaluation has false positives | Cannot gate releases on it | Trend signal only. Structural checks are the gate. |
| 5 | Free-tier observability | Sampling limits; no distributed tracing | Structured logging with correlation IDs compensates. Upgrade path costs ~$100/mo when needed. |
| 6 | Zone C testing bounded by authorization | Blind spots inside Jayant's infrastructure | Contract tests assert behaviour at the boundary. Escalation covers the rest. |

---

## 10. Flagged for decision — outside the apparatus

Two live public claims surfaced while reading the source documents. Neither is a testing finding, but both carry exposure:

1. **`security-posture.md` §6 states *"External penetration test: Planned Q3 2026"* and §1 states *"SOC 2 Type I report expected Q3 2026."*** It is now August 2026. Both appear on the `/security` page and in the enterprise objection-handling script. They need either delivery or revised dates before a prospect checks.

2. **"Zero hallucinations" is an absolute claim** in `CLAUDE.md` and in marketing copy. The T6 eval harness exists precisely to find counterexamples, and eventually it will. Better found internally than by a PE client. Worth considering whether the provable claim — *"every insight cited to source"* — should replace the unprovable one.

---

## 11. Success criteria

The apparatus is working when:

1. A change cannot reach production without passing T0–T3.
2. Jayant can verify his integration by running one command and reading its output.
3. Every async path in the product has a tested, designed failure state — no unresolving spinners, no blank panes.
4. The 500-concurrent target is proven, not assumed.
5. A production incident produces a diagnosis and, where permitted, a fix, without a human being woken.
6. The activation rate — signup to first report — is visible on a dashboard, continuously.
7. The security claims Caspr makes publicly are backed by tests that run on a schedule.
8. Total recurring cost stays under $20/month and token consumption is dominated by authoring, not running.

---

*Document: `docs/superpowers/specs/2026-08-12-product-testing-apparatus-design.md`*
*Owner: Joy Sharma*
*Depends on: `architecture-alignment-v4.md` (integration contract) · `security-posture.md` (claims under test) · `pricing-model.md` (wallet invariants) · `BUILD-STATUS.md` (build rules)*
