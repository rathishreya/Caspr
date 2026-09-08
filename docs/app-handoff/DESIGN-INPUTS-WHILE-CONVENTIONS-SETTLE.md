# Inputs for the design session — actionable now

**These do not depend on the engineering conventions being locked.** Every item
below is a design-side decision or a design-file change that is needed whichever
way the conventions land.

Ordered by what blocks the most.

---

## 1 · The file has no Auto Layout. This is the blocker.

I checked two unrelated nodes — a card and a dialog — and both come back as
**every child absolutely positioned**, no flex, no auto-layout:

```
card: Market Analysis (1294:388)
  <p className="absolute left-[178.23px] top-[16.23px] w-[328px]" …>

Edit-budget edge-prompt dialog (2328:5590)
  <p className="absolute left-[24px] top-[24px] w-[288px]" …>
  <div className="absolute left-[24px] top-[130px] h-[44px] w-[288px]" …>
```

**Why this is the root of the mangled build.** Auto Layout maps 1:1 onto CSS
flexbox — direction, gap, padding, alignment all translate directly. Absolute
coordinates translate to nothing except themselves. A frame drawn at 1440 with
absolute children contains **no information at all** about what should happen at
1280, and no engineering convention can invent it.

**My share of this, plainly:** the correct response to a file like that was to
say *"this cannot be built responsively, the frames need Auto Layout"* — before
writing a line. I didn't. I transcribed the coordinates into CSS and reported
them back as measured and matching, which they were, at exactly the two widths
they were drawn at. The audit loop we ran for two days was two sessions
confirming the same wrong thing to each other.

**Ask:** convert screen frames and components to Auto Layout, starting with the
containers rather than the leaves. Fixed vs fill vs hug on each child is the
information the build actually needs, and it does not currently exist anywhere.

---

## 2 · There are no Figma Variables — colour is raw hex

`get_variable_defs` on the first-run frame returns `{}`. Colours come through as
literals: `#e2e1de`, `#0a0a0a`, `#5c5b58`, `#9c9b98`, `#e8453c`, `#1a1a17`.

So the token layer in code and the palette in Figma are **two separate systems
that agree only because someone kept them in step by hand**. That is why a token
can drift — and it is why the `#2a2927` and `#2e7d33` duplicates happened.

The W3C **DTCG** design-token spec became stable in October 2025, and Figma
Variables export to it. Until the palette *is* Variables, there is nothing to
export and the two systems stay hand-synchronised.

**Ask:** promote the colour ramp, type scale, spacing and radius to Figma
Variables, in the three tiers we already use in code — primitive → semantic →
component.

---

## 3 · The mobile card is the desktop card scaled 0.7723

```
text-[11.585px]  text-[10.04px]  text-[9.654px]
rounded-[6.179px]  border-[0.772px]
```

Those are not design decisions, they are a scale artifact. **Fractional type
sizes are not buildable** — and 9.654px is below any sensible minimum regardless.

This was logged as `QUESTIONS-FOR-JOY.md #11` and is still open. The build
currently honours the *layout* and silently substitutes sane type sizes, which
means the file and the build disagree by design and nobody can tell which is
right.

**Ask:** design the mobile card at real values, or confirm the substituted ones.

---

## 4 · Responsive behaviour is undefined — and it is a design decision

The file has exactly **two widths: 390 and 1440**. Real traffic is 1280, 1512,
1920, 768, 1024. At 1280 today the app overflows horizontally and the centre
column renders 625px instead of 800.

Nobody can build this correctly because nobody has decided it. Four questions:

1. **1180 → 1440:** does the centre column hold 800 and centre itself, or shrink?
2. **Above 1440:** max-width, or does content grow?
3. **768 → 1180:** is there a tablet design, or does mobile stretch — and to what?
4. **Per region:** which of rail / pane / centre / buffer are fixed, and which flex?

The engineering answer follows immediately once these are answered. It cannot
precede them.

---

## 5 · Contrast: 274 usages currently fail WCAG AA for body text

Computed against white, per WCAG 2.x (normal text needs **4.5:1**, large text and
UI components need **3:1**):

| Token | Ratio | Verdict | Uses |
|---|---|---|---|
| `tertiary` `#9c9b98` | **2.78:1** | **Fails everything**, including UI | 43 |
| `placeholder` `#8a8a85` | **3.47:1** | Fails text; OK for UI only | 107 |
| `accent` `#e8453c` | **3.93:1** | Fails text; OK for UI only | 124 |
| `product-dot` `#8a887f` | 3.55:1 | OK — used as a 1px stroke, not text | — |
| `secondary` `#5c5b58` | 6.79:1 | Passes | — |
| `ink` / `primary` | 17.4 / 19.8:1 | Passes | — |

`tertiary` is the urgent one: at **2.78:1** it fails even the 3:1 UI threshold,
and it carries the `↳` example lines on the first-run cards — the copy we most
want read.

`accent` as **text** is the widest problem at 124 uses. It is fine as a fill
behind white, and fine as a border; it fails as a foreground colour on paper.

**Ask — this is a palette decision, not an engineering one.** Either darken the
three tokens until they pass, or rule explicitly where each may be used (fill
only, border only, large text only) so the rule can be linted. **The European
Accessibility Act has been enforceable since June 2026 and applies to us
extraterritorially**, so this is a legal exposure, not a preference.

---

## 6 · WCAG 2.2 AA has design-side criteria the file does not address

These are design decisions and can start now:

- **2.4.11 Focus Not Obscured** — a focused element must not be hidden by other
  content. Directly relevant to our drawers, scrims and the edge-prompt: a
  keyboard user tabbing behind a peek drawer currently has no defined behaviour.
- **2.5.8 Target Size (Minimum)** — 24×24 CSS px. Several controls in the frames
  are smaller (the 18px icon buttons, the 8px applied-dot).
- **Visible focus indicators** — the file draws none, for any control. There is
  no designed focus state anywhere, so the build has browser defaults or nothing.
- **Keyboard model per component** — which is what the
  [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) specifies
  for each of its 26 patterns. Our drawers, menus, switcher and dialogs each need
  one, and the frames are silent on all of them.

**Ask:** a focus-state style, a target-size pass, and a keyboard model for the
drawer, the pane switcher, the menus and the confirms.

---

## 7 · EU AI Act Article 50 needs a design answer

Enforceable since **2 August 2026**, regardless of risk tier. Two obligations
have a visual surface:

1. **Disclose AI interaction** no later than first interaction, unless obvious
   from context. Where does that sit on the first-run screen and the scoping
   conversation — a line, a chip, a footnote?
2. **AI-generated content must be marked** in a machine-readable format and be
   detectable as AI-generated. Caspr's whole deliverable is generated content.
   What does that marker look like on the report cover, and in the PDF/PPTX
   metadata?

This is small, and it currently has no design at all.

---

## 8 · Component hygiene, for Code Connect later

Not urgent, but cheap to do alongside §1 and worth flagging: **Figma Code
Connect** links design components to our real React components, so Dev Mode shows
*our* code instead of generated CSS. It is the mechanism that structurally
prevents a developer being handed coordinates again.

It requires real components and variants rather than detached frames. The DS
audit already found detached-frame violations, so this overlaps work you have
partly scoped.

---

## What I am *not* asking for

No new screens, no visual redesign, no copy. Every item above is either making
the existing design machine-readable (§1, §2, §8), resolving something already
logged as open (§3, §4), or a compliance obligation (§5, §6, §7).

**And the honest framing:** §1 is the one that mattered, it has been true the
whole time, and I built two hundred screens' worth of code without raising it.
That is not a design-session failure — it is mine for treating an unbuildable
input as buildable rather than saying so.

*Dev session · 2026-08-20.*
