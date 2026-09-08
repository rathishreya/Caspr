> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — Figma fix, round 3: design-session response

**Re:** `FIGMA-FIX-ROUND-3.md` (2026-08-13) · **File:** `y2F394I4CwEeSzH2kKuDCt` · **Date:** 2026-08-13

All items applied and **re-verified in the file** node-by-node (not read off the previous report).

---

## Root cause of the "master fixed, screens not" pattern — found and fixed

It was not master-vs-instance. My colour sweeps used `page.findAll`, and under Figma's **dynamic page loading a non-active page returns incomplete results** — so the sweep only ever fully processed whichever page was active, silently skipping every node on the other pages. Direct `getNodeById` sets always worked, which is why the specific nodes I set by hand landed and the swept ones didn't.

**Fix:** the sweep now calls `setCurrentPageAsync(page)` before scanning each page. Re-run across the whole file it touched **4,244 nodes** (Report Creation 1733 · Profile & Wallet 1223 · Documents 1002 · Insights 109 · Components 89 · Onboarding 88) — i.e. every instance of every drift value on every screen, not just the ones you listed.

---

## §1 — Greys ✅

Every node in your table re-verified at its target:

`812:23`→#5c5b58 · `1301:3298`/`1301:3300`→#8a8a85 · `2002:161`→#5c5b58 · `1827:196`/`2044:63`→#5c5b58 · `762:162`→#5c5b58 · `1144:2906`+siblings→#8a8a85 · `971:73`→#1a1a17 · `926:2495` filenames→#1a1a17 · `1194:377`→#5c5b58 · `1144:2904`+siblings→#e0ded9 · `1446:172`→#ececea · `1099:15` dividers→#e0ded9 · `628:5` drawer edge→#e0ded9.

- **Flap rows** `724:35` / `2025:2` → **#5c5b58** (corrected from the wrong #6b6b66 they'd landed on).
- **MESSAGE SUPPORT headings** `2011:26` / `2044:68` → **#474642** (were #47463f).
- **§1b pill borders** `#e2e1df` → **#e2e1de** — swept file-wide (tol 0), both composers included.

**Ruling on the two off-map greys:**
- `1301:3316` / `1301:3317` (pending section title/index, **#b8b5b0**) — **KEPT, deliberate.** It's the "not yet drafted" state and reads intentionally lighter than tertiary. Documented as a `pending`/undrafted grey; not drift.
- (Note: `#6b6b66` report-grey-mid stays a token — it was NOT globally swept; only the specific generation-failed body nodes you named were moved to #5c5b58, so report content greys are untouched.)

---

## §2 — 0.895 scale artefact ✅

`2011:30`, `2011:33`, `2044:72`, `2044:75` reset to **border 1 · radius 2 · font 14 · inset 13**. The two subject fields also had their text box widened so the prefilled subject sits on one line (it was wrapping after the font went to 14).

`2011:11` failed content re-centred to match `2002:2` (glyph 300 / headline 351 / body 404 / Try again 490 / Contact 550).

---

## §3 — `1493:7/12/17` child reflow ✅

In each 342-wide card: price → right-edge inset **32** (`x=234`), `×` → right-edge inset **7** (`x=319`). The `×` is back inside the card on all three.

## §4 — `924:24` label box ✅

Commit text layer widened **342 → 358** at x=0 so its centred label sits on the button's centre. Button stays 80/358.

## §5 — Ask divider ✅

`944:1400`: label `1020:13` re-centred on **195** (x=124), right rule `1020:14` → **x=286 / w=88** (ends 374), equal rules. Swept the other compact Ask frame too — `810:2162` (`865:8` → x=286/w=88). Input `945:12` left untouched (correct 358-wide shared component).

---

## Nothing left open

Every round-3 item is applied. The only item deliberately kept is `#b8b5b0` (pending state), ruled above. The token file can now drop the wide grey palette — the screens carry the collapsed ramp everywhere.
