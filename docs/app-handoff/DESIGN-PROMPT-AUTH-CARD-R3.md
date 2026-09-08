# Design prompt — the auth card, round 3

**To:** the design session · **From:** the dev session · **Date:** 2026-08-26
**File:** `y2F394I4CwEeSzH2kKuDCt` · **Page:** `184:3`
**Follows:** [`DESIGN-PROMPT-AUTH-OVERLAYS-R2.md`](DESIGN-PROMPT-AUTH-OVERLAYS-R2.md) → [`DESIGN-RESPONSE-AUTH-OVERLAYS.md`](DESIGN-RESPONSE-AUTH-OVERLAYS.md) Round 4
**Authority:** [`design-guidelines.md`](../product/design-guidelines.md) · [`entry-routes-and-cta.md`](../entry-routes-and-cta.md)

Joy reviewed the built signup and login screens and found seven defects. **Five are mine and I am
fixing them in code.** The two below need a drawn answer first, plus three decisions Joy has now
locked that the frames must absorb.

---

## §0 — Three decisions Joy locked today, 2026-08-26

Apply these to every frame that carries them. They are not proposals.

### 0.1 Red is a surface. Ink is a letterform.

**The problem found in the build:** `Terms`, `Privacy Policy` and the `Log in` switch were drawn in
accent as *text*, so a single card had the primary CTA, two 12px legal links and a switch link all
competing in the same red. The accent stopped meaning "this is the action".

| Treatment | Applies to | Value |
|---|---|---|
| **Accent fill** | buttons, the wordmark dot, any surface | `#e8453c` — unchanged, and it stays at full strength |
| **Inline link inside a sentence** | `Terms`, `Privacy Policy` | **ink + underline**. Mid-sentence there is no positional cue, so the underline carries real information |
| **Standalone link ending a line** | `Log in`, `Start free →`, `Forgot password?` | **`brand/black` + Inter Medium 500**, *no* underline |

**The weight is load-bearing, not styling.** Body copy in these cards is `text/secondary` `#5c5b58`
Regular; the link is `#1a1a17`. That colour step is only **2.56:1**, below the 3:1 a colour-only link
distinction needs. Medium is what makes it read, and it is also the non-colour cue that keeps it
conformant. **Do not draw these as black Regular** — it looks correct in Figma at 200% and vanishes
at 100%.

### 0.2 `accent-text` is `#be3530`, matching `design-guidelines.md` line 56

The build had drifted to `#c83b34`. `design-guidelines.md` is the authority and the code is being
corrected, not the doc. It shares a hex with `accent-pressed` — that is accepted, because the two
never appear in the same role.

**After 0.1 this token is nearly unused in the auth cards.** It remains correct for red glyphs that
must be red and small — citation dots, delta figures — and `#e8453c` remains correct as text **on the
dark cards**, per `design-guidelines.md` line 63.

### 0.3 Every button label is Inter **Medium 500**

`entry-routes-and-cta.md` §3.2 swept the header buttons to Medium. The **card submit** (`Continue
with email`, `Log in`) was left at **Semi Bold 600**, so the two buttons on one screen disagree.
Medium everywhere.

---

## §1 — The auth card needs a vertical scale. It currently has none.

**This is the largest of Joy's findings and the one I cannot fix without you**, because inventing
spacing in code is how the frames and the build drift apart again.

Measured on the built signup card, top margin of each block in order:

```
headline → standfirst        14
standfirst → OAuth group     26
OAuth group → "or" rule      24
"or" rule → form             20
form → consent line          16
consent line → switch line   20
```

**Six values, no scale, and none of them is a multiple of a common unit.** Joy's words: *"the vertical
spacing between all the items is weird — tough to tell what text is associated with which box/title."*
That is exactly what unscaled spacing produces: if the gap above a label equals the gap below it,
the label floats between two blocks instead of belonging to one.

`design-guidelines.md` line 163 records that this already happened once — *"the two login cards grew
12–15px because their internal gaps were 5 · 23 · 19 · 10 · 13"* — and were re-spaced onto the scale.
**The signup card was not part of that pass.**

**What I need:** the spacing scale for this card, as a token per gap, with **grouping expressed by the
scale** — a tighter gap binding a label to its field than the gap separating one group from the next.

## §2 — Centre alignment: how far does it go?

Joy: *"we had agreed to center align the layout — other than text inside the boxes, e.g. Work email."*

**The build is `text-align: start` throughout with exactly one centred line at the bottom**, so the
centring currently reads as a mistake rather than a decision.

The boundary needs drawing, because there are four candidate stopping points:

| | Centred? |
|---|---|
| Headline, standfirst | presumably yes |
| OAuth button labels | ? |
| Field placeholders (`Work email`) | **no** — Joy was explicit |
| Password hint, consent line, switch line | ? |

**Draw it once and I will follow the frame.** My instinct — flagged as instinct, not a
recommendation — is that anything that is a *label for a control* stays left, and anything that is
*prose addressed to the reader* centres, but the consent line straddles that and you should rule.

## §3 — The type ramp jumps at the foot of the card

`consent line` is 12px and the `switch line` immediately below it is 14px, so the smallest text on
the card is followed by something larger. Joy: *"the 'Already have an account …' line suddenly jumps
to a higher font size."*

Either the consent line comes up or the switch line goes down. **The switch line is a control and the
consent line is fine print**, so my reading is that the current sizes are inverted — but this is a
type-ramp decision and it belongs to you.

## §4 — The thread cards have no behaviour between 768 and 1180

The five "Pick a thread" cards behind the scrim use **two unrelated layouts with a hard break at
`shell:` (1180)**:

- below 1180 — `grid-cols-2`
- at and above 1180 — `flex-wrap justify-center`

At **700px** that produces a first card spanning **668 × 108** and its four siblings at **328 × 162**
— one full-width short card above four half-width tall ones. Joy: *"constant height and varying
widths … at medium widths the text inside them has a lot of vertical spacing — looks quite weird."*

**What I need:** the card grid at **768** and **1024**, and whether card height is fixed or content-
driven. Right now it is neither consistently.

## §5 — Does a website page get a hamburger, and what is in it?

`entry-routes-and-cta.md` §3 says `Log in` lives inside the hamburger on website mobile, and that the
open run has no hamburger. **The open run was also rendering the marketing nav, which §3 says it must
not have — that is my bug and it is fixed.**

What is undrawn is the website hamburger itself: it is referenced in §3 but I cannot find a frame
showing it open. **Does one exist?** If not it needs one — the five nav links plus `Log in`.

## §6 — The legal sheet now has to hold a real document

**The most serious defect Joy found:** the overlay showed the **Terms** text under a **Privacy
Policy** heading, because only one section array was ever wired. It also showed a five-paragraph
summary standing in for a policy.

I am wiring the real documents. They are substantial:

| | Sections | Lines |
|---|---|---|
| `docs/legal/terms-of-use.md` | **47** | 315 |
| `docs/legal/privacy-policy.md` | **22** | 223 |

Both are dated **01 September 2026** (Joy, today). The overlay's hardcoded *"Last updated 11 August
2026"* is wrong and goes.

**The frame draws a bottom sheet sized for five short paragraphs.** Forty-seven sections is a
different object. **Does it stay a bottom sheet that scrolls, or become a full page?** A phone-height
sheet holding a 315-line document is a lot of scrolling inside a scrolling container, which is the
interaction people get stuck in.

---

## §7 — What is mine, so you do not draw it

Fixing in code now, no frame needed: the accent-as-text sweep (§0.1 applied to the ~128 sites the
lint ratchet already lists), the open run's stray marketing nav, the login consent line's missing
hyperlinks, the `New to Caspr?` line sitting *outside* the card on the scrim, and wiring Privacy to
the privacy document.

**And the structural one:** `LoginPage` and `SignupOverlay` are two implementations of one card,
which is why the login screen diverged — no links in its consent line, its switch line outside the
card. I am unifying them. **So please draw ONE card spec with the differences named as variants**,
rather than two frames that can drift apart again.

## §8 — What to send back

Append to `DESIGN-RESPONSE-AUTH-OVERLAYS.md` as Round 5:

1. §1 — the spacing scale, per gap.
2. §2 — where centring stops.
3. §3 — the two font sizes at the foot of the card.
4. §4 — the card grid at 768 and 1024, and whether height is fixed.
5. §5 — hamburger frame, or confirmation that one is needed.
6. §6 — sheet or page for a 47-section document.
7. §0 — confirmation that the three locked decisions are applied, and to how many nodes.
