# Caspr product app — build status & resume guide

**Read this first if you are picking up the build.** It says what exists, what to
build next, how to build it, and the mistakes that have already been made once so
you don't repeat them.

Last updated: 2026-08-12.

---

## 1. Orientation — read in this order

1. **`../caspr-claude-core/docs/product/DEV-HANDOVER.md`** — the seven non-negotiables. Non-optional.
2. **`../caspr-claude-core/docs/product/design-guidelines.md`** — colour, radius, type, shell geometry.
3. **`../caspr-claude-core/docs/product/navigation-flow-map.md`** — element → destination wiring (Figma has zero prototype reactions).
4. **`../caspr-claude-core/docs/product/motion-and-interaction-states.md`** — motion tokens + hover/focus/pressed/disabled.
5. **`../caspr-claude-core/docs/app-handoff/QUESTIONS-FOR-JOY.md`** — open questions and rulings already made.
6. **`../caspr-claude-core/docs/product/api-spec-v1.md`** — the contract sent to Jayant.

> **Doc move (2026-08-17):** the design→dev handoff docs — `DEV-HANDOFF-2026-08-17.md`, `FIGMA-*.md`, `QUESTIONS-FOR-JOY.md`, `WORKFLOW-REVIEW-PLAN.md`, `EDIT-ECONOMICS.md`, `SAMPLE-REPORTS.md`, `THEATER-SOURCE-DECODE-MOTION.md` — now live in **`../caspr-claude-core/docs/app-handoff/`**. Any bare `*.md` filename cited below refers to that folder. Only code + `README.md` / `README-DEV.md` / this file remain in `caspr-app`.

**Figma:** file `y2F394I4CwEeSzH2kKuDCt`. Screens live on pages `184:2` (Report
Creation) · `184:3` (Onboarding) · `184:4` (Documents) · `184:5` (Profile &
Wallet) · `184:6` (Insights). Components on `1:3`.

---

## 2. Method — how every screen gets built

Per `DEV-HANDOVER.md` §2, and it works. Don't shortcut it.

1. `get_design_context` on the frame (load the `figma-design-to-code` skill first).
2. Build, reusing existing tokens/components.
3. **Measure in the browser against the frame's numbers** — `getBoundingClientRect`, computed styles. Do not eyeball.
4. Fix deltas until they are zero.

**Measuring has caught a real error on nearly every screen.** It is the single
highest-value habit in this build.

Every component carries `data-figma-node="…"` so a rendered element can be traced
back to its frame.

---

## 3. What exists

### Foundation
- **Monorepo:** `packages/contract` (shared types — also the source of the API spec), `packages/util`, `apps/web`, `services/mocks`, `services/backend`.
- **Tokens:** `apps/web/src/index.css`, `@theme static`, every value traced to a spec or frame.
- **Motion:** full token set; global `:focus-visible` = 2px accent ring @2px offset.
- **Backend:** RS256 IdP + JWKS, wallet ledger (verified against `pricing-model.md` worked examples), reservation, Stripe webhook mapping, Hono app, RDS schema + RLS. Runs on `:8787`.
- **Mock layer:** deterministic source-stream simulator, scheduler, player, MCP generators, mock auth.
- **Live integration proven:** auth + wallet run against the real backend; analysis stays on mocks (`VITE_USE_MOCKS=false`).

### Shell — all built and measured
Rail (`626:76`) · Mobile header (`628:25`) · Bottom nav (`625:2`) · Drawer with
**peek 94 / half 408 / full 760** detents · `PlansAskPeek` (`1579:2`) ·
shell-header wordmark + `NewButton` (`1025:2`).

The rail's wordmark and the `+ New` button are **route-declared**, not
path-sniffed: a screen says what chrome it needs via its route `handle`
(`ShellHandle` in `AppShell`), so the shell reads the screen map instead of
duplicating it. Paned screens carry `brand: 'wordmark'`; pane-less Welcome
carries `brand: 'mark'`, the "C." collapse (`667:61`).

### Primitives
`Button` · `TextButton` · `DockedInputBar` (`217:339`, width-flexible) ·
`ScreenTitle` (`659:2`) · `AnalysisListRow` (`673:2`) · `SuggestionItem`
(`634:16`) · `LayoutSectionCard` (`1301:3294`) · `GateBlock` (`708:63`) ·
conversation primitives · icon set · `Wordmark` (generated from the real SVG) ·
`NewButton` (`1025:2`, desktop — deliberately not the mobile header's 73×30
`1929:17`).

### Screens
- **Onboarding — complete**, both breakpoints: Login · First-Time User ·
  Gate + Theater · Conversation + Layout · Signup (+ Terms legal sheet) ·
  Email Sent · Forgot password · Reset link sent · Set new password.
- **Report Creation — in progress:** Welcome (`638:2`) · **Conversation
  (`640:2`) ✓ measured** · **Gate (`708:2`) ✓ measured** · **Layout Canvas
  (`692:2` / `694:2`) ✓ measured**.
  *Desktop only for Conversation and Gate — their mobile frames (`639:2` /
  `722:2`) are still unbuilt; each route renders a plainly-marked
  (`data-unbuilt-frame`) readable stack below the shell breakpoint so nothing
  is a dead end.*

**Layout Canvas — every measurement against the frame:** rail 0/0/64 · wordmark
17.38/19.28/51.19×23.44 · `+ New` 372/18/66×28 · pane 64/0/390 · title card
547/10/800×58 · cards 587 at y 104/232/360/488/592 (116·116·116·92·92) · docked
input 76/832/332×36 · conversation x=84 w=300, bubbles right-aligned to 404,
question numbers 84→104. Mobile: title 0/52/390×58 · cards x=16 at
126/254/382/510/614 · drawer 0/380/390×408 · handle 391 · eyebrow 20/414 ·
questions 20→42, text 300 · input 16/744/358×36 · nav 788. Card internals
(index 16/21·17, title 40/20·18, dots 42/57 + 42/83, bullets 58/50 + 58/76·16,
skeletons 520/380 desktop · 260/190 mobile) all exact.
**Only vertical conversation spacing differs** — §11 rhythm rather than the
frames' hand-placed positions. Deltas listed in `QUESTIONS-FOR-JOY.md` §12.

**Conversation — every measurement against `640:2`:** wordmark 17.38/19.28 ·
`+ New` 372/18/66×28 · `ANALYSES` 84/68 h17 · list rows 340×52 at x=88, y
112/170/228/286 (row internals: title 2/16 w208 h20 · status right-34 w96 h16 ·
chevron right-2 w10 · rule on the floor) · title card 547/10/800×58 · user block
1007/98/340×40 · reply 547/162/800×20 · suggestions 547 at 200/234/268/302,
360×28 · docked input 547/830/800×36. Type exact too: reply Inter 14/20
`#5c5b58`; user block Inter 14/18 `#0a0a0a` on a 1px `#e0ded9` r2 card at 10/13;
status `#9c9b98`, Current `#e8453c`, chevron `#8c8a85` 17.

**Gate — every measurement against `708:2`:** `+ New` 372/18 · eyebrow 84/68 ·
conversation identical to Layout Canvas · **gate block 358×325 at x=80** with
every internal offset exact (intro 0 · Tier 32 · caret x344 · rings x8 at
61/89/117 with a **1.5** stroke · tier labels x34 at 60/88/116 · prices right-344
· rules 146/192/236/280/324 · row label +8 / value +26 / price +10 / chevron +9,
**and the first row's +2 drift reproduced**) · **Generate 80/782/358×46** ·
**input 80/840/358×36** · title card 547/10/800×58 · cards 587 from y=104.
Type exact: Tier Medium 14 · tier labels 13.5 (selected ink, rest `#5c5b58`) ·
prices DM Mono 13 (selected accent) · row labels Medium 14 · **row values
italic 12.5** · "Included" `#8a8a85` · rules `#ececea`.
The button carries the **total** — `Generate · $105` = Study $80 + the $25
premium-data row, matching the frame; switching to Brief re-quotes to $40.

**Theater — every measurement against `762:2` / `724:2`:** desktop — wordmark
17.38/19.28 · `+ New` 372/18 · title 547/10/800×58 · count hero 547/92 (DM Mono
Medium **64**, box 83) with `SOURCES REVIEWED` at 547/176 · source list from
547/**222** on a **26** pitch (Inter 14 ink) · horizontal fade 667/196/200×660 ·
graph 837/187/**510.4×614.4** · carousel 88/68/312 with every line exact
(bubble 106, status 150, rule 186, question 208, rationale 250, options 284/360)
· pagination 88/852 · docked input 80/795/358×36 · pane switcher 64/829/390×58
with **Ask Caspr live and the other four at 0.4**. Mobile — header 52 · title
0/52/390×58 · count hero 20/116 (54, box 70) + label 20/186 · flap row 20/**228**
(DM Mono 11/16 `#73706b`) then names on a **24** pitch · vertical fade
0/394/390×480 · graph 0/450/390×424 · receded drawer 0/822/390×22 · **no bottom
nav**.

The generated graph matches the spec's own numbers: **97 stars** on desktop from
the 11×9 grid+jitter (§11 says "~97 at the 638×768 reference") and **46** on
mobile (§3 says "~46 on Compact"), 20 and 10 spokes respectively, ~70% locking.
The split-flap runs §7's cycle — 18×42ms scramble, snap, 1100ms hold, release,
150ms pause — verified live in the browser.

**Generation — every measurement against `775:2` / `777:83` / `1827:2`:**
desktop — title 547/10/800×58 with the eyebrow advanced to `MARKET ANALYSIS ·
STUDY · GENERATING` · five cards 800×88 at x=547 from y=88 on a **100** pitch ·
card internals (index 19/17·20×14, title 47/15·300×18, bars 47/45·742×6 and
47/59·682×6) exact. Mobile — three cards 358×88 at x=16 from y=120 on a **98**
pitch · Half drawer 380–788 with the divider row at 404, rules 96 at 16/278,
question 426, rationale 468, options 173×58 at 498/568 · Ask input 16/694 ·
switcher 0/730 · **bottom nav restored** (the immersive moment ended at
Theatre). Failed — glyph 924.2/304.2 · headline 370 · body 717/414/460 ·
`Try again` 358×46 · `Contact support`, all centred on 947.

**The pane is now one component.** `763:77` (Theatre), `1527:2` (Generation) and
`1827:29` (failed) are byte-identical, so they share `WorkingPane`; Theatre was
refactored onto it rather than keeping a second copy of the same numbers.

**Reader — every measurement against `810:2147` / `1446:2` / `1099:2`:** the
shared shell — title 547/10/800×58 with report meta on it · **report page
547/88/800×428** (index 40/36, title 40/50, rule 40/92, paragraphs 40/108 and
40/154, **The Signal 40/210/720×138**, closing paragraph 40/368) · **all three
citation dots at 373/128.5, 376/174.5, 748/372.5** · switcher 64/829/390×58.
Ask — eyebrow 88/68 · bubble right-aligned to 434, 36 tall, **filled `#edece9`
with no stroke** · reply 88/164 · divider rules 88/221 · quoted dot 88/248 ·
answer 88/270 · nudge 86/359 · prompt 80/795. Contents — heading 88/68 · meta
right to 430 · **every one of the fourteen rows exact**, sections ruling 28
below their text and subs 21, on 12/9 gaps · switcher divider 80/829/358×1.
Updates — `Coming soon` 88/104 · dividers 204/286/368/450 · rows on the **82**
pitch · foot rule 80/750, caption 88/762, **disabled** `Re-analyse · $40`
88/782/342×40.

Edit — chip 88/106 · **every toolbar glyph on its own hand-set x** (undo 88,
redo 108, rule 128, B 140, I 162, U 182, S 203, rule 226, aligns 238/261/284/307,
rule 332, lists 344/368, rule 394, link 406) · selects 88/166/314 at y=176 ·
message 88/244 · suggestions 317/351/385 · `Discard` 310/68 and the ghost `Save`
372/61 · **edit indicators 575/196 and 575/242, 2×32**. Outputs — `+ Generate`
right to 430 · search 88/112/342×40 · pills 88/164 wrapping at 34 · feed rows
241/300/359/427/499 with the rule at 291 · card internals exact. Generate Output
— eyebrow 80/68 · `‹ Back` right to 438 · blurb 80/92 · add-card 80/124/358×54
· queued rows 190/260/330 on the **70** pitch · commit 80/782/358×42 reading
`Generate 3 outputs · $20`.

**Mobile — measured against `639:2` / `722:2` / `944:1394` / `1452:2`:**
Conversation — user block 104/152/270×40 · reply 20/208/340×40 (14/20) ·
suggestions 20 at 272/306/340/374 · input 16/734 · **no analyses list**, there
being no pane on compact. Gate — cards 16 at 126/254/382/510/614 · drawer
380–788 · block 16/398 with rows at 436/480/524/568/612 and rules at
472/516/560/604/648 on a uniform **44** pitch · Generate 16/686 · input 16/744.
Reader — report document 16/118/358×520 with every internal exact (index 36/138,
title 36/152, rule 36/190, paragraphs 36/204 and 36/280, Signal 36/346) · drawer
380–788 · Ask eyebrow 16/414, bubble to 374, rules 16–104 and 271–358, answer
16/578, nudge 14/665 · Contents rows and rules exact at both levels · input
16/694 · switcher 0/730 · nav 0/788.

**The compact report is not the desktop page scaled** — `971:64` re-sets it:
Instrument Serif 22 not 20, ink `#171716` not `#333330`, the index grey rather
than near-ink, The Signal at **radius 2** with a 9px label and a 12.5 Regular
claim, **no icon and no evidence line**. Built from the frame, not derived.

**Gate:** typecheck clean · **210 tests passing** · production build clean ·
`npm audit` = 2 non-applicable react-router advisories.

**The one deliberate deviation on both screens** is §11's rhythm (Joy,
2026-08-12: "§11 stands"), which makes the Gate pane taller than its frame — the
conversation + gate block now scroll between the header line and the docked
Generate slot instead of being compressed. The slots themselves do not move.

---

## 4. Build next, in order

0. ~~Re-measure Conversation `640:2` and Gate `708:2`~~ — **done, measured.**
   Their **mobile** frames (`639:2` / `722:2`) remain unbuilt — fold them into
   the mobile-variants pass at item 5.
1. ~~**Layout Canvas** `692:2` / `694:2`~~ — **done, measured.** Note the
   structural inversion it introduces (see §5).
2. ~~**Theater** `762:2` / `724:2`~~ — **done, measured**, both breakpoints.
3. ~~**Generation** `775:2` / `777:83` + generation-failed `1827:2`~~ — **done,
   measured.** Mobile-failed has **no frame**; see §6.
4. ~~**Working / reader cluster**~~ — **done, measured.** The shared reader plus
   all six panes: **Ask Caspr `810:2147` · Contents `1446:2` · Edit `837:2331`
   · Outputs `831:2227` · Generate Output `923:2405` · Updates `1099:2`**
   (coming-soon). Desktop only — the six compact frames are still open (§4.5).
   **✓ Edit's three sub-variants** — Chart `1131:2455` · Visual·Cover
   `1131:2668` · Infographic `1395:2` — built and measured 2026-08-13. Each is
   the pane *and* the thing it edits: a stacked-bar figure, a poster cover, a
   2×2 quadrant. Reached by selecting the element, with `/report/chart`,
   `/report/cover` and `/report/infographic` for direct entry.
   **✓ Their three mobile frames** (`1275:2860` / `1275:2968` / `1422:2`) —
   built and measured 2026-08-13. All three collapse to one shape in the Half
   drawer: selection, a scrolling rail of 156×94 proposals, one row of controls,
   and `OR JUST ASK` above the docked input — no suggestion rows, because the
   input is the ask. **The reader is now complete on both breakpoints.**
5. **Mobile variants — DONE.**
   **✓ Conversation `639:2` · ✓ Gate `722:2` · ✓ the compact reader shell
   (`944:1394` / `1452:2`) with its reflowed 358 report document and ✓ Ask
   Caspr + ✓ Contents** — on top of Layout Canvas `694:2`, Theater `724:2` and
   Generation `777:83`, already built.
   **✓ Outputs `946:1492` and ✓ Updates `1120:2295`** — built and measured
   2026-08-13. Neither is the desktop pane reflowed: Outputs runs a **358**
   column with its own feed rhythm (14/14/10/10, no rules between version rows),
   Updates draws **two** rows and puts the commit inside the scroll area. Both
   frames drop the docked input, so the drawer foot is 58 rather than 94 —
   `ReaderShell` now takes `mobileInput`.
   **✓ Edit `1138:2734` and ✓ Generate Output `1283:3112`** — built and measured
   2026-08-13, which **closes the compact reader**: all six panes are now their
   own frames rather than the desktop pane in a drawer. Edit drops the whole
   formatting toolbar (the frame says why in words) and writes Caspr's opener as
   a shorter string; Generate Output steps its type down a notch, shortens both
   card kinds, commits inside the scroll area at 342 in a 358 column, and queues
   two outputs rather than three.
6. ~~**Welcome mobile** `637:2` + the **"C." logo collapse**~~ — **done,
   measured 2026-08-13.** The collapse is `667:61`: Instrument Serif 25.71 with
   the accent full stop, an 18×33 box at 23/13.769, shown wherever a route
   declares `brand: 'mark'`. Welcome is the only pane-less screen, so it is the
   only one that carries it.
7. **Documents** `184:4` — **the library is BUILT**, desktop and compact, with
   its empty, no-results and loading states (`843:89` · `1280:196` · `1803:2` ·
   `1846:51` · `1824:2` · `1832:113`), each measured. Routes: `/documents` and
   `/documents/{empty,no-results,loading}`.

   The page has **30 top-level frames, not ~50**, and most are not Documents:
   - ~~**Document View** `1848:2` / `1849:2`~~ — **done.** Both frames are
     byte-identical to the Ask Caspr reader (`810:2147` / `944:1394`), verified
     by measurement, so a cover opens the reader at `/documents/:id` rather
     than a screen built twice. **Documents is complete.**
   - ~~**Data Room — 18 frames**~~ — **COMPLETE**, all 18 built and measured
     against the frames (spec `data-room-screens.md`). Base desktop `1756:2`
     and compact `1766:2` (with the add-file peek `1784:296`) · row actions
     `1778:81` / `1785:356` · delete confirm `1775:2` / `1784:290` · add-files
     drawer `1768:2` · uploading `1791:2` / `1796:2` · empty `1805:2` /
     `1808:2` · upload failed `1809:2` / `1824:197` · no results `1812:2` ·
     loading `1832:2` · search results `1851:2` · feature locked `1885:2` /
     `1885:109`. Routes: `/data-room` and
     `/data-room/{uploading,empty,no-results,loading,search,failed,locked}`.

     Three things the frames decide, worth not undoing:
     · **Empty and loading carry no search field**, and the empty header reads
       `NO FILES YET` rather than counting to zero.
     · **The empty state does not empty the pane** — unlike Documents, whose
       filter pane collapses. The pane is the way *out* of empty.
     · **A search narrows the centre, not the header** — `1851:8` keeps
       counting the whole library while one hit shows.

     Corrections this pass, from reading design-context rather than metadata:
     every absolute inset in `FileCard` was **1px out**, because the card draws
     its edge inside its box, so a Figma coordinate is 1 further out than the
     equivalent CSS offset. Tag, `≡`, filename, meta, glyph and the upload bar
     are all re-measured and exact at both widths; the upload bar is inset to
     the card's gutter at y=53 rather than flush to the bottom edge, and the
     percent is DM Mono 13. Uploading is now a **list** that fills Included,
     which is what both frames draw.

     Open with Joy: `1812:2`, `1832:2` and `1851:2` have **no mobile frame** —
     their compact halves are derived from `1808:2`'s ramp. See
     `QUESTIONS-FOR-JOY.md` §30.
   - ~~**Shell odds**~~ — **done, measured 2026-08-14.**
     · `More (nav overflow)` `1236:2860` → `app/shell/MoreDrawer.tsx`, opened by
       the bottom nav's fourth tab (the `onMoreClick` hook that was already
       there). Carries the four destinations the nav has no room for —
       Insights · Data Room · Help · Account — which are the rail's bottom
       cluster re-cut for a phone.
     · `Sign-out Confirmation` `1248:104` → `app/shell/SignOutDrawer.tsx` on
       `/sign-out`, drawn over Welcome as the frame draws it. The accent commit
       is **Stay signed in**; leaving is a plain link. Nothing in the file shows
       what opens it — QUESTIONS §31(a).
     Both corrected the `Drawer` scrim, which was covering the full viewport
     where every mobile scrim in the file is drawn 52 down and 52 up. That
     change reaches every scrimmed mobile drawer — QUESTIONS §31(b).
   - ~~**Toasts** `1922:2` / `1928:76`~~ — **done.** Built as a component
     (`components/ui/Toast.tsx`): `ToastCard`, a `ToastViewport` the shell
     mounts once, and a `useToast()` that no-ops outside a provider so a screen
     rendered alone still renders. `/toasts` stands the three drawn examples up
     to measure. Three rules the frames set: **red is reserved** for the `!` and
     the action word, so a success tick is ink; **a toast never blocks**
     (`role=status`, `role=alert` for errors); and **anything with an action
     does not auto-dismiss**, because timing out `Undo` / `Retry` throws away
     the recovery. Mobile matches the frame to the pixel; desktop hugs its
     message rather than the frame's padded label boxes — QUESTIONS §31(c).

   **Page `184:4` is now complete.**

8. ~~**Profile & Wallet** `184:5`~~ — **COMPLETE.** 46 top-level frames
   (44 screens + 2 reference); all 44 built and measured.

   ~~**Wallet**~~ — desktop `1532:2` + mobile `1571:2`, the four top-up cards
   at both widths (`1854:124`/`1887:124`/`1855:212`/`1855:440` and
   `1857:2`/`1888:2`/`1858:2`/`1858:175`). Routes: `/wallet`,
   `/wallet/no-transactions`, `/wallet/top-up{,/custom,/success,/declined}`.

   The Wallet's centre derives everything from one cycle of entries — the
   header's counts, the 31 daily bars and the ledger are three views of the same
   data, so they cannot drift apart the way they can in the frame.

   ~~**Account**~~ — desktop hub `1596:2` with all **seven** centres (Details,
   Research profile, Password, Two-factor, Devices, Notifications, Preferences),
   the mobile menu `1669:2` + details `1697:76`, the four confirmations at both
   widths, and the seven editing drawers. Routes: `/account`,
   `/account/:section`, `/account/{change-email,email-sent,reset,delete}`,
   `/account/research/empty`, and `/account/:section/:drawer`.

   Five of the seven centres come from `1629:2`, which is labelled REFERENCE and
   says in its own name to build `1596:2` — so its content is the spec and
   `1596:2` is the shell.

   **`Sign out` was drawn all along**, at 16/858 in the account pane
   (`1614:21`). That closes QUESTIONS §31(a).

   ~~**Help**~~ — desktop `1711:2` + compact `1712:2`. The last destination the
   More drawer pointed at that had no screen.

   ~~**The rest**~~ — Wallet no-transactions `1830:2` · billing/Stripe
   `1878:124` / `1878:220` · plans drawer `1581:154` · compact Account sections
   `1686:2` / `1680:211` / `1680:312` / `1680:2` / `1811:2` · research questions
   drawer `1689:33` · desktop sign-out `2081:2905` · Help full composer
   `1713:112`.

   Three decisions in that last batch worth not undoing:
   · `1830:2` **drops the pace chart entirely** rather than drawing a flat line,
     and the activity card becomes the empty state instead of keeping its band.
   · `1686:2` makes **Security a compact-only section**: three desktop centres
     reached through one screen of three cards, which is what lets the account
     menu stay four rows and never scroll. Its third card is the real
     `Danger card` component — the three "strays" flagged in §32(e) are copies
     of it.
   · `1581:154` is drawn at 368, which is not a detent. It ships as a **Half**
     (408): Joy's round-5 ruling is three detents and nothing else, so `Drawer`'s
     height override was removed rather than a fourth detent added.

   Open flags from this page: `QUESTIONS-FOR-JOY.md` §32 and §33.

9. ~~**Insights** `184:6`~~ — **COMPLETE.** The smallest page in the file: **two
   frames**, `1231:2860` desktop and `1277:196` compact, and **both are the
   coming-soon state**. There is no live Insights drawn anywhere, so under hard
   rule 8 the coming-soon state *is* the screen. Route `/insights`.

   What makes it worth shipping rather than hiding: **the pane is live while the
   centre is not.** Five filter facets and a working docked input, because
   telling Caspr what to watch is useful *before* it can watch — it means
   Insights is watching from the day it turns on. The centre is real chrome
   around a deliberate blank: title bar, chart furniture, feed skeletons.

   **Every figure reads `XX` or `YY%`.** That is the design, not placeholder I
   left in. The only stated number is `25M SOURCES`, which is true today.
   `InsightsPage.test.tsx` fails if anyone later replaces them with invented
   ones — that is the specific regression this page is exposed to.

   Compact has no room for a preview, so Insights is a **scrimmed Half drawer
   over Home** carrying the announcement and three of the five facets;
   `INDUSTRY` and `TIME RANGE` are dropped.

   Two deltas measuring caught: the frame's feed rules are at 428/516/596/676
   against rows at 444/524/604/684, so the first is 16 above its row and the
   rest 8 — carried per row rather than derived. And `1241:81` is drawn at
   x=454, the pane's *outer* edge, so the hairline is `left-full`; `right-0`
   would eat the pane's 390th pixel.

   Open flags from this page: `QUESTIONS-FOR-JOY.md` §35. Three of the four
   closed the same day — the design session's own pre-flight caught the stray
   green, the off-scale radii and the off-ramp greys independently.

10. **Final alignment pass** — `FIGMA-FINAL-ALIGNMENT.md` is now the single
    source of truth for the locked system. Applied to the build; see
    `QUESTIONS-FOR-JOY.md` §36 for the table of what moved.

    The one structural change: **the peek detent is one surface with half and
    full**, so it lost its own handle (r3/y9/`#d3d1c7`) and its four-sided
    hairline for the shared top-edge-only border. `/wallet`, `/account` and
    `/help` were each pasting their own copy of the peek — they now share
    `app/shell/PeekSheet.tsx`, which reads `PEEK_HEIGHT` and `DRAWER_LIFT` from
    `Drawer`. It is deliberately not a `Drawer`: a permanent affordance must not
    announce itself as a dialog the user cannot exit.

    Verified across all three routes at 390: h94 · bottom 56 · radius 20 ·
    handle 44×5 r2.5 at y12 · one shared border.

   **Read `../caspr-claude-core/docs/product/documents-categorization-alignment.md`
   FIRST.** It is locked (Joy, 2026-07-31) and it *supersedes* the "5 core
   Types" model that older notes still describe. What it settles:
   - Filter pane order: **Project** (with `+ New Project`) → **Type** →
     **Sector** → collapsed **Geography · Theme**.
   - **Tier is not a flat filter** — it cascades under Type, because rung names
     are type-dependent (Market Research: Brief/Study/Intelligence · Investment
     & Deal: Screen/Thesis/Diligence · Legal: Screen/Review/Deep).
   - **Status is a tag, not a filter and not a sort** — rendered on non-complete
     covers only.
   - **Sort pills are contextual**: hide a dimension already collapsed to one
     value, and hide Tier/Sub-type when >1 Type is in view.

   **Primary frame `843:89` (Documents — Desktop v3), geometry surveyed:**
   - Filter pane `843:243` at x=64/390: `FILTER` 20/68 · sections at caret 20 /
     label 38 — PROJECT 110, TYPE 238, SECTOR 428, THEME 684, GEOGRAPHY 718 ·
     rows on a **32** pitch, label x=20 w=230, count x=278 w=64, chevron x=356,
     divider at row−9, x=20 w=336.
   - Content column at 547/800: title 0/8 800×58 · metric strip at x 0/200/400/
     600, value y=92 h36 + label y=130 h14 · search 0/184 800×40 · `Sort by:`
     0/244 with pills at 61/153/222/285/364, y=238 · group label + divider (the
     rule starts at the label's right +14 and runs to 800) at 282/512/742/972 ·
     **cover cards 130×178.1 on a 167.5 × 230 grid** from y=306.
   - Card internals: cover 130×162.5, image 130×97.5, tier label 9.1/9.1,
     a 15.6×1.3 rule at 9.1/114.4, title 9.1/122.2 w111.8, meta 0/167.7.

   Next step is `get_design_context` on `843:243` and one Cover Card for colour
   and type, then build pane + column, then measure.

---

## 4b. The product build — wiring, not screens

The screen build is **complete**: all six Figma pages, both breakpoints,
measured. What follows is connecting it.

11. ~~**Reference AI implementation**~~ — **BUILT.** `services/reference-ai`.
    Jayant chose **Option A** (`jayant-open-inputs-answered.md`), so this is
    not a mock standing in for a real API — it is the published contract his
    service implements to, specified in `api-spec-v2.md`.

    Three things a stub skips, which are why clients break at integration:
    real transports (MCP/HTTP, SSE, WebSocket — split by *lifetime*, not
    preference); modelled latency (`real` · `compressed` · `zero`, the middle
    one keeping proportions so ordering bugs surface in seconds); and
    injectable failure by header, refused unless `ALLOW_FAULTS=true`.

    Proven over real sockets, not `app.request` — backend mints a JWT, the AI
    service fetches the JWKS over HTTP, SSE is read with `fetch`, the
    WebSocket does first-frame auth and closes 4401 without it.

12. ~~**Conformance suite**~~ — **BUILT.** `services/conformance`, 21 checks.
    `npm run conformance -- --origin <url>`. Shares no code with the reference
    implementation, so an all-green run means two independent readings of the
    contract agree. It found a real bug on its first full run: `propose_layout`
    derived `analysis_id` from the prompt, so re-proposing the same question
    **overwrote a completed analysis and destroyed its versions**.

13. ~~**Wire the core loop**~~ — **DONE.** prompt → layout → refinement → gate
    → theater → generation → report runs end to end against the reference
    service, and all six designed screens carry the live analysis.

    The flow is a reducer **above the router** (`AnalysisSession`), because one
    analysis outlives every screen that shows it. Screens keep their props with
    the frame's values as defaults, so each still renders standalone for review
    and measurement — wiring was a data swap, not a rewrite.

    Three bugs only a real browser against a real service found:
    · Layout refinement sliced questions off the already-revised layout, so it
      compounded and emptied the gate by the third revision.
    · `VITE_REALTIME_ORIGIN` pointed at a port nothing serves.
    · The reader fetched on section count, racing the service's own store, and
      rendered a cover reading **0 SECTIONS**. `analysis_complete` is the
      signal; counting sections never was.

14. ~~**Token refresh + wallet at the gate**~~ — **DONE.**

    **Refresh** is rotating opaque tokens, stored hashed, with reuse detection
    that revokes the family (and only that family). The client refreshes five
    minutes early; the transport retries a 401 **once**, sharing a single
    in-flight refresh so a burst of 401s cannot present an already-used token
    and trip the theft detection.

    **The wallet** now holds the analysis price before generation starts —
    money first, then work, because starting a paid run for someone who cannot
    pay is only discovered once the compute is spent. Keyed on the analysis, so
    a retried commit re-uses its hold. A shortfall returns to **scoping** with a
    402, not to failed: nothing broke, and the user can top up and commit the
    same analysis. Release credits **Paid**, not the ledger it came from
    (`pricing-model.md` §10.2), and `analysis_failed.refundable` finally has a
    consumer.

15. ~~**Ask Caspr**~~ — **DONE.** The red dots finally do something: clicking one
    sends its anchor *and* its section (the dot alone does not say which
    section it came from) and streams back a framing line, the quoted figure
    and the answer. Free-form questions go through the same tool unscoped.

    Deltas **append** — assigning would show the last few words and look like a
    very terse answer — and a dropped stream keeps the partial answer with a
    note rather than throwing away what arrived.

    Open: the pane renders **one** exchange, because that is what `810:2162`
    draws. Multi-turn has no frame and was not invented — `QUESTIONS-FOR-JOY.md`
    §37 offers three ways out.

16. ~~**Edit proposals and Outputs**~~ — **DONE.**

    **Outputs** is complete: committing the queue renders the files and they
    return on the event channel, version-pinned, with rows moving queued →
    Ready. The session keeps the channel open past `complete`, because outputs
    outlive the run.

    **Edit** is wired and blocked on artwork. The pane has 3 thumbnails, the
    rail offers 6 intents, and the service returns 15 kinds — so five intents
    fall back to the frame's set. `QUESTIONS-FOR-JOY.md` §38 costs it at ~9 new
    drawings and recommends drawing them.

17. ~~**The apply path**~~ — **DONE.** Picking a proposal previews it in the
    reader, Save commits it, Discard restores the analyst's chart, and only
    **saved** edits travel with `generate_output`. Verified: the export request
    carries `overrides.sec_1.chart_data` for the picked proposal, pinned to the
    version.

    Two layers because Discard has to mean something — with one, previewing a
    proposal *is* accepting it. And the output idempotency key includes the
    saved edits, so re-exporting after an edit is a new job rather than a cache
    hit returning the pre-edit file.

18. ~~**Documents library + Data Room**~~ — **DONE.** Both live, on a **new
    product-side** surface (`GET/POST /documents`, `/files`) that the contract
    did not define because it is not Jayant's: §1.8 gives us identifiers and
    status, never content, and a library index is exactly that. The payoff is
    that **the library loads when the AI service is down**.

    The client records an analysis at commit and again at completion, because
    nothing else can — the AI service does not call us. Index writes are
    swallowed on failure: a library entry that could not be written must never
    break the analysis it describes.

19. ~~**Filters, search and sort**~~ — **DONE.** Counts are real and faceted,
    both search fields search, and the locked sort rule drives the pills
    (`sortsFor` finally does its job). Narrowed-to-nothing is `no-results`, not
    `empty`. Client-side by design; moves server-side behind the same hook if a
    library ever reaches the thousands.

20. ~~**Data Room row actions**~~ — **DONE.** Move between Included/Excluded,
    privacy, and delete (through its confirmation) all persist. Delete had been
    drawn and confirmed with nothing behind it — the dialog dismissed and the
    file stayed.

    **`allowMethods` did not include PATCH or DELETE**, so both failed at the
    CORS preflight in a browser while every server-side test passed. There is
    now a preflight test, because `app.request` cannot see this class of bug.

21. ~~**Gate add-ons + queue position**~~ — **DONE.** Add-ons ride the layout so
    the price arrives before the gate, are carried through every refinement, and
    the commit sends back exactly what the gate priced. The queue drains:
    positions are recomputed from the queue, only ever fall, and a failure frees
    its slot like a success.

22. **Theater decode motion — BUILT AND VERIFIED, GATED OFF** (§41).
    The choreography is implemented and unit-tested (`decode.ts`,
    `DecodeRow.tsx`, 11 tests) with the twelve Nsibidi glyphs exported from
    Figma `2099:168` into `assets/nsibidi/`. `GLYPHS_VALIDATED = false` keeps it
    off pending cultural validation, and the Theater runs the old flap
    unchanged.

    The earlier "wiring unproven" note was wrong: rAF does not fire in a hidden
    browser pane, which is what I was verifying in. Painting is covered by 8
    component tests on a fake frame clock. **Gotcha worth keeping:** the spec
    calls the flap row `762:2` and the Theater root already uses that id — the
    duplicate sent me debugging the wrong element.

23. **WHAT IS LEFT.** The contract's whole 🟢 surface is wired, the six
    designed screens carry live data, and **the four build gaps in bucket c are
    closed**. What remains is waiting on other people.

    ### a. Waiting on the design session
    All four are in `FIGMA-DECISIONS-PROMPT.md`; none needs a code change.
    · **Edit thumbnails** (§38) — decided, spec'd. 9 drawings. Five of six
      intents do nothing visible until they land.
    · **Queued centre** (§39) — decided, spec'd. One centre on an existing screen.
    · **Ask turn gap** (§37) — confirm **24** pane / **9** drawer, or draw two
      turns. The drawer's 9 is the weak one: nothing multi-turn is drawn at any
      compact width.
    · **Nsibidi validation** (§40) — the gate on the Theater decode. Glyphs are
      in the build (Figma `2099:168` → `assets/nsibidi/`); what is missing is a
      Nsibidi/Ekpe reference checking the forms, which the Figma frame itself
      asks for.

    ### b. Waiting on Jayant
    `api-spec-v2.md` §13, down from seven items to three.
    · Staging `{AI_ORIGIN}` / `{REALTIME_ORIGIN}`, **plus the written
      confirmation that staging holds no real customer data** — still
      outstanding, and our security tooling refuses to run without it.
    · Confirmation of the §0.2 decisions, **D2 especially** (no tokens in URLs),
      because it constrains how his SSE and WebSocket endpoints take credentials.
    · A signed pentest authorisation, in-window. "Y" in a document is not what
      the tooling checks for.

    ### c. Genuine build gaps — mine — ✅ ALL FOUR CLOSED (2026-08-15)
    Found by auditing rather than assumed; §42 has the full write-up.

    1. ~~**Welcome's input goes to the dev harness and drops the prompt.**~~
       **DONE.** It calls `submitPrompt` and goes to `/conversation`. `scoping`
       also came out of `useFlowNavigation`'s destination map — it spans
       Conversation, Layout and Gate, so leaving it in would have skipped
       Conversation and pulled a user off the Gate mid-shortfall.
    2. ~~**Data Room files never reach an analysis.**~~ **DONE.** The commit
       reads the library, filters to **Included**, and sends those ids both at
       the top level and inside the confirmed gate configuration. A library that
       will not load no longer blocks a paid run.
    3. ~~**Outputs cannot be downloaded.**~~ **DONE, and larger than it looked:**
       the service published a url for a route that did not exist. There is now
       a signed one — HMAC over job, file, analysis, version and expiry;
       unauthenticated by design because a download is a top-level navigation;
       403 if edited, 410 once stale. The relative url resolves against the
       **MCP endpoint**, not `VITE_REALTIME_ORIGIN` — that is a `ws://` address
       and would have produced a link no browser fetches. Non-http(s) urls are
       dropped rather than opened.
    4. ~~**Signup does not create an account.**~~ **DONE**, and the backend
       half that §42 flagged is now built too (§43): scrypt password hashing,
       `/auth/signup` that answers a taken email exactly as it answers a new
       one, emailed verification links that work once and expire in a day, and
       an `/auth/session` that actually checks the password. `/verify` is the
       landing route — no frame draws it, so success redirects into the app and
       only the two failure states carry copy, which is flagged for Joy.

       **Password reset is built too** — all three drawn screens wired, one-hour
       links, every session revoked on confirm, and the two kinds of link
       guarded against confusion.

       **Still open there:** a real mail provider behind the `Mailer` seam
       (links print to the console today) and how the 1,500 existing signups
       get a password.

    Verified over the real wire against the three running services: signup
    creates the account and the $100 trial wallet; a Brief runs to
    `analysis_complete`; `generate_output` publishes a link that returns the
    report and 403s once tampered with.

    ### d. Product decisions with Joy
    Recorded rather than owned: the payment gateway/entity (Stripe, DBS or
    ICICI pending), the 1,500-user migration and the `caspr.ai/signup` routing
    (item 19), SOC 2 initiation, and the EU-residency claim for Enterprise —
    which Joy deferred on the grounds that Enterprise is a separate deployment.

---

## 5. Gotchas — already paid for once

- **The conversation moves.** On **Conversation** the pane holds the *analyses list* and the conversation is in the 800 centre column. From **Layout Canvas onward** the pane swaps to the live conversation and the centre becomes the canvas. Deliberate (§6), not an inconsistency.
- **Card insets must subtract the border.** A 358 card with a 1px border needs `px-35`, not `px-36`, to land a 286 control column. Same class of bug bit the 406 pane (`px-23`).
- **Pin small type.** 9.5px labels need explicit `h-[10px] leading-[10px]`, or line-height rounding drifts the whole stack 1–2px.
- **Mobile frames are often scaled groups, not designs.** If values are fractional (`0.772` border, `6.179` radius, `9.654px` type) it's a Figma group scale. **Ruling: keep the layout, use designed type + radius 2, let heights grow.**
- **Mixed gutters.** Several mobile frames put text at x20 but controls/cards at x16.
- **The browser pane can collapse to `innerWidth: 0`**, making every measurement read 0. **Assert the viewport before trusting a measurement.**
- **Radius is semantic, not decorative.** `0` documents/title cards · `2` all functional chrome **and page content cards** · **`12` layout cards AND overlay/modal cards** · `20` drawer tops. **Controls inside a 12px overlay card stay 2px.**
- **`↳` elbow = "start new"; `›` chevron = "resume".** Never swap them.
- **Docked commit + input sit at fixed slots** (desktop y=782 / y=840), frame-level, never flowing after variable content.
- **Drawers stop at the bottom nav's top edge** (788), never the frame floor — except the one Full instance, which does cover it (flagged).
- **Scrim rule:** blocking confirmations dim; working surfaces never do.
- **Figma strokes are INSIDE the shape; CSS borders are not.** A 208×29 bubble
  with 12/7 insets and a 1px stroke needs `px-11 py-6` + `border`, not
  `px-12 py-7`. Same bug class as the 358 card and the 406 pane — and it also
  hit the drawer, whose 1px top border was pushing its handle and all its
  content down a pixel; it is now an **inset box-shadow**, which is what an
  inside stroke actually is.
- **Pin line-height to the Figma text-box height, not `leading-none`.** Figma's
  auto line height is ~1.21em, so `leading-none` makes a 15px title sit in a
  15px box where the frame has 18 — every glyph in the card rides ~1.5px high.
  Section card = 17 (index) / 18 (title) / 16 (bullet); eyebrow = 17.
- **`leading-normal` is 1.5 in Tailwind — NOT the font's natural line height.**
  Figma's "auto" line height is the font's own metric (~1.21em for Inter, 1.3em
  for DM Mono), which is CSS `line-height: normal` — written `leading-[normal]`.
  Using `leading-normal` inflates every box by ~25% and drops each glyph ~2px
  below its designed baseline; stacked, it walked the Theater pane 14px off.
  Either pin an explicit px height or use `leading-[normal]`, never the bare
  utility.
- **Use `matchMedia`, never `window.innerWidth`, for a JS breakpoint.** They can
  disagree — under viewport emulation `innerWidth` read 1283 on a 390 CSS
  viewport — which puts a JS-chosen tree under CSS-chosen chrome. `matchMedia`
  is the same engine as the `shell:` variant, so it cannot drift.
- **An absolutely-positioned child of a bordered box is offset by the border.**
  The border grows the padding box, so `left: 47` lands at 48. Every inner
  offset on a card with a 1px stroke is **one less** than the Figma number —
  this hit the generating card and both option cards after already hitting the
  chat bubble and the drawer. Assume it, then measure.
- **Absolutely-positioned fixed widths bleed between breakpoints.** The Theater
  centre overflowed 182px at 1180 because its 800 column and graph were placed
  from the left at fixed sizes. Anchor a right-aligned composition **from the
  right edge** so it tracks the column as it narrows.
- **A stroked SVG's flow box is bigger than the frame's node.** Figma measures
  the *path*; a 1.6 stroke hangs 0.8 outside it on every edge, so a 44×37 vector
  renders 45.6×38.6 and pushes everything under it 1.6 low. Pull the overhang
  back out with a negative margin (`my-[-0.8px]`), don't shave the gap below it.
- **Don't pass a width to `Button`.** Its `commit` size is `w-full
  max-w-[358px]`; adding `w-[358px] max-w-full` lets `w-full` and `max-w-full`
  win on stylesheet order and the button renders full-column (800 on desktop).
  Let the container do the sizing.
- **A closed drawer stays mounted, so it must be `inert`.** `aria-hidden` alone
  leaves its fields tabbable behind the screen.
- **The Browser pane freezes CSS transitions when it isn't displayed**
  (`document.visibilityState === 'hidden'`). Layout still measures, but anything
  mid-transition reads its *start* value — a drawer looks stuck closed. Clear
  `style.transition` and the transitioned property before measuring, or measure
  the resting geometry from computed `top`/`bottom`.
- **A numbered list needs a fixed number COLUMN, not a gap.** "1" is 7 wide and
  "2" is 9, so a gap puts the question text at two different x. Every frame has
  it at one (84→104 desktop, 20→42 on `694:2`).
- **Icons:** exported SVG geometry is kept byte-exact; only baked colour becomes `currentColor`. Brand marks (OAuth logos) are never recoloured. The 20px nav exports are the 24px geometry scaled — one icon set serves both.

---

## 6. Open — needs Joy

**Copy:**
- ~~Three of four **suggestion strings** on Conversation~~ — **resolved**: all
  four read out of the instance overrides on `640:95/100/105/110` and are built.
- **Signup consent** — `DEV-HANDOVER.md` §5 already rules this (no checkbox, one
  passive line under the buttons); confirm that supersedes `1979:115`/`1979:117`
  and the item closes.

**Closed by the 2026-08-12 Figma pass** (`FIGMA-FIX-RESPONSE.md`, re-matched in
one sweep): section cards now radius 12 · The Signal radius 10 → 2 and its
compact card grown to hold the evidence line · Edit chip/selects 4 → 2 · Generate
Output cards 6 → 2 and its commit back to Inter Medium 14 · report body leading
1.55 throughout · `692:2`'s docked input at 80/358 · "six sections" → five ·
Intelligence `SOON` in the frame · desktop flap row · wallet balance in DM Mono ·
curly apostrophe on `1527:7495` · no `#e9453c` anywhere in the file · **mobile
generation-failed (`2002:2`) and its contact-support composer (`2011:11`) built**.

**Closed by the second pass (2026-08-13):** pane headings unified on 14 /
`#474642` / 0.3 · Generate Output moved onto the shared x=24/342 column · title
card confirmed at 2 · `--error` tokens gone (they were never in the build) ·
`accent-pressed` now the documented `#be3530` (swatch `8:17`) instead of a
filter · **desktop contact support `2044:9` drawn and built, so the app has no
dead links**.

**Closed by the third pass (2026-08-13):** the grey collapse finally landed
file-wide (4,244 nodes — the earlier sweeps were silently skipping non-active
pages, a `page.findAll` + dynamic-page-loading trap worth remembering), so
**`index.css` now carries a named ramp and every semantic grey is an alias onto
it** · the 0.895 scale artefact reset on all four Help fields · `1493:7/12/17`
reflowed · `924:24`'s label box widened · the Ask divider widened on compact.

**Still open, all built to the frame and logged in `QUESTIONS-FOR-JOY.md`:** Full
drawer covering the nav · peek shell drift · **§12 conversation rhythm (frames vs
§11 — the one place Layout Canvas does not match its frame)** · **§16
between-breakpoint reflow** · **§26 follow-up: `865:8` took the compact rule
numbers on a pane whose column starts 8px further in, so it overshoots** · two
new one-unit colour pairs (`#dedbd6`/`#e5e3de`/`#e5e3df`), not urgent.

**Still with the design session:** `accent-pressed` wants promoting from a swatch
to a variable · the three user-bubble treatments · Theater node sizes · the
Outputs feed rhythm.

**With Jayant:** seven questions at the end of `api-spec-v1.md` — MCP transport/URL/schemas, JWKS confirmation, section-content delivery, anchor delimiter, 429 shape, max concurrent analyses, and Option A/B on the reference implementation.

---

## 7. ⛔ HARD RULES — Joy's, non-negotiable

Violating any of these is a failed handoff regardless of how good the rest is.
They exist because each one has already cost correction time.

### Build discipline
1. **NEVER recreate or invent a design.** Every screen, component, colour, size,
   spacing, icon and state already exists in Figma. If something you need is
   **missing: STOP and ask Joy.** Do not approximate, do not "fill the gap", do
   not build a reasonable version. *"I couldn't find it so I made one"* is the
   single most damaging thing you can do here.
2. **Pixel-identical to Figma, per screen.** Verify by measuring, not by eye.
3. **Per-screen differences are intentional.** If the "same" component looks
   different on another screen, **replicate the difference** — do not normalise
   it or de-duplicate it into one component that flattens it. Match the frame,
   not your mental model of the component.
4. **Match the frame even when a spec disagrees** — then **flag the conflict**.
   Several spec docs have already been corrected this way (radius, shell
   geometry, nav labels). Never silently pick one.
5. **Reuse and compose; never hand-rebuild.** Clone/instance what exists rather
   than re-authoring it.
6. **Reference frames are not screens.** Anything tagged `(ref)`,
   `(representative)`, `(for review)`, or a "Toasts —" demo is guidance. See
   `DEV-HANDOVER.md` §5a.

### Scope
7. **The website (`caspr.ai`) is a separate, FROZEN codebase. Do not touch it.**
   Nothing in this build may change it — including its SEO and CRO behaviour.
8. **"Coming soon" means build the real screen**, with its coming-soon treatment
   — Insights and Updates included. **No dead links.** Users should see what is
   coming. Do not build Insights internals.
9. **Launch depths are Brief + Study only.** Intelligence renders disabled/SOON.

### ⛔ 9a. REPORT CONTENT IS SACROSANCT — never rephrase, edit, or truncate it
**Joy, 2026-08-12:** *"every word in the report is sacrosanct — the product
never rephrases or edits any information provided by the report. Whatever comes
must be shown as is — desktop or mobile doesn't matter."*

Anything the API delivers as report content — section titles, body copy, The
Signal's claim **and its evidence**, anchor explanations, source names, version
summaries — renders **in full, verbatim, at every breakpoint**. Concretely:

- **No `truncate`, no `line-clamp`, no ellipsis** on API-delivered text. Let the
  container grow, wrap, or scroll instead.
- **No per-breakpoint abridgement.** If a compact frame has no room for a field,
  the frame is wrong — grow it and flag it; do not drop the field.
- **No summarising, re-titling, or reflowing sentences** in the client. The
  client is a renderer, not an editor.
- Chrome the product owns (nav labels, filenames in a file list, UI affordances)
  is not report content and may still truncate.

This supersedes any frame that shows a clipped or abridged version of delivered
content.

### Product decisions already made — do not relitigate
10. **Auth is email + password** (not magic link), and **all three OAuth
    providers — Google, LinkedIn, Outlook — ship at launch.**
11. **Phone verification is ON at launch**, OTP via AWS SNS; TOTP stays primary 2FA.
12. **Active nav item = red icon + RED LABEL** everywhere.
13. **Radius is semantic:** `0` documents/title cards · `2` all functional chrome
    **and page content cards** · `12` layout cards **and overlay/modal cards** ·
    `20` drawer tops. **Controls inside a 12px overlay card stay 2px.**
14. **Shell geometry:** rail 64 · pane **390** · buffer **93** · content 800 at
    **x=547**. Pane-less (Welcome) content x=352.
15. **Mobile scaled-group artifacts:** keep the layout, use designed type and
    radius 2, let heights grow. Never reproduce fractional scaled values.

### Engineering
16. **NO hardcoded references.** No hardcoded domains, absolute roots, API URLs,
    keys or ports. Everything env/config-injected, all internal paths
    **relative** — re-pointing local → `new.caspr.ai` → `caspr.ai` must be a
    **config change, never a code change**. *(This was a direct complaint from
    Jayant about earlier work. Do not regress it.)*
17. **Code quality to Jayant's bar.** He is exacting and will read this. Idiomatic,
    documented, meaningfully tested — not test theatre.
18. **Security: assume you will be attacked.** Every request authed, short-lived
    JWTs, no secrets in the bundle, input validated, abuse-guarded. Sensitive
    data (analysis content, uploaded files) never touches the product-side layer.
19. **Performance:** no hung states. Every async path has loading, error and
    timeout states — they are already designed.
20. **Keep the contract current.** If the build changes the Jayant-facing shape,
    update `architecture-alignment-v4.md` / `api-spec-v1.md` and tell Joy
    immediately.

### Working style
21. **Ask when genuinely blocked; don't guess.** But do everything that isn't
    blocked first — log the blocker in `QUESTIONS-FOR-JOY.md` and keep moving.
22. **Report honestly.** If something is unverified, say so. Never claim a screen
    matches when it hasn't been measured.
