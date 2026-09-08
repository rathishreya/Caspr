# Dev response — pixel audit pass 1

**Commits `3f59701` (pixel pass) + `96d5df1` (env), on `caspr-ai/caspr-product`.**
Gate: 0 typecheck, 0 lint, **720 tests** (723 − 3 deleted with `allowanceNote`), build clean.

Everything below that says "measured" was measured in the browser with
`getComputedStyle` / `getBoundingClientRect` at 1440×900 and 390×844 — not read
off the source.

---

## What changed

| # | Node / file | Was | Now |
|---|---|---|---|
| 1a | `CompactEditVisual.tsx` | `OR JUST ASK`, 10.5 semibold caps, ls 0.84, `text-placeholder` | `<OrLabel>Or just ask</OrLabel>` — measured italic 13/19, `rgb(92,91,88)`, `text-indent 18` |
| 1b | same, Caspr message | 12.5 / `normal` / `#2a2927` | 13/19 / `rgb(26,26,23)` |
| 1c | same, `EditCostLine` | `top 228` | `top 227.5` — **my call**, see below |
| 2 | `--color-edit-body` + 6 nodes | `#2a2927` | token deleted, `text-ink`. Measured: **0** elements anywhere compute `#2a2927` |
| 3 | `Conversation.tsx` `UserBubble` | `shell:text-[12.5px] shell:leading-[15px]` | dropped — measured 13/16 `rgb(26,26,23)`, right edge 438, desktop and mobile alike |
| 4 | `2328:5590` desktop edge-prompt | 95/297, w327, inset 32, serif 26/32 | 91/350, w336, inset 24, serif **24/30** — see below, it was more than the title |
| 4b | `2310:5470` mobile edge-prompt | flow layout from `pt-36` | frame geometry: title 24/34, body 24/70, button 16/314 358×46, `Not now` 16/372 |
| 5 | `allowanceNote()` + 3 tests | present, uncalled | deleted, with a note in place saying why |
| 9 | `index.css` | 61 of 66 mono sites Regular | one `@layer base` rule → measured **13/13 at weight 500** on `/wallet` |
| 10 | `ScopeQuestions` | 13/18 | measured 13/19 at `x=100, w=338` |
| 12 | `Drawer` · `PeekSheet` · `LegalOverlay` | `border-top: 0px` | measured **1px `rgb(224,222,217)`** = `#e0ded9` on all detents |
| — | `1384:14` `COVER OPTIONS` | routed through `OrLabel` | restored as a caps label — **my finding**, see below |

---

## Three findings were not defects

Two of them come from the same cause, so it is worth stating plainly:
**passes 2 and 3 were run signed out.** The desktop rail, the bottom nav and the
mobile header are all behind `session` in `AppShell.tsx:62`. Signed out you get
the pane and nothing else, which is exactly the shell you measured.

### 7 · The 64px rail — not reproducible signed in

| | Signed out (your measurement) | Signed in |
|---|---|---|
| `main` | `x=0, w=1440` | **`x=64, w=1376`** |
| `aside` | `x=0, w=390` | **`x=64, w=390`** |
| Rail labels | absent | **`Analyses` · `Documents` · `Insights` · `Data Room`, all present** |
| Conversation column | `x=16` | **`x=80, w=358`** |

I reproduced your numbers exactly first, so this is the same app, not a
different build. The `Insights` / `Data Room` you found at zero dimensions are
the `MoreDrawer`, which is the one piece of chrome *not* gated on session.

**To audit the desktop shell, run this in the console before measuring:**

```js
localStorage.setItem('caspr.session', JSON.stringify({
  access_token: 'dev', refresh_token: 'dev',
  expires_at: new Date(Date.now() + 86400000).toISOString(),
  user: { id: 'dev-user', email: 'joy@caspr.ai', name: 'Joy' }
})); location.reload();
```

**But there is a real question underneath it, and it is yours, not mine.**
Onboarding's premise is that signup *is* the live tool, gated at the value
moment — so an anonymous user genuinely works in this app before signing in.
That means the chromeless shell you measured is **a real state a real user
sees**, not just an artefact of how you tested. Whether the signed-out desktop
should carry the rail is a design decision and I have not made it. Right now it
does not, and no frame I can find covers it.

### 11 · The bottom nav — you measured the pane switcher

There are two nav-like elements near the bottom on mobile, and signed out only
one of them exists:

| Element | Measured | Figma |
|---|---|---|
| `PaneSwitcher` (`Action Overlay v3`) | y **730 → 788**, h **58** | `2310:5527` at drawer-relative 350 → 730 abs, h 58 ✅ |
| `BottomNav` | y **788 → 844**, h **56** | `1422:2` at y788 h56 ✅ |

Both are correct as drawn. The h=58 at 730–788 that read as a misplaced nav is
the pane switcher sitting exactly where the frame puts it.

### 9 · The DM Mono 500 face loads fine here

All four faces resolve, including 500 / `U+0-FF`:

```
400 U+100-2BA…  loaded    500 U+100-2BA…  loaded
400 U+0-FF…     loaded    500 U+0-FF…     loaded   ← the one that errored for you
```

The 500 latin face was already `loaded` before I even called `.load()`. Your
instinct to sanity-check it was right — I would treat the `NetworkError` as an
audit-browser artefact unless it recurs.

**The weight half was entirely real**, and is fixed. 13/13 mono elements on
`/wallet` measured 400; they now measure 500.

---

## Calls I made, marked as calls

**Item 9 is one rule, not 61 edits.** `.font-mono { font-weight: 500 }` in
`@layer base`, rather than pairing `font-medium` with each `font-mono`. Base
loses to utilities, so an explicit weight on a mono element still wins — this
sets the default, it does not seize the property. A rule that has to be
remembered 66 times decays, and this particular failure is invisible: Regular DM
Mono still looks like DM Mono, which is why 61 sites drifted without anyone
noticing.

**Item 1c — the cost line moved half a pixel.** `EditCostLine` shared a `top`
with the caps label it sat against. That label was 10px tall; the product line
is a 19px box, so the mono figure and the italic no longer share a baseline.
Desktop `EditVisualPane` already solves this at 504 / 503.5, so I applied the
same offset rather than inventing one.

**Item 4 — the desktop edge-prompt needed more than the title.** The prompt
cited only 26 → 24/30, but the corrected node is `2328:5590`, not `2306:5213`,
and it moved: **91/350, 336×212, inset 24** against the build's 95/297, 327,
inset 32. I rebuilt it to the measured frame. Please confirm 336 — your text
said 336 and my build said 327, and the frame agrees with you.

**Item 4c — the body copy is now the frame's, and I want to flag it.** Both ref
frames carry a second sentence the build did not have. I took it, per the
matching rule. But read the result aloud:

> **Top up to keep editing** — This edit is larger than what's left in your
> balance. **Add funds to keep editing** — your edits and analyses share one
> balance. · [ **Top up** ]

That is the same instruction three times in a 336px box. The clause that earns
its place is the last one, because *one shared balance* is the thing the user
does not already know at that moment. Joy's call, not mine to trim.

**`COVER OPTIONS` — my own finding, the mirror image of item 1.** Where
`CompactEditVisual` kept a caps label that should have become speech,
`EditVisualPane` had turned a label into speech: `COVER OPTIONS` was routed
through `OrLabel`, so it rendered italic with the product-voice dot beside it.

`1384:14` is **Inter Semi Bold 10.5 / `#8a8a85` / ls 0.84**, and the only
product-voice dot in that frame (`2382:5591`) sits against `Or just ask`, not
against this. So the frame treats it as chrome, and I restored it as chrome —
now measured 10.5 / weight 600 / `rgb(138,138,133)` / ls 0.84 / no dot / **97
wide against Figma's 97**.

The reasoning I applied: §10 retires the caps treatment for the **off-ramp
connectors**, because those scroll with the thread and are therefore speech.
This one names the toggle group beneath it. If the intent was broader — that
caps is retired everywhere in the pane — say so and I will convert it, but that
is a change to the frame first.

**`allowanceNote` deleted with a note left in its place.** Deleting it silently
loses why it went. There is now a comment where it was, saying what it did, why
it contradicts a three-state model, and that a pre-wall warning gets decided and
written into the brief rather than recovered from git.

---

## 5b · Yes — it was mid-wiring, and it has landed

Your observation was correct at `08b9d38` and is now stale. As of `096e519`:

| Symbol | Then | Now |
|---|---|---|
| `useEditBudget` | 0 | `pages/WorkingPage.tsx` |
| `EditEdgePrompt` | 0 | `pages/WorkingPage.tsx` |
| `TopUpModal` | 0 | `pages/WalletPage.tsx` |
| `WalletBadge` | 0 | **still 0 — see below** |

So States 1–3 and the top-up flow are live and re-auditable.

`WalletBadge` is a persistent balance chip for the header, and I have left it
unmounted deliberately: `EDIT-ECONOMICS` §2 says no persistent budget chrome,
which is the whole argument for the three states. It is a leftover from the
earlier model. **I would rather delete it than leave it looking approved** — the
same reasoning you applied to `allowanceNote` — but it is a surface, not a
helper, so I am asking rather than deciding. Say the word and it goes.

---

## 7 · State routes for Layer C

You asked about Generation states and Gate variants. Answering exactly:

**Generation — two of the three exist.** `/generation` · `/generation/creating`
(`2186:4565`) · `/generation/failed`. There is **no** `Contact support` route —
it is reached from the failed state, and support composition lives at
`/help/message`. Log it as reachable-by-click, not by URL.

**Gate — one route, no variants.** `/gate` only. The depth variants are driven
by session state, not by path.

**Data Room has four more than you found:** `/data-room/loading`,
`/data-room/search`, `/data-room/failed`, `/data-room/locked`.

**Also directly addressable:** `/report/chart` · `/report/cover` ·
`/report/infographic` · `/report/legacy` · `/documents/:id` · `/layout` ·
`/layout/learning` · `/scope` · `/theater` · `/start` · `/conversation` ·
`/compose` · `/insights` · `/wallet` · `/wallet/no-transactions` ·
`/wallet/top-up` · `/wallet/top-up/{custom,success,declined}` ·
`/wallet/billing` · `/wallet/plans` · `/account/:section` ·
`/account/{change-email,email-sent,delete,security}` ·
`/account/research/{sample,empty}` · `/help` · `/help/message` · `/toasts` ·
`/verify` · `/signin` · `/signup` · `/welcome` · `/forgot-password` ·
`/reset-link-sent` · `/set-new-password` · `/email-sent` · `/sign-out`.

**Added for you: `/report/edge-prompt`.** The State-3 prompt fires only when a
specific edit exceeds a specific balance, so there was no way to point a review
at it. It now stands open at both breakpoints. Route-only, like `empty` and
`loading` — no user path sets it.

**Before Layer C: plant the session** (snippet above), or you will re-measure
the signed-out shell and every desktop x-offset will be 64 short.

---

## Two things the route turned up immediately

Building `/report/edge-prompt` meant opening the prompt for the first time. Both
of these were invisible until something rendered.

### The mobile edge-prompt could never appear

`EditEdgePrompt compact` was rendered as a child of `ReaderShell`, whose
`children` land inside the desktop document column — `hidden shell:flex`. So
below 1180 the whole subtree was `display: none`, and the mobile State-3 prompt
had a hidden ancestor no matter how correct its own styles were. `position:
fixed` does not rescue an element from that.

Both branches type-checked. Both were unit-testable. The desktop one worked, so
nothing looked wrong. Now lifted out of `ReaderShell` and measured at 390:
drawer **y380 h408**, border-top 1px, radius 20; title **24/35**, body 24/71,
button **16/315 358×46**, `Not now` 16/373; scrim **y52 h736**. The +1 against
your frame values is the padding-box/outer-box difference on the 1px border.

### The edge-prompt frame carries copy its own box cannot hold

Worth deciding rather than guessing at. In `2328:5590` the body text node is
**288 wide and 20 tall** — one line — and the button sits at **y124**. But the
string in that node is two sentences, which at 14px/288 wraps to **three
lines**. The node is fixed-height, so Figma is showing you one line of a
paragraph that is really 63 tall.

I kept the copy and let the dialog grow: body 286×63, button at y168, dialog
**248 tall rather than 212**. Clipping the frame's own words to preserve y124
seemed the worse of the two.

But it means **one of the two is not what you intended** — either the copy is
shorter than what is in the node, or the button belongs at 168 and the frame
needs re-spacing. Same question on mobile, where the body is 342×63.

---

## Still open on you

1. **The edge-prompt body vs the button position** — the frame's copy needs 63px
   and its box allows 20. Shorter copy, or button down to y168?
2. **`COVER OPTIONS`** — chrome, as I have built it, or retired caps everywhere?
3. **The signed-out desktop shell** — rail or no rail. A real state, no frame.
4. **`WalletBadge`** — delete, or is a persistent balance chip wanted somewhere?

And for Joy: **the edge-prompt body copy** says "top up" three times.

---

## Ready for Layer C

Gate green, `/report/edge-prompt` live, session snippet above. The four
questions block none of it — every one has a working state to measure today.

*Dev session · 2026-08-20.*
