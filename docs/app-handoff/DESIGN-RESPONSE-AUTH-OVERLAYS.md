# Design response — the auth overlays and the demo header

**2026-08-25.** Answers [`DESIGN-PROMPT-AUTH-OVERLAYS.md`](DESIGN-PROMPT-AUTH-OVERLAYS.md), built against [`../product/showcase-and-auth-spec.md`](../product/showcase-and-auth-spec.md) §5.

**All five frames are drawn**, on page `184:3`, prefixed `AUTH · `. Everything reuses existing components; nothing was hand-redrawn.

**Two things need Joy before the dev session takes this**, and one of them is a defect in a frame the spec lists as reusable.

---

## Frames delivered

| | Frame | Node |
|---|---|---|
| 1 | Login overlay — Desktop (over conversation) | `2509:677` |
| 1 | Login overlay — Mobile (over conversation) | `2509:781` |
| 2 | Header over scrim — Desktop / theater · conversation | `2510:695` · `2510:937` |
| 2 | Header over scrim — Mobile / theater · conversation | `2510:1038` · `2510:1169` |
| 3 | Signup — volunteered · required · imposed (comparison) | three cards, side by side |
| 4 | Website header — Desktop · Mobile | `2511:986` · `2511:998` |
| 5 | Swap — before · after · transition spec | `2513:876` · `2513:979` · `2513:1080` |

**Frame 1 is drawn over the conversation deliberately** — it is the cheapest possible demonstration of rule 1. There is a conversation behind the login card and no theater, which is the state the reported bug got wrong.

---

## 1 · The two defects

### 1.1 · The existing overlay's scrim is 0.50, not 0.42

`1182:328` — the `dim` rectangle inside `Gate + Theater · Signup Overlay` — is **black @ 0.50**. `design-guidelines.md` §13 locks the scrim at **0.42**, and the prompt restates it as locked.

**I built the new frames at 0.42 and left the existing frame alone.** Changing an approved frame that the dev prompt references, without saying so, is the drift problem in miniature. **It should be corrected — say the word and it is one edit.**

### 1.2 · The mobile signup overlay has no scrim at all

This is the bigger one. `1303:527` inside `Signup Overlay — Mobile` is an **opaque `#0a0908` rectangle** covering y52–844. That is `theater/bg` — the theater's own background, at full opacity. So on mobile there is no scrim and **nothing behind the card is visible**.

Two problems with that:

- **It breaks rule 1 in spirit.** "The overlay never changes what is behind it" is unfalsifiable if what is behind it cannot be seen. On mobile the user cannot tell their conversation survived, which is exactly the reassurance the model depends on.
- **It breaks the app-wide rule in §13** — *"a mobile drawer gets a scrim ⟺ its desktop counterpart is a scrimmed modal."* The desktop signup is a scrimmed modal, so the mobile one must dim rather than replace.

**So I did not follow one instruction in the prompt.** Frame 1 says *"match the signup overlay's existing treatment at `1303:429`"* — I did not, because that treatment is the defect. **Mobile login is drawn as a centred card on a 0.42 scrim**, matching desktop. Flagging it rather than quietly diverging.

---

## 2 · Frame 2 — the answer to the load-bearing question

The prompt asked three questions. The answers are drawn against both backgrounds and both breakpoints.

**How does a lit header read against a dimmed field without looking like a rendering error?**

By not being lit. **The header is *undimmed*, which is a different thing** — it keeps exactly the surface it always had, and the scrim begins precisely at its lower edge. Nothing is brightened, so there is no highlight to misread as a z-index artefact. The boundary is *the dim starting*, not the header standing out.

**Does it need a boundary?**

Yes, and contrast alone does not carry it. The existing hairline is `border` `#e2e1de`, which vanishes against a dimmed field. **While an overlay is open the hairline steps up to `border/strong` `#c8c6c0`.** That is a token swap, not a new element, and it reverts when the overlay closes.

**No shadow.** This system has no elevation shadows and introducing one here would be a new primitive for a single state.

**How does it read as interactive?**

**The accent button stays fully saturated, and it is the only saturated thing on screen.** A 0.42 scrim desaturates everything beneath it; the one element that keeps its colour reads as live without any instruction. Over the theater — the hard case, and the one it will be seen against most — this is unmistakable.

That is also why the escape is legible without a close button: the way out is the control that was always there, and it is the only thing that still looks like a control.

---

## 3 · Copy — flagged, not invented

Per the prompt, drawn at honest length with placeholder strings.

| Variant | Placeholder drawn | What it must do |
|---|---|---|
| **Volunteered** | *Create your free account* / *Your first $100 of research is on us — no card required.* | Must not imply an interruption. **This is what the imposed card says today** — which is the real finding: the existing card is written as volunteered, so it is *imposed* that needs new copy, not volunteered |
| **Required** | *Attaching sources needs an account* / *Your draft is saved. Create an account to attach your own files — first $100 on us.* | Must say **why it appeared**. It has a second job the others do not: reassure that the draft survives (rule 4), because the user just had an action refused |
| **Imposed** | *Keep going — create your free account* / *Caspr is analysing. Create an account to see the finished report.* | Must acknowledge that something stopped |

**Frame 4's button reads *Start free*, sized for something longer** — GTM's call per spec §7.

---

## 4 · What the dev session gets

**Z-order, named in the layers:** scrim below header · card above scrim · header above everything. In every frame the scrim's top edge is the header's bottom edge, so the ordering is also geometric and cannot be got wrong by accident.

**The swap** — `AUTH · 5 · Transition spec` states it in full. The load-bearing detail: **the two cards are different heights (540 vs 585)**, so the card must be centred by layout, not placed at a stored `y`. Positioned by coordinate, the swap jumps. Card content cross-fades at 160ms; height animates over the same 160ms anchored at the centre; the scrim is never re-mounted, which is what would cause a flash.

**Auto Layout** on everything new — the switch rows, the header button, the transition-spec card all hug their content. The cloned demo backgrounds keep the structure they already had.

**Reuse, not recreation** — the login card is `1168:2` cloned, the signup card is `1182:329` cloned three times with copy changed, the header wordmark and nav are clones of `1170:146`'s. Nothing was drawn to look like something that exists.

---

## 5 · Deliberately not done

- **The existing frames' defects are flagged, not fixed** (§1). They are referenced by the current dev prompt; silently editing them is how the file and the build stop agreeing.
- **The demo screens are untouched** — D0, D1, D2 are correct, as the prompt says.
- **Frame 2's mobile pair is drawn over both backgrounds** but the mobile theater is dark to begin with, so the scrim does less work there. Worth a look before build: on mobile over the theater the case for the stronger hairline is weakest, and it may be the one place the boundary can be dropped.

---

# Round 2 — answers to `DESIGN-PROMPT-AUTH-OVERLAYS-R2.md`

**2026-08-25.** All of §1, §2 and §4 are done. §3 is drawn with your copy, marked *proposed*. One item in §4 I have **not** done, with evidence.

## §1 — Both corrections applied

| | Node | Was | Now |
|---|---|---|---|
| 1.1 | `1182:328` | black @ 0.50 | **black @ 0.42**, renamed `scrim · black 42%` |
| 1.2 | `1303:527` | opaque `#0a0908` | **black @ 0.42**, same token |

Rendered and checked: the demo shows through on mobile — source list, graph hub and spokes, *4,271 / SOURCES REVIEWED*. Your pre-check was right, it was one property.

## §2.1 — Agreed, moved under the scrim. And it surfaced a compliance problem.

`1303:519`, `1303:520`, `1303:521` and `1320:514` now paint **before** the scrim, so they dim with the field. Your reasoning holds: the input bar is not an escape route, and a lit control that does nothing when tapped reads as a bug.

**But you were right to raise the legal line, and the answer is not the one either of us assumed.**

Dimming does not *suppress* the disclosure — it **breaks its contrast**. `#5c5b58` on white is 6.79:1. Under a 42% black scrim both composite: text → ~`#353533`, surface → ~`#949494`, and the ratio falls to **≈4.04:1**. Below the 4.5 AA minimum, on a required disclosure, on a screen that is legally in scope.

**This is pre-existing and not mobile-only** — the desktop scrim covers `1195:378` too, so the same line already fails behind every desktop overlay.

**The fix is a token, not a z-order exception.** Set the footer legal line to `text/label` **`#474642`**. Undimmed it is 8.9:1; under the same scrim it composites to ≈4.80:1 and **passes**. The disclosure then survives every overlay without being carved out of the dim.

**Applied (Joy, 2026-08-25) — 23 nodes across the Onboarding page**, bound to the **`text/label`** variable rather than set as a raw hex, so it stays tokenised and moves with the token.

Deliberately scoped: the sweep checks the surface behind each line and **only darkens on light surfaces**, so a footer over a dark band would have been left alone. None existed, but the guard is in the pass so re-running it is safe.

**It changes every onboarding footer, not only the overlay states — and that is the point.** A disclosure that is legible undimmed and illegible dimmed is a disclosure whose compliance depends on which screen you happen to be on. One value that survives both is the only version that holds.

## §2.2 — The frame says 52. Your code is 4px out on mobile.

| | Frame | Your code |
|---|---|---|
| Mobile header band | `1303:498` = **y0–52**, hairline `1303:499` at **y52**, scrim from **y52** | `top-[56px]` |
| Desktop | hairline `1182:318` at **y71**, scrim from **y72** | `shell:top-[72px]` ✓ |

**Desktop matches. Mobile does not — change the code to 52.** The 52 band is consistent across the mobile onboarding frames, so the frame is not the outlier.

**On the hairline: they were not stepped up — they are now.** Both `1303:499` and `1182:318` were still `#e2e1de`, which is the value that vanishes against a dimmed field. Both are now **`border/strong` `#c8c6c0`** and renamed `header boundary · border/strong (overlay open)`. This applies **only while an overlay is open**; the default header keeps `#e2e1de`.

## §2.3 — Keep `1182`. The fork risk was real but it was mine, and it is fixed.

`1182` is the **canonical imposed-signup screen** and nothing replaces it.

You were right that something duplicated it — but it was my round-1 header study, whose desktop/theater frame carries the same composition. That is the fork. **Fixed by renaming rather than deleting**: every study frame is now prefixed `AUTH · 2 · STUDY (not a screen) ·` and `AUTH · 5 · STUDY (not a screen) ·`.

So: `1182` is the screen; `AUTH · 2` and `AUTH · 5` are annotated studies of a boundary and a transition. One is built from, the others are read. Nothing goes to Deprecated.

## §3 — Four cards drawn. Your copy, with one change and one addition.

**`volunteered`** and **`imposed`** are your words exactly. *"Your analysis is ready to run"* is the better line — it says the work is held rather than access denied, which is the distinction the light call earns.

**`required` — SPECIFIC. Decided by Joy, 2026-08-25. Thread the action through.**

> **Attaching your own sources needs an account**
> Your draft is saved. Create an account to attach files — your first $100 of research is on us.

The generic form was drawn for comparison, rejected, and **removed from the file** — a rejected variant left lying next to the chosen one is the next mis-clone.

Two reasons it won. The user just had an action **refused**, so the subhead reassures that the draft survived — rule 4, at the exact moment it is in doubt. And *"That needs an account"* makes them reconstruct which of their last three clicks caused the card.

**The pattern for every future trigger is `"[Action] needs an account"`.** Attaching files is the only one today, but §3 of the spec states the general rule — *anything that persists or exports the user's data* — so the next such control ships with a line that already fits. That is what the threading buys beyond this one string.

**All four are one component with two text nodes swapped.** Everything below the subhead is identical.

**Copy is proposed, not approved** — invented against the spec's behaviour, not lifted from research. Joy signs off.

## §4 — One done, one refused

**Done:** `1303:528` renamed `Login card` → **`Signup card`**.

**Not done — `1303:432` is not placeholder residue.** It is the **flap row**: the first frame of the theater's source-decode animation.

Evidence:

- `THEATER-SOURCE-DECODE-MOTION.md` line 1 — *"Theater — source decode motion (the flap row)"* — and line 7: *"the top line of the sources list is a decode animation: it holds a line of cipher script for a beat, flips the whole line at once into a real, cited source name"*. `M9K2X0Q8ZP` **is** that cipher script.
- The string appears in **10 frames**, including `Theater — Source Web` on the Components page and a node named literally `M9K2X0Q8ZP (flap row)` on `Theater — Desktop v3`.
- It sits inside `List Zone (~29%)`, at the top of the source list — exactly where the spec puts it.

Deleting it would remove the held state of a specified animation from ten frames. **Renamed to `M9K2X0Q8ZP (flap row — decode cipher, do not delete)`** so the next reader does not reach the same conclusion.

## §5 — Both questions

**Do I hold the website file?** **No.** This session has one Figma file, `y2F394I4CwEeSzH2kKuDCt` — the app. **The website is owned by the website design session and is not in scope here** — nothing in this document is an action for it.

**Does a mobile login overlay exist?** **Yes — `2509:781`**, built in round 1: `AUTH · 1 · Login overlay — Mobile (over conversation)`. It is a 42% scrim with the login card centred at x16 y150.

**And a deliberate divergence you should know about.** Round 1 told me to match `1303:429`'s mobile treatment. I did not, because that treatment was the defect you have now approved fixing. The mobile login overlay was built correct from the start, which is why it needed no rework in this round.

---

# Round 3 — the CTA decision applied

**2026-08-26.** Applies [`../entry-routes-and-cta.md`](../entry-routes-and-cta.md) §3, locked by Joy. **27 strings changed across every frame in the file.**

| Was | Now | Count |
|---|---|---|
| `Login` | **`Log in`** | 21 |
| `Start Free →` | **`Run the analysis`** | 4 |
| `Start free` *(my Frame 4 placeholder)* | **`Run the analysis`** | 2 |

Scoped to the **header band only** (absolute y < 80). The in-card switch *"New to Caspr? Start free →"* and the gate button *"Start free — first $100 on Caspr"* are untouched — §8 keeps the gate, and the card switch is not a header CTA.

**Geometry and names followed the words.** The website-header button grew with the longer label, so it was re-anchored: desktop right edge back to the 120 margin (x1170, w150), mobile ending at x334 with 16px clear of the hamburger. Seven button layers still named `Start Free btn` were renamed to match what they now say — a layer name that contradicts its label is the mis-clone the last round was spent removing.

## ⚠ One collision the CTA decision creates — and it lands on the auth model

**§3 assigns the header a `Run the analysis` button and `Log in` as *text*. Inside the open run, both halves break.**

*Run the analysis* is incoherent once the user is running one — so the open-run header cannot carry it. That leaves `Log in` alone, and §3 says text.

**But rule 2 of the auth model depends on the header carrying a saturated element.** The round-1 answer to *"how does the header read as interactive?"* was: **the accent button is the only saturated thing on screen** — a 42% scrim desaturates everything beneath it, so the one element that keeps its colour reads as live without instruction. That is the entire mechanism by which somebody escapes an imposed signup card.

**Demote `Log in` to plain text in the open run and that signal disappears.** The escape becomes grey text on a white bar above a dimmed field — legible, but no longer obviously *the way out*.

**My recommendation, and it is a small carve-out rather than a change to §3:**

| Surface | Button | Text |
|---|---|---|
| Website pages | **Run the analysis** | Log in |
| **Open run** *(D0 · D1 · D2 and every overlay)* | **Log in** *(filled, accent)* | — |

The frames are currently drawn this way — the open-run header carries a filled `Log in` button — so **no rework is needed if this is accepted.** It also reads correctly: on the website the primary action is to start; inside the run the primary action for a returning user is to sign in, and for everyone else the header is simply proof the app is still there.

**This belongs in `entry-routes-and-cta.md` §3 as a row rather than living here.** Flagged rather than edited — that file is locked and it is Joy's.

---

# Round 4 — the dev session, applied in code

**2026-08-26.** Commit `746e3b0` on `caspr-ai/caspr-frontend` `main`. Gate green: 649 unit tests,
lint 0 errors, bundle 196.58 kB gzipped against a 215 kB limit.

## What landed

| Item | Source | Applied |
|---|---|---|
| Compact band **56 → 52**, scrim offset with it | §2.2 · `entry-routes-and-cta.md` §3.2 | `SiteHeader`, `AuthOverlay` |
| Mobile wordmark **22 → 24** | §3.2 | `SiteHeader` |
| Button **padding-driven** h34/h39, **Medium** not Semi Bold, label 13/14 | §3.2 | `SiteHeader` |
| `Log in` text beside the button, gap **24** | §3 | `SiteHeader` |
| Footer → `text/label` **#474642**, 11/12, centred/right | §2.1 · §3.3 | `SiteFooter` |
| **`AI disclosure` added to the legal string** | §3.3 | `SiteFooter` |
| Three signup copy states | §3 | `SignupOverlay`, `AuthOverlayContext` |
| `demo` → **the open run** | `entry-routes-and-cta.md` §1 | 6 files |

**Verified in the running app, not just in tests.** At 375px: band 52, wordmark 24, button h34/13px,
`Log in` on the bar, footer centred 11px. At 1280px: band 72, wordmark 26, `Log in` 14px. **Scrim top
= header bottom = hairline bottom, gap 0 at both widths**, scrim `rgba(0,0,0,0.42)`, hairline
`#c8c6c0` while open.

## Two things worth knowing

**1 · Your §3.2 sweep removed the need for three props, so they are gone.** `width`, `compact` and
`labelSize` on `SiteHeaderAction`, and `headerAction` on `AuthScreen`, each existed so a caller could
vary a metric now fixed — which is *how* the labels drifted to `Start Free →` / `Login` / `Log in`
across the frames. **A per-screen bar is now a compile error rather than a silent difference.**

**2 · Your Round-3 recommendation was not adopted, and the frames are right anyway.** §collision
proposed a filled **`Log in`** in the open run with no text link. Joy locked
`entry-routes-and-cta.md` §3 **27 minutes later** with a filled **`Sign up`** *plus* `Log in` as
text. Checked `1303:429` against it: **the frames carry `Sign up` + `Log in`, matching the lock.** So
the recommendation in §collision is stale relative to what you then built — flagged only so nobody
later reads it as the standing decision.

## One deviation, and it is typographic

The `imposed` headline was approved as *"Your analysis is ready to run."* with a full stop. The other
two headlines carry none, so it ships **without** one. If the stop was intentional it should go on
all three rather than one — say which and it is a one-line change.

## Still open, and none of it is blocked on design

- **Copy sign-off** — `volunteered` and `imposed` remain *proposed*. `required` is decided.
- **No trigger is wired** for `imposed` or `required`. The three-second imposition and the
  file-attach trigger both wait on the light call, so those two cards are unreachable in the running
  app and **tests are currently the only thing guarding their copy**.
- **`entry-routes-and-cta.md` §3.3 baseline** — *19px from the frame bottom* was not translated to
  CSS, because the mapping depends on line-height and there is no frame to check the result against.
  The colour, size, alignment and string all landed. Worth a look when the footer is next on screen.

---

# Round 5 — answers to `DESIGN-PROMPT-AUTH-CARD-R3.md`

**2026-08-26.** Three §0 decisions applied, §1–§3 drawn, §4–§6 answered, §5 drawn.

## §0 — Applied, with counts

| | Applied to |
|---|---|
| **0.1 · Red is a surface, ink is a letterform** | **22 inline legal links** → `brand/ink` + underline, including ranges inside the consent sentence. **20 standalone links** — `Log in`, `Start free →`, `Forgot password?` → `brand/black` + Inter Medium, no underline |
| **0.2 · `accent-text` = `#be3530`** | Already correct in the file — the drift was code-side only. No Figma change |
| **0.3 · Button labels Inter Medium** | **58 labels**, card submits included |

## §1 — The card spacing scale

**Grouping is expressed by the gap.** The rule underneath: **the gap above an element must be larger than the gap below it when it belongs to what follows** — and reversed when it belongs to what precedes. That asymmetry is what fixes *"tough to tell what text is associated with which box"*; equal gaps are exactly what makes a label float between two blocks.

| Gap | Value | Why |
|---|---|---|
| headline → standfirst | **8** | one unit, not two |
| standfirst → OAuth | **32** | the only true section break |
| between OAuth buttons | **8** | a set |
| OAuth → `or` rule | **20** | |
| `or` rule → form | **20** | symmetric — a divider that divides unequally is not a divider |
| email → password | **12** | a set |
| password → hint | **8** | **the hint belongs upward** — 8 above it, 24 below |
| form → submit | **24** | |
| submit → consent | **12** | the consent explains the submit it sits under |
| consent → switch | **24** | different purpose |
| Card padding | **40** desktop · **36** mobile | unchanged |

Every value is on `design-guidelines.md` §9's scale. The old set — 14 · 26 · 24 · 20 · 16 · 20 — had none on it.

## §2 — Centring stops at the edge of a field box

Joy's rule taken literally is also the simplest: **everything centres except text inside a field.** Applied — **71 centred, 14 left inside fields.**

| | |
|---|---|
| Headline · standfirst · OAuth labels · password hint · consent · switch | **centred** |
| Placeholder and typed text in `Work email`, `Create a password` | **left** |

I did not take your *"labels for controls stay left, prose centres"* instinct, because the boundary it draws is invisible to a reader. **The box is its own alignment context** — a reader sees a container and expects text to start at its edge; outside a container there is no edge to start from. The consent line, which straddles your rule, is unambiguous under this one.

## §3 — The foot ramp was inverted

**Consent 11.5 · switch 13.** The consent line is fine print and is now the smallest thing on the card; the switch line is a control and matches body. **15 nodes.**

## §4 — Two layouts, not three. Height is content-driven.

**Do not add a 768–1180 layout.** Use the structural breakpoint everything else uses — **1180** (`design-guidelines.md` §10b) — and below it use the composition already drawn for mobile:

| | Layout |
|---|---|
| **≥1180** | five cards across |
| **<1180** | **lead card full-width, then 2 × 2** |

That removes your 700px case entirely: below 1180 the lead card is *meant* to be full width and the other four are equal, so the "one short wide card above four tall ones" cannot occur.

**Height is content-driven, equalised per row** — each row takes its taller card. **Fixed height is what produced the excess vertical space Joy saw**, a short card padded to match a tall one. Never set a card height.

## §5 — No hamburger frame existed. Drawn.

**`AUTH · 6 · Website hamburger — open (Mobile)`** — five nav links plus `Log in`, Inter Medium 15, 16px vertical padding per row, hairline between rows, full-bleed panel below the 52px bar.

**The `Run analysis` button stays in the header bar and is never inside the menu.** `entry-routes-and-cta.md` §3 puts the button in the bar and only `Log in` in the menu, because a new visitor must never open a menu to find the door.

## §6 — A page, not a sheet

**47 sections and 315 lines is a document, not an overlay.** A phone-height sheet holding it is a scroll container inside a scroll container — the interaction people get stuck in, and impossible to skim.

**Make `/legal/terms` and `/legal/privacy` real routes.** They have to be linkable anyway: the consent line points at them, and a legal document that cannot be linked or bookmarked is a compliance problem as much as a UX one.

Keep the bottom sheet if you want the in-context read, but only for a **short summary with a "Read the full terms" link**. What it must not do is pretend to hold the whole document.

**One consequence:** these are the first `/legal/*` pages, so they carry website chrome — header and footer — which makes them website pages, not app overlays.

---

## §7 — Copy APPROVED, and three defects found on review

**Joy signed off the three variants, 2026-08-26.** They are no longer proposed. Strings in [`DEV-PROMPT-ROUND-4.md`](DEV-PROMPT-ROUND-4.md) §6.

Reviewing the rendered cards, Joy flagged overlapping text and wrong OAuth labels and asked whether it was a rendering artefact. **It was not — all three were real, and none would have been visible in the node tree.**

1. **The Google and LinkedIn button labels had been overwritten** with the headline and standfirst. Cause: a script selecting "the first two text nodes by y" used **local** y, so labels nested inside the OAuth buttons sorted above the card's own headline. The `required` and `imposed` headlines were wrong for the same reason — the intended copy had gone into the buttons. Selector now uses absolute y and excludes anything inside a button.
2. **The headline overlapped the standfirst** on `required`, because its longer copy wrapped to two lines in a card with no Auto Layout. **All three variant cards are now nested Auto Layout on §1's scale.**
3. **The switch line was two nodes** at different sizes (13 and 14) with a 13px gap. Now **one text node** with the link as a styled range — Inter Regular 13 `text/secondary`, link Inter Medium 13 `brand/black`. **15 instances merged**, four of which the first pass missed because the *header's* `Log in` was matching ahead of the card's.

**The durable lesson, and it is the one for the build:** a card whose height is not content-driven breaks on the first longer string. `required` is that string.

## §8 — Verified clean

| | |
|---|---|
| Screens | **29** |
| Auth card variants | **3** — headline, OAuth labels and switch line correct on each, **zero overlaps**, all Auto Layout |
| Switch lines still split | **0** |
| Missing wordmark or footer | **none** |

**Everything in `DESIGN-PROMPT-AUTH-CARD-R3.md` is answered and drawn. The dev session can proceed.**

---

---

# Round 6 — the card close control

**2026-08-26.** Drawn and placed on all seven auth cards. Two of your three questions have answers that differ from what you proposed, and the reasons matter.

## 1 · The close control — drawn, and it supersedes a locked line

**`Close · auth card`** — 24 × 24, inset 16 from the card's top and right, glyph `text/tertiary` `#75746f`, ink on hover, 1.5px strokes with round caps. Instanced on all seven cards.

**It supersedes `showcase-and-auth-spec.md` rule 2**, which says *"no close button on the card, no trap, and the way out is the control that has been there the whole time."* That rule needs Joy's sign-off to change, so flag it — but here is why it has to:

**The mechanism the rule depended on no longer exists, and we removed it ourselves.** Rule 2 worked because the open-run header carried a control that was *not* the open card — the round-1 header had `Log in` as its button while the imposed card was signup, so the header offered a different action. When `entry-routes-and-cta.md` §3 made the open-run button `Sign up`, **both header controls became auth actions**, and neither dismisses. You are right that clicking `Sign up` while signup is open does nothing visible.

So the rule's *letter* now produces exactly what its *intent* forbade: a card with no discoverable exit. Joy's question — *"how do I get back to the /app if I want to continue working on the report?"* — is that failure, reported.

## 2 · There is no standalone state. Do not draw one.

You asked for two states — dismissible, and standalone for a cold `/signup` where a close lands on nothing.

**`showcase-and-auth-spec.md` §1 already rules this out:** *"A cold link (`/login`, `/signup`) → Land on the demo at D0, overlay open."* On a cold arrival there **is** something behind — D0, the open run. The close always has somewhere to go.

**One state, always present.** If you are seeing a case with nothing behind the card, that is the cold-arrival routing not matching §1 — a routing bug to fix, not a second card variant to draw. Drawing the variant would make the bug permanent.

## 3 · The fold is 768, not 860

**860 is invented; 768 is the live site's actual number.** Measured from `new.caspr.ai`'s own markup: the nav is `hidden md:flex` and the hamburger is `md:hidden` — Tailwind's `md`, which is **768px**.

Your reasoning for moving off 1180 is right, and the correction stands: 1180 is the app shell's structural breakpoint (rail / pane / centre) and has nothing to do with a marketing bar. But **use the site's number rather than a new one** — your measured 601px of content clears 768 comfortably (768 − 80 padding = 688), and a third breakpoint invented in the app is how the two surfaces drift apart again.

## 4 · Header height — the frames stay, and here is the annotation you asked for

**Do not update the frames to 65.** `DEV-PROMPT-ROUND-4` §3 stands: the header band in these frames is **indicative**, per §5.5, because the build imports the website's real header component.

Setting the app header to 65 is correct. **What matters is that the scrim offset is derived from the rendered header height, not from a constant** — that is the whole point of §3, and it is what makes 52 / 56 / 65 / 72 stop mattering.

**Recorded in the file:** the header band on these frames is not a spec. Build to the imported component.

---

*Design session · 2026-08-26. Round 6.*

---

*Design session · 2026-08-26. Round 5.*
