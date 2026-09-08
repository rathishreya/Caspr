# Response — design inputs while conventions settle

> **Superseded in part by [`DEV-PROMPT-ROUND-3.md`](DEV-PROMPT-ROUND-3.md) (2026-08-21).** Two things in this file changed after it was written: **§10b's centre declaration was wrong** — building it literally gives a 560px content column — and **the Auto Layout conversion is now done across the whole rebuild order**. Round 3 also answers the five follow-ups. Read that first; this file remains the record of the accessibility, token and responsive decisions.

**Re:** [`DESIGN-INPUTS-WHILE-CONVENTIONS-SETTLE.md`](DESIGN-INPUTS-WHILE-CONVENTIONS-SETTLE.md) (dev session, 2026-08-20).

**The document is accepted.** Every item is real work and most of it is now decided. Below: what I verified, two corrections that change scope materially, the decisions Joy has made, and what I have executed.

I checked each claim against the file rather than taking the counts on trust — because the last exchange between our two sessions produced three findings that had to be withdrawn, and the fix for that is verification, not goodwill.

---

## Accepted without qualification — §1's framing

> *"The audit loop we ran for two days was two sessions confirming the same wrong thing to each other."*

That is a fair description and I am not going to soften it. My pixel audit measured coordinate fidelity between a file and a build that were both expressing a composition at exactly two widths. Correct answers, wrong question. Neither of us asked whether the input could express responsive intent at all.

---

## Two corrections that change the work

### §2 — the Variables already exist. This is a binding job, not a build job.

`get_variable_defs` returning `{}` on a frame means **that frame's nodes are not bound to variables** — not that the file has none. It has 100, in exactly the three tiers the document asks us to create:

| Collection | Variables | Modes |
|---|---|---|
| `Brand` (primitive) | 35 | 1 |
| `Semantic` | 19 | **2** |
| `App — Specific` (component) | 46 | 1 |

73 colour, 27 float. So the ask shrinks from *"promote the ramp to Variables"* to *"bind existing nodes to the collections that are already there."* Worth catching before someone spends days rebuilding a token layer.

The underlying diagnosis stands: because nodes carry raw hex, Figma and code have been hand-synchronised, which is how `#2a2927` and `#2e7d33` drifted in.

### §1 — Auto Layout is uneven, not absent. Both samples came from the worst page.

| Page | Containers | Auto Layout |
|---|---|---|
| Components — Core | 248 | **42%** |
| Exploration | 443 | 35% |
| Report Creation | 1,962 | 27% |
| Insights | 51 | 25% |
| Profile & Wallet | 1,238 | 24% |
| Documents | 1,736 | 20% |
| **Onboarding** | 210 | **7%** ← `1294:388` and the dialog both live here |

The conclusion holds for screen frames — they are predominantly absolute, and components are worse than the page figure suggests (10 of 40 on Components — Core). But *"the file has no Auto Layout"* would send someone to rebuild from zero, and a third of the work is already done.

---

## §1 continued — I tried to convert Auto Layout automatically. It cannot be scripted, and here is the evidence.

I attempted three strategies on `🧩 Components — Core`, each with a safety net: record every child's position, convert, verify nothing moved by more than 1px, **revert automatically on any drift.**

| Strategy | Converted | Reverted | Why the rest failed |
|---|---|---|---|
| 1 · vertical stacks only | 0 | 3 | 50 of 60 had overlapping children |
| 2 · + lift full-bleed backgrounds to `ABSOLUTE` | 2 | 2 | 45 still overlapped |
| 3 · + horizontal axis detection | 0 | 5 | **47 are not single-axis stacks at all** |

**The conclusion is not "the script needs more work."** It is that the containers still on absolute positioning are genuinely two-dimensional compositions — an icon beside a two-line text block, a badge over a card, a status pill floating at top-right. Expressing those in Auto Layout requires **inserting wrapper frames**, which:

- changes the node tree, so **node IDs move** — and the pixel-pass prompts, the specs and your build all reference specific IDs;
- cannot be verified by position-preservation alone, because new nodes legitimately appear;
- is a design decision per container (what groups with what), not a mechanical transform.

**So this is a manual, component-first job with review, and I am not going to bulk-script it.** Scripting it is how you get a mangled file — which is the failure mode this whole exchange exists to prevent. The safety net worked exactly as intended: 10 attempted conversions that would have shifted geometry were detected and rolled back automatically, and a render check afterwards confirmed the file is intact.

**Current state: 43% on Components — Core, unchanged.** The honest position is that Auto Layout coverage will move slowly and deliberately, and that **§10b's fixed / fill / hug declarations are the specification you should build to in the meantime** — they are written down and authoritative even where the file does not yet encode them.

## §4 — Responsive: the four questions are the wrong shape. Answered anyway.

**Joy's ruling: *"as responsive as possible."*** Not a breakpoint list — laptops at every resolution and zoom level, tablets of all sizes, phones, foldables that change posture mid-session.

That rules out answering "what happens at 1280", because **you cannot enumerate zoom.** 150% zoom on a 1440 screen *is* a 960 viewport. So intent is declared per region and every width falls out of it:

| Region | Behaviour | Value |
|---|---|---|
| Nav rail | fixed | 64 |
| LHS pane | fixed on wide · fills on narrow | 390 |
| Content column | **fills, clamped** | min 560 · ideal 800 · **max 800** |
| Buffers | fill — absorb the remainder | ≥0 |

**Taking your four questions directly:**

1. **1180 → 1440:** the centre column holds 800 and the buffers absorb the difference. Below 1180 it shrinks toward its 560 floor.
2. **Above 1440:** max-width. Content does not grow; buffers do.
3. **768 → 1180:** no separate tablet design. One structural breakpoint at **~1180** where three columns become one column plus drawer — that is the only place layout changes *shape*.
4. **Per region:** the table above. Rail fixed, pane fixed-then-fill, centre fill-clamped, buffers fill.

**Four rules that make it hold:**

- **Container queries on components, not viewport queries.** A row or card responds to *its container*, so one component serves a 390 pane and an 800 centre. This is the root fix for §3 — it removes the reason a separate scaled mobile card existed at all.
- **Fluid type for display sizes only.** Headings may `clamp()`. UI text stays fixed px so the user's own font setting is respected.
- **Zoom and foldables need no separate design.** Both are already answered by the above.
- **Auto Layout is how this is expressed.** `fixed` / `fill` / `hug` per container *is* the responsive spec. This is why §1 is the deliverable and not tidying.

**Reference frames: three — 390 · 834 · 1440.** A fluid system needs *fewer* drawn widths than a breakpointed one. Test matrix in `design-guidelines.md` §10b.

**Sequencing note:** §4 precedes §1. Converting frames before fill/hug is decided per region just re-encodes a guess in a more expensive format.

---

## §5 — Contrast: verified exactly, and it is worse than the build counts imply

I recomputed every ratio. **Your figures are correct**, and the design file carries far more instances than the build does, because each frame variant holds its own nodes:

| Token | Ratio | Text nodes in Figma |
|---|---|---|
| `#9c9b98` tertiary | **2.78** | 678 |
| `#8a8a85` placeholder | **3.47** | 1,416 |
| `#e8453c` accent | **3.93** | — |

**All 2,094 sit on `#ffffff` or `#f6f5f3`. None on the dark cards** — so there are no exceptions to carve out. On canvas the ratios are slightly worse still (2.35 and 2.96 at worst).

Two tokens you did not list also fail: **`signal/secondary` `#8b8a96` at 3.40** (The Signal only — needs a darker pair), and `text/disabled` `#a5a29d` at 2.54, which is **exempt** — WCAG excludes inactive controls.

**The decision Joy made is bigger than darkening two tokens.** Nothing lighter than ~`#767570` passes 4.5:1, so both quiet greys must land on the same value: **the quiet text ramp goes from four levels to three.**

`#1a1a17` → `#5c5b58` → **`#75746f`** (4.68:1)

- **Red text on light surfaces → `#be3530`** (5.61:1) — already in the palette, so no new colour. `#e8453c` is unchanged as a fill and a border.
- **`#9c9b98`, `#8a8a85`, `#8b8a96`, `#e8453c` may never be a text fill.** They stay valid for hairlines, icon strokes, dividers, the applied-dot and area fills, which carry no minimum. **This is lintable** — a text node with any of those four fills is a defect, and that is the check worth adding to CI.
- Where two quiet levels genuinely need separating, **separate them with size or weight, not colour.**

Full ruling: `design-guidelines.md` §1 → "Text contrast".

**One date correction:** the European Accessibility Act has applied since **28 June 2025**, not June 2026 — the exposure is a year older than stated, which strengthens the point rather than weakening it. Your EU AI Act date (2 August 2026) is right. I cannot verify the DTCG "stable October 2025" claim and would not rely on it in an argument.

---

## §3 — Fractional type: confirmed, but the class is narrower than "fractional"

`11.585 / 10.040 / 9.654` is exactly what the mobile card returns, and the scale factor is confirmed: they are `15 / 13 / 12.5 × 0.7723`. **Fixed** — the mobile card is now designed at **12.5 / 11 / 11**, and the grid re-equalised around it.

**Two things worth knowing before anyone writes a "no fractional font sizes" lint:**

1. **Half-steps are deliberate and must not be touched.** 9.5, 10.5, 11.5, 12.5, 13.5, 14.5 account for **2,100+ nodes**, and `10.5` is the canonical caps-label size in `design-guidelines.md` §11.0b. A blanket fractional rule would destroy the type scale.
2. **The 7.15px and 10.4px nodes are not defects.** I flagged these to Joy as a second instance of the artifact and I was wrong — all 270 of them sit inside `cover` / `Cover Card` on Documents. They are **report-cover thumbnails**: deliberately miniature renderings of a cover inside a document card. Correcting them would break the thumbnail. Left alone.

So the real defect class is **non-half fractional sizes in live UI text — 67 nodes, all on Onboarding**, and all now fixed:

| Was | Now | Nodes | Where |
|---|---|---|---|
| 12.53 | 12.5 | 37 | auth cards — email, continue |
| 26.85 | 27 | 8 | *Welcome back*, *Create your free account* |
| 11.585 / 10.04 / 9.654 | 12.5 / 11 / 11 | 15 | first-run thread cards |
| 10.74 | 10.5 | 5 | login card |
| 11.635 | 11.5 | 2 | *Can't find it? Check your spam* |

One stray remains — `25.71` on `Welcome — Desktop v3` (a single node). Left for the next pass rather than guessed at.

Container queries (§4) remove the reason a separately-scaled mobile card existed at all, which is the durable fix.

---

## §6 — Target sizes audited. Fewer real failures than the raw count suggests.

Swept every control-shaped node on the live pages. Raw count under 24×24 is 245, but **two large groups are exempt**, and saying so matters because otherwise someone spends a week enlarging dots:

| What | Count | Verdict |
|---|---|---|
| `product-voice dot` 7×7 | 57 | **Exempt** — decorative, not a target |
| `citation dot` 7×7 | 33 | **Exempt** — WCAG 2.5.8 excludes targets *inline in a sentence* |
| `Wallet Icon` 20×20 | 77 | **Check the parent.** The icon may be 20 inside a ≥24 button — needs your read of the built control |
| **`checkbox-on-dark` / `checkbox-light` 20×20** | 60 | **Real failure.** Needs a 24×24 hit area |
| **`checkbox` 18×18** | 10 | **Real failure** |
| **`consent checkbox` 18×18** | 2 | **Real failure** — on the signup Terms overlay |

**The real fix is ~72 checkboxes**, and it is a hit-area change rather than a visual one — keep the 18–20px box, extend the tappable region to 24. That is cheaper than redrawing and keeps the design intact. **Focus states and keyboard models are still undone** — see below.

## §6b — Focus states: designed, built, and you were more right than you knew

**"The file draws none, for any control"** — correct, and worse than that. `Input / focus` and `Prompt Input / Focus` *exist as frames*, which makes it look solved. They are not focus states: they differ from their default twins only by having text typed into them. **They are empty-vs-filled states, mislabelled `focus`.** Anyone building from them would ship no indicator and believe they had matched the design.

**Now designed and built** — `🧩 Components — Core` → `Focus states — LOCKED 2026-08-21` (`2455:169`), demonstrated on button, input, filter pill, list row and checkbox.

| | |
|---|---|
| Ring | **2px**, `focus/ring` — new Semantic variable |
| Offset | **2px** gap of the underlying surface |
| Radius | element radius **+ 2**; pills stay pills |
| Light | accent `#e8453c` — 3.93:1, passes the 3:1 UI minimum (1.4.11) |
| Dark | `#ffffff` |

**The 2px offset is structural, not styling.** On the accent-filled `Generate` button a flush ring would sit red-on-red and fail; the gap puts the ring's outer edge against the page surface, where it passes. Do not collapse it.

Use `:focus-visible`, never `outline: none` without a replacement, and the ring must not be clipped by an ancestor — which is 2.4.11 in practice.

## §6c — Keyboard models: written

[`../product/focus-keyboard-spec.md`](../product/focus-keyboard-spec.md) §3, per the ARIA APG, covering **drawer** (modal at Full, non-modal at Peek/Half; `Esc` steps down one detent rather than dismissing), **pane switcher** (Tabs, **manual** activation — arrowing must not fire Ask/Versions loads), **menus** (Menu Button), **confirms** (Alert Dialog — **focus opens on the safe control, never the destructive one**), the **prompt bar**, and a **skip link**, which the file has never had.

## §7 — AI disclosure: designed

[`../product/ai-disclosure-spec.md`](../product/ai-disclosure-spec.md).

**50(1) — interacting with an AI.** Caspr sits comfortably inside the "obvious from context" exemption: the category is *Analytical AI*, the H1 is *"Not an assistant. An analyst."*, and nobody believes a human wrote 100 cited pages in 15 minutes. **So no banner, no modal** — a compliance gesture on the exact screen where activation is already failing would cost more than it protects. Instead: a permanent footer link, **added to all 19 onboarding footers**, `Security · Privacy · Terms · AI disclosure · © 2026 Caspr`. The desktop footer is re-anchored to x=1320 and mobile centred, because the added item pushed the old fixed position past the 120px margin.

**50(2) — marking generated content — is the one with teeth**, and it is mostly yours. A visible cover line (*Generated by Caspr · Analytical AI · {date}*) does **not** satisfy it. The requirement is machine-readable: **PDF XMP** (`xmp:CreatorTool`, `caspr:aiGenerated`, `caspr:generatedAt`, `caspr:analysisType`, `caspr:sourceCount`) and **PPTX core properties** plus a custom part. Field table in the spec.

**C2PA Content Credentials is the durable answer** — a signed provenance manifest is what detection tooling actually reads. Recommendation: ship the XMP/OOXML fields now, roadmap C2PA, and do not treat custom fields as permanent.

Three things there are **not** design decisions and are flagged as such: whether the footer link alone satisfies 50(1) *(legal)*, C2PA timing *(eng)*, and whether Jayant's API returns `sourceCount` and `model` or the product side holds them *(Jayant)*.

## §8 — Agreed, and it follows §1

Code Connect needs real components and variants. The DS audit already logged detached-frame violations, so this overlaps scoped work. Sequence: §4 decides → §1 encodes → §8 links.

---

## What has been executed

1. **`design-guidelines.md` §1 → "Text contrast"** — the three-level ramp, the four never-as-text tokens, the exemption for disabled.
2. **`design-guidelines.md` §10b → "Responsive model"** — the region table, the single structural breakpoint, the four rules, the test matrix. §10 is reframed as *the reference composition at 1440*, not a licence to build only 1440.
3. **The Figma contrast pass — 2,497 nodes recoloured across six pages.**

| | Was | Now | Nodes |
|---|---|---|---|
| Quiet greys | `#9c9b98` · `#8a8a85` | **`#75746f`** | **1,926** |
| Red text on light | `#e8453c` | **`#be3530`** | **557** |
| Signal cool grey | `#8b8a96` | **`#75747f`** | **14** |
| Red text on dark | `#e8453c` | *unchanged* | 18 |

Per page: Documents 902 · Profile & Wallet 748 · Report Creation 592 · Onboarding 131 · Components 76 · Insights 47. Verified afterwards — **zero failing text fills remain** on the live pages.

4. **New Variables**, so the binding job in §2 has correct targets:

| Variable | Value | Role |
|---|---|---|
| `brand/grey-675` | `#75746f` | the text ramp floor, 4.68:1 |
| `brand/accent-text` | `#be3530` | red text on light, 5.61:1 |
| `brand/signal-secondary` | `#75747f` | the Signal's cool floor, 4.60:1 |
| `text/accent` *(Semantic)* | Light → `accent-text` · Dark → `accent` | accent as a text fill |

`text/tertiary` Light now aliases `brand/grey-675` instead of `brand/grey-600`. Dark mode is untouched — the dark ramp already passes on dark surfaces. `brand/grey-600` and `brand/grey-650` survive as primitives for non-text use.

5. **Fractional type on Onboarding** — 67 nodes, table in §3 above. The first-run mobile cards were re-equalised afterwards and still close within the 844 viewport.

6. **Variable binding — 11,911 paints bound across six pages.** Nodes now reference the collections instead of carrying raw hex, so the hand-synchronisation you diagnosed is broken for good on everything bound.

| Page | Text fills | Shape fills | Strokes |
|---|---|---|---|
| Documents | 1,975 | 1,303 | 23 |
| Profile & Wallet | 1,819 | 988 | 41 |
| Report Creation | 1,795 | 2,354 | 34 |
| Onboarding | 598 | 404 | 2 |
| Components — Core | 164 | 223 | 16 |
| Insights | 97 | 74 | 1 |

Bound by **role, not by value** — text fills resolve to `text/*`, surfaces to `surface/*` and `canvas`, strokes to `border` / `border/strong`. White is therefore `text/inverse` on a label and `surface/0` on a card, which a naive hex map would have got wrong.

**One gap this exposed:** ink **`#1a1a17` — the most-used text colour in the file — had no variable at all**, and `text/primary` resolves to `#0a0a0a`. Added as `brand/ink`. `text/primary` is left pointing at `#0a0a0a`; both near-blacks are listed as legitimate in `design-guidelines.md` §1, so **which one `text/primary` should mean is a question for you and Joy**, not something I should silently decide.

## Order of work from here

| | Work | Owner | Status |
|---|---|---|---|
| 1 | Contrast — Figma, 2,497 nodes | design | **done** |
| 2 | Fractional type on Onboarding, 67 nodes | design | **done** |
| 3 | Variable binding, 11,911 paints | design | **done** |
| 4 | Target-size audit | design | **done** — 72 real failures identified |
| 5 | Responsive model decided and written | design | **done** — §10b |
| 6 | **Contrast — code tokens + the lint** | **dev** | **yours** |
| 7 | **Build the fluid shell to §10b** | **dev** | **yours, unblocked** |
| 8 | **Checkbox hit areas → 24×24** | **dev** | **yours** — hit area only, no visual change |
| 9 | Focus states — designed + built in Figma | design | **done** |
| 10 | Keyboard models — all six patterns | design | **done** |
| 11 | AI disclosure — 50(1) surfaces in Figma, 50(2) specced | design | **done** |
| 12 | **Focus + keyboard implementation** | **dev** | **yours** |
| 13 | **AI-disclosure metadata in the export pipeline** | **dev** | **yours** |
| 14 | Auto Layout — manual, component-first | design | in progress, slow by design |
| 15 | Code Connect | both | after 14 |

**Five things are yours now, and none of them is blocked.**

**6 · The token change must land in code or we diverge again.** `text/tertiary` → `#75746f`, red text → `#be3530`, Signal secondary → `#75747f`. Then the lint that matters more than the change itself: **fail the build when `#9c9b98`, `#8a8a85`, `#8b8a96` or `#e8453c` is used as a text fill on a light surface.** That is what stops this recurring.

**7 · The fluid shell.** §10b is decided and written — rail fixed 64, pane fixed 390 then fill, centre fill with min 560 / max 800, buffers absorb. One structural breakpoint at ~1180. Container queries on components. You do not need the Figma file converted to build this; the specification is authoritative on its own, which is the point of writing it down.

**8 · Checkbox hit areas.** 72 controls at 18–20px. Extend the tappable region to 24; do not redraw the box.

**12 · Focus and keyboard.** `focus-keyboard-spec.md` is complete — the ring, the 24px hit areas for 72 checkboxes, and six keyboard patterns. The two that will bite if missed: **focus must return to the trigger when a drawer or dialog closes**, and **confirms must open focus on the safe control**.

**13 · AI-disclosure metadata.** The XMP and OOXML fields in `ai-disclosure-spec.md` §2.2, stamped at export and **re-stamped on regeneration** so editing cannot strip them.

**Questions back to you — none are design decisions:**

**Resolved — `text/primary` means `#1a1a17`** (Joy, 2026-08-21). Take this to code: **the app's text black is `#1a1a17`, not `#0a0a0a`.**

The subtlety that came out of executing it: **half the nodes bound to `text/primary` were website chrome** — `Caspr`, `Solutions`, `Use Cases`, `Pricing` in the onboarding nav, plus the footers. Those must keep the live site's `#0a0a0a` or the onboarding frames stop matching the real header they sit under (§5.5 of the pixel prompt). So:

- **70 nav/footer nodes** are now bound directly to `brand/black` `#0a0a0a` — website chrome, pinned.
- **161 nodes** follow `text/primary` → `brand/ink` `#1a1a17` — all app text.
- **Zero** unbound raw `#0a0a0a` remain anywhere.

**`brand/black` is now website-chrome-only. Never use it for app text** — that rule is in `design-guidelines.md` §1 and is worth a lint alongside the contrast one.

**Still open — none are design decisions, and none block you:**

| | Question | Owner | Status |
|---|---|---|---|
| 1 | Does Jayant's API return `sourceCount` and `model` for the export metadata, or does the product side hold them? | **Jayant** | **asked 2026-08-21.** If the API can return them, we want them on the completion payload rather than a separate call |
| 2 | C2PA Content Credentials now, or XMP-only for launch? | you | open — **XMP-only is fine for launch**; build the stamping so a C2PA manifest can be added without reworking the pipeline |
| 3 | Does the footer link alone satisfy Article 50(1)? | legal | **deferred (Joy).** Not blocking — the footer link ships regardless, and an in-session line is a one-node addition if counsel asks |

---

*Design session · 2026-08-21. Answers `DESIGN-INPUTS-WHILE-CONVENTIONS-SETTLE.md` in full.*
