# Pixel-fidelity audit — protocol & checklist

**Prepared 2026-08-19, to run when the code lands.** Objective: **is the build pixel-identical to the Figma?** Every gap gets categorised and routed.

Reference for all expected values: [`DEV-BRIEF.md`](DEV-BRIEF.md). Figma `y2F394I4CwEeSzH2kKuDCt`.

---

## 1 · Severity taxonomy — and who owns each

| Severity | Test | Owner |
|---|---|---|
| **CRITICAL** | The value is specified **unambiguously** in `DEV-BRIEF.md` or a living spec, and the build differs. Pure execution error. | **Dev** — fix the build |
| **MEDIUM** | The build differs **and** the spec is silent, ambiguous, self-contradictory, or the value existed only implicitly in Figma and was never written down. | **Us** — fix `DEV-BRIEF.md` first, *then* the build |
| **LOW** | The difference is a **consequence of defined behaviour** (scroll state, live data, API-authored copy, accepted clipping, responsive reflow). | **Nobody** — record and close |

**Fourth outcome I will flag explicitly, not force into the three: `REVERSE` — the build is right and Figma is wrong.** It happens, and silently "fixing" the build to match a stale frame would be the worst result of this audit. These route back to the design session.

Every MEDIUM is a defect in the handoff I consolidated — that's the point of separating them from CRITICAL. The count of MEDIUMs is the score for the brief, not for the dev.

---

## 2 · Inputs & setup

- **Code** — GitHub repo (read for intent: tokens, component props, layout constants).
- **Running app** — the authoritative source for *rendered* truth. I measure with `getComputedStyle` / `getBoundingClientRect`, not by eye; screenshots cannot distinguish `#1a1a17` from `#2a2927`, or 16px from 19px.

**Needed from Joy:** the repo URL/branch · the localhost URL · which states the **proxy APIs** can actually reach (see §7).

**Viewports — measure at exactly these, they are the Figma frame sizes:**
- Desktop **1440 × 900**
- Mobile **390 × 844**

---

## 3 · Pre-flight — run first, stop if it fails

A failure here invalidates every downstream measurement and would generate a page of phantom findings.

0. **ESTABLISH A SESSION FIRST.** ⚠️ *Added 2026-08-20 — this omission produced three false CRITICALs in the first run.* The rail, bottom nav and mobile header are gated on `session` (`AppShell.tsx:62`). Signed out, the desktop shell collapses and **every x-offset reads 64 short**. Plant one before measuring anything:
   ```js
   localStorage.setItem('caspr.session', JSON.stringify({
     access_token: 'dev', refresh_token: 'dev',
     expires_at: new Date(Date.now() + 86400000).toISOString(),
     user: { id: 'dev-user', email: 'joy@caspr.ai', name: 'Joy' }
   })); location.reload();
   ```
   Then **confirm** the session took: the rail must be present at `x=0 w=64` and `main` at `x=64`. If it is not, stop — every subsequent measurement is invalid.
   *(The signed-out shell is a legitimate state in its own right — see the onboarding frames — but it must never be compared against signed-in frames.)*
1. **Fonts actually loaded** — `document.fonts.check()` for **Instrument Serif**, **Inter**, **DM Mono**. **A font not yet used on the page reports `unloaded` and `FontFace.load()` may throw — that is not a defect.** Verify by measuring a *rendered* element against a forced-fallback span, on a page that actually uses the face. A silent fallback shifts every metric; a false alarm wastes a round.
2. **Viewport is exact** (no browser zoom, no devicePixelRatio surprise).
3. **Token layer present** — the four newest variables exist: `--color-fill-track` `#e5e5e3` · `--color-fill-chip` `#ededeb` · `--color-text-label` `#474642` · `--color-accent-pressed` `#be3530`.
4. **Reduced-motion off** (unless testing that path).

---

## 4 · Layer A — deterministic checks (mechanical, highest signal)

Run these globally before looking at any screen. Each is objectively pass/fail.

### 4.1 Colour tokens (`DEV-BRIEF` §1.1)
`#1a1a17` primary · `#333330` report body · `#5c5b58` secondary · `#6b6b66` muted · `#474642` label/eyebrow · `#8a8a85` metadata · `#9c9b98` tertiary · `#a5a29d` disabled · `#b8b5b0` pending · hairlines `#e2e1de` / `#e0ded9` / `#ececea` / `#d6d4cf` · fills `#e5e5e3` / `#ededeb` · accent `#e8453c`, pressed `#be3530` · `credit-green` `#1a7f4b` **on signed ledger amounts only**.
**Flag:** any hand-typed off-token hex; green used for anything but a signed amount; The Signal's cool greys (`#6b6a78` / `#8b8a96`) warm-merged.

### 4.2 Radius (§1.2)
**0** documents / dark bars / bands / rules · **2** *all* chrome **and** content cards · **12** overlay only (modal, confirm, popover) · **20** drawer top · off-scale for pills/toggles/dots.
**Flag:** a content card at 12 (common slip — it was the old rule and is explicitly superseded).

### 4.3 Typography (§1.5, §2.4)
- **Every figure in DM Mono Medium** — prices, balances, counts, data points. *The single easiest miss.*
- Instrument Serif **never** in nav/wayfinding.
- Conversation text **Inter 13 / line-height 19**.
- Body copy auto-height (no fixed-height body boxes).

### 4.4 Geometry
- Conversation column **x=80 desktop / 16 mobile, width 358**, sharing the prompt bar's left edge.
- Docked input **pinned**; mobile drawer-relative **y=314**.
- Drawer detents **94 / 408 / 760** only — no content-sized heights; one **top-edge-only** border `#e0ded9`; handle 44×5 r2.5 y12 `#c7c4bf`.
- Dark title/cover bars **h58, r0, `#0b0b09`**.
- Scrims: mobile 42% black **y52 h736**; desktop full-viewport. Drawer gets a scrim **⟺** its desktop counterpart is a scrimmed modal.
- **The nav is visible at every detent, Full included.** Hidden only in document read-mode and the Theatre.

### 4.5 Spacing (§2.4)
heading→first message **16** · between turns **16** in pane/drawer (**24** only in the 800px centre) · paragraph in one message **8** · message→its stack/list **12** · between stack/list items **8** · hairline→phase-marker **12**.

---

## 5 · Layer B — the conversation system (most likely source of MEDIUM)

This changed on 2026-08-19, so it is the least-settled area and the one where the prompt may have lagged the design.

- [ ] **Two voices distinct** — Caspr upright Inter (nudge `#1a1a17` / reply `#5c5b58`); Product **italic + 7px grey outline dot `#8a887f`** (engaging `#34332f` / quiet `#5c5b58`).
- [ ] **Dot is inline, not a bullet** — wrapped lines and later paragraphs of the same turn run **flush left**; first line indented 18. **Not a `<ul>`.**
- [ ] **One mark per turn**, not per line.
- [ ] **Red ● reserved for citations / Ask-Caspr** — never the product mark.
- [ ] **Phase markers** = full-width hairline **then** the product-voice line beneath, left-aligned, sentence case. No centred caps between hairlines.
- [ ] **Alignment** — Caspr *and* Product always left, full width, un-bubbled. **Only the user is right-aligned**, hug-width bubble.
- [ ] **User bubble** — Regular when typed, **Italic when it echoes a tapped option/poll**.
- [ ] **Pinning** — heading + selection indicator pinned; proposal cards, intent pills, connectors, chips all **scroll**.
- [ ] **`Or just ask` / `Or steer by intent`** render as product voice (sentence case, dotted), **not** caps labels.
- [ ] **Italic exclusivity** — gate parameter values and the citation scope line are **Regular**.
- [ ] **No `↻ x/10` counter anywhere**; no budget bar/meter; `＋ Generate bespoke` carries no "· 1 revision".

---

## 6 · Layer C — screen-by-screen

Priority order: **P1** conversation system (most churn) → **P2** converged pages (expect CRITICAL-or-nothing) → **P3** the rest.

### P1 · 📝 Report Creation (`184:2`)
| Screen | Desktop | Mobile |
|---|---|---|
| Welcome | `638:2` · panel open `1037:1871` | `637:2` · all analyses `965:1587` |
| Conversation | `640:2` | `639:2` |
| Layout Canvas | `692:2` · Learning `2138:4416` | `694:2` · Learning `2139:4497` |
| Gate | `708:2` · tier-change `1472:2` · insufficient budget `1814:2` | `722:2` |
| Theater | `762:2` | white `724:2` · get-to-know `756:2` |
| Generation | `775:2` · Creating `2186:4565` · failed `1827:2` · failed+support `2044:9` | `777:83` · Creating `2187:4708` · failed `2002:2` · failed+support `2011:11` |
| Ask Caspr | `810:2147` · 2-turn `2211:4828` | `944:1394` · 2-turn `2214:4957` |
| Edit — Chart | `1131:2455` | `1275:2860` |
| Edit — Visual·Cover | `1131:2668` | `1275:2968` |
| Edit — Visual·Infographic | `1395:2` | `1422:2` |
| Edit (base) | `837:2331` | `1138:2734` |
| Contents | `1446:2` | `1452:2` |
| Generate Output | `923:2405` · add output `1500:2` | `1283:3112` |
| Versions | `831:2227` | `946:1492` |
| Updates *(Phase 2)* | `1099:2` | `1120:2295` |
| Edit-budget refs | State 2 `2304:5072` · edge-prompt `2306:5213` | State 2 `2309:5354` · edge-prompt `2310:5470` |
| Chart marks | `2123:4416` (9 `thumb/<kind>`) | — |

### P2 · 📁 Documents (`184:4`) — converged
Documents `843:89` / `1280:196` · selection `2229:2680` / `2256:2868` · Archived `2266:3233` / `2268:3321` · Archived empty `2273:3425` / `2274:13877` · empty `1803:2` / `1846:51` · loading `1832:113` · no-results `1824:2` · filters sheet `2271:3373` · delete single `2264:3003` · delete bulk `2199:12923` / `2207:2629` · Document View `1848:2` / `1849:2` · cover-card status ref `2291:3553`.

**Data Room:** `1756:2` / `1766:2` · selection `2242:2777` / `2258:2927` · empty `1805:2` / `1808:2` · loading `1832:2` / `2072:2278` · search results `1851:2` / `2071:2215` · no results `1812:2` / `2073:2337` · upload failed `1809:2` / `1824:197` · uploading `1791:2` / `1796:2` · add files `1768:2` · delete file `1775:2` / `1784:290` · delete bulk `2264:13646` / `2264:13822` · reset `2199:12745` / `2206:5607` · feature-locked `1885:2` / `1885:109`.

**Also:** More overflow `1236:2860` · sign-out `1248:104` · **Toasts `1922:2` / `1928:76` are component demos, not screens.**

### P2 · 👤 Profile & Wallet (`184:5`) — converged
Wallet `1532:2` / `1571:2` · plans drawer `1581:2` · no transactions `1830:2` · **top-up `1854:2` / `1857:2` · custom `1887:2` / `1888:2`** · success `1855:2` / `1858:2` · payment failed `1855:230` / `1858:175` · billing `1878:2` / `1878:135` · Account `1596:2` · mobile sections (Details `1697:76`, Research profile `1680:2`, Security `1686:2`, Notifications `1680:211`, Preferences `1680:312`) · Help `1711:2` / `1712:2` / `1713:2` · scoped-reset confirms `2195:2927` / `2206:3001`, `2199:12745` / `2206:5607`.

### P3 · 🚀 Onboarding (`184:3`)
Login `1167:146` / `1286:377` · first-time `1170:146` / `1289:377` · conversation+layout `1301:3280` · gate+theater `1177:3075` / `1302:397` · signup overlay `1182:127` / `1303:429` · email sent `1183:252`.
**Note:** Onboarding is the reference for the **centre** rhythm — turn gap **24**, not 16. Do not flag that as a deviation.

### Not built — do not audit
📊 **Insights (`184:6`)** — Phase 2/coming-soon. Base frames only.

---

## 7 · Pre-registered expected differences — do **not** file these

| Expected difference | Why |
|---|---|
| **Caspr's dialogue text** differs from the frames | It is Jayant's API output; frames hold *samples*. Check the *treatment*, never the words |
| Live/proxy data vs sample figures ($80, 4,271, 57 pages, dates) | Sample content |
| **Scroll position** in any thread | Figma frames are static snapshots of a scrolling surface |
| Three mobile drawers clipping at the pinned input (`Ask Caspr — Mobile`, `Generation — Mobile · Creating`, State-2 ref) | Joy reviewed and accepted; thread exceeds a Half drawer and clips cleanly |
| Widths between 390 and 1440 | Figma shows representative widths; reflow is CSS |
| Any state the proxy can't reach | Log as **unverified**, not as a pass |

---

## 8 · Finding format

```
[SEVERITY] Area · Screen (Figma node) — one-line claim
  Expected : <value> (source: DEV-BRIEF §x / living spec)
  Actual   : <measured value> (how measured)
  Impact   : what the user sees
  Route    : dev fix | spec fix + dev fix | record only | back to design (REVERSE)
```

Findings ordered **CRITICAL → MEDIUM → REVERSE → LOW**. Grouped by area, because one root cause (e.g. a wrong token, a `<ul>` for the product voice) usually explains many symptoms — I'll report the cause, not 30 instances of it.

---

## 9 · Coverage ledger

The audit output ends with an explicit list of **what was not verified and why** — unreachable states, missing routes, components not yet built. A silent gap reads as a pass, and that is the failure mode worth guarding against.

---

*Prepared by the design session, 2026-08-19. Method: measure, don't eyeball. Report the cause, not the symptom count.*
