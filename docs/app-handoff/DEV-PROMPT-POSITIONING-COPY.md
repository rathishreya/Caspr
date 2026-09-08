# Dev prompt — positioning copy fixes

> **SUPERSEDED 2026-08-20 — do not send this file.** Everything below was merged into [`DEV-PROMPT-PIXEL-PASS-2.md`](DEV-PROMPT-PIXEL-PASS-2.md) §5 (the two fixes, the verified-clean list, the Ask-pane note) and §6 (the hero HOLD), so the dev works from **one** prompt for this round. Kept only as the record of how the copy sweep was reasoned.

Caspr's positioning was locked on 2026-08-20. The design session swept every user-facing string in the build (`08b9d38`), the Figma app file, and the product specs against it.

**The result is small: two fixes, and one decision that needs Joy before anyone touches it.** Nothing structural changes. Full working: [`../app-positioning-alignment.md`](../app-positioning-alignment.md).

**For context, the locked stack:**

| | |
|---|---|
| Category | Analytical AI |
| Identity | **Not an assistant. An analyst.** |
| Promise | **Arrive certain.** |
| Proof | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

---

## 1 · Fix — the source count on the Help page

`apps/web/src/pages/HelpPage.tsx:58`, the answer to *"Where does Caspr get its data?"*

```diff
- '1M+ curated sources — documents, government databases and news feeds — plus anything you add to your Data Room.',
+ '25M+ curated sources — documents, government databases and news feeds — plus anything you add to your Data Room.',
```

**25M+ is the only approved figure.** Any other count is a retired claim. This is the sole wrong source count in the build — every other reference already says 25M+.

## 2 · Update the comment — and you were right

`apps/web/src/pages/LayoutCanvasPage.tsx:110–117`. You flagged a conflict: the frames said **25M+ live sources** while `CLAUDE.md` said **1M+**. You went with the frames and left a note saying it deserved a second look.

**That was the right call, and the source doc has since caught up** — `CLAUDE.md` now states 25M+. `LEARNING_LINE` needs no change.

Please just update the comment so it records the resolution rather than an open conflict — otherwise the next reader re-opens a settled question:

```
FLAGGED → RESOLVED 2026-08-20. The frames said 25M+, CLAUDE.md said 1M+;
the frames were right and CLAUDE.md now says 25M+. 25M+ is the only
approved source count.
```

*(Worth saying plainly: catching that and flagging it rather than silently picking one is exactly the behaviour that makes this build auditable.)*

---

## 3 · HOLD — the first-time-user hero needs a decision first

**Do not change this yet.** The alignment brief asked for the retired line to be swapped for *"Not an assistant. An analyst."* — but that instruction does not survive contact with the actual markup.

`apps/web/src/pages/onboarding/FirstTimeUserPage.tsx:95–103` is **three stacked lines**, not one hero:

| Line | Current | Type |
|---|---|---|
| `h1` | *"You're in. Let's get to work."* | serif 26 / 42 |
| `p` | *"Analytical AI for business professionals — analysis, not conversation."* | sans 13 / 16, secondary |
| `p` | *"15 minutes.  100 pages.  Cited to source."* ← **the retired line** | serif 17 / 22 |

**The problem:** line 2 already carries the positioning — *"analysis, not conversation"* is the approved one-liner, and it says substantially what *"Not an assistant. An analyst."* says. Dropping the proposed swap into line 3 would leave two adjacent lines making the same point.

So this is a copy decision, not a find-and-replace. **Joy is choosing between:**

- **(a)** Replace line 3 with the **proof** — *"Every source, credible. Every claim, triangulated. Every report, defensible."*
- **(b)** Delete line 3 — line 2 already does the work
- **(c)** Replace line 3 with the identity and soften line 2 to avoid the echo

**Measured, so the space question is settled:** the hero is Instrument Serif 17/17 in a 358px column at 390 wide. *"Not an assistant. An analyst."* is **1 line**, same as today. The longer sub-line from the brief runs to **2 lines (34px)**. Option (a)'s proof line will also wrap — worth measuring once chosen.

**And it must land in Figma first.** The same string lives at `1171:4` (First-Time User — Desktop, 22px) and `1289:385` (mobile, 20px). We changed the build ahead of the file once already this week and it produced a bug report against work that was actually correct — so: **Figma first, then the build.**

---

## 4 · Verified clean — no action

Searched and confirmed **zero** instances in the build and Figma:

- *"Zero hallucinations"* — gone (the only two occurrences were rationale lines in the specs, now restated)
- *"LAM" / "Large Analysis Model"* — none
- *"SOC 2 certified"* — none
- **Citations framed as work for the user** — none. This was the item the alignment brief called *"the single most common error to look for"*, and the build does not commit it once. Every `verify` in the codebase is JWT, OTP or phone verification. The citation-adjacent copy already reads as readiness: *"cited, never leaked"*, *"boardroom-ready, cited to source"*.

---

## 5 · One thing the positioning work surfaced in your favour

`features/reader/AskCasprPane.tsx:102` already carries this:

> *"IMF's 2026 outlook puts the 2030 market at $390bn; BloombergNEF at $431bn. Caspr triangulates $412bn — a 21% CAGR — weighting BNEF's bottom-up fleet data against IMF's macro model."*

Two sources disagreeing, the derived figure, and why one was weighted over the other. That is the **"every claim, triangulated"** proof beat, working today. The alignment brief assumed nothing in the product expressed it and asked for a new feature; it does, so no feature is being built.

Keep that answer shape when the real Ask responses get wired — it is doing more positioning work than anything else in the app.

---

*Design session · 2026-08-20. Items 1 and 2 are safe to take now. Item 3 waits on Joy, and on Figma.*
