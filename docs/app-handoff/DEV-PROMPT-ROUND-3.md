# Dev prompt — round 3 (structure)

**Follows:** [`DESIGN-INPUTS-RESPONSE.md`](DESIGN-INPUTS-RESPONSE.md), which you accepted, and your five follow-ups. This is everything since.

**Headline: the Auto Layout conversion is done across your whole rebuild order**, and doing it changed two things I had previously written down wrong. Read §2 and §3 before you build the shell — **§10b's centre declaration was incorrect** and you would have built a 560px content column.

**Pull Figma before anything.** ~150 new wrapper frames exist, all named `auto · *`. Leaf node IDs are unchanged; wrappers are new.

---

## 1 · Your five follow-ups, answered

### 1.1 · Sequencing — agreed, and delivered in your order

Onboarding → shell → conversation/gate/theater/generation → reader → wallet/documents/account. All five stages converted.

| Page | Before | Now |
|---|---|---|
| Onboarding | 7% | **23%** |
| Profile & Wallet | 24% | **28%** |
| Report Creation | 27% | **28%** |
| Documents | 20% | **21%** |
| Components — Core | 42% | 43% |

**Percentage is not the target and you should not treat it as one.** The remaining absolute containers are, as far as I can measure, genuinely two-dimensional — document column plus pane plus floating header plus overlay plus pinned furniture. *The content that stacks, stacks.* The rest is absolute on purpose.

### 1.2 · The 834 frames — they did not exist. Now they do, and they are not a source of truth.

§10b named 390 · 834 · 1440 as reference *widths*; my wording implied drawn frames existed. They did not.

Built now: `Shell regions — §10b · 1440 / 1280 / 1254` and `Shell single-column — §10b · 834 / 390`, on `🧩 Components — Core`.

**Build fluid from the region table.** The frames are a check on your work, not its source. **If your fluid build and an 834 frame disagree, your build is probably right and the frame is what needs fixing.**

### 1.3 · `text/primary` = `#1a1a17` — done, with one subtlety your count could not show

Your evidence was better than mine and the conclusion is the same. But **half the Figma nodes bound to `text/primary` were website chrome** — the onboarding nav and footers, which must keep `#0a0a0a` to match the live site they sit under.

- **70 nav/footer nodes** → bound directly to `brand/black` `#0a0a0a`
- **161 app nodes** → follow `text/primary` → `brand/ink` `#1a1a17`
- **Zero** unbound raw `#0a0a0a` remain

**`brand/black` is now website-chrome-only. Never use it for app text** — worth a lint beside the contrast one.

### 1.4 · The header/footer import — you were right, §5.5 was impossible. Corrected in the file.

I specified an import across a Next.js/Vite boundary without checking the boundary existed. That is the same class of error as auditing coordinates without asking whether the frames could express responsive intent.

**The intent stands — exactly one implementation.** Four hand-built onboarding headers means the drift the rule exists to prevent has already started.

**My read is your first option: extract a shared router-agnostic package.** `Header`, `Footer`, `Wordmark`, `CTAButton` as presentational components taking `href` strings and a `LinkComponent` prop, each app passing its own.

**Not your second option.** Signup *is* the live tool, gated at the value moment (`onboarding-understanding.md`) — serving onboarding from the website would mean the website needs the app runtime. The marked mirror is an honest fallback if the package cannot be scoped, but it accepts drift and merely detects it.

### 1.5 · The stray `25.71` — fixed

`667:61` on `Welcome — Desktop v3`, the `C.` wordmark → **26**. **No fractional sizes remain in the file** outside the deliberate half-steps and the cover thumbnails.

---

## 2 · NEW — the spacing scale. This is what unblocked everything.

**`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`.** Every gap and pad resolves to one of these. `design-guidelines.md` §9.

This existed only as prose, and its absence is precisely why Auto Layout had stalled. A Figma frame carries **one** `itemSpacing`, so a stack whose gaps run 16 · 12 · 27 · 32 · 16 cannot be expressed at all. Automated conversion failed on **94 of 119** onboarding containers for that reason — not overlaps, **uneven gaps**.

**The technique — one gap per wrapper:**

```
content stack   VERTICAL 32
├─ hero         VERTICAL 24
│  ├─ text      VERTICAL 16
│  │  ├─ greeting
│  │  └─ headline+proof  VERTICAL 12
│  └─ prompt bar
└─ action       VERTICAL 16
   ├─ "Not sure where to start?"
   └─ cards row  HORIZONTAL 20
```

Mirror this nesting in your JSX. A flat container with hand-set margins per child is the thing this replaces.

---

## 3 · CORRECTION — §10b's centre declaration was wrong

**If you build what §10b originally said, you get a 560px content column at 1440.** I encoded it literally in Figma and that is exactly what happened.

The intent was always that **buffers give way before the centre does**. The correct declaration:

```css
.rail   { flex: 0 0 64px; }
.pane   { flex: 0 0 390px; }
.buffer { flex: 1 1 0; }                          /* grows and shrinks to 0 */
.centre { flex: 0 1 800px; min-width: 560px; }    /* holds 800; shrinks only once buffers are gone */
```

**Order of collapse — note 1254, which was never written down before:**

| Width | What happens |
|---|---|
| 1440 | centre 800, buffers 93 each — matches §10 exactly |
| 1280 | centre 800, buffers 13 each — nothing switches |
| **1254** | buffers reach 0 (`64 + 390 + 800`) |
| 1254 → 1180 | centre shrinks from 800 toward its 560 floor |
| **1180** | structural switch — three columns become one column plus drawer |

**A Figma caveat: Auto Layout has no flex-shrink and no priority.** Three `FILL` siblings split space equally. The reference frames therefore pin the centre `FIXED 800` with buffers `FILL`, which reproduces §10 at all three widths but cannot show the centre shrinking. **Where the frames and this CSS disagree, the CSS wins.**

**Below 1180 is one composition, not a third design.** Header 52 fixed · content fill with 16px gutters · drawer at its detents · bottom nav 56 fixed and top-most. Tablet and phone are the same structure; they differ only in how much width the content region gets.

---

## 4 · Expect pixel movement. Do not file it as regressions.

Converting a frame normalises off-scale gaps, so **some things moved**. This is the conversion working. A pixel audit that flags these is wrong, and I would rather tell you now than have you reconcile it later.

| Where | Movement |
|---|---|
| First-Time User — Desktop | everything below the prompt bar rose **3px** (27px gap → 24) |
| First-Time User — Mobile | text moved **x20 → x16** — corrects a pre-existing mismatch with the 16px gutter |
| Login — Desktop | card **528 → 540**; sign-up link re-spaced to 24 below |
| Login — Mobile | card **479 → 494**; link re-spaced to 16 below |
| Conversation — Desktop | suggestions moved down 3px; pane rows and suggestion stacks 6px gaps → 8 |
| Generation | card gaps 10/12 → **12** |
| Theater | source list 9 → **8** |
| Wallet | plan-card run moved **240 → 258** — see §5 |

**Both Gate frames converted with zero movement**, because their 24px conversation rhythm was already on scale. That is what a disciplined frame looks like.

---

## 5 · Two structural defects found by converting

### 5.1 · The user chat bubble was never a container

On the Conversation frames the rounded background was a `Frame` and the text was an **overlapping sibling positioned on top of it** — not a child. The bubble could not grow with its text; a longer message would have overflowed silently.

**Fixed** — text reparented, frame hugs at padding 14/11. **Build bubbles as: text is a child, frame hugs.** Never a fixed box with text floating over it.

**And a correction to my own warning:** I told Joy this was probably systemic. It is not. I swept both pages for the shape — a childless frame with exactly one text sibling inside its bounds — and got **one** hit, which was a Login button. The reader's bubbles are proper component instances. Only the two Conversation frames were affected.

### 5.2 · A 2px overlap I had twice dismissed

*"More budget, more depth — Business unlocks upload, editing, Intelligence."* was flagged twice as a hairline touch and left alone both times, because the rendered text sat clear of the plan card. Once the plan cards became a single run, it was **−2px against a real container across 7 frames** and no longer arguable. The run now sits 16px below the line.

**The general point, and the real case for this whole exercise: loose nodes hide this class of defect; containers surface it.**

---

## 6 · Patterns — encode these, do not re-derive them

| Pattern | Encoding |
|---|---|
| Right-aligned user bubble | full-width `HORIZONTAL` wrapper, `primaryAxisAlignItems: MAX` — not a per-child alignment override |
| Numbered question row | `HORIZONTAL`, gap 0, **number fixed 20px**, text fills — holds the text edge steady when the numeral becomes 10 |
| `or` divider | `HORIZONTAL`, both rules fill, word hugs — self-solves at any card width |
| Chat bubble | text is a **child**; frame hugs with padding |
| Card / row stacks | `VERTICAL` gap 12, children `FILL` |
| List runs | 3+ siblings sharing x and width → one `VERTICAL` wrapper, spacing snapped to the scale |

**Left absolute on purpose:** the Theater graph zone (138 nodes — a data visualisation, not a layout), cover-card thumbnails, and pinned furniture (input bar, pane switcher, bottom nav).

---

## 7 · Also changed since the last prompt

- **Focus ring is 1.5px, not 2px** (Joy). The 2px perimeter is a **AAA** rule (2.4.13); we hold **AA**, where 1.4.11's 3:1 contrast is the measurable requirement — met at any thickness. **The 2px offset is unchanged and is structural** — it is what keeps the ring legal on the accent-filled button. 1px was rejected: the hairline border is already 1px, so a 1px ring reads as a border-colour change. `focus-keyboard-spec.md` §1.

---

## 8 · Still yours, unchanged

Contrast tokens and the never-as-text lint · the fluid shell to §10b (now with the corrected CSS) · checkbox hit areas → 24×24 · focus and keyboard implementation · AI-disclosure metadata in the export pipeline · the `Wallet Icon` 20×20 parent check.

**Open, and none are design decisions:**

| | Question | Owner |
|---|---|---|
| 1 | Does the API return `sourceCount` and `model` for export metadata? | Jayant — asked |
| 2 | C2PA now, or XMP-only for launch? | you — **XMP-only is fine**, build so a manifest can be added without rework |
| 3 | Does the footer link alone satisfy AI Act 50(1)? | legal — **deferred by Joy**, not blocking |

---

*Design session · 2026-08-21. Read with `design-guidelines.md` §1 · §9 · §10a · §10b and `focus-keyboard-spec.md`.*
