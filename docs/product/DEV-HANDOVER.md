# Caspr Product App — Developer Handover

**From:** Joy (product/design) · **To:** the development session (front-end + product-side backend build)
**Date:** 2026-08-10 · **Status:** Design handoff — ready to begin build against mocks.

> **Read this whole document before writing a single line of code.** It defines what you are building, the one source of truth, the seven rules you must not break, and where every spec lives. If anything here conflicts with your instinct to "just build it," this document wins.

---

## 0. What you are building

The **Caspr product app**: a React SPA **and** a product-side backend, in a **new repo**, deployed AWS-native. Caspr is Analytical AI — the app is the tool where a user enters a prompt and receives an analyst-grade, cited report. The design is complete in Figma. Your job is to reproduce it **exactly** and wire it to a mocked backend now, swapping in Jayant's real AI endpoints as they land.

The website (`caspr.ai`) is a **separate, frozen** codebase — out of scope. Do not touch it.

---

## 1. ⛔ THE SEVEN NON-NEGOTIABLES

These are hard rules from Joy. They are not suggestions. A violation of any one is a failed handoff, no matter how good the rest is.

### 1. NEVER recreate or invent a design. Pull everything from Figma.
- Every screen, component, colour, font, size, spacing, icon, and state already exists in the Figma file. **Use it.**
- If something you need appears to be **missing** from Figma: **STOP. Do not build it from assumption, do not approximate, do not "fill the gap."** Tell Joy exactly what is missing. She will create the frame in Figma, and you build **only after** it exists.
- "I couldn't find it so I made a reasonable version" is the single most damaging thing you can do here. Missing = blocked = ask. Never missing = permission to invent.

### 2. Pixel-identical to Figma. Per-screen. Always.
- Joy has spent days refining every screen individually. The build must be **pixel-identical** to Figma — position, size, colour, font family, weight, letter-spacing, radius, shadow, spacing.
- **If the "same" component looks different on another screen in Figma, that difference is intentional.** Do not normalise it, do not de-duplicate it into one shared component that flattens the difference. Replicate what each screen actually shows. When in doubt, match the frame, not your mental model of the component.
- Verify by screenshot diffing against the Figma frame (see §3). Do not eyeball-and-move-on.

### 3. Responsive across every device class — this is core UX.
- Must work flawlessly on: **laptops at all common resolutions** (1280→1920+ wide, and scaled-DPI displays), **phones** (iPhone *and* Android, small and large), **tablets of varying aspect ratios**, and **the new generation of foldables** (many of our ICP use them — dual-aspect, fold/unfold reflow).
- Figma provides desktop (1440-class) and mobile (390-class) frames. The **breakpoints between and beyond them are yours to engineer** — fluid, not fixed. If a layout decision between breakpoints is ambiguous or not shown in Figma, **ask Joy** rather than guessing.
- Test on real viewport ranges, portrait and landscape, and fold/unfold transitions. No horizontal-scroll bleed, no clipped text, no broken touch targets.

### 4. Code quality to Jayant's bar.
- **Best practices**, idiomatic, reviewed-code standard. Jayant (CTO) is exacting and will read this.
- **Documentation** as you go — architecture notes, component docs, README, inline where it earns its place.
- **NO hardcoded references.** No hardcoded domains, absolute roots, API URLs, keys, ports, or environment assumptions. Everything injected via **environment/config**, all internal paths **relative**. Re-pointing local → `new.caspr.ai` → `caspr.ai` must be a **config change, never a code change**. (This is already a hard rule in the architecture contract — `architecture-alignment-v4.md §1`.)
- **Tests** — meaningful coverage, not theatre. See §9 definition of done.

### 5. Keep the API handshake document current.
- The integration contract is **`architecture-alignment-v4.md`** (now v4.1). If your build reveals that the contract with Jayant needs to change, **update that document and tell Joy immediately** so she can forward it to Jayant. Do not let the code and the contract drift.
- *(Already actioned this cycle: v4.1 addendum records hosted Stripe "Model B", AWS SNS phone/OTP, SG entity/USD payout, and the notifications/nav work. None of those changed Jayant's §7 contract — all product-side.)*

### 6. Security is critical. Assume you will be attacked.
- Cyberattacks are **expected**. The proprietary models and user data are the crown jewels — protect them (`architecture-alignment-v4.md §2, §8`).
- Every request authenticated (short-lived JWT, refresh rotation, no long-lived creds). No public unauthenticated endpoints. Input validation and output encoding everywhere. No secrets in code or the bundle. Anti-abuse (rate limits, WAF, anti-SMS-pumping on OTP). Sensitive data (analysis content, uploaded files) **never** touches the product-side layer or any third party.
- Follow OWASP; treat every input as hostile; least-privilege IAM. When a security decision is non-obvious, choose the more conservative option and note it.

### 7. Performance must be top-notch. Test everything after building.
- Minimum lag, **no hung states**, no frozen UI, no unbounded spinners. Every async path has a loading state, an error state, and a timeout (the states are already designed — see §7 scope map / `figma-dev-readiness-review.md`).
- Optimise bundle size, render performance, and perceived latency (skeletons, optimistic UI where the design calls for it). **Test the built product** across the device classes in rule 3 before calling anything done.

---

## 2. Source of truth: the Figma file

**File key:** `y2F394I4CwEeSzH2kKuDCt` — "Caspr App — Design System / Screens".
Read it with the Figma MCP (`figma-use` skill). Reference frames by **node ID**. Verify with `get_screenshot` on the node.

**Canonical pages (build from these):**
- `🧩 Components — Core` — the master components. Instances cascade from here. Match these.
- `📝 Report Creation` — the core loop: compose → gate → Theater → generating → report reader (red dots, Ask Caspr, Contents/Versions/Outputs).
- `📁 Documents` — Documents library + Data Room + Document View + all file-management flows + states.
- `👤 Profile & Wallet` — account, settings, wallet, payment flow, phone verification.
- `📊 Insights` — **Phase 2 / "Coming soon."** Build the entry points and the coming-soon state only; do not build Insights internals.

**NON-canonical — DO NOT build from these:**
- `🧭 Exploration · Mobile + Desktop` — scratch/experiments. Ignore. (It still contains old nav variants; they are not the design.)
- `🗑 Deprecated — pending deletion` — dead frames. Ignore.

**Authoritative frame index:** `caspr-figma-state-registry.md` — the registry of screens/states with their node IDs. Use it to locate the right frame; if a screen you need is not in the registry and not on a canonical page, treat it as **missing** (rule 1 → ask Joy).

**Pixel-match workflow (per screen):** open the Figma frame → read its structure/tokens → build → `get_screenshot` the Figma node and compare against your rendered output at the same viewport → fix deltas → only then move on. Match masters from `🧩 Components — Core`, but honour per-screen differences (rule 2).

---

## 3. Spec index — where everything is written down

All under `docs/product/`. Read the ones relevant to the surface you're building.

| Doc | What it covers |
|---|---|
| **`architecture-alignment-v4.md`** (v4.1) | **The integration contract with Jayant.** Auth (self-hosted JWT, no Clerk), MCP tools, generation payload, real-time events, charts/infographics, Stripe Model B, AWS SNS, security, config discipline. Start here for anything backend/contract. |
| `app-shell-framework.md` | The shell: rail, panes, drawers, navigation grammar. |
| `navigation-flow-map.md` | Every element → its destination screen. Use this to wire navigation (the Figma file has **zero** prototype reactions by design — this doc is the wiring map). |
| `figma-dev-readiness-review.md` | The readiness pass + **§8 notifications/nav** + the full empty/error/loading **state system** (which frame is which state). |
| `motion-and-interaction-states.md` | Motion tokens (frequency-gated), per-interaction motion, hover/focus/pressed/disabled, a11y, `prefers-reduced-motion`. |
| `design-guidelines.md` | Colour, radius scale, typography, logo, nav, list rows, dividers, spacing, §13 file-list/row-actions/scrim/progress rules. |
| `notifications-spec.md` | Toasts (built) + bell entry points + **Alerts/Notification-Center = Phase 2, not yet in Figma** + user-education layer (Phase 2). |
| `gate-output-spec.md` | The gate (single pre-gen confirmation), output metering, tiers, formats, language, style. |
| `data-room-screens.md` | Data Room file management (cards, `≡` menu, tag, upload-to-centre, delete-confirm, scrim rule). |
| `document-taxonomy.md` | Type/Depth/Status model + **the Lingo layer** (ICP-variable labels resolved at runtime — see below). |
| `documents-categorization-alignment.md` | Documents categorisation (5 core Types, GICS sectors, status-as-tag, sort→group dividers). |
| `copy-standards.md` | Voice guardrails + consistency rules + **which strings are Lingo tokens**. |
| `account-wallet-screens.md` | Account/wallet/payment/phone-verification screen specs. |
| `onboarding-understanding.md` | Onboarding = signup IS the live tool, gated at the value moment. |
| `updates-feature-phase2.md` | Updates / re-analyse feed — **Phase 2**. |
| `theater-visualization-spec.md`, `visualization-library.md` | Theater beat + the chart/visual library + generation economics. |

**Lingo (important, easy to get wrong):** some on-screen labels (deliverable Type/Sub-type only — e.g. "Business Case") are **resolved at runtime** by `(slug × account-ICP) → label`. Figma always shows the **canonical/default** word; the spec marks these as `{lingo: slug}` tokens. Wire the lookup; do not hardcode the displayed word. Fixed strings (Brief/Study/Intelligence, file states, wallet/UI labels) never alias. Detail: `document-taxonomy.md §Lingo` + `copy-standards.md §3`.

---

## 4. Build workflow

1. **Scaffold** the new product-app repo (React + Vite + TypeScript + Tailwind v4, per `architecture-alignment-v4.md §3`). Config-driven from day one (rule 4).
2. **Mock-first.** Build the entire UI against a **mock MCP server + mock auth + mock wallet**. No blocking dependency on Jayant.
3. **Swap** mocks → Jayant's real MCP tools/endpoints as they land (§7 of the contract), one at a time.
4. **Deploy target:** S3 + CloudFront (SPA); product backend in the shared AWS account (EKS or API-GW+Lambda, TBD with Jayant).
5. **Test:** load test to the 500-concurrent guardrail + **third-party penetration test before go-live** (`architecture-alignment-v4.md §10`).
6. **Cutover:** single-shot to `new.caspr.ai` → `caspr.ai` on green. Website untouched.

---

## 5. Scope map — build now / Phase 2 / pending from Joy

**Build now (Phase 1, designed & in Figma):**
- Core loop: compose → gate → Theater → generating → report reader (inline red dots, Ask Caspr, Contents/Versions/Outputs).
- Documents + Data Room + Document View + all file management + search + every empty/error/loading state.
- Account / settings / wallet / **payment (Stripe Model B hosted)** / **phone verification (OTP via AWS SNS)**.
- Shell: labelled desktop rail, mobile header + bottom nav (**Analyses · Documents · Wallet · More**), drawers.
- **Toasts** (built) + **bell entry points** (built).
- Onboarding = gated signup-as-tool.
- **Auth = email + password** (NOT passwordless / magic-link) **+ all three OAuth (Google · LinkedIn · Outlook) from day one.** Screens: Login (desktop `1167:146` / mobile `1286:377`) and Signup (desktop `1182:127` / mobile `1303:429`) each carry a password field; Login has a "Forgot password?" link and a "Log in" CTA; Signup has a "Create a password" field + requirements hint. **Password reset chain:** Forgot password (`1881:2` / `1881:47`) → Reset link sent (`1964:2` / `1964:31`) → Set new password (`1963:2` / `1963:26`). Email Sent (`1183:252` / `1303:560`) is **signup email-verification**, a separate flow from reset. **Radius: overlay/modal cards = 12px; the controls inside (inputs, OAuth rows, CTA) stay 2px; page content cards = 2px** (per `design-guidelines.md §2`).
  - **Signup consent — implicit, minimum friction (Joy 2026-08-11):** **no checkbox, no gating.** All buttons (OAuth + email CTA) are **always active**. A single passive line sits **below the buttons**: "By continuing, you agree to our **Terms of Use** and **Privacy Policy**." — clicking any signup button = agreement (industry-standard implicit consent). Terms/Privacy mentioned **once**; **signup only** (removed from login). The **Terms of Use / Privacy Policy** links open an **in-app Legal overlay** — desktop scrimmed modal `1978:364` (centred over the centre screen area) / mobile bottom drawer `1979:2` — **one reusable overlay** (swap title + content for Terms vs Privacy); dismiss via a **"Close" button at the bottom** (no ✕ — we don't use ✕ anywhere). Content piped from the website legal source; Figma shows **placeholder** legal text.
  - **Overlay content alignment (Joy 2026-08-11):** on the auth overlay cards (login · signup · forgot · reset-link-sent · set-new-password · email-verification) **all content is centre-aligned EXCEPT the email/password input fields and the password-requirements hint** (those stay left-aligned). OAuth button labels and CTAs are centred. The **Legal Terms/Privacy overlay keeps its document body left-aligned** for readability (headings/paragraphs), with the Close button centred.
- Depths: **Brief + Study only.**

**Phase 2 (coming-soon placeholders only — do NOT build internals):**
- **Insights** depth/detail.
- **Alerts / Notification Center** screen (bell opens a stub until Joy designs it — `notifications-spec.md §3`).
- **Updates / re-analyse** feed.
- The Signal · What Changed · enterprise custom templates · infographic Regenerate · output watermarking · user-education layer.

**Pending from Joy (blocked — ask before building):**
- Anything not present on a canonical Figma page or in the state registry (rule 1).
- The Notification Center frame (Phase 2, Joy to design).
- Between-breakpoint / foldable reflow decisions not shown in Figma (rule 3 — ask).

---

## 5a. Reference / demo frames — do NOT build these 1:1

Some frames in Figma are **references, proposals, or component demos** — deliberately not literal screens. They are tagged in their names (`(ref)`, `(representative)`, `(for review)`) or are obvious demo compositions. **Do not reproduce them as standalone screens.** They exist to show intent; build the real thing they point to.

| Frame | What it is | What to build instead |
|---|---|---|
| `1629:2` **"Account — section center-states (ref)"** | A tall reference sheet stacking the desktop Account section's centre-pane states for review. | Build the desktop Account hub (`1596:2`) with its centre-pane sections; use this sheet only as the **visual reference** for those centre states. |
| `1603:2` **"Compact card options (for review)"** | A design exploration of card options. | Nothing — the chosen option is **already applied** to the live Wallet/Account screens. |
| `157:260` / `165:261` **"Theater — Source Web (representative)"** | Representative **snapshots** of the generative Theater visualisation (it renders dynamically). | Build the Theater per `theater-visualization-spec.md` — do not pixel-copy these stills. |
| `1922:2` **"Toasts — Desktop"** · `1928:76` **"Toasts — Mobile"** | Demo compositions showing the toast **component** overlaid on a real screen. | Build the toast as a **reusable component** per `notifications-spec.md`; it is not a page. |

**Rule of thumb:** if a frame's name carries `(ref)`, `(representative)`, `(for review)`, or is a "Toasts —" demo, treat it as guidance, not a build target. If you're unsure whether a frame is a real screen, **ask Joy** (rule 1) — do not build it speculatively.

### Account — what's real (so the account screens aren't ambiguous)
The Account area **is** production; only the `(ref)` sheet above is not. Build:
- **Mobile:** the `Account · …` section screens (Details, Security, Preferences, Notifications, Research profile), the **Menu (open)** `1669:2`, the drawers (Edit name `1698:2`, 2FA `1698:37`, Language `1698:86`, Password `1700:2`, Edit phone `1884:107`, Verify phone `1895:3`), and the confirms (Change email `1658:98`/`1662:2`, Reset `1662:52`, Delete `1658:151`, Sign-out device `1864:33`).
- **Desktop:** the Account hub **`Profile — Desktop v3` `1596:2`** + the desktop action frames (Change email enter/sent `1646:2`/`1646:54`, Reset `1646:106`, Delete `1646:158`), Research profile desktop `1736:2`, and Wallet desktop `1532:2`. Account sections render in the **centre pane** (pane-vs-centre grammar) — `1629:2` is the reference for those centre states.
- **There is no separate "Settings" destination** — settings live **inside Account**. The nav word is **"Account"**, never "Profile".

---

## 6. Recommended model for the dev session

Given rule 4 (Jayant's quality bar), rule 6 (security), and the architectural scope (a real backend + auth + payments + AWS-native infra), **run the dev session on the most capable model — Opus (latest, e.g. Opus 5), high reasoning.** This is not routine CRUD; the cost of a subtle auth/security/contract mistake is high, and Opus is materially stronger at architecture, security reasoning, and holding a large spec in context.

- If the dev session is currently on Sonnet or a smaller model, **switch it to Opus** for the architecture, auth, payments, security, and integration work.
- Sonnet is acceptable for clearly mechanical, well-specified sub-tasks (e.g. translating one finished Figma frame to markup) to control cost — but default to Opus, and never drop below it for anything touching auth, payments, security, or the Jayant contract.
- **Joy:** if you need to change the session model, do it from the app's model selector (the CLI `/model` dialog isn't available here).

---

## 7. Definition of done

A screen/feature is done only when **all** hold:
- [ ] **Pixel-identical** to its Figma frame at desktop and mobile, verified by screenshot comparison (rule 2).
- [ ] **Responsive** and tested across laptop resolutions, iPhone, Android, tablet aspect ratios, and foldable fold/unfold — portrait and landscape (rule 3).
- [ ] **All states** present and wired: default, empty, loading, error, disabled — matching the designed state frames (`figma-dev-readiness-review.md §states`).
- [ ] **Motion** matches `motion-and-interaction-states.md`, including `prefers-reduced-motion`.
- [ ] **No hardcoded references**; config-injected; relative paths (rule 4).
- [ ] **Secure**: authed, validated, no secrets in bundle, abuse-guarded (rule 6).
- [ ] **Performant**: no hung states, every async path has loading+error+timeout, measured (rule 7).
- [ ] **Documented + tested**.
- [ ] Nothing was **invented** — every pixel traces to Figma; anything missing was raised with Joy, not filled in (rule 1).

---

*Owner: Joy · 2026-08-10. Entry doc for the Caspr product-app dev session. Pair with `architecture-alignment-v4.md` (contract) and the Figma file (`y2F394I4CwEeSzH2kKuDCt`).*
