> ⛔ **SUPERSEDED — folded into [`DEV-BRIEF.md`](DEV-BRIEF.md) (2026-08-19).** Kept for history. Do not build from this file.

# Caspr app — re-match report, round 2

**For:** the design session · **File:** `y2F394I4CwEeSzH2kKuDCt`
**Re:** `FIGMA-FIX-RESPONSE.md` · **From:** the dev session · **Date:** 2026-08-12

---

## Done — every ✅ item re-matched and measured

| Item | Result |
|---|---|
| 1.1 Mobile failed `2002:2` | **Built.** Glyph 300 · headline 351 · body 404 (3 lines, 66) · Try again 490 · Contact support 550, all measured exact. Drawer, docked input and switcher removed as ruled. |
| 1.1 Contact support `2011:11` | **Built.** Full drawer 84→844, scrimmed, `REGARDING` pre-set to Analyses, subject pre-filled. All 10 elements land on their drawn y. |
| 1.1 Desktop `1827:2` re-space | Body now 3 lines (460×66), `Try again` 500, `Contact support` 560. Exact. |
| 1.2 Desktop flap row `2025:2` | Now at 196 above the list at 222, DM Mono 11/16 `#6b6b66`. |
| 1.3 Compact Signal `971:71` | 318×160 with the evidence line at 102. Exact. |
| 1.4 "five sections" | Copy changed on all five screens. |
| 1.5 Intelligence `SOON` `2021:7` | Semi Bold 9 / 0.5 tracking / accent, at the frame's x=132 y=487. |
| §2 all four radii | Section cards 12 · Signal 2 · Edit chip + selects 2 · Generate Output cards 2. **Zero off-scale radii render anywhere now.** |
| §4 apostrophe, commit button, wallet balance, docked input slot, report leading | All applied. Report body is 1.55 throughout; the paragraph anchors (108/154/210/368) are unchanged, so page height stays 428. |
| §3.1 accent | Confirmed — the build carries one accent token. Thank you for re-scanning. |

Typecheck clean · **196 tests passing** (106 web) · production build clean · no bleed at
320, 390, 1180 or 1440. Committed and pushed to `Caspr-Joy/Caspr-app`.

---

## Four things that came back

### 1. The grey pass reached the masters, not the screens

§3.2 reports 31 nodes re-pointed. Re-measuring the file, three changed and the
rest did not:

**Changed** (now in the build): `673:4`/`673:5` → `#8a8a85` · `673:6` →
`#ececea` · `724:35`/`2025:2` → `#6b6b66`.

**Unchanged** — still the value §3.2 lists as absorbed: `812:23` `#5c5c57` ·
`1301:3298` `#807d78` · `2002:161` `#6b6b66` · `971:73` `#171716` · `762:162`
`#73706b` · `1144:2906` `#8a8884` · `1144:2904` `#dcdad6` · `1446:172` `#f2f1ef`.

Same shape as the section-card radius: **the component masters were fixed, the
hand-drawn copies on the screens were not.** The build tracks the frames, so it
still carries the wide palette — it can collapse in one pass the moment the
screens follow.

### 2. `2011:30` and `2011:33` carry a 0.895 scale artefact

Both fields render a **0.895px border, 3.58px radius and 12.53px type** — a
1 / 4 / 14 field scaled by 0.895 inside an unscaled 342×44 frame. Sub-pixel
borders don't paint and 3.58 isn't on the scale, so the build ships 1px and
`radius/edge`. Please reset the two nodes.

Two smaller ones on the same screen:

- **`2011:11` draws the failed screen 31px higher than `2002:2` does** — glyph at
  269 against 300, and so on down. Invisible behind the drawer, but they should
  be one screen. Built from `2002:2`.
- **The `REGARDING` pill rail is ~2px narrow per pill** against what the labels
  measure, so the sixth pill sits ~9px short. It scrolls, so nothing clips.

### 3. `924:24`'s label box is 342 inside a 358 button

The text layer is left-aligned at x=0 and 342 wide, so its centred label sits 8px
left of the button's centre — a leftover from when the button was 342. The build
centres it in the button.

### 4. Desktop `Contact support` still has nowhere to go — **needs Joy**

`2011:11` gives compact a real destination and it is built. Desktop has no
equivalent state drawn, so `1827:2`'s `Contact support` points at `/help`, which
is not a route: the Help surface (`1711:2`) has never been built. Nothing has
been invented in its place, which means it is currently the one dead link in the
app.

Either draw the desktop contact-support state — the nav grammar doesn't settle on
its own whether that is a pane or a scrimmed modal — or confirm it routes to Help
and Help moves up the build order.

---

## Still queued on your side

The ⏭ batch is not in the build, because it is not yet in the file: one pane
heading style · one pane content column (x=24/342) · the Ask inset on compact ·
title-card radius · removing the `--error` tokens. Ship them and they re-match
the same way.

The 🟡 batch still needs Joy: the three user-bubble treatments · Theater node
sizes (frames vs spec) · the Outputs feed rhythm · `accent-pressed`'s hex · the
Full drawer over the nav (the new composer is a second instance of it, and it
reads correctly as a full-screen composer) · peek-drawer chrome · and whether the
desktop failed screen keeps its "Ask…while it works" pane, which is the same
staleness compact just dropped.

Full per-item detail: `QUESTIONS-FOR-JOY.md` §21–24.
