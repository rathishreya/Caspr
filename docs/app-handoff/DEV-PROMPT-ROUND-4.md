# Dev prompt — round 4 (the header, the wordmark, the auth card)

**To:** the dev session · **From:** the design session · **2026-08-26**
**File:** `y2F394I4CwEeSzH2kKuDCt` · **Page:** `184:3` — **pull before you start.**

Two threads land together. **§1–§3 are new and come from measuring the live site.** §4 is the round-5 answer set to `DESIGN-PROMPT-AUTH-CARD-R3.md`, which lives in full in [`DESIGN-RESPONSE-AUTH-OVERLAYS.md`](DESIGN-RESPONSE-AUTH-OVERLAYS.md).

---

## 1 · The wordmark was never text, and that is why it looked wrong

Joy flagged the wordmark's weight across every screen. The cause is structural: **the live site's wordmark is an inline SVG, and Figma had it as Instrument Serif text.**

Measured at `new.caspr.ai`:

- `viewBox 0 0 2189 1055`, rendered **66 × 32** at both breakpoints
- **five letter paths carrying `stroke-width: 16` with `paint-order: stroke`** — filled *and* outlined
- the dot is a **`<circle>` r60 in accent**, not a period glyph

**The stroke is the weight.** Instrument Serif's hairlines are too thin at 32px, and the outline expansion is what makes it hold. No font weight reproduces that, which is why every attempt to match it with text failed.

**Now a component** — `Wordmark · Caspr` on `🧩 Components — Core`, instanced in all 28 screens at x120 (desktop) / x20 (mobile), vertically centred. The mechanism is in the component description so nobody re-types it as text.

**For you:** keep using the site's own SVG. Do not rebuild it, and do not substitute a font.

## 2 · Header type now matches the live site

Measured, then applied to all 28 screens:

| | Was in Figma | Now — matches live |
|---|---|---|
| Nav links | Inter Medium 14 | **Inter Medium 13** |
| Nav gap | ~40 | **24** |
| `Solutions` · `Use Cases` · `Analyses` | plain | **+ `↓` U+2193 at 10px**, 4px gap — the caret is smaller than its label |
| `Log in` | Medium 14 | **Medium 13**, matching the nav |
| CTA label | Medium 14 | **Inter Semi Bold 13** |

`Pricing` and `Blog` stay bare — they have no menus.

**Three values that are ours, not the site's — build these:**

1. **CTA text** — `Run the analysis` / `Run analysis` / `Sign up`, per `entry-routes-and-cta.md` §3.
2. **`Log in`** — as text on every surface, per §3.
3. **Radius 2**, not 4. `design-guidelines.md` §2 locks functional chrome at 2.

## 3 · Header height — do NOT chase it, and here is the fix instead

The live header is **65 (64 + 1px border) at both breakpoints**. Figma is 72 desktop / 52 mobile. **Joy's call: do not reflow 28 frames**, and I agree.

**The number propagates into exactly one place — your scrim offset**, currently `top-[56px] shell:top-[72px]`. That constant is the defect, not the frame height.

**Derive it.** Position the overlay below the header in flow, or `top: var(--header-h)` set from the rendered header. Then 52, 56, 65 and 72 all stop mattering — **including the question you asked in round 2, permanently.**

Supporting: §5.5 already declares these headers **indicative only** with the real component imported at build; the mismatch is 13px on mobile, not 7; and reflowing would still leave a hand-replica that is approximately right.

## 4 · Round 5 — the auth card

Full detail in [`DESIGN-RESPONSE-AUTH-OVERLAYS.md`](DESIGN-RESPONSE-AUTH-OVERLAYS.md) → Round 5. Headlines:

**§0 applied** — 22 inline legal links to ink + underline, 20 standalone links to `brand/black` + Medium with no underline, 58 button labels to Inter Medium.

**§1 · the card spacing scale**, every value on §9's scale:
`8 · 32 · 8 · 20 · 20 · 12 · 8 · 24 · 12 · 24`, padding 40 / 36.
The rule that makes it work: **the gap above an element is larger than the gap below it when it belongs to what follows.** The password hint sits 8 below its field and 24 above the submit — that asymmetry is what stops it floating.

**§2 · centring stops at the edge of a field box.** Everything centres; only text *inside* `Work email` and `Create a password` stays left. 71 centred, 14 left.

**§3 · the foot ramp was inverted** — consent **11.5**, switch **13**.

**§4 · two layouts for the thread cards, not three.** Use the 1180 structural breakpoint: five across above it, **lead card full-width + 2 × 2** below. Your 700px case disappears. **Height is content-driven, equalised per row — never set a card height.**

**§5 · the hamburger is drawn** — `AUTH · 6 · Website hamburger — open (Mobile)`. Five nav links plus `Log in`. **The CTA button stays in the bar, never in the menu.**

**§6 · the legal documents get real pages, not a sheet.** `/legal/terms` and `/legal/privacy`. 47 sections inside a phone-height sheet is a scroll container inside a scroll container. They must be linkable anyway — the consent line points at them.

## 5 · Also done since round 3

- **Footers normalised** across 28 screens — Inter Regular 12 / 11, `text/label` `#474642`, 19px from the frame bottom, **below the scrim** so the disclosure dims with the field. Five frames had no footer at all.
- **Headers normalised** — one variant per property. Found on the way: `Log in` in three different colours, seven button variants, **radius 4 in ten frames**, and five frames carrying an **orphaned accent rectangle** with its label floating beside it as a loose sibling.
- **Page tidied** — the spent CTA width study and the standalone website-header fragments removed; the AUTH sections laid into non-overlapping bands.

## 6 · The signup copy is APPROVED — build these strings

**Signed off by Joy, 2026-08-26.** No longer proposed. One card, two text nodes swapped; everything below the standfirst is identical across all three.

| Variant | Headline | Standfirst |
|---|---|---|
| **`volunteered`** | Create your free account | Your first $100 of research is on us — no card required. |
| **`required`** | Attaching your own sources needs an account | Your draft is saved. Create an account to attach files — your first $100 of research is on us. |
| **`imposed`** | Your analysis is ready to run. | Create an account to run it. Your first $100 of research is on us — no card required. |

**`required` is the specific form**, so thread the triggering action through — the pattern for every future trigger is **`"[Action] needs an account"`**. Attaching files is the only one today, but `showcase-and-auth-spec.md` §3 states the general rule (*anything that persists or exports the user's data*), so the next such control ships with a line that already fits.

**Note what changes for you:** the build currently ships **`volunteered`'s wording for `imposed`** — so the card that interrupts someone reads as though they chose it. That is the substantive fix here, not a polish pass.

### The switch line is one sentence, not two nodes

Joy: *"they should read like a single sentence with `Log in` having slightly more weight and colour."*

It was two text nodes at **different sizes** (13 and 14) with a **13px gap** between them. Now **one text node** — `Already have an account? Log in` — Inter Regular 13 `text/secondary`, with the link as a **styled range**: Inter Medium 13, `brand/black`. Same for `New to Caspr? Start free →`. **11 instances merged.**

Build it as one string with a span, not two elements. Two elements is what produced the gap and let the sizes drift apart.

### Three real defects found while reviewing — not rendering

Joy flagged overlapping text and wrong OAuth labels and asked whether it was a rendering artefact. **It was not.**

- **The Google and LinkedIn button labels had been overwritten** with the headline and standfirst copy. Cause: a script that picked "the first two text nodes by y" using **local** y — so labels nested inside the OAuth buttons sorted above the card's own headline. The REQUIRED and IMPOSED headlines were wrong for the same reason. All repaired, and the selector now uses absolute y and excludes anything inside a button.
- **The headline overlapped the standfirst** on `required`, because its longer copy wrapped to two lines in a card that had no Auto Layout to reflow. **All three variant cards are now nested Auto Layout on §1's scale**, so copy length can no longer cause a collision.

**The lesson for the build: a card whose height is not content-driven will break on the first longer string.** `required` is that string.

## 7 · What is still open

| | | Owner |
|---|---|---|
| `imposed` and `required` triggers unwired | tests are the only guard on those two strings | you |

Nothing else is outstanding on the design side. Everything in `DESIGN-PROMPT-AUTH-CARD-R3.md` is answered and drawn — see [`DESIGN-RESPONSE-AUTH-OVERLAYS.md`](DESIGN-RESPONSE-AUTH-OVERLAYS.md) §8.

---

*Design session · 2026-08-26. Read with `design-guidelines.md` §1 · §2 · §9 · §10a · §10b and `entry-routes-and-cta.md` §3.*
