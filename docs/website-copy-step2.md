# Step 2 — Copy drafts for review

Product-truth copy for the existing 16 designs. **Draft only** — nothing goes into Figma until approved.
Voice per [`.agents/brand-guidelines.md`](../.agents/brand-guidelines.md): conclusions not descriptions, numbers
anchor everything, no exclamation points.

**Decided upstream (2026-08-18):**
- **"All outputs" means all *committed* outputs — the tier's set, not every format.** Brief stays PDF + MD; a
  Brief does not ship a deck. So the format claim is **per-tier**, and only the *language* claim is universal.
- Extra formats and additional languages stay charged. "No retainer, no per-seat charges, no hidden fees" is
  unchanged and correct.
- Edit credits are a benefit, surfaced in tier comparisons and one FAQ, nowhere else.

---

## 1 · The inclusion line

Two different claims, so they get separated. **Language is universal and belongs in the headline. Formats are
per-tier and belong on the card**, where the context is already specific.

**Primary (pricing hero support line / analysis-types section):**

> **Your language. Included.**
> Every format your tier delivers, generated natively in your working language — not translated after the fact.

**Per-tier card bullet.** Replaces the current `— Boardroom-ready PDF/PPTX`, which is vague on two axes at once:

| Tier | Bullet |
|---|---|
| Brief | `— PDF and Markdown, in your language` |
| Study | `— PDF, PPTX, XLSX, CSV, Markdown — in your language` |
| Intelligence | `— PDF, PPTX, XLSX, CSV, Markdown — in your language` |

**Why this shape.** The base is more generous than the page admits — a French user's French report is included,
and the charge applies only to a *second* language. Leading with that makes the paid edge obvious without
apologising for it. Stating formats per-tier keeps the claim true for Brief, which a flat "every format" line
would not be.

---

## 2 · FAQ — what's included, what costs extra

**Q. What's included, and what costs extra?**

> Every analysis includes its full output set — a Brief delivers PDF and Markdown; a Study and an Intelligence
> add PPTX, XLSX and CSV. All of it generated natively in your working language.
>
> Four things are priced separately, and each is shown before you generate: a **format outside your tier's set**
> — a Brief as a deck, say; a **second language**, where every format in it is a new deliverable;
> **re-generating an output** after you have edited the report; and **premium data sources**, where an analysis
> calls for them.
>
> Per-output prices are $5 for PDF, DOCX, XLSX or CSV, $10 for PPTX. Markdown is free. Nothing is charged that
> did not appear on the confirmation screen first.

---

## 3 · FAQ — edit credits

**Q. Can I change the report after it's generated?**

> Yes. Every analysis carries an editing allowance — 15,000 credits on a Brief, 80,000 on a Study, 300,000 on an
> Intelligence. Rewriting a section, regenerating a chart, tightening the language, adding an appendix: all of it
> draws on that allowance rather than costing you a second analysis. On a Study, that is enough to rewrite every
> section of a 100-page report twice over.

*(Closing sentence confirmed by Joy as within the allowance.)*

---

## 4 · Tier comparison row

Where a comparison chart exists, one row — framed as capability, not allowance:

| | Brief | Study | Intelligence |
|---|---|---|---|
| **Edit the finished report** | 15,000 credits | 80,000 credits | 300,000 credits |

---

## 5 · Multilingual — the feature that isn't on the site

Currently absent entirely. A real differentiator against every competitor on the `/vs` pages, and the unlock for
non-English markets with no product work.

**Eyebrow:** `MULTILINGUAL BY DEFAULT`

**Headline:**

> **Written in your language. Not translated into it.**

**Body:**

> Caspr reasons and writes in your working language. The structure, the vocabulary and the conclusions are native
> to it — not produced in English and passed through a translator.
>
> Where a translation pipeline demonstrably outperforms native generation, we use that instead. The test is the
> output, not the method.

**Supporting line for the homepage hero proof row:**

> No credit card · 25M+ curated sources · Your language, natively

**Note.** The second paragraph is doing real work and should not be cut for brevity. It keeps the headline claim
true without naming the exception, and it reads as rigour rather than hedging — the brand tests both routes and
ships the better output. Dropping it would leave an absolute claim with a known exception behind it.

---

## Also folded into this pass

- **`25M+` → `25M+` curated sources** — wrong in ~6 places, in Figma and live.
- **Brief length** — the site says "1–3 pages"; `gate-output-spec.md` calls a Brief "a 3–5 page note". One of the
  two is wrong; the site should not state a number it misses.
- **Free trial** — `$100` is stated everywhere, the **90-day expiry** and no-card terms are not.
- **Minimum Research Budget `$200`** — implied by the plan cards, never stated.

---

## Open action outside the website

**`pricing-model.md` §4.6-B overstates the base.** It reads *"Included in the analysis price (the base): ALL
formats — MD · PDF · PPTX · XLSX · CSV"* with no tier qualifier. `gate-output-spec.md` §4 is the correct one
(Brief = PDF · MD; Study and Intelligence get all five), and your ruling confirms it. The two specs have been
inconsistent on this point, and **pricing-model is the document the billing rules are read from** — worth
correcting to *"the tier's committed output set, in the user's working language"*. Say the word and I'll make
that edit as an announced change; the app is mid-build so I'd rather not touch it quietly.

*(This reverses the "widen Brief to all formats" note from earlier today — that was my misreading of "all
outputs", now corrected.)*

---

# What changed, by screen

Executed 2026-08-18. **Live site untouched** — all changes are in Figma `rmurwf7WT9B4kKhXcju3ro`.

## Sweep — all 15 page designs, desktop + mobile

| Change | Nodes | Pages |
|---|---|---|
| `25M+` → `25M+` | **77** | `/` 17 · `/consulting` 10 · `/market-research` 10 · `/academic` 10 · `/category-managers` 9 · `/investors` 7 · `/agencies` 6 · `/strategy` 4 · `/startups` 4 · `/pricing` 2 · `/about` 2 |
| Brief page count `1–3 pages` → `3–5 pages` | 4 | `/` desktop + mobile · `/pricing` desktop + mobile |

## Homepage `/` — `14:2` desktop, `20:2` mobile

| Fold | Change |
|---|---|
| **02 Hero** | Proof row now four items over two balanced lines: `No credit card · 25M+ curated sources` / `Zero hallucinations · Your language, natively`. Explicit line break — free wrapping split "Your / language, natively" |
| **05b Engine** | Stat numeral `25M+` → `25M+` (both frames) |
| **05c Multilingual** | **NEW SECTION**, inserted between Engine and Pricing. Dark band, cloned from Category Claim. Desktop 1440×602, mobile 390×498 |
| **05 Pricing** | Format bullet now per tier — Brief `— PDF and Markdown, in your language`; Study + Intelligence `— PDF, PPTX, XLSX, CSV, Markdown — in your language`. Brief meta row now `15 min · 3–5 pages` |

Page height: desktop 5735 → **6337** · mobile 6952 → **7574**.

## `/pricing` — `64:3` desktop, `70:2` mobile

| Fold | Change |
|---|---|
| **04 Analysis Types** | Header column widened 328 → 720 and re-centred to fit the new **inclusion line**. Brief meta `3–5 pages` |
| **05 FAQ** | 6 → **8 entries**. Added *"What's included, and what costs extra?"* and *"Can I change the report after it's generated?"*. The Research Budget answer now states the **$200 minimum** |

FAQ section: desktop 1398 → **1940** · mobile 1250 → **1784**.

---

# Five things to look at on review

1. ~~"Zero hallucinations" is gone from the homepage hero.~~ **Resolved — restored as a fourth item** (Joy,
   2026-08-18). Four items no longer fit one line at 560px, so the row is set two-and-two with an explicit
   break; free wrapping split "Your / language, natively" across lines. Desktop and mobile both 2 lines, 36px.
2. **Multilingual section placement was my call.** I put it between Engine and Pricing as a dark band — it reads
   as a capability claim next to the engine story, and dark punctuates the grey→white alternation. Trivial to move.
3. **The inclusion line is one paragraph, not two.** Both approved sentences are verbatim, but run together, so
   the header carries eyebrow + headline + one support line rather than four stacked elements.
4. **Desktop and mobile `/pricing` FAQs have different copy** — and did before this work. Desktop asks *"What is
   the Research Budget model?"*; mobile asks *"What is a Research Budget?"*, with different answers throughout.
   I added the two new entries to both but did not reconcile the existing six. Worth a pass.
5. **I was wrong about the 90-day trial expiry.** My earlier note said it was missing; it is already in the
   `/pricing` FAQ — *"no credit card required, valid for 90 days"*. No change made. It is still absent from the
   trial CTAs themselves, which is the weaker version of the original point.

Minor: the `25M+` change pushed two mobile ICP FAQ answers (`/consulting`, `/agencies`) onto an extra line. Both
are in auto-layout and reflowed cleanly.
