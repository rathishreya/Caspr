# Dev prompt — round 5 (the architecture rename, the poll, the alphabet)

**To:** the dev session · **From:** the app design session · **2026-09-01**
**File:** `y2F394I4CwEeSzH2kKuDCt` — **pull before you start.**

Three threads. **§1 and §2 change strings you are already rendering. §3 changes an asset.** §4 lists two specs
I corrected, so you do not build from the stale versions.

---

## 1 · The architecture rename — the brains are retired

**Source:** [`source-assess-conclude.md`](../source-assess-conclude.md).
**⛔ Never render, log or name:** *Thinking Brain · Learning Brain · brain · thinking · reasoning · cognitive.*

### 1.1 The proof line — 4 nodes

| Was | Now |
|---|---|
| Every source, credible. Every **alternative, weighed**. Every **conclusion, defensible**. | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

`1171:4` · `1289:385` · `2601:251` · `2601:295`

**Four, not the two the spec listed** — the invited-user first-run frames are clones of the FTU stack and
carried the old line. **If you templated that stack, it is one constant, not four strings.**

### 1.2 The generation notification line — 8 nodes

`760:67` · `1514:6` · `2157:3` · `1527:7494` · `1827:37` · `2044:39` · `2186:4603` · `2187:4717`

> `Initiating Learning Brain` → **`Sourcing now — assessing and concluding follow.`**

**Render it as it already is: Inter Italic 13 `#5c5b58`, left-aligned, sentence case**, with the product-voice
dot and a single `#ececea` hairline above. **Not centred, not caps.**

**⚠ Do not implement this as `SOURCING → ASSESSING → CONCLUDING`,** even though an earlier prompt offered that.
That lockup narrates a *running sequence*; this node fires **once**, inside the Ask thread, between two other
italic Caspr sentences. Setting three caps words there re-creates the centred-caps phase label `DEV-BRIEF.md`
§10 retired. **If you want the three-stage lockup, its home is the Theater's own progress furniture** — not the
thread, and it is not designed yet.

---

## 2 · The get-to-know depth poll is retired — and the rule behind it matters more than the string

**`How deep do you usually go?` is gone.** Joy, 2026-09-01: *"We will have this information anyway from the
users data."*

**The evidence was on the screen.** `Account · Research profile` asked that question in its `SHARPEN YOUR
PROFILE` row while the `MEMORIES` list **directly below it already read `Prefers Study-depth analyses`** — a
question answering itself, in one viewport.

> ### ⛔ The rule: never ask what usage data already answers.
> Depth, type, sector, geography, cadence, whether they edit, share or export — **all logged.** A poll that
> asks one of them spends the user's attention to learn something you already have.

**Depth preference becomes a derived memory, not an answered one.** The memory string is now
**`Prefers the $80 depth`** — the price rung, which is universal, rather than a depth name that only exists
for one deliverable type (`COPY-07b`). `2092:2927` · `1736:152` · `2195:2991` · `2206:3030`.

### 2.1 What replaces it — and it rotates

`gate-output-spec.md` §8.0.1 already specifies a **rotating family** of engagement formats. Two questions are
drawn; **the third is specified here and not yet drawn.**

| Question | Options | Drawn at | Why it is askable |
|---|---|---|---|
| **Where does this one end up?** | `A board or IC` · `A client pitch` · `My own call` | `2159:4566` — Generation | **Caspr sees the export, never the room.** Drives register and the acquirer lens (`report-style-guide` §10.2 / §10.3) |
| **How settled is your starting view?** | `I have a hypothesis` · `Genuinely open` · `Challenging a view` | `1749:80` · `1834:22` · `2195:2947` — Research profile | **Changes how alternatives are weighed and presented** — the triangulation promise |
| **What gets cut when you present this?** | `The method` · `The alternatives` · `Nothing` | *not drawn* | Tunes section priority and length |

**The two surfaces deliberately show different questions.** Putting *"Where does this one end up?"* on the
Research profile would repeat the memory `Output goes to investment committees` sitting six rows below it —
the same defect that retired the depth question. **Build the rotation so a question whose answer is already a
memory is not served.**

**Placeholder distribution is `46 / 33 / 21`** and the bar fills are drawn to it. Real aggregates replace it.

---

## 3 · The Caspr alphabet has a v2, and it changes your SVG

**New:** `Caspr alphabet — angular full set v2 (A–Z · 0–9)` — **`2658:178`** on `🧩 Components — Core`,
36 nodes `caspr-alpha-v2/<char>`. **v1 `2104:168` stays as the lineage reference — do not build from it.**

| | v1 | **v2 — ships** |
|---|---|---|
| Box | `46 × 46` | **`24 × 46`** |
| Ink | `26.8 × 26.8` | **`16 × 32`** |
| Stroke | `3.45` round caps + joins | **`3.45`, unchanged** |

**Export as `viewBox "0 0 24 46"`, `stroke-width 3.45`, `stroke-linecap/linejoin: round`, `fill: none`.**

**⚠ Two interim hacks come out the day this lands** — both in
[`hp02_theater_source_web.html`](../../content/assets/visuals/video/hp02_theater_source_web.html):

1. **`transform: scaleX(.62)`** — it existed only because v1 was square. **Remove it.**
2. **`vector-effect: non-scaling-stroke`** — it existed only to survive that transform. **Remove it.**

**Why the box is `24 × 46`:** the flap cell's pitch is Inter's average advance, **measured at 7.19px at 14px
across 16 real source names — a ratio of 0.513**. **Ink is 16, not the 19 first specified**: with the round-cap
stroke a 19-wide path occupies **22.45 of the 24 box**, leaving 0.24px of side bearing, and the churn row
renders as a solid band. At 16 it occupies 19.45 and reads as script. The acceptance test is drawn inside
`2658:178`.

**Per-name advance ranges 0.44 → 0.59**, so the cell pitch is the resolved name's **measured width ÷ character
count**. Glyph positions do not correspond to individual letters. **That is by design, not a fitting bug.**

---

## 4 · Two specs I corrected — do not build from the old text

| File | Was | Now |
|---|---|---|
| **`gate-output-spec.md` §8.0** | *"the hairline+centered-label format … reads `INITIATING LEARNING BRAIN`"* | The product-voice line in §1.2. **It described a format `DEV-BRIEF.md` §10 had already retired**, and the file had already been migrated |
| **`THEATER-SOURCE-DECODE-MOTION.md`** §Assets · §Font | `viewBox 24, stroke-width 1.8` · **DM Mono Medium** | **`viewBox 46 / stroke 3.45`** for v1 and the v2 table · **Inter Regular 14 `#1a1a17`** for the flap cells *and* the resolved rows |

**`DEV-BRIEF.md` §10 was right on both counts and needs no change.**

---

## 5 · Pass-through — not design, but they are yours

| | |
|---|---|
| **`§§PG\|COVER\|§§` markers leak into the PDF text layer** | Six in the first three pages of every PDF, none in the `.md`. Invisible on the page, but **copy-pasted, indexed, and read aloud by screen readers** |
| **Duplicated tables in Briefs only** | All three Briefs checked repeat a table immediately after itself. **Zero Studies do** — a Brief-template bug |
| **⚠ The report-cover provenance string** | *"Analysis generated by Caspr's Thinking Brain"* → *"Sourced, assessed and concluded by Caspr; every claim cited to source."* **Do not ship this alone.** It is on 23 delivered reports and is half of **EU AI Act Art. 50(2)**, whose **XMP half is absent entirely**. Changing the visible string without adding the XMP fields leaves the gap open **and makes it look closed.** Goes with Jayant, in one pass |

---

## 6 · One lint to widen

**`COPY-11a` currently matches `/mo` and misses `/mth`.** A `$1,800/mth, committed` string passed the check and
had to be caught by eye. **Widen to `/mo`, `/mth`, `/month`, `pm`, `p.m.`**

---

*App design session · 2026-09-01. Read with `source-assess-conclude.md`, `DEV-BRIEF.md` §10,
`gate-output-spec.md` §8.0 / §8.0.1, and `THEATER-SOURCE-DECODE-MOTION.md`.*
