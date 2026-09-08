> **⛔ HISTORICAL DOCUMENT — vocabulary below is superseded.**
> This predates **2026-08-27**, when **the Thinking Brain and the Learning Brain were retired together.**
> The architecture is now **Source. Assess. Conclude.** — [`source-assess-conclude.md`](source-assess-conclude.md).
> **The body is left unedited on purpose:** it records what was true when it was written. **Do not copy
> vocabulary out of it.**

# For the website session — what changed in the product, 2026-08-21

Five things decided or discovered on the app side that reach the website. **Two of them are the website's problem more than the app's**, so they are first.

---

## 1 · The accessibility exposure applies to caspr.ai, not just the app

We audited the app against WCAG 2.2 AA and found **2,094 text nodes failing the 4.5:1 contrast minimum**. Three brand colours were the cause, and **the website uses the same palette**:

| Token | On white | Verdict |
|---|---|---|
| `#9c9b98` | **2.78:1** | Fails everything, including the 3:1 UI floor |
| `#8a8a85` | **3.47:1** | Fails as text |
| **`#e8453c` — the accent** | **3.93:1** | **Fails as text.** Fine as a fill or a border |
| `#5c5b58` | 6.79:1 | Passes |

**The accent is the one to check first.** Red text on a light background fails, and a marketing site uses accent text far more freely than an app does — links, eyebrows, emphasis, CTA text on pale surfaces.

**The app's fix, for consistency if you take it:**

- Quiet text floor → **`#75746f`** (4.68:1). The two old quiet greys collapse into one — nothing lighter than ~`#767570` can pass, so the ramp goes from four levels to three
- **Red text on light surfaces → `#be3530`** (5.61:1), already in the palette. `#e8453c` is unchanged as a fill and a border
- Disabled text is **exempt** — WCAG excludes inactive controls

**This is a legal exposure, not a preference.** The **European Accessibility Act has applied since 28 June 2025** and reaches us extraterritorially. Full ruling: `product/design-guidelines.md` §1 → "Text contrast".

**The lint worth adding to both codebases:** fail the build when `#9c9b98`, `#8a8a85`, `#8b8a96` or `#e8453c` is used as a text fill on a light surface.

## 2 · The website needs an `/ai-disclosure` page

EU AI Act **Article 50** has been in force since **2 August 2026**.

We decided **against** a banner or modal — Caspr sits comfortably inside the "obvious from context" exemption, and a compliance interstitial on the first-run screen would cost activation we cannot afford. Instead: **a permanent footer link**, already added to all 19 onboarding footers:

> `Security · Privacy · Terms · AI disclosure · © 2026 Caspr`

**The page it points at does not exist yet.** It needs to state: that Caspr is an AI system, what the Thinking Brain and Learning Brain do, that outputs are generated and cited, and where sources come from. Short.

**A layout note from doing it:** the added item pushed the footer past the 120px margin. Desktop footers are now right-anchored to **x=1320**, mobile centred. If the live footer is a fixed-position string, it will overflow.

Spec: `product/ai-disclosure-spec.md`.

## 3 · Header and footer — one implementation, and the app cannot import yours

We told the app to import `caspr-web/components/layout/Header.tsx`. **That was wrong and is corrected** — `caspr-website` is Next.js, `caspr-app` is a Vite SPA on react-router, and those components bind to `next/link` and `next/navigation`. Only `Wordmark` is portable.

**The drift has already started: the app has four hand-built onboarding headers.** The onboarding screens sit *under the real site header*, so any divergence shows on the highest-intent pages we have — the ones a user sees straight after signing up.

**Recommended: extract a shared router-agnostic package** — `Header`, `Footer`, `Wordmark`, `CTAButton` as presentational components taking `href` strings and a `LinkComponent` prop, each app passing its own. **This is a website-repo decision as much as an app one**, which is why it is here.

## 4 · Two near-blacks, deliberately kept apart

The app's primary text is now **`#1a1a17`** (`text/primary` → `brand/ink`).

**The website keeps `#0a0a0a`**, and the app's onboarding nav and footers are bound *directly* to it — 70 nodes — precisely so they keep matching the live site. **This is intentional. Do not "fix" either one to match the other.** `design-guidelines.md` §1.

## 5 · Custom templates — real, priced, and NOT to be promised as live

**Decided:** $1,000 one-time per template · three for $2,500 · **Business ($600) and above may purchase** · **Enterprise includes the first**. Repeatable — consultants and agencies work across client brands.

**`website-proposal-v2.md` §122 already says custom templates must not be presented as live. That still holds** — this is **Phase 1.5**, and `template_id` is `null` until it ships.

**What the website may do now:** carry it on the pricing page as a **Coming soon** line under Business and Enterprise, with the price. What it must not do: imply it is available, or take money for it.

**Why the price is what it is**, in case pricing-page copy needs the argument: a boutique agency charges **$1,500–3,500** for a branded deck template. We sit under that deliberately, and the copy should say so — *"less than a design agency charges for the template alone, and this one applies itself to every report you run after it."* At $1,000 with no framing, a low price reads as low value.

### 5a · The 2-hour response commitment — a positioning asset the site should use

**Custom-template enquiries are answered within 2 hours, round the clock, all year** (Joy, 2026-08-21). **No qualifier** — no business hours, no timezone, no "next working day". A request at 23:00 is answered by 01:00.

**This is worth more to the site than to the product.** The alternative a buyer is weighing is a design agency, and agencies reply in days. *Two hours, any hour* is a hard, checkable differentiator of exactly the kind the brand is built on — a specific number rather than an adjective, which is the house style.

The unqualified string is deliberate and resourced. **Do not soften it into "business hours" on any page** — an unqualified promise that turns out to be qualified is worse than never making it.

⚠️ **Scope — confirmed by Joy: the custom-template request inbox only, for now. This is the part most likely to go wrong on a website.**

**Never write it as general support.** No page may carry *"2-hour support"*, *"24/7 support"*, or *"we reply within 2 hours"* without its subject attached. The claim is always: *"custom-template requests, answered within 2 hours."*

The temptation is obvious — a bare *"2-hour response, round the clock"* is a better headline than the scoped version, and it will read as a support promise to every visitor. **It would be an overclaim, and the kind a prospect tests on day one.** Keep the subject in the sentence.

Scope may widen later; until it does, copy must not widen it.

Full mechanics — where the nudge lives, when it fires, who sees it: `product/phase-map.md`.

---

## Also worth knowing

- **The phase map is now one document** — `product/phase-map.md` supersedes the scattered "Phase 2" and "Coming soon" markers across six files that had drifted apart. **Anything the site labels "Coming soon" should be checked against it**, since some items moved *into* launch (infographic regenerate, the user-education layer) and others hardened into Phase 2 (Insights, Updates, Intelligence depth, Connect-a-source).
- **A spacing scale now exists** — `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64` (`design-guidelines.md` §9). It was prose until now, and its absence is what had stalled the app's Auto Layout conversion. Worth adopting on the site for the same reason.

---

*Design session · 2026-08-21.*
