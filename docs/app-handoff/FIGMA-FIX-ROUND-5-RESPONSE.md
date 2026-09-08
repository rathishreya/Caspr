> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma fix, round 5: design-session response

**Re:** `FIGMA-FIX-ROUND-5-PROMPT.md` · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Date:** 2026-08-14

Every edit was **re-read in the file after the set**, and the two most layout-sensitive (search-results card, the six-memory list) were screenshot-verified. `setCurrentPageAsync` ran before every sweep.

One mechanical lesson worth logging: **a `use_figma` call that throws rolls back every edit in that call.** A radius batch hit a TEXT node with no `cornerRadius`, threw, and silently reverted the colour + radius-12 work that preceded it in the same call. Caught it on read-back (values were unchanged), split the batch, and re-applied. Read-back is what surfaced it.

---

## Part A — twelve fixes

| # | Item | Result |
|---|---|---|
| **A1** | Mobile toast radii `1928:142` / `1928:139` | → **2** ✅ |
| **A2** | `#e5e5e3` fill variable | Already `fill/skeleton` (round 4); set its code syntax to **`--color-fill-track`** to match the build. All listed nodes (`1832:94–97`, `2072:2385–87`, `1791:101`) confirmed **bound** ✅ |
| **A3** | `2071:2231` phantom filename | → **`market_data_2026.csv`** · meta `640 KB · Jul 8, 2026` · tag **PUBLIC** (matched the real PUBLIC style: `#ededeb` pill, `#8a8a85` text, 50 wide, right edge 318). Screenshot-verified ✅ |
| **A4** | `1808:121` fixed-height body | → **HEIGHT (h42)**. Swept `184:4` + `184:5` for body copy (Inter 13.5–16, ≥300 wide, >45 chars, `NONE`) → **21 more boxes** set to auto-height ✅ |
| **A5** | Four confirmation scrims at h792 | `1658:117` / `1662:21` / `1662:73` / `1658:172` → **y52 h736**, 42% black ✅ |
| **A6** | Stale `Context questions` pane row | Removed from `1646:2/54/106/158` **and** `2081:2853`; Security block shifted **up 28** → Security now at **y278**, matching `1596:2` ✅ |
| **A7** | Three stray `Danger card` copies | `1698:64` / `1700:29` / `1864:60` deleted (the real card `1691:2` on `1686:2` untouched) ✅ |
| **A8** | Nine 0.895-scaled fields | `1698:32`, `1700:42/45/48`, `1884:134/138`, `1667:165`, `1672:219`, `1711:161` → **h44 · r2 · 1px · 14pt · inset 14** ✅ |
| **A9** | Two off-centre glyphs | `1834:99` → x382 (centre 400) · `1811:103` → x177 (centre 195) ✅ |
| **A10** | Three greys | `#ecebea` → `#ececea` (see note) · `#47463f` and `#ededeb` tokenised (see note) ✅ |
| **A11** | Peek-drawer reconcile | **31 peek handles** → master `628:3` values: `#c7c4bf`, r2.5, **y12** (see decision) ✅ |
| **A12** | 15/22 vs 14/21 note | Acknowledged — the frame `2073:2351` is correctly **14/21**; only the round-4 prose slipped. No change. |

**A10 notes (some calls I made):**
- **`#ecebea` → `#ececea`:** the two values differ by 1/255, so the merge pass also harmlessly re-set existing `#ececea` fills (bound tokens skipped). The value is now unified; the count looks large but most were no-op re-sets.
- **`#47463f` eyebrows:** rather than a standalone token, I merged it into **`#474642`** — the canonical eyebrow/heading warm-grey established in rounds 2–3 (`#47463f` was already treated as drift toward it then). Created a token for the role — **`text/label` = `#474642`** (`--color-text-label`) — and bound the whole eyebrow/overline/section-heading family to it (77 nodes). One token for one role, drift absorbed. (Joy confirmed the merge and the `text/label` name, 2026-08-14.)
- **`#ededeb` chip:** created **`fill/chip` = `#ededeb`** and bound it (49 nodes). This value is shared by the DEFAULT chip *and* the PUBLIC tags (found while doing A3), so it's a genuine shared chip surface, not a one-off.

**A11 border — reversed to top-edge-only (Joy, 2026-08-14).** I first kept the peek's full hairline; Joy's swipe-continuity argument corrected it: the three detents are one surface at three heights, and a border that appears/disappears mid-drag reads as a disruption. Geometrically only top-edge-only can be shared (half/full run their bottom off-canvas, sides sit at the screen edges), so **all 31 peek frames were unified to the master's top-edge-only border** — `#e0ded9`, `strokeTopWeight 1`, other sides `0`. The peek still reads as lifted from its rounded top + shadow + top hairline (screenshot-verified). Peek / half / full now carry one identical border.

---

## Part D — the five rulings, applied to the file

| Ruling | Node edits | Result |
|---|---|---|
| **B1** green→accent ticks | `1553:15/21/23/25/27/29`, `1581:161` → **`#e8453c`** | ✅ green survives only on `+$186` (`1623:61`, `1636:93`) |
| **B2** radius 12/2 | →12: `1648:2/35/67/99`, `2081:2905`, `1854:124`, `1887:124`, `1855:212`, `1855:440`, `1878:124`, `1885:93`, `1775:94`, `1778:172`. →2: the confirmation commits, `2081:2908`, top-up chips `1854:127–133` + `1887:127–133` (frames), `1887:205`, `1878:126`, `1271:198`, `1271:206`, `1760:73`, `1760:70`, `1885:94`, delete-file commit `1775:55` | ✅ `design-guidelines.md §2` rewritten: **12 = overlay surfaces only; content/layout cards now 2** |
| **B3** copy | `1811:7` → `NO MEMORIES YET` · `1680:7` / `1736:8` → `6 MEMORIES` (`MAR` kept on `1669:7`) | ✅ |
| **B4** show all | — (covered by D4) | ✅ |
| **B5** drawer detents | `1581:154` → **408** (Half; rows kept top, +40 below composer) | ✅ |

**D4 — six memories.** Added the missing sixth row to `1680:26` (**"Prefers Study-depth analyses"**, sourced from desktop `1736:135` for parity); card grew 304 → **344**, entry row moved to y304, header now reads **6 MEMORIES**. Screenshot-verified — all six render, count matches.

---

## Part C — Insights (`184:6`) pre-flight

Ran the seven checks. `184:6` currently holds only two frames — **Insights Desktop `1231:2860` + Mobile `1277:196`** — so this is a scan of the coming-soon placeholders, for your build to work against.

| Check | Finding |
|---|---|
| 1. Desktop states have 390 siblings | Only the **base** state exists at both widths. **No empty / loading / error / no-results states drawn** — these are the ones round 4 caught missing on the Data Room. Draw them when Insights is built. |
| 2. Body auto-height | One box (`1250:105`) was fixed — **fixed it now** (→ HEIGHT). |
| 3. Radius per B2 | Off-scale radii on placeholders: `1246:124–129` (r1), `1253:121–139` (r3), plus icon-internal r2.5/r0.8 (ignore). Sweep to 0/2/12/20 when building. |
| 4. Greys off-ramp | `#0f0e0d`, `#deddda`, `#e9e8e6`, `#e6e5e2` (×16), `#0a0605` (old warm scrim) — all drift; **`#2e7d33` is a stray green** (×3) that B1 would send to accent. |
| 5. Scrims | `1277:221` was `Scrim` y52 **h740** — **fixed to h736**. |
| 6. Figures DM Mono | Clean — no stray Inter on a number. |
| 7. Drawer detents | No off-detent drawers found. |

I fixed the two universal-rule items now (scrim extent, the one body box). The rest are drift on placeholder frames that you'll redraw when Insights is built — flagged rather than patched, since mass-fixing internals you're about to replace is wasted motion.

---

*Response by design session · 2026-08-14. Pages `184:4` and `184:5` are converged; `184:6` is pre-flighted with its gaps listed. Peek/half/full drawers now share one top-edge-only border (Joy's swipe-continuity call). One remaining judgment call marked above: eyebrow → `#474642` canonical — reverse on a word.*
