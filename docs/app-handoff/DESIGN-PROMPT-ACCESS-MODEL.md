# Design prompt — the access model

*2026-08-26. Paste into the design session. Covers **both** Figma files — the app and the website.*

**Read first, in this order:** [`docs/product/access-model.md`](../product/access-model.md) *(the whole
thing — it is the spec)* · `CLAUDE.md` pricing block · `docs/website-copy-rules.md` §2 and §4.11 ·
`CONCEPTS.md`.

---

## 1 · ⛔ Four rules that bind every frame you touch

| | |
|---|---|
| **1** | **Never write a budget as `from $200/mo`, `$200 per month`, or `starting at $200`.** It is money set aside to spend on your own analyses. Write **`$200 a month of research`**, paired with *"unused balance carries forward"*. Lint rule `COPY-11a` |
| **1b** | **⚠ Never write *"only what you run is recharged"* or *"only charged for what you run"* — both are false.** `R = F + top_up`, and **the platform fee is charged every month regardless of use**: a $200 budget is charged **$14 if nothing ran**, **$94 for one $80 analysis**. **Permitted:** *unused balance carries forward* · *each month restores only what you consumed*. Lint rule `COPY-11b`. **An earlier version of this prompt contained the false phrasing — check anything already drafted from it** |
| **2** | **Never write a depth name without its type.** `Brief · Study · Intelligence` is the **Market Research** ladder only. Investment & Deal is `Screen · Thesis · Diligence`. Use **"the $300 depth"** for the rung across types. Lint rule `COPY-07b` |
| **3** | **Never state a page count.** Depth is **levels of decomposition** — one, two, three. Length follows the topic |
| **4** | **~~Caspr Signals~~ is retired** *(folds into Insights)* · **Monthly Brief folds into Updates** · **The Signal** means only the in-report sentiment layer |

---

## 2 · The rename — you own the copy in both files

**`Professional · Business · Enterprise` → `Try · Solo · Team · Org`.**

| Mode | Budget | Card |
|---|---|---|
| **Try** | none — $100 gifted, no card · then top up | A verb among nouns, deliberately: everything to its right is a commitment |
| **Solo** | $200 a month of research · **~$186 for analyses** | |
| **Team** | $600 a month of research · **~$558 for analyses** | **⭐ Mark as recommended** |
| **Org** | $1,800 a month, **committed** · 3 seats min · **~$1,674 pooled** | **Visually different — a full-width band, not a fourth card.** Different purchase, different CTA (`Talk to us`) |

**⚠ The second figure is mandatory on every card and never dropped for layout.** The app's wallet header reads
**`$186 available`** — a card promising $200 with no second number sets up a first login that shows *less than
the page said*. **But never name the fee:** no *platform fee*, no `7%`, no `$14`. Show gross and available,
explain neither. `pages-for-production.md:55` · `CLAUDE.md:150–152`.

**The plan name is the entity, deliberately:** `Org → Team(s) → User`. Solo means you have no team; Team means
you are one; Org means you contain them. **Data Room scopes reuse the same words** — `Own · Team · Org`.

**Surfaces to sweep:** website `/pricing` and `/enterprise` plan cards · app wallet and plan screens · the
Gate · any settings or upgrade surface.

---

## 3 · `/pricing` — fold 5 structure

```
   Try            Solo           Team ⭐
   no commitment  $200/research  $600/research
   ────────────────────────────────────────────
        Org — $1,800 committed · 3 seats
        SSO · API · deployment quoted · Talk to us
   ────────────────────────────────────────────
        Full comparison table   ✓ / —
```

**⚠ The comparison table's first row must not be a tick.** Against Try, Solo adds only **editing** and
**Updates** — two ticks for $200 — because we deliberately refused to gate anything that costs nothing to
serve. Lead the table with **Research Budget** as a value row, so the grid reads as *what your budget unlocks*
rather than *how many features you get*.

---

## 4 · New design work

| | What | Notes |
|---|---|---|
| **4.1** | **Share an analysis** — invite as viewer or editor | |
| **4.2** | **The file-share grant** | *"This analysis drew on 3 files from your Data Room. Share them with [name]?"* — **explicit, per share, defaulting to NO.** Same pattern as Gate 1: selection is per act, never a standing permission |
| **4.3** | **Shared / read-only analysis view** | **Ask Caspr and every citation must work here, unmetered.** Forwarding is the distribution mechanism; an analysis that cannot show its sources is just a PDF |
| **4.4** | **Private-source claim treatment** | For a claim sourced from an unshared file: show the claim, name the source as private, **render no content**. Sourced without being exposed |
| **4.5** | **Invited-user onboarding** | A new collaborator gets **their own $100**, untouched. Editing on the owner's analysis always draws the **owner's** wallet. Two pots, no bleed — design the moment so the $100 reads as *theirs, for their own first question* |
| **4.6** | **Data Room — two axes** | **Confidentiality** *(Confidential / Publishable — governs whether outputs can go public)* and **Visibility** *(Only me / Team / Org)*. **Both default closed.** These are different questions and must not share a control |
| **4.7** | **Org Data Room view** | Scoped library: `Own · Team(s) · Org`, role-based |
| **4.8** | **Org seats** | Pooled budget view · seat management · optional per-user sub-limit |

---

## 5 · Remove

- **The $399 à-la-carte price.** One price per analysis — `$15 · $80 · $300` — at every mode
- **The $300-depth plan gate.** Redundant: $186 of Solo budget cannot buy a $300 analysis, so the arithmetic gates it. Any mode may run any depth its balance covers
- **Caspr Signals** from every plan card and settings surface

---

## 6 · Blocked — do not design around these

| | |
|---|---|
| **1** | **Seats 4+ pricing** — `pricing-model` §5.2 still says TBD |
| **2** | **Insights** — whether it gates, and at which mode, is undecided |
| **3** | **The `public` field rename** in §6.1 of the access model has engineering impact and is not yet agreed |
