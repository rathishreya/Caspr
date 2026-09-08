# Onboarding / Sign-up — spec (for dev)

*Locked concept 2026-07-31 (Joy). Design built in the app Figma file `y2F394I4CwEeSzH2kKuDCt`, page 🚀 Onboarding (`184:3`). Website design system referenced from `rmurwf7WT9B4kKhXcju3ro` (Caspr.ai — Website Redesign) but rendered with the **web-app fonts** (Instrument Serif / Inter / DM Mono), not the reference file's Source Serif Pro.*

## The concept — onboarding IS the live tool, gated at the value moment

The signup experience is **the real Caspr tool, running unauthenticated, framed by the website nav + footer.** The user actually *uses* Caspr — writes a prompt, gets clarifying questions — and only hits the signup wall at the moment of peak intent (the gate, with the theater beginning to play). No account is requested until effort is invested and value has landed. This directly targets the activation gap.

### Flow (refined 2026-08-01, Joy — the "generate" trigger fixes the earlier logic gap)

1. **First-time-user page** — website nav (top-right = **"Login"**) + welcome + prompt bar + suggestions. User prompts here.
2. **Conversation + layout** — the tool converses in the **pane** while the drafted **structure cards** fill the **centre**. User reviews the layout.
3. **User confirms "generate" IN CHAT** — they say they like the layout and want the output. **Caspr replies "…calling my Ghost minions to read the sources…" and THIS starts the Theater** (Source-Web spectacle) in the centre, and the **gate slides in inline** (pane/drawer) with the **"Start free — first $100 on Caspr"** button, ~~no cost shown~~ **showing the actual cost — superseded 2026-08-25, `showcase-and-auth-spec.md` §4a**.

   > **The cost must be shown, and it is load-bearing.** The charging model depends on it: a user who declines after signup is charged only the light call's small cost, and that is fair *because they agreed to the larger figure at the gate*. Hide the cost and they agreed to nothing, and the deduction becomes a charge nobody consented to. Building the no-cost version silently breaks the economics two documents away.
   - *Why this matters:* the Theater is real work — it can't start before the user says go. The **gate is no longer the trigger for anything**; it's the signup capture layered over a Theater that's already earned its wow. If the user stalls at the gate, nothing was left running behind an un-pushed gate.
4. **Signup wall** — the signup overlay fires when the user **clicks the gate button OR the Theater has played ~3 seconds** (the "OR" is now logically sound because the Theater is already playing). It overlays the **dimmed Theater** (translucent dark from below the header). The **"Start free" stays a button** (NOT converted to a chat nudge — Joy).
5. **Returning users** — Login overlay.

## Pages (desktop built on 184:3)

- **Login** (`1167:146`) — website nav (keeps "Start Free →") + `#f6f5f3` band + centred white card ("Welcome back", Google/LinkedIn/Outlook, work email, red "Continue with email", Terms/Privacy) + "New to Caspr? Start free →" + website footer.
- **First-time-user** (`1170:146` desktop · `1289:377` mobile) — website nav (CTA = "Login") + three-line stack: greeting *"You're in. Let's get to work."* (Inter 16/13, secondary) → identity *"Not an assistant. An analyst."* (Instrument Serif 42/24) → proof *"Every source, credible. Every claim, triangulated. Every report, defensible."* + **prompt bar** + **5 Type cards** + website footer. *(Rebuilt 2026-08-20: the old descriptor line was deleted as an echo of the identity line, and the retired "15 minutes. 100 pages. Cited to source." was replaced by the proof. **Mobile is centre-aligned — stack and card text both — on this screen only.**)*
- **Gate + Theater** — website nav (Login) + LHS gate pane (no cost, "Start free — first $100 on Caspr") + centre theater. *(building)*
- **Signup / Login overlays** — centred modal on a dimmed centre. *(overlays pending re-build on the website system)*

## Suggestions on the first-time-user page

Two mechanisms run together (Joy: keep both):
- **Prompt-bar placeholder that flips** through example prompts (Option 1).
- **5 square Type cards** below the bar (Option 2), each = Type name + one-liner + a click-to-prefill example.

### The 5 cards = the 5 core Types (not more)

Keep the count at **5** — the universal top layer of the taxonomy. Every one of the 15 research types and the 6 website use-cases rolls up into these. Do **not** expand to a wall of cards (that reintroduces the paralysis the page exists to defeat). Extra granularity lives *underneath* (as the example prompts, and expandable after a card is chosen). **Depths (Brief · Study · Intelligence) stay OUT of the first run** — depth is chosen at the gate, not here.

| Type | One-liner | Default example (prefills the prompt) |
|---|---|---|
| Market Analysis | Market size, competition, category reads | Size the EV charging market in Southeast Asia to 2030. |
| Diligence | Company, target and executive deep-dives | Due-diligence read on Acme Corp ahead of a Series B. |
| Deal Sourcing | Acquisition targets and investable sectors | Acquisition targets in European logistics tech. |
| Research Synthesis | Regulatory and evidence — one clear read | What's changing in EU AI regulation, and who's exposed? |
| Strategy | Market entry, business cases, theses | Build the business case for entering India's EV fleet market. |

### ICP-based personalization (DEV SPEC)

Carry the entry ICP into the first run to greet each user in their own language (lifts activation; matches the ICP-landing-page / watering-hole strategy). **Detect the ICP** from the referrer path / UTM off the marketing ICP pages (`/consulting`, `/investors`, `/agencies`, `/strategy`, `/startups`, `/category-managers`, `/academic`), or the signup segment. Then, on the **same 5 cards**:

1. **Reorder** — lead with that ICP's primary Type.
2. **Swap the card `↳` example prompts** to ICP-flavoured ones.
3. **Flavour the flipping placeholder** to match.

**No new UI** — same 5-card structure, personalized content. Fallback (no ICP known) = the generic examples above.

#### What flexes, and what never does (Joy, 2026-08-20)

The count stays at five in **every** case — known ICP and unknown alike. Joy considered varying it (4 when the ICP is known, 6–8 when it isn't) and rejected it: cutting to 4 hides a Type from someone whose need is that Type, and there is nothing *above* five to add, so 6–8 forces a downward split into overlapping cards — the paralysis this page exists to defeat. Detection is also lossy (shared links, stripped referrers, a consultant browsing `/investors`), and **reordering degrades gracefully where filtering fails hard**: a wrong guess must never remove the card they came for.

**The dividing line is the prompt bar** (Joy, 2026-08-20): *"don't change any text above the prompt bar."*

A card carries three lines — **① Type name** (`Market Analysis`), **② one-liner** (*Market size, competition, category reads* — what the Type covers), **③ `↳` example** (*Size the EV charging market in Southeast Asia to 2030*).

| Element | Flexes by ICP? | |
|---|---|---|
| Hero stack — *"You're in…" / "Not an assistant. An analyst." / "Every source, credible…"* | **No** | Above the bar. It is the positioning; it is not re-cut per audience. |
| **Prompt-bar placeholder** | **Yes** | 5–10 prompts per ICP, flipping. Subtle, draws the eye by moving, and sits in the one element the user must touch. Library: [`onboarding-placeholder-prompts.md`](onboarding-placeholder-prompts.md) §3. |
| **Card order** | **Yes** | The ICP's lead Type goes first, and takes the full-width card on mobile. |
| Card ① Type name | **No** | It is the taxonomy label. |
| Card ② one-liner | **No** | It defines what the Type covers. A Type that reads differently per user is not a taxonomy — and ③ already does the recognition job, more concretely. |
| **Card ③ `↳` example** | **Yes** | Per ICP, one per Type — 40 strings in [`onboarding-placeholder-prompts.md`](onboarding-placeholder-prompts.md) §5. |

**Nothing above the prompt bar ever changes.** Below it, personalisation is carried by *which card is first* and *the two sample-prompt layers* — the flipping placeholder and the card examples. Both are drawn from the same authored library, so what flips in the bar and what sits on the cards never contradict each other.

**Mobile promotes rather than filters.** The lead Type's card is **full-width at position 1** (x16 w358, ~h108), with the remaining four in a 2×2 beneath at 173 wide, 8px gutters. That signals *"this is you"* while keeping all five Types on screen, and it removes the orphaned fifth card that a 5-item 2-column grid produces. Desktop stays 5-across — no orphan there, so order alone carries it. Built: `1289:377` (mobile) · `1170:146` (desktop).

**Lead Type per ICP.** The *"prompt skew"* column below is the brief; the authored strings it produced — both the flipping placeholders and the per-ICP card examples — live in [`onboarding-placeholder-prompts.md`](onboarding-placeholder-prompts.md).

| Entry ICP | Lead Type | Prompt skew *(the brief)* |
|---|---|---|
| Investors | Diligence / Deal Sourcing | "Due-diligence read on [target]" · "Acquisition targets in [sector]" · "Investment thesis for [space]" |
| Consulting | Market Analysis | "Competitive teardown of [category]" · "Market sizing for [market]" |
| Strategy / Corp Dev | Strategy | "Should we enter [market]?" · "Business case for [initiative]" |
| Agencies | Market Analysis | "Client industry deep-dive for [pitch]" · "Category landscape for [brand]" |
| Startups | Strategy | "Investor-ready market sizing for [product]" · "Business case for [round]" |
| Category Managers | Market Analysis | "Category read on [segment]" · "Competitive landscape for [aisle]" |
| Academic | Research Synthesis | "Literature synthesis on [topic]" · "Market context for [thesis]" |

## Design system (website replication)

> **⚠️ Header & footer are INDICATIVE only.** The nav and footer in these Figma frames are hand-replicated approximations and do **not** exactly match the live site. **During dev, reuse the LIVE website components** (`caspr-web/components/layout/Header.tsx`, `Footer.tsx`, `components/ui/Wordmark.tsx`, `CTAButton.tsx`) — do not rebuild from these frames. Same for tokens: use `caspr-web/app/globals.css`. The Figma frames are for the onboarding-specific content only (login card, first-run welcome + cards, gate box, signup/email-sent overlays).
>
> **This holds on mobile too, and mobile is where it matters most (Joy, 2026-08-20).** The mobile frames draw a simplified 56px bar — wordmark plus a text "Login" — which is a placeholder, not a design. Mobile nav resolves to the website's hamburger (see §Pending). **Use the website's mobile header as-is; do not reproduce what the frame draws.** Applies to every onboarding screen at both breakpoints: Login, First-Time User, Gate + Theater, Signup / Email-Sent, Forgot password, Set new password, Reset link sent, Terms overlay. A second header implementation drifts from the marketing site the moment either changes — and the drift lands on the highest-intent screens we have.

Rendered with **web-app fonts** (from `caspr-web/app/globals.css`): `--font-display: Instrument Serif`, `--font-text: Inter`, `--font-mono: DM Mono`. Colours: accent `#e8453c`, ink `#0a0a0a`, surface-1 `#f6f5f3`, border `#e2e1de` / strong `#c8c7c4`, footer bg `#070605`.

- **Nav** (1440×72, white, bottom border): wordmark "Caspr"+red "." (Instrument Serif ~26) at x=120; links Solutions · Use Cases · Analyses · Pricing · Blog (Inter Medium 14); right button = red "Start Free →" **or** "Login" on tool/first-run pages. 120px side margins.
- **Footer** (1440×360, `#070605`): wordmark + tagline + social + 5 columns (Product · Solutions · Use Cases · Company · Trust & Legal) + divider + copyright. Full-height tool views (Gate+Theater) omit the footer.

## Pending

Mobile versions of all pages (nav → hamburger, cards stack). Signup/Login overlays re-built on the website system.

---

## Update — workflow review (2026-08-17)

- **Pre-prompt / draft title = muted "New analysis"** (sentence case), never `…` (ellipsis is reserved for in-progress). Built: analyses pane desktop `1037:1892` + mobile `965:1660`.
- **The 3–5s question-wait is a Learning STATE of the layout canvas, not a new screen.** Draft layout shows immediately; eyebrow → `… · LEARNING`; the scope questions are replaced by a red pulse dot + *"Reading your live pipelines to sharpen the questions…"* + `PREPARING YOUR QUESTIONS` + skeleton bars; the centre draft shows later sections still forming (gentle live-revision — single settling changes, never a wholesale reflow). Built: desktop `2138:4416` + mobile `2139:4497`.
- **Sample reports** are the primary activation asset — a real, finished, cited report seeded into every account, left post-generation so Ask/Edit/Outputs are live. Mechanism in `../app-handoff/SAMPLE-REPORTS.md`; content populated post-launch.
