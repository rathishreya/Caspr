# Design session — the auth overlays and the demo header

**2026-08-25.** Paste everything below the line into the design session.

Source of truth for the model: [`docs/product/showcase-and-auth-spec.md`](../product/showcase-and-auth-spec.md), locked by Joy today. This asks for the frames that spec needs. **Five frames; three are adaptations of work that already exists.**

---

You are the **design session** for Caspr. Figma file `y2F394I4CwEeSzH2kKuDCt` — *Caspr App — Design System + Screens*. The onboarding screens live on page **`184:3`**.

## Why this exists

Caspr's signup model is *"onboarding IS the live tool, gated at the value moment"* — a visitor uses the real product, unauthenticated, and only meets a signup wall once effort is invested and value has landed.

The build got the screens right and the journey wrong. Every frame was reproduced faithfully and nothing connected them, so clicking **Start Free** from a cold login page landed on a theater analysing a prompt the user never wrote, over a conversation they never had. Joy found it by walking the journey — which nothing in the test suite does.

The fix is a model where **login and signup are always overlays over the demo**, never pages, never over anything else. The frames below are what that model needs and does not have.

**One rationale worth carrying into the design** (Joy): a visitor who opens the login card and changes their mind is left standing *in the demo*. They came to log in, decided not to, and are now one step further into the product rather than back on a marketing page. A cancelled auth becomes a trial rather than a bounce. **The card is never a dead end — what is behind it is always somewhere worth being.**

## The rules the design must satisfy

From the spec. These are decided; please design *within* them rather than re-opening them.

1. **The overlay never changes what is behind it.** Open signup while a visitor is mid-conversation and there is a conversation behind it — no theater, no substituted screen. That is correct, not a missing state.
2. **The header sits above the scrim and stays live.** The scrim dims the content, not the chrome. This is how somebody escapes the imposed signup card: no close button, no trap, and the way out is the control that has been there all along.
3. **Switching swaps the box, not the scrim.** Login ↔ signup exchanges the card in place. The scrim does not flash and the background does not move.
4. **Three signup triggers, three tones.** Volunteered (they clicked the CTA), imposed (three seconds into the theater), required (they tried something that needs an account — today, attaching files).

## What is already locked — do not re-decide

| | Value | Source |
|---|---|---|
| **Scrim** | Black **@ 0.42** | `design-guidelines.md` §13, locked 2026-08-08 |
| **Overlay card radius** | `radius/soft` **12px** — and §2 already names *"auth: login · signup"* as overlay surfaces | §2 |
| **Controls inside the card** | stay at radius **2**. The contrast is the point, not an inconsistency | §2 |
| **Focus ring** | **1.5px**, keyboard-only, never clipped, never covered by a scrim or drawer | §10a |
| **Red as text** | `#e8453c` is a **fill, never a text colour** (3.93:1). Red text on light is `#be3530` | §1 |
| **Fonts** | three, no additions | FINAL UI lockdown |

## Two working rules, and they are not style preferences

### Reuse. Never recreate.

**Take the existing component. Instance it, or clone it. Do not hand-draw a new one that looks the same.**

This has gone wrong repeatedly and the failure is always quiet: a hand-rebuilt element matches at a glance and carries a wrong value inside it — a radius of 8 where the scale says 2, `#e9453c` where the token is `#e8453c`, a 13px where the type ramp says 12.5. Nobody sees it in Figma. It ships, and then the build and the file disagree about something neither can prove.

Concretely, for these frames:

- The login card is **`1167:146`'s card**, instanced — not a new rounded rectangle with the same fields typed into it
- The scrim is the **existing** scrim treatment from the confirmation modals, not a new black fill at an eyeballed opacity
- The signup variants are **the same component** as `1182:127` in different copy states, not three separate cards
- If something you need does not exist as a component, **make it one** and say so, rather than drawing it twice

### Reflow. Never reposition.

**Auto Layout on every container. Nothing is placed by coordinate.**

The build has just spent a week on the consequences of the alternative: **559 absolutely-positioned elements**, text clipped because a Figma text-box height was transcribed as a CSS height, and sections overlapping the moment a string ran longer than the one it was drawn with. A frame laid out by coordinate photographs perfectly and breaks on the first real sentence.

So:

- **Auto Layout**, with real direction, gap and padding — not a frame with children nudged into place
- **Text hugs.** A paragraph's height is its content's, never a fixed value. A fixed height on text is the single most expensive habit in the file
- **Spacing from the scale.** Not an arbitrary value that happens to look right at this one string length
- **Resizing behaviour set deliberately** — fill, hug, or fixed, chosen per element rather than inherited from however it was drawn

These two frames make the rule especially load-bearing: the card swaps between login and signup at **different heights**, and the header sits over content of wildly different density. Both only work if the layout reflows rather than holding positions.

## The frames

### 1 · Login as an overlay — desktop + mobile

**Adapt, do not redraw.** `1167:146` (desktop) / `1286:377` (mobile) is the login **page**: marketing header, `#f6f5f3` band, centred white card, footer. **The card is already right.** Take it out of the page and put it on a scrim.

- Drop: the band, the site header, the footer
- Keep: the card, its contents, its dimensions (358 compact / 400 expanded)
- Add: the scrim, and the *"New to Caspr? Start free →"* switch that currently sits below the card

Mobile: match the signup overlay's existing treatment at `1303:429` so the two behave identically — if that is a centred card, this is a centred card; if it is a sheet, this is a sheet.

### 2 · The header above the scrim — **the one that matters**

This is the only genuinely new design problem here, and everything else depends on it.

The scrim dims the content at 0.42 black. The header does **not** dim — it stays fully lit and fully interactive, because it is the escape from an imposed signup card. So the frame has to answer:

- **How does a lit header read against a dimmed field without looking like a rendering error?** A bright bar over a dark wash can read as a z-index bug rather than a deliberate affordance.
- **Does it need a boundary?** A rule, a shadow, a slight lift — or does the contrast alone carry it?
- **How does it read as *interactive*?** Somebody looking at an imposed card must be able to tell, without instruction, that the header is still theirs to use. If they cannot, the card is a trap in practice however dismissible it is in code.

Please draw it for **both** breakpoints and against **both** backgrounds — a quiet one (the conversation) and a busy one (the theater). The theater is the harder case and the one it will be seen against most.

### 3 · Signup card — the volunteered and required variants

`1182:127` / `1303:429` exists and is the **imposed** variant. Same card, two more copy states:

| Variant | Must convey |
|---|---|
| **Volunteered** | Nothing was blocking them. Must not imply an interruption that did not happen |
| **Required** | **Why it appeared.** A card that materialises after a click with no explanation reads as a bug — *"Attaching your own sources needs an account"* |

**Copy is Joy's, not the design session's.** Please draw the states with placeholder text at the right length and flag the strings for her.

### 4 · Website header — desktop and mobile

Both a **signup button** and **Login** as text.

- **Desktop:** both visible.
- **Mobile:** button visible, **Login inside the hamburger.** The nav links need a hamburger regardless, so Login joins something that already exists rather than adding an element. The asymmetry is deliberate — a new visitor should never hunt for the way in; a returning user knows what they are looking for and will take one tap.

**The button's wording is GTM's and is not settled.** Draw it with *Start free* as a placeholder and size the slot for something slightly longer.

### 5 · The login ↔ signup swap

Rule 3, drawn: what moves and what does not.

The scrim stays. The card exchanges. Show the before, the after, and enough of the transition that a developer knows whether the card cross-fades, slides, or resizes — and what happens if the two cards are different heights, which they are.

## What the dev session needs out of this

- Layers named so the z-order is legible: **scrim below header, card above scrim, header above everything.**
- The scrim's exact treatment where it meets the header — the boundary is the thing being specified.
- Both breakpoints for every frame.
- The copy strings flagged for Joy rather than invented.
- **Components, not detached copies.** A detached instance is invisible in a screenshot and becomes a divergence nobody can trace — it is how the file and the build stop agreeing.
- **Auto Layout on everything handed over.** A frame that arrives positioned by coordinate gets transcribed as absolute positioning, and that is the defect the last week was spent removing.

## What is deliberately not asked for

The demo screens themselves — D0 `1170:146`, the scoping state `1301:3280`, the theater `1177:3075` — are drawn and correct. Nothing about them changes. The problem was never the screens; it was that nothing connected them and the overlay brought its own fabricated background.
