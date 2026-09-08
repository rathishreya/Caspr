# Engineering standards — proposal

**Status: proposal, nothing adopted.** Researched 2026-08-20 against current
published versions, not from memory. Where I am asserting from knowledge rather
than from a source I checked today, it says so.

**What this is for.** Caspr sells to consulting firms, PE/VC and corporate
strategy teams. Those buyers run security questionnaires, and increasingly
accessibility and AI-governance questionnaires. Standards are not hygiene here —
they are a **sales gate**. A named standard also gives a reviewer something to
check against instead of forming an impression, which is what happened last week.

---

## 0 · The short answer

| Area | Standard | Why this one |
|---|---|---|
| **Application security** | **OWASP ASVS 5.0.0, Level 2** | The one document an appsec programme can anchor to. Verifiable, ~350 numbered requirements |
| **Accessibility** | **WCAG 2.2 AA** (via EN 301 549) | **Legally required now** for EU customers |
| **Performance** | **Core Web Vitals p75** + a hard bundle budget | Directly tied to the activation problem |
| **AI risk** | **OWASP Top 10 for LLM Apps 2025 + Agentic 2026**, inside **NIST AI RMF** | Names the risks; RMF is the loop that manages them |
| **AI law** | **EU AI Act Article 50** | **Enforceable since 2 Aug 2026** |
| **Payments** | **PCI DSS 4.0.1, SAQ A** | Stripe does *not* discharge this for us |
| **Supply chain** | **NIST SSDF (SP 800-218)** + CycloneDX SBOM + SLSA provenance | Attacks doubled in 2025; buyers now ask for SBOMs |
| **Org certification** | **SOC 2 Type II** or **ISO 27001** — one decision, §7 | Whichever your revenue geography demands |
| **Code quality** | typescript-eslint strict + **jsx-a11y** + react-hooks + Prettier | The floor. We currently enforce **3 rules** |

Three of these are **live legal obligations we are already exposed to**, not
aspirations. They are §3, §4 and §5.

---

## 1 · Application security — OWASP ASVS 5.0.0, Level 2

ASVS 5.0.0 shipped May 2025 — the largest revision in the project's history:
**17 chapters, ~350 requirements**, with new chapters for Web Frontend Security,
Self-Contained Tokens, and OAuth/OIDC. Guidance is explicit that starting at 5.0
now is cheaper than adopting 4.0.3 and migrating later.

**Level 2 is the right target.** L1 is a smoke test; L3 is for systems where
lives or national security are at stake. L2 is the standard for an application
handling money and confidential business data — which is exactly Caspr: identity,
a wallet, a ledger, and clients' commercial research.

**What it gives us that we do not have:** the numbered requirement. "Is it
secure?" is unanswerable. "Does it satisfy V6.2.3?" is a yes or no a reviewer can
check and we can evidence. It also directly covers ground I built by instinct —
the two-role RLS model, the scrypt hashing, the token rotation — none of which is
currently mapped to a requirement anyone could audit.

**Immediately relevant chapters:** V3 Web Frontend Security (CSP, Trusted Types),
V9 Self-Contained Tokens (our JWTs), V10 OAuth/OIDC (Google sign-in).

**Also adopt:** a **strict CSP with per-request nonces and `strict-dynamic`** —
the 2026 best practice, and the only CSP approach compatible with a framework
that injects scripts at runtime. Plus `nosniff`, HSTS, `frame-ancestors`,
Referrer-Policy, Permissions-Policy. We currently ship none of these.

---

## 2 · AI risk — OWASP GenAI + NIST AI RMF

These layer, they do not compete:

- **NIST AI RMF** — the management loop: identify, measure, treat, monitor.
- **OWASP Top 10 for LLM Applications 2025** — the named risks that loop must
  address (prompt injection, insecure output handling, and the rest).
- **OWASP Top 10 for Agentic Applications 2026** (published Dec 2025) — *extends*
  the LLM list rather than replacing it. Caspr is agentic: it plans an analysis,
  calls tools, and acts across steps. This list is the closer fit.
- **ISO/IEC 42001** — the certifiable AI management system. Later, and only when
  a buyer asks for it.

**The one that matters most for us today is prompt injection into report
content.** Caspr ingests 25M+ sources and the user's own Data Room uploads, then
generates a document. A poisoned source that changes what the report says is not
a hypothetical for a research product — it is the product's threat model.

---

## 3 · AI law — EU AI Act Article 50 · **live since 2 August 2026**

Enforcement of the transparency obligations began **2 August 2026**. They apply
regardless of risk tier — this is not a "high-risk system" question.

Two obligations land on us directly:

1. **Disclose AI interaction** no later than first interaction, unless obvious
   from context. Our conversational scoping flow is squarely in scope.
2. **AI-generated content must be marked in a machine-readable format and be
   detectable as AI-generated.** Caspr's entire output — a 100-page PDF or a
   PPTX — is generated content. Right now nothing we emit carries such a marker.

This is a live gap with a regulator attached, and it is cheap to close (document
metadata + provenance marker). It should not wait for a rewrite.

---

## 4 · Accessibility — WCAG 2.2 AA · **enforcement began June 2026**

The European Accessibility Act became enforceable **June 2025**, with member-state
enforcement from **June 2026**. It is **extraterritorial** — it applies to any
business serving EU consumers wherever it is headquartered. French advocacy groups
filed emergency injunctions against non-compliant retailers in November 2025, so
this is being enforced, not merely legislated.

The harmonised technical standard is **EN 301 549 v3.2.1**, which operatively
means **WCAG 2.1 AA today**; v4.1.1 incorporating **WCAG 2.2** is expected.
**Build to 2.2 AA** — it is a superset, and rebuilding to it later costs more.

**This is our worst-scoring area by a distance.** Measured on the current build:

| Signal | Current | Meaning |
|---|---|---|
| Heading elements across 151 files | **16** | No document structure. A screen reader gets flat text |
| `onClick` handlers vs `<button>` | **218 vs 202** | Interactive elements that are not buttons |
| `eslint-plugin-jsx-a11y` | **not installed** | Nothing catches it |
| axe / automated a11y testing | **none** | Nothing measures it |

This is a direct consequence of the absolute-positioning approach: a layout built
from `<span>`s at fixed coordinates has no semantic structure to expose. **The
accessibility failure and the responsiveness failure are the same defect.**

---

## 5 · Payments — PCI DSS 4.0.1, SAQ A

**Using Stripe does not make us compliant, and this is the most commonly held
misconception in the area.** The iframe is sandboxed; **the page that frames it is
not**. Analytics, session replay, chat widgets and A/B tooling all run in the same
top-level browser context, and a script there can read the DOM, overlay a fake
field on the iframe, or redirect the form on submit.

The January 2025 SAQ A moved requirements **6.4.3** (every script on a payment
page inventoried, justified, authorised, integrity-verified) and **11.6.1**
(tamper detection on payment-page headers and scripts) out of the questionnaire
and into the *eligibility criteria*. Enforcement began **31 March 2025**.

**Practical consequence:** we must keep a script inventory for any page in the
payment flow, and be able to show a timestamped record that we would have detected
a change. A screenshot is not evidence. The cheapest compliant posture is to keep
third-party scripts off those pages entirely — which is achievable now, and gets
much harder once marketing tooling is added.

---

## 6 · Performance — Core Web Vitals, budgeted in CI

Targets, at the **75th percentile of real users** (all three must pass):

| Metric | Good | Note |
|---|---|---|
| **LCP** | < 2.5 s | Loading |
| **INP** | < 200 ms | Responsiveness — the most commonly failed in 2026; 43% of sites miss it |
| **CLS** | < 0.1 | Visual stability |

Plus a **bundle budget: < 200 KB compressed initial JS**, the standard figure.

**Where we stand: 206.76 KB.** Just over, after the ECharts fix took it from
579 KB. Before that fix we were nearly 3× the budget.

**Why this is commercial, not technical.** Activation is the funnel problem —
1,500 signups, ~2 paid. Time-to-first-report begins with time-to-first-paint.
Only 47% of sites pass CWV in 2026, and the rest lose 8–35% of conversions.

**Enforce in CI, not in review.** Automated checks catch 100% of regressions;
code review catches roughly 20%. Lighthouse CI on every PR, plus real-user
monitoring in production — the lab number and the field number answer different
questions and we need both.

---

## 7 · Organisational certification — one decision needed from you

Both are ~65–75% overlapping controls, so the second is far cheaper than the first.

- **SOC 2 Type II** — the default request in **US** B2B procurement. Type I is
  achievable in 2–4 months and unlocks early deals; roughly $15–30k cheaper than
  ISO 27001 for a company our size. Flexible scoping: one product, not a whole
  management system.
- **ISO 27001** — what **EU/UK/APAC** buyers and NIS2-regulated customers ask for.

**Recommendation: lead with your higher-revenue geography, add the other within
18–24 months.** Given the ICP list leans UK/EU, ISO 27001 may be the right lead —
**but that is a revenue question, not an engineering one, and it is yours.**

One thing to protect: we have already checked and confirmed **no "SOC 2
certified" claim exists anywhere in the build or the specs**. Keep it that way
until an auditor says otherwise.

---

## 8 · Supply chain — SSDF, SBOM, provenance

Supply-chain attacks **more than doubled in 2025**; 70%+ of organisations
reported an incident, ~$60bn in cost, 454,600 new malicious packages. Enterprise
buyers now ask for SBOMs in diligence.

The accepted trio: **SBOM for visibility, SLSA provenance for integrity, SSDF for
governance.**

- **SBOM in CycloneDX** (OWASP's format) generated **at build time** by Syft or
  Trivy, signed and attached to the artifact — not as a post-hoc export.
- **SLSA Build L2 → L3.** L3 (hardened builder, non-falsifiable provenance) is
  the current bar for US federal procurement, and a good north star.
- **NIST SSDF SP 800-218** as the governance mapping — it is what SOC 2 and buyer
  questionnaires increasingly reference.

Cheap to start: emit an SBOM per build, verify at deploy, map controls to SSDF.

---

## 9 · Code quality and delivery — the floor we do not currently meet

Nothing here is exotic. It is the baseline any reviewer expects.

| Control | Standard | Current |
|---|---|---|
| Linting | typescript-eslint **strict** + jsx-a11y + react-hooks | **3 rules total**, added on day 154 of 154 |
| Formatting | Prettier + `.editorconfig` | none |
| TS strictness | `strict`, `noUncheckedIndexedAccess` | partial |
| Layout rule | **flow/grid first; absolute only for true overlays** | violated 836 times |
| Breakpoints | defined scale, tested width matrix | one custom breakpoint |
| File size budget | ~300 lines, enforced | largest file 813 |
| Architecture decisions | **ADRs** | none — which is how the backend language was chosen invisibly |
| Commits | Conventional Commits | prose, inconsistent |

**And the testing layer that would have caught what shipped:**

- **Playwright** across a real width matrix (360 / 768 / 1024 / 1280 / 1440 / 1920)
- **Visual regression** (Chromatic or Playwright snapshots)
- **axe** in CI
- **Lighthouse CI** with the budgets above

Our 829 tests run in **jsdom, which has no layout engine** — `getBoundingClientRect`
returns zeros. That suite is structurally incapable of detecting an overlap, an
overflow, or a section covered by a rectangle. It was never going to catch this.

*(§9 is the one section drawn mainly from established practice rather than a
source I re-verified today. The tooling names are stable and uncontroversial;
the specific thresholds are proposals, not citations.)*

---

## 10 · Proposed sequence

**Tier 0 — before another line of application code.** Free, and they change how
everything after them is written: adopt ASVS 5.0 L2 as the security spec, WCAG
2.2 AA as the accessibility target, the CWV + bundle budgets, and write the
**layout rule** down. Turn on strict lint, jsx-a11y, Prettier. Write the first
three ADRs (layout, backend language, auth model).

**Tier 1 — the legal exposures, in parallel and not waiting for a rewrite.**
EU AI Act Art. 50 disclosure + content marking (§3). PCI script inventory and
tamper detection (§5). Security headers and CSP (§1).

**Tier 2 — the enforcement, ~90 days.** Playwright width matrix, visual
regression, axe and Lighthouse in CI, SBOM per build, secret scanning.

**Tier 3 — sales-driven, 6–12 months.** SOC 2 Type II or ISO 27001 (§7), external
penetration test against ASVS L2, ISO 42001 when a buyer asks.

---

## What I need from you

1. **SOC 2 or ISO 27001 first** — a revenue-geography decision (§7).
2. **ASVS Level 2 confirmed** as the target, or L1 if you want it cheaper sooner.
3. **Whether Tier 1 legal items get done now**, separately from any rebuild. My
   recommendation is yes — they are small, and two of them have regulators.

---

*Sources:*
[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) ·
[ASVS 5.0.0 release](https://scotthelme.co.uk/owasp-asvs-5-0-0-is-here/) ·
[ASVS 5.0 developer guide](https://www.securecodinghub.com/blog/owasp-asvs-developers-complete-guide) ·
[Core Web Vitals 2026](https://www.corewebvitals.io/core-web-vitals) ·
[CWV thresholds & SEO impact](https://meteoraweb.com/en/analisi-dei-dati-e-metriche/core-web-vitals-2026-lcp-inp-cls-thresholds-and-seo-impact) ·
[Performance budgets in CI](https://www.codewithseb.com/blog/performance-budgets-frontend-engineers-guide) ·
[SOC 2 vs ISO 27001](https://soc2auditors.org/insights/soc-2-vs-iso-27001/) ·
[SOC 2 vs ISO 27001 comparison](https://atlantsecurity.com/learn/iso-27001-vs-soc-2) ·
[European Accessibility Act guide](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) ·
[SaaS EAA / EN 301 549](https://www.accessibility.works/blog/saas-eaa-compliance-european-accessibility-act-en-301-549-requirements/) ·
[EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/) ·
[Commission enforcement from 2 August](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) ·
[OWASP Top 10 for LLM / Agentic](https://docs.modulos.ai/frameworks/owasp) ·
[AI governance framework layering](https://alice.io/blog/ai-risk-management-frameworks-nist-owasp-mitre-maestro-iso) ·
[PCI DSS 6.4.3 & 11.6.1 with Stripe](https://cside.com/blog/does-stripe-make-you-pci-compliant-6-4-3-11-6-1) ·
[PCI DSS client-side compliance](https://cside.com/blog/pci-dss-4-0-1-requirements-6-4-3-11-6-1-client-side-compliance-guide) ·
[Supply chain: SBOM, SLSA, SSDF](https://petronellatech.com/blog/the-supply-chain-security-trifecta-sbom-slsa-ssdf/) ·
[2026 supply chain guide](https://cloudsmith.com/blog/the-2026-guide-to-software-supply-chain-security-from-static-sboms-to-agentic-governance) ·
[Security headers 2026](https://appsecbrief.com/articles/http-security-headers-guide-2026/) ·
[CSP strict-dynamic (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
