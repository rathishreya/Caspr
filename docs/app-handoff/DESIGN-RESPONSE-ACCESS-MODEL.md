# Design response — the access model

**To:** the dev session · **From:** the design session · **2026-08-27**
**File:** `y2F394I4CwEeSzH2kKuDCt` · **New page:** `🤝 Collaboration & Org` (`2601:2`) — **pull before you start.**

Answers [`DESIGN-PROMPT-ACCESS-MODEL.md`](DESIGN-PROMPT-ACCESS-MODEL.md). **App file only.** §3 (`/pricing` fold 5)
and the website plan cards are with the website design session, per Joy — nothing below touches them.

---

## 0 · Read this first — rule 1b landed mid-build and invalidated copy

The prompt gained **rule 1b** after I had already drafted from the earlier version, exactly as it warned. The
phrase **"only what you run is recharged"** is **false** — `R = F + top_up`, and the platform fee is charged
every month regardless of use.

**21 nodes carried the false claim. All 21 are fixed.** Seven were mine, written an hour earlier from the
superseded prompt; **fourteen were already in the file** and had never been caught, in three wordings:

| Was | Now |
|---|---|
| `Only what you run is recharged` | `Unused balance carries forward` |
| `Sep 1 · tops your budget back to $186 — you only pay for what you used` | `Sep 1 · restores what you consumed — unused balance carries forward` |
| `Sep 1 · tops back to $186 — pay for use` *(mobile)* | `Sep 1 · restores what you consumed` |

**One more, outside Figma and worth your attention:** [`docs/legal/refund-policy.md`](../legal/refund-policy.md)
§"How Caspr Billing Works" stated *"You only pay for what you use."* **In a legal document.** Corrected to
*"Each month restores only what you consumed in the previous cycle."* — **flagging rather than burying it,
because it is legal copy and Joy may want it reviewed.**

`CLAUDE.md` and `CONVENTIONS-CONFORMANCE-SPEC.md` were already corrected by another session; no action there.

---

## 1 · The rename — 161 edits, zero skipped

`Professional · Business · Enterprise` → **`Solo · Team · Org`**, across 22 frames.

| Surface | Change |
|---|---|
| Wallet plan list (8 frames, desktop + mobile) | mode names · budget lines · bullets · CTAs |
| Mobile wallet eyebrow | `WALLET · PROFESSIONAL` → `WALLET · SOLO` |
| Wallet status line | `On Professional` → `On Solo` |
| `Rail — v3 (slim)` component | plan chip → `Solo` |
| Data Room feature-locked (×2) | `BUSINESS` → `TEAM` · `Upgrade to Business` → `Upgrade to Team` · **frames renamed** |

**Team is marked recommended** — a styled range on the existing name node, `Team · Recommended`, Inter Medium
10.5 bound to the **`brand/accent-text`** variable. One node, not two elements. **Build it as a span**; two
elements is what produced the gap-and-drift defect on the auth switch line.

**Org buys differently, so it asks differently:** its CTA is now `Talk to us  ›`, not `Switch to this budget`.

### The budget lines are the substantive change, not the names

| Was | Now |
|---|---|
| `$200/mo budget` | `$200 a month of research` |
| `$600/mo budget` | `$600 a month of research` |
| `$1,800/mo budget` | `$1,800 a month, committed` |
| `$558 / mo analysis budget` · `$558 monthly analysis budget` | `$558 a month of research` · `$558 available for analyses` |

**These are longer strings and the boxes did not fit.** 41 nodes overflowed. The name/price row is now sized
per-row from the copy's own measured width, right-anchored at the card's 16px inset — **do not hard-code the
170px price box**; it cannot hold `$1,800 a month, committed` (195px).

### Copy that asserted a gate we removed

`More budget, more depth — Business unlocks upload, editing, Intelligence.` was wrong three ways: retired plan
name, a **bare depth name** (`COPY-07b`), and a **$300-depth plan gate that §5 removes**. Now
**`Team adds a Data Room and collaborators.`** The Team bullets changed with it — `Intelligence deep-dive
analyses · coming soon` is gone entirely.

---

## 2 · §5 removals

| | |
|---|---|
| **$399 à-la-carte** | **Zero occurrences** — never reached the app file |
| **$300-depth plan gate** | Removed from the Team bullets and the upsell nudge |
| **Caspr Signals** | One node — the Insights stat `Signals flagged` → **`Alerts flagged`**, matching the rail's existing `Alerts` destination |

---

## 3 · §4 — thirteen new frames on `🤝 Collaboration & Org`

Every one is **cloned from an existing screen and retexted**, per Joy's standing rule. Nothing was drawn from
scratch except two segmented controls and the withheld-source block.

| | Frame | Node | Cloned from |
|---|---|---|---|
| **4.1** | Share an analysis — Desktop · Mobile | `2601:3` · `2601:50` | reader + `Data room — delete file (confirm)` card · `Two-factor enable (drawer)` |
| **4.2** | File-share grant — Desktop · Mobile | `2601:80` · `2601:127` | same |
| **4.3** | Shared analysis · read-only — Desktop · Mobile | `2601:157` · `2601:204` | `Working · Ask Caspr` |
| **4.4** | Private-source claim — reference | `2612:1051` | the reader's own citation nodes |
| **4.5** | Invited user · first run — Desktop · Mobile | `2601:234` · `2601:284` | `First-Time User` |
| **4.6** | Data Room · file settings — Desktop · Mobile | `2601:325` · `2601:421` | `Data Room` + confirm card |
| **4.7** | Org Data Room — Desktop · Mobile | `2601:466` · `2621:3553` | `Data Room` + `Filter Pill v3` |
| **4.8** | Org seats — Desktop · Mobile | `2601:562` · `2621:6523` | `Account` details-card row grammar |

**4.7 mobile drops `Reset Data Room`.** A scoped view is not where you wipe an organisation's library — the
control is owner-only and does not belong on a `Own · Team · Org` filter. Owner is on the **meta line**, not
appended to the filename, so long names cannot wrap into it.

**4.2 defaults to NO, visibly.** Three unticked file rows, and the primary button reads **`Share without files`** —
the default action is stated on the button, so the safe path needs no decision. Helper: *"Nothing is shared
unless you tick it — this share only."* Gate-1 pattern: per act, never a standing permission.

**4.4 keeps the red citation dot on the withheld claim.** The claim *is* sourced; dropping the dot would read
as an uncited assertion, which is the one thing Caspr cannot afford. What changes is only what opens — the
reasoning, or the reason it is closed.

**4.5 puts the $100 inside the Auto Layout stack**, between the prompt and the threads, with the money phrase
in accent: *"**Your first $100 of research is yours alone.** Refining Priya's analysis draws on Priya's budget —
never on yours."*

**4.6 gives the two axes two controls that never touch** — `Confidential / Publishable` and
`Only me / Team / Org`, **both defaulting closed**, each with its own helper line.

---

## 4 · ⚠ A component changed — this one affects your build

**`Action Overlay v3` (`635:9`) now has two boolean component properties:**

| Property | Key | Default |
|---|---|---|
| `Show Edit` | `Show Edit#2611:0` | `true` |
| `Show Updates` | `Show Updates#2611:1` | `true` |

**And it is now Auto Layout** — `HORIZONTAL`, `SPACE_BETWEEN`, padding 24/24. **Measured drift across all
41 instances: 0px.** The existing hand-placed columns already sat exactly where space-between puts them, so
nothing moved; the conversion only makes hidden tabs *collapse* instead of leaving a hole.

**Why it was needed:** a read-only viewer must not see `Edit` or `Updates`, and instance children cannot be
hidden or repositioned without this. The read-only bar reads **`Contents · Ask Caspr · Outputs`**.

**For you:** render the tab set from a permission prop, not a fixed array of five.

---

## 4a · Try is a real mode, and the app now carries it

**Every plan list is four rows.** `Try · Solo · Team · Org`, ascending commitment, in all **8** lists
(7 desktop + the mobile plans drawer).

| | |
|---|---|
| Name | `Try` |
| Budget line | `No monthly budget` |
| Sub | `Top up as you go — nothing recurring` |
| Action | `Switch to Try  ›` — and `✓  Current` when it is |

**The Try row deliberately does not promise $100.** The gift is a first-run event, not a property of the mode;
promising it to an existing Solo user looking at a switch list would be false. **The $100 appears in the
Try user's own wallet**, where it is true.

**Two new frames — `Wallet — Desktop · Try` and `Wallet — Mobile · Try`.** A Try wallet is not a Solo wallet
with a smaller number; **the whole billing spine is different**, so the ledger changes shape:

| Solo | Try |
|---|---|
| `BUDGET PACE · DAILY BALANCE` · `BUDGET $186` | `SPEND · DAILY BALANCE` · `GIFTED $100` |
| `UPCOMING` · `Next recharge` · `Sep 1 · restores what you consumed` | `EXPIRING` · `Credit expires` · `25 Nov 2026 · 90 days from signup` |
| `Monthly recharge` · `$200 charged, adjusted` · `Download invoice` | `Welcome credit` · `$100, no card required` · **no invoice** |
| `Team adds a Data Room and editors` | `Set a budget to unlock editing and Updates` |

**The upsell target changes with the mode** — from Try the next rung is **Solo** (editing, Updates), not Team.

**The mobile plans drawer moved to the Full detent** (`390 × 760`, top at y=84). Four modes with descriptions
do not fit a half sheet; the Ask input now sits below the list instead of colliding with it. **This is a
locked detent, not a new height.**

### Two more copy defects found on the way

- **7 nodes still asserted the removed $300-depth gate** — `Unlock Intelligence, upload & editing` on six
  mobile wallets, and `Adds Intelligence (coming soon), upload, editing` in the plans drawer. My first audit
  missed them because its regex only looked for the full `Brief · Study · Intelligence` ladder, not a bare
  `Intelligence`. Now `Team adds a Data Room and editors` / `Your own data, and people to work with`.
- **`$1,800/mth, committed`** slipped past `COPY-11a` because the pattern matched `/mo`, not `/mth`. **Same
  offence, different abbreviation.** Now `$1,800 a month, committed`. **Worth widening the lint** — the rule
  should catch `/mo`, `/mth`, `/month`, `pm` and `p.m.`

---

## 5 · Conformance — full-file audit, all clear

Run across every page except Archive and Deprecated:

| Check | Hits |
|---|---|
| `COPY-11a` · subscription framing (`from $200/mo`, `/mth`, `$200 per month`, `the $200 plan`) | **0** |
| `COPY-11b` · false recharge claim | **0** |
| Rule 3 · page count | **0** |
| Retired plan names | **0** |
| `$300`-depth gate asserted | **0** |
| `$399` | **0** |
| `Caspr Signals` | **0** |
| **Right-aligned text overflowing its parent** | **0** |

**Rule 3 was not clean before this pass.** 23 nodes stated a page count, in four wordings — including
`57 PAGES · VER 1 · JUL 13, 2026` on **17 reader frames**. Now `VER 1 · JUL 13, 2026`. Also fixed:
`CASPR · 48 PAGES · MAY 2026` → `CASPR · MAY 2026`, `57 pages · 7 sections` → `7 sections`,
`57 pages · Generated Jul 13, 2026` → `Generated Jul 13, 2026`.

---

## 6 · Open — four decisions, and I have not guessed at them

| | | Owner |
|---|---|---|
| **1** | **Can a viewer buy outputs?** §4.3 guarantees Ask Caspr and citations, unmetered. It is silent on outputs. I kept `Outputs` in the read-only tab bar as the least-surprising reading — **stated as an assumption, not a decision** | Joy |
| **2** | **The Data Room row badges still read `PRIVATE` / `PUBLIC`** — one axis, where 4.6 now has two. Redesigning them implies the `public` field rename, which **§6.3 blocks**. Left untouched deliberately | blocked |
| **3** | **Does `Switch to Try` exist as a real action?** The row offers it, and the arithmetic supports it — cancel the budget, keep topping up. But **nobody has confirmed a budget-holder may drop to PAYG**, and if they cannot, the Try row should be display-only on a paid wallet | Joy |
| **4** | **The 90-day expiry is drawn as `25 Nov 2026`** — 90 days from an assumed 27 Aug signup. **Whether unused gifted credit truly expires, or just goes dormant, is not in the spec** | Joy |

**Closed since the last version:** the Try row and Try wallet state (§4a), and the missing 4.7 / 4.8 mobile frames.

**Not designed around, per §6:** seats 4+ pricing (the `Add a seat →` control exists and carries **no price**),
and whether Insights gates.

**One inconsistency I did not sweep:** the legacy Data Room dialogs use **radius 4**, where `design-guidelines.md`
§2 locks functional chrome at **2**. Everything I built uses 2. The legacy 4s are a separate sweep — flagging
rather than folding it silently into this change.

---

*Design session · 2026-08-27. Read with `access-model.md`, `design-guidelines.md` §1 · §2 · §9 · §10a · §10b,
and `CONVENTIONS-CONFORMANCE-SPEC.md` §3.12.*
