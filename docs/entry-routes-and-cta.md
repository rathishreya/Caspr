# Entry routes and the primary CTA

**Locked 2026-08-25 (Joy).** Closes the open item at
[`product/showcase-and-auth-spec.md`](product/showcase-and-auth-spec.md) §11 — *"the header signup wording"* —
and [`site-truth.md`](site-truth.md) §45 — *"states the offer three ways, close to one."*

**Read by:** the website session, the app session, and the GTM engine. **This file is the source.**

---

## 1 · ⛔ It is not a demo. The word is retired everywhere

**The app and dev sessions named three routes as *login, signup, demo*. The third one is misnamed, and the
spec that describes it says why.**

`showcase-and-auth-spec.md` §4a is explicit: **"Nothing on screen may be representative rather than real."**
It runs the real Caspr APIs, on the user's own prompt, producing their own layout. The only difference from a
signed-in run is what does not execute until signup.

> **The rename is a guardrail, not cosmetics. A team that calls it "the demo" will eventually fake something
> in it** — and faking is precisely what §4a forbids. The word licenses the failure.

**Also retired:** *preview* and *trial* (collides with the actual free trial — $100, 90 days), *playground*
and *sandbox* (both announce that it is not real).

---

## 2 · The three routes

| Route | Internal name | Code | What the user sees |
|---|---|---|---|
| **The product, unauthenticated** | **the open run** | `enterOpenRun()` | **No label at all** |
| Signup overlay | signup | `openSignup()` | *Start free — first $100 on Caspr* (at the gate) |
| Login overlay | login | `openLogin()` | *Log in* |

**⚠ The open run has no user-facing name, deliberately.** Users click a button and they are working. **The
moment it is given a name, they have been told it is not the real thing.**

**That is about the *route*, not the chrome. Inside the open run the header button reads `Sign up`** — §3.
*Run the analysis* is incoherent once the user is running one, so the button switches to the door still worth
offering. **The run itself is still never named.**

*(This renames `enterDemo()` in `showcase-and-auth-spec.md` §11. The mechanism is unchanged — GTM decides
which CTA does which, with no engineering change required to rearrange them.)*

---

## 3 · The CTA — one phrase, every surface

| Surface | | Action |
|---|---|---|
| **Header button — desktop** | **Run the analysis** | `enterOpenRun()` |
| **Header button — mobile** | **Run analysis** — §3.1 | `enterOpenRun()` |
| **Header text — every website page** | **Log in** | `openLogin()` |
| Mobile | Button visible · **Log in** inside the hamburger | |
| **Every body CTA, all viewports** — homepage · ICP pages · `/pricing` · `/samples` · blog · search answers | **Run the analysis** | `enterOpenRun()` |
| **The open run** *(D0 · D1 · D2 and every overlay)* | Button becomes **Sign up** · **Log in** stays text | `openSignup()` · `openLogin()` |
| **The gate** *(in-product, locked, unchanged)* | Start free — first $100 on Caspr | |

### The open run swaps the button's label, nothing else (Joy, 2026-08-26)

**The header pattern is identical everywhere — a filled accent button plus `Log in` as text. Only the button's label changes with context.**

| | Button | Text |
|---|---|---|
| Website pages | **Run the analysis** | Log in |
| **Open run** | **Sign up** | Log in |

**Why the label has to change:** *Run the analysis* is incoherent once the user is running one. Inside the run the door that is still worth offering is the account.

**Why it must stay a filled button:** `showcase-and-auth-spec.md` rule 2 makes the header the escape from an imposed signup card — no close button, the way out is the control that was always there. The design answer to *"how does a user know the header is still theirs?"* is that **a 42% scrim desaturates everything beneath it, so the one element that keeps its colour reads as live without instruction.** A header of grey text above a dimmed field loses that. **The saturation is the affordance**, and it is why the button survives even though the overlay in front of it is also signup.

**`Sign up` and `Log in` are a matched pair**, which is why §5's *"a bare verb reads as an instruction to the reader"* rule does not bite here. That rule governs the **marketing CTA**, whose job is to name Caspr's output. These are auth controls, and `Log in` is already locked as a bare verb.

**Sentence case, not title case** — *Sign up*, never *Sign Up*. Title case is software register; sentence case
is editorial, which is where the brand sits.

### `Log in` is text unless a hamburger exists to hold it (clarified 2026-08-26)

The row above says *"Mobile · Log in inside the hamburger"*. **That presupposes a hamburger, and only website
pages have one** — the open run carries no nav links, so there is nothing for `Log in` to hide inside.

| | Hamburger? | `Log in` |
|---|---|---|
| Website — desktop | no | **visible text**, left of the button |
| Website — mobile | **yes** | inside it |
| Open run — desktop | no | **visible text** |
| Open run — mobile | **no** | **visible text** |

**The rule underneath: `Log in` is always reachable in one tap.** The hamburger is a place to put it, not a
reason to hide it — so where there is no hamburger it stays on the bar.

### 3.2 The canonical header — every value, so this is never re-derived

Applied across all 30 onboarding screens 2026-08-26 and verified: **one variant per property, zero exceptions.**

| | Desktop — 72 band | Mobile — 52 band |
|---|---|---|
| Wordmark | Instrument Serif **26** · `brand/black` | Instrument Serif **24** · `brand/black` |
| The dot | 26 · `brand/accent-text` `#be3530` | 24 · `brand/accent-text` |
| Nav links | Inter Medium **14** · `brand/black` | *(in the hamburger)* |
| `Log in` | Inter Medium **14** · `brand/black` | Inter Medium **13** · `brand/black` |
| Button fill | `brand/accent` `#e8453c` · **radius 2** | same · **radius 2** |
| Button label | Inter Medium **14** · white | Inter Medium **13** · white |
| Button padding | 20 / 11 → **h39** | 14 / 9 → **h34** |
| Button anchor | right edge **1320** | 16px clear of the hamburger, else **374** |
| Gap, `Log in` → button | **24** | **24** |

**Everything is centred on the band's midline** — 36 desktop, 26 mobile — by box centre, not by eye.

**Three things this pass corrected that were invisible in a screenshot:**

- **`Log in` existed in three colours** — `#1a1a17`, `#be3530` and white — across 25 frames. It is now `brand/black`, matching the nav links, because the accent belongs to the button and two red elements in one bar compete.
- **Seven button variants** — Semi Bold vs Medium, four heights, and **radius 4 in ten frames**, which breaks the radius scale in §2 of `design-guidelines.md`.
- **The mobile wordmark sat 3–5.5px below centre** in twelve frames, which is what made the button look high. The button was correct; the wordmark was not.

**And five frames carried an orphaned button**: a 90px accent rectangle with its white label floating beside it as a loose sibling rather than a child. Invisible once a new button was placed on top. Both removed.

### 3.3 The canonical footer

Swept the same way, 2026-08-26. **28 screens, one variant per property.**

| | Desktop | Mobile |
|---|---|---|
| String | `Security · Privacy · Terms · AI disclosure · © 2026 Caspr` | same |
| Type | Inter **Regular 12** | Inter **Regular 11** |
| Colour | `text/label` `#474642`, **bound** | same |
| Box | x720 · w600 · **right-aligned** | x20 · w350 · **centred** |
| Baseline | **19px from the frame bottom** | same |
| Z-order | **below the scrim** — it dims with the field | same |

**Four defects it found:**

- **Five desktop frames had no footer at all** — the D1 conversation screen and its four clones.
- **Mobile was Inter Medium, desktop Inter Regular.** A disclosure line is fine print; Regular is the correct register, and Medium was doing nothing except making one breakpoint heavier than the other.
- **Two baselines** — 19px from the bottom on 820-tall frames, 17px on 972-tall ones. Now 19 everywhere, measured from the frame bottom rather than set as an absolute y.
- **The four footers I had just added sat *above* the scrim**, because appending a child puts it on top. That contradicts §2.1, which settled that the footer dims with the field — `#474642` survives the 42% scrim at ≈4.80:1 precisely so it can. All 12 scrimmed frames now paint the footer below the scrim.

**The last one is the general lesson: adding an element to a frame with a scrim puts it in front of the scrim by default.** Anything added after a scrim exists needs its z-order set deliberately, or it silently becomes the one thing that does not dim.

**No per-page and no per-ICP variants.** §5 is why.

### 3.1 The mobile header drops the article — and that is not a variant

**Set 2026-08-25 (Joy).** The **mobile header** shows **Run analysis**. Everywhere else — including every body
CTA on a phone — keeps **Run the analysis**.

**Why this does not breach the one-phrase rule.** That rule forbids **varying the message by page or
audience** — a button reading *diligence read* to an investor and *industry primer* to a consultant.
**Truncating for viewport is a layout adaptation, not a positioning choice.** Same promise, fewer words,
because there is less room — the console's rail collapsing to icons. **The thing does not change; its
expression compacts.**

**Why the header and not the body.** A CTA at the foot of an article is full-width even on a phone, so it has
all the room it needs — and that is the position where the article does the most work, picking up the
question the reader has just finished. **Chrome compresses; content does not.**

**The trigger is the existing mobile header breakpoint** — wherever the hamburger appears. **One breakpoint,
not two.**

**Nothing changes for the open run**, whose mobile button already reads **Sign up**.

*(The arithmetic, as context rather than as the rule: at 375px the header leaves roughly 193px for the button
and the full phrase needs about 144px, so it fits; at 320px it does not. The short form removes the question.)*

> **The header and the gate use different verbs on purpose.** The header opens the door to *the work*; the
> gate starts *the account and the budget*. Different moments, different jobs.

---

## 4 · Why "Run the analysis"

| | |
|---|---|
| **1** | **"Run" is the ICP's own verb.** Investors and consultants say *run the numbers*, *run a screen*, *run a model*. Working language, not marketing language |
| **2** | **Decisive where "start" is tentative.** *Start* is about beginning; *run* is about executing. Same length, opposite posture — and posture is the difference between an assistant and an analyst |
| **3** | **The article is what makes it language rather than a menu label.** *Run Query · Run Report · Run Analysis* is toolbar register. Four characters of article turns a software control back into a sentence |
| **4** | **No idiom risk.** It carries no meaning that misfires outside English-speaking markets |
| **5** | **The definite article picks up the question the reader just read** — strongest at the foot of a search answer or an ICP page, which is most surfaces |

---

## 5 · ⚠ The rule that killed the alternatives — reusable, so keep it

> **A bare verb the reader could perform reads as an instruction to them. A verb plus the deliverable reads as
> something Caspr does.**

| ⛔ Fails — reader labour | ✅ Works — Caspr's output |
|---|---|
| Get the read · Analyse · Research · Verify | **Run the analysis** · Start an analysis · Get the answer |

**This predicts the next candidate before it is tested**, which is worth more than the list below.

### What was rejected, and why

| Candidate | Why not |
|---|---|
| **Get the read** | Outside English-speaking markets it misreads as *go read something* — **an instruction to the reader**, which is the failure mode in the row above |
| **Verify** | **Named in the positioning rules.** CLAUDE.md rule 2: *"'Verify', 'check the working', 'traceable', 'audit it yourself' all sell the reader more labour"* |
| **Research** | **The retired category** — *"AI for Market Research"* — and the buyer's pain, not the product. Research is the input; analysis is what Caspr adds |
| **Analyse** | Right word, wrong grammar. Bare, it commands the reader. Also a US/UK spelling tax on every surface |
| **Ask Caspr** | **The generative-AI idiom** — *Ask ChatGPT*, *Ask Gemini*. Borrows the category we decline to be in, and collides with the in-product **Ask** surface |
| **Arrive certain** | The best line the brand owns, and that is why it stays in the hero. **Repeated in chrome on every page it becomes wallpaper inside a week** |
| **Launch** | Translates cleanly, but it is the most overused verb in SaaS CTAs and carries the wrong metaphor — you launch things you *built*, over time |
| **Start** *(alone)* | Clean in the header, **limp at the foot of a 1,200-word answer.** One phrase means the weakest position decides |
| **Run Analysis · Start Analysis** | Article-less title case is toolbar register. *Start Analysis* pays both costs — software register **and** the generic verb |
| **Commission an analysis** | Genuinely tempting — **it is the verb you use for the thing Caspr replaces**, so it does the cost comparison silently. Rejected for hinting at cost at the top of funnel, where cost does not belong |

---

## 6 · Why there are no per-ICP variants

**Each ICP has eight prompts in the locked library** ([`product/onboarding-placeholder-prompts.md`](product/onboarding-placeholder-prompts.md)).
An investor does diligence **and** deal sourcing **and** market sizing **and** comparables.

**A button saying *"Start a diligence read"* tells the other seven they are in the wrong place** — and the
mismatch runs the wrong way: the button narrows, then the landing screen immediately widens to a bar cycling
eight prompts.

**The variety already has a home one layer down.** The rule is already recorded (Joy, 2026-08-20):
**"don't change any text above the prompt bar."** Nothing above the bar varies; the flipping placeholder
carries the personalisation. **The CTA is the door, and the door does not vary either.**

> **And the reasoning for the placeholder applies exactly:** *"Personalisation lands as recognition — 'that is
> my question' — rather than as the page announcing that it knows who you are."* **A per-ICP button is the page
> announcing. The placeholder is recognition.**

**The specificity an investor needs arrives about a second after the click, in their own words.** That is soon
enough, and it lands better.

---

## 7 · What this changes

| | |
|---|---|
| **1** | **Every CTA on the website.** No special sequencing needed — **the site is being revised anyway**, so this lands with the rest of the copy rather than as a separate dev round |
| **2** | **`website-copy-deck.md` CTA lines** — updated 2026-08-25, including the ICP-specific *"Run your first consulting analysis free"*, which §6 rules out |
| **3** | **`site-truth.md` §45 closes.** The website now states one thing; the offer is stated once, in-product, at the gate |
| **4** | **`enterDemo()` becomes `enterOpenRun()`** in the app codebase, and "demo" leaves the specs |

### ✅ And the last second statement of the offer is gone

**The homepage's final section carried the eyebrow `START FOR FREE`. Dropped 2026-08-25 (Joy).**

It restated — worse — the offer its own headline already makes: **"Your first $100. On us."** One says it in
the brand's voice; the other said it in anyone's.

> **So the offer is now stated exactly once on the website, in that headline, and once in-product at the
> gate.** Nowhere else. That is what §45 asked for.

---

## 8 · Not changed

**The gate button stays `Start free — first $100 on Caspr`** — locked at
[`product/onboarding-understanding.md`](product/onboarding-understanding.md) and `showcase-and-auth-spec.md`
§4a, **including that the cost is shown**, because the charging model depends on the user having agreed to a
figure.
