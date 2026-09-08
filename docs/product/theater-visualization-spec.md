# Theater / Source Web — Visualization Spec

**Status:** LOCKED — 2026-07-11 (Joy), built end-to-end as a live animated prototype before being written down here. Every value below traces to that working prototype, not to an idealized description.
**Scope:** The Learning Brain phase of the analysis lifecycle (`app-shell-framework.md §6`, "Theatre"). This is the single most important visual in the product — treat changes to it with proportionate care.
**Reads with:** `app-shell-framework.md` (shell, lifecycle, drawer), `visual-design-language.md` (Theater mode tokens, motion tokens), `architecture-alignment-final.md §9 Endpoint 2` (the real SSE event contract this eventually binds to).
**Ownership:** Built by us (Joy's team), in code. Not a Jayant handoff — Jayant's team supplies the source-stream events; we own the rendering entirely.
**v3 update — 2026-07-29 (Joy):** re-composed into the v3 product shell in Figma (`y2F394I4CwEeSzH2kKuDCt`) — **the stage is now WHITE, not near-black**, and desktop uses the three-zone rail·pane·centre shell. See **§12** for the full v3 delta; where §1–11 give a dark-stage colour or the old 880-column layout, §12 supersedes it. §1–11 remain the source of truth for the *composition logic and animation* (starfield, spokes, lock-in, flap engine, hub) — only the surface colour and the shell wrapping changed.

---

## 1. The concept

Caspr's Learning Brain identifies a shortlist of sources worth investigating for the topic, then reads through them, keeping what's useful. The visualization makes this literal:

- **The starfield** — a mathematically reduced representation of the full **25M+** universe of possible sources. Quiet, uniform, ambient. Never connects, never resolves, never changes color. *(Source universe raised 25M+ → 25M+ on 2026-07-29. The star count in §3/§11 is a fixed visual **density**, not a literal fraction of the universe, so it does not mechanically change with this number. But the larger universe may argue for reading as an even sparser/quieter field relative to the connected candidate spokes — i.e. proportionally **fewer connected nodes against a vaster ambient field**. Deliberately deferred: **revisit the star-count and candidate-ratio math after the app is built** and we can see it live, rather than re-deriving it now.)*
- **The candidate spokes** — the shortlist Caspr's Learning Brain has already identified as relevant to this topic. Connected to the hub by a grey line **from the very first frame** — this connection is the starting state, not something that draws in later. Investigation, not discovery, is what's being watched.
- **Locking in** — when a candidate yields something citable, its node and line flip from grey to red and settle. **Not every candidate spoke resolves.** Some sources get investigated and turn out to have nothing relevant — they stay grey, twinkling, forever "checked, nothing kept." This is true to how research actually works and must not be designed away.
- **The hub** — the hub is not "Caspr." It represents the topic itself — the thing all this investigation orbits.

---

## 2. Layout — two zones, never overlapping

The screen splits into two stacked, structurally separate regions. **The list is never layered over the graph** — that was tried and explicitly rejected; the graph must stay fully visible at all times.

| Zone | Share of screen (Compact reference) | Contents |
|---|---|---|
| Header | ~8.5% | Wordmark (left) + wallet balance (right). No context strip, no nav — Theatre is the one phase where chrome recedes furthest. |
| Counter | ~7.5% | Single large number, centred, directly below header. |
| **List zone** | **~29%** (target range: 25–35%, prefer the low end) | The flap row + the growing confirmed queue. Masked so entries fade out at *its own* bottom edge — never touches the graph's pixels. |
| **Graph zone** | **~48%** (the dominant region) | Starfield + candidate spokes + hub. Full brightness always. Undimmed, unobstructed. |
| Drawer (Peek) | ~7% | Handle only, in this phase. |

Ratios are derived from the working prototype (520px reference height); hold the *proportions*, not the raw pixel values, when adapting to real device heights.

**The fade mechanic:** the list zone has `mask-image: linear-gradient(to bottom, black 0%, black 60%, transparent 96%)`. As the queue grows and pushes entries toward the bottom of *its own* box, they dissolve there. This creates the illusion that the list sinks into the graph below, without either zone ever touching the other's pixels.

---

## 3. The starfield

| Property | Value |
|---|---|
| Count | ~46 on Compact (tune down to ~35 if crowded); more (~90–150) on Expanded — larger canvas, same density logic. Count is explicitly meant to vary by screen size. |
| Fill | `#9A968D` — chosen for contrast against the near-black stage; the darker grey used in earlier passes was too low-contrast to read. |
| Radius | 0.7–2.0px, varied per star for organic size variety ("like viewing the universe"). |
| Distribution | Scattered across the full canvas, **including close to the hub** — no large exclusion zone. Only constraint: keep a **~20–22px minimum clearance from hub centre** (covers the hub's radius at peak pulse + a safety margin) so no star ever visually touches the hub disc. |
| Drift | Continuous per-star jitter: `home + sin(t·f+phase)·amp` on both axes independently. Each star gets its own random phase (0–2π) and frequency (~0.1–0.3), amplitude ~1.0–2.2px. Never synchronized — that reads as mechanical. |
| Twinkle | Opacity breathes 0.16 → 0.62, `ease-in-out`, 2.5–3.8s duration (randomized per star), 0–2.2s staggered delay. Desynced — stars should never flash in unison. |
| Interaction | None. Never connects, never locks, never named. Pure ambient texture. |

---

## 4. Candidate spokes — the identified shortlist

| Property | Value |
|---|---|
| Count | 10 on Compact reference; scale with screen size like stars. |
| **Angular distribution** | **Evenly spaced around the hub** — 360°/N (36° for 10 spokes), offset by 18° from the cardinal axes so it doesn't read as a mechanical grid. This is what keeps candidates from clustering next to each other. |
| **Radial distribution** | **Deliberately varied, not a ring.** Radius should range roughly 40px (close) to 145px (near the canvas edge) across the set — mix short and long freely. At least 1–2 spokes should reach close to the canvas edge in each major region (this fixed a real "dead space at the bottom" problem in the prototype — check all quadrants, not just the ones that feel obviously empty). |
| Hub clearance | Same ~20px minimum as stars (trivially satisfied given the radius range above, but check when tuning). |
| Line, resting | Stroke `#4A4844`, width 1, opacity 0.6. **Present from frame one** — this is the starting state, not drawn in. |
| Node, resting (grey) | Fill `#6B6863`, radius 2.8px. |
| Node, resting breathing | Opacity 0.55 → 0.95, `ease-in-out`, 2.4–3.3s duration, staggered 0–1.7s delay. Narrower/brighter range than background stars — candidates should read as more present/considered than ambient texture. |
| Drift | Same jitter mechanism as stars, own phase/frequency, amplitude ~1.6px. **The connecting line's endpoints must be recalculated every frame** to track both the hub's current position and the node's current position — otherwise the line visually detaches from its own endpoints as they drift. |

### 4.1 Not every spoke resolves

Only a **subset** of candidate spokes are "resolvable" — i.e., eligible to ever lock red. In the prototype: 7 of 10 (70%). The remaining 3 are simply never included in the pool of nameable sources, so they twinkle grey indefinitely.

**Guidance for the real build:** this ratio should not be hardcoded. Once wired to Jayant's `notable_source_found` stream, the ratio emerges naturally from how many of the pre-identified candidates the Learning Brain actually finds something in. The design requirement is that **the system must support partial resolution as the normal case** — never force every spoke to eventually turn red.

---

## 5. Locking in — grey → red

Triggered when a source resolves in the list (§6) and its name matches a resolvable candidate spoke.

| Element | Before | After | Transition |
|---|---|---|---|
| Node fill | `#6B6863` | `#E8453C` (accent) | 0.4–0.5s ease-out |
| Node radius | 2.8px | 5px | 0.4–0.5s ease-out |
| Node animation | twinkling (spoketwinkle) | **removed entirely** — settles at opacity 1, steady | instant on lock |
| Line stroke | `#4A4844` | `#E8453C` | 0.5s ease-out |
| Line opacity | 0.6 | 0.85 | 0.5s ease-out |

**The steady-vs-twinkling contrast is semantic, not decorative:** twinkling = still being evaluated; steady solid red = confirmed and settled. Do not add motion back to locked nodes.

---

## 6. The hub

| Property | Value |
|---|---|
| Fill | `#E8453C`, always. |
| Base radius | 11px (Compact reference viewBox, 260px wide). |
| **Pulse** | **`transform: scale(1 → 1.12)` only.** 2.1s ease-in-out infinite. |
| **Opacity** | **Must stay fixed at 1.0, always.** |

**This is a confirmed, non-negotiable bug fix, not a preference:** an earlier version pulsed the hub's opacity, and because every spoke line converges exactly at the hub's centre point, a translucent hub let those line-stubs show through underneath it, breaking the illusion. Scale-only pulsing eliminates this regardless of paint order. Do not reintroduce opacity animation on the hub.

Drift: same jitter mechanism, smaller amplitude (~1.1px), own phase — subtle wobble, never fully static.

---

## 7. The flap / queue engine

One mechanism drives both the list and the graph. This is the core "engine" — build it once, skin it two ways (§8).

**Cycle, per source:**
1. Pick a name at random from the pool (resolvable spoke names + any "extra" names with no dedicated spoke — sources found organically, not pre-identified).
2. **Split-flap scramble:** the flap row cycles through random uppercase alphanumeric characters (spaces preserved) matching the target's length, for ~750ms (18 ticks × 42ms).
3. Snap to the real name. **Hold static for 1100ms** — long enough to actually read.
4. **Queue insert:** unshift the resolved name to the top of the confirmed list, pushing every existing entry down one position. If the name matches a candidate spoke, fire the lock-in transition (§5) simultaneously.
5. Pause 150ms, then repeat immediately. Never idle.

**Ordering principle:** newest confirmed source is always at the top; the *oldest* confirmed source is always the one furthest down the list, since every new entry pushes from the top. ("First one goes to bottom of the list.")

**Queue cap:** retain a maximum of ~10 entries in the prototype; older ones drop off. In production, size this to whatever the visible zone plus fade-mask buffer needs, not a business-logic limit.

---

## 8. Two skins, one engine

The exact same queue state renders two ways depending on how much room is available:

| State | Graph | List |
|---|---|---|
| **Peek** (default) | Full starfield + spokes + hub, at the ~48%-height zone described in §2 | Compact, ~29% zone, masked/fading at its bottom edge |
| **Expanded** (drawer pulled up) | **Removed entirely** | Expands to fill the vacated space (~81% of screen in the prototype), mask removed — becomes a plain, fully legible list |

**Architectural note:** the list is *centre content*, never drawer content — this was explicitly corrected mid-design. What actually happens is that the Work Card (bottom drawer, per `app-shell-framework.md §5`) claims more vertical space, and the centre content must reflow to fit what's left. The reflow rule is: **drop the graph first** (it's the replaceable, decorative layer); if centre height falls below a threshold, show list-only. This should be implemented as a real reflow response to available centre height, not a hardcoded coupling to a specific drawer detent — though a direct state-binding (drawer detent → centre mode) is an acceptable first pass if reactive layout isn't ready.

**Open:** the exact trigger for pulling the drawer up during Theatre (auto vs user-initiated, and under what condition) is explicitly deferred — "we can discuss what we need at the time" (Joy). The *resulting* visual behavior above is locked; the trigger is not.

---

## 9. Mapping to the real API (Endpoint 2, source-stream)

The prototype simulates all of this with `setInterval`/`Math.random`. Production replaces the simulation with the real SSE contract already defined in `architecture-alignment-final.md`:

| SSE event | Drives |
|---|---|
| `total_sources_reviewed` | The counter — direct 1:1, replaces the prototype's random increment. |
| `notable_source_found` | The flap/lock mechanism. Event provides a name → triggers the flap cycle with that name as target → on resolve, locks the matching spoke if one exists, otherwise just joins the list as an "extra." |
| `source_category_activated` / `source_category_progress` / `source_category_completed` | Not yet wired to a specific visual. Candidate spokes are currently assumed to be a **fixed set, present from the first frame** (per §1 — the shortlist is the starting state, not progressively revealed). **This assumption needs reconfirming against how the Learning Brain actually sequences category activation** once the real stream is live — it may turn out categories activate progressively and spokes should appear as they do, which would be a real (if modest) change to §4. |
| `cross_reference_detected` | **Not used in v1.** Natural future enhancement: draw a secondary line directly between two already-*locked* (red) spokes when Caspr detects they corroborate each other. Explicitly out of scope for the first build. |
| `layout_ready` | Ends the Theatre phase; triggers the transition into Layout Canvas. **The Theatre → Layout Canvas handoff motion itself is not designed yet** — separate task. |

---

## 10. The wordmark

Use the approved logo asset (`assets/logo/caspr-logo-*.svg` — Instrument Serif, outlined to vector paths, synthetic bold stroke, geometric red-dot period; see `project-caspr-logo.md`). For Theatre's always-dark stage: recolor the letterform paths to a light tone (`#F5F4F0`) — the red dot is independently defined with its own `fill="#E8453C"` and is untouched by this recolor. This is a straight recolor of the exact approved geometry, per the master file's documented purpose (`currentColor` → recolor to black/white/ghost from one file) — not a new variant.

Placement: hard left-aligned, vertically centred in the header zone. **On Expanded, when the left rail is hidden (Theatre only), the logo and wallet must still anchor to the true outer-frame edges** (e.g. `x=20` from the real left edge, matching the rail's own left-padding convention) — **not** be inset inside the 880px centre column's own header/context-bar coordinate space. The persistent brand mark belongs to the container, not to per-screen chrome; building it inside the column reads as a separate, disconnected "mini header" rather than the same app frame with the rail temporarily hidden.

---

## 11. Expanded (Desktop) layout

Built and confirmed live in Figma (`Theater — Source Web — Expanded`, file `y2F394I4CwEeSzH2kKuDCt`) — same care as the Compact build, several rounds of correction included below because they're genuinely non-obvious.

**Split:** the 880px centre column divides **25:75** — **narrow list column on the LHS (~210px), wide graph zone on the RHS (~638px)**, with a ~32px gutter between them. (Explored and explicitly rejected: LHS-graph/RHS-list, a near-even 44:56 split, and constraining the graph to a "squarish" shape — none of these held; the locked version is list-narrow-left, graph-wide-right.)

**Height — the composition uses the FULL available centre height, not half.** Both zones span the entire `Content` frame height (768px at the 900px Expanded Shell reference), the same height every other Expanded screen gets between header and drawer-at-Peek. Do not pre-shrink the visualization to reserve empty space for the drawer "just in case" — that was tried and was visibly wrong (dead space with nothing in it, even at the drawer's normal small Peek state).

**This produces a deliberate divergence from Compact's behavior, not an inconsistency:**

| | Compact | Expanded |
|---|---|---|
| Graph vs list arrangement | Stacked vertically, sharing scarce screen height | Side by side — no vertical contention between them |
| When drawer claims more room | **Reflows**: graph drops entirely, list expands to fill the vacated space (§8) | **Overlays**: drawer simply covers whatever portion of the (already full-height) composition sits beneath it |

Reflow exists on Compact because vertical space is genuinely scarce and contested. Expanded doesn't have that problem — width is abundant, so graph and list never compete for the same space, and there's no reason to shrink the visualization pre-emptively for a drawer state (Half/Full) that Theatre reaches only if a user deliberately pulls to it. Do not port the reflow behavior to Expanded; let the drawer cover.

**Starfield:** generate via **grid + jitter**, not hand-placed points — divide the zone into roughly 11×9 cells, place one star per cell at a random offset up to ~70% of the cell size, skip any cell landing within ~50px of the hub. This produced ~97 stars at the 638×768 reference size and is the right approach *because* it scales cleanly to other canvas sizes — don't hand-list coordinates for Expanded canvases.

**Spokes: 20 on Expanded (double Compact's 10).** Position by real trigonometry, not by eye:
- Angle: `9° + i·18°` for `i = 0..19` (18° = 360°/20; the 9° offset avoids landing on the cardinal axes — generalizes to `(180/N)°` offset for N spokes).
- Radius: a **varied base value per spoke** (the reference set ranges 55–200), not a uniform ring.
- **Elliptical, asymmetric scale** to fit a non-square, non-centred zone: `scaleX ≈ 1.3` throughout; `scaleY` differs by hemisphere because the hub sits well above zone-centre — **2.4 for the lower half** (`sin(angle) ≥ 0`, ~548px of room) and **0.85 for the upper half** (`sin(angle) < 0`, only ~200px of room). Using one uniform scale for both directions either clips the top or leaves the bottom half-empty — check the actual room available in each direction before picking a scale, don't assume symmetry.
- Locked/idle ratio holds at **~70/30** (14 of 20 locked in the reference) — same ratio as Compact, confirming this is an archetype-independent rule (§4.1), not a Compact-specific tuning.

**List column at full height** naturally shows more rows before its fade-mask kicks in (10 in the reference, vs Compact's visible ~4) — row count is a function of available height, not a fixed number to hardcode.

**Implementation gotcha (found while building the reference, not a design rule, but worth flagging):** if the Theater screen is built by detaching an instance of a shared shell component, check whether that component's root frame still carries `layoutMode` from its original construction (ours had inherited `HORIZONTAL`, used originally to centre the rail + column). An inherited auto-layout on the frame will **silently override** any explicit x/y set on direct children — this is exactly what caused the logo/wallet to keep snapping to the wrong position regardless of what was set. Set `layoutMode = NONE` on the detached frame before positioning direct children freely.

---

## 12. v3 rebuild — WHITE stage + three-zone shell (Figma, 2026-07-29)

Re-composed into the v3 product shell. Frames: **mobile immersive `724:2` · mobile get-to-know carousel `756:2` · desktop `762:2`** (file `y2F394I4CwEeSzH2kKuDCt`, page *Report Creation* `184:2`). The composition *logic* and *animation* (§1–11) are unchanged and still bind to the SSE stream (§9); what changed is the **surface colour** and the **shell wrapper**.

### 12.1 White stage — colour remap
Joy chose the WHITE variant over the dark stage (the one full-screen dark moment read as jarring in an otherwise white/canvas app; the red graph reads as *analysis*, not spectacle, on white). Every "on near-black" value in §3–6 inverts:
- **Starfield / idle spokes / grey candidate nodes:** the light-on-dark greys (`#9A968D`, `#4A4844`, `#6B6863`) become **light grey on white** — ambient starfield ≈ `#D1CFCC` (~0.82), idle spoke lines ≈ `#D0CFCC`, grey candidate nodes ≈ `#C2C1BB` (~0.76). Visible but quiet against white.
- **Hub · locked nodes · locked spokes:** **red `#E8453C`, unchanged** (reads cleanly on white).
- **Counter + source list text:** **ink `#1A1A17`** (was light).
- **Wordmark:** standard dark "Caspr." — the §10 light-recolor for the dark stage does **not** apply on white.
- **Build gotchas:** (a) the dense graph is a clone of the approved **`Graph Zone (LHS, square)` `339:1613`**; recolour = non-red fills/strokes → light grey. (b) The starfield "stars" are `Ellipse`-inside-`INSTANCE` nodes — the **instance frame's own square fill must be stripped (`fills = []`)** so only the round ellipse renders; leaving it makes them read as grey *squares* (contradicting §3's circular dots). (c) A few source-node instances resist recolour (locked component fills) — recolour the component or accept a couple of stray darker dots.

### 12.2 Desktop shell — supersedes §11's single 880 column
v3 desktop is **rail (64px, icon + label) → pane (360px) → centre (800px @ x=532)**:
- **Pane = the get-to-know-you engagement carousel** (education / MCQ / feedback **pills at 2px radius**, `WHILE CASPR WORKS` function-eyebrow at y=68, `‹` back-chevron right-aligned in that row, **pagination dots pinned to the pane bottom**). This is the "while the machine works" layer — *not* part of the graph composition. White drawer/pane (carousel is not the Ask-Caspr prompt surface).
- **Centre (800px) = the visualization:** the **count hero** (big DM-Mono number + `SOURCES REVIEWED` eyebrow-label, top-left — **relocated out of the title** vs §2's "counter directly below header"), the **source list** as a left column, and the **dense graph right-aligned to the section's right edge**, sized **~80%** so it doesn't overbear.
- **Fade is HORIZONTAL on desktop:** a white linear-gradient overlay between list and graph, transparent→opaque left→right, so long source names read as sliding *behind* the graph. §2's **vertical** `mask-image` still governs the **mobile stacked** layout (list fades down into the graph).

### 12.3 Title / stage — the eyebrow carries it
The Theater now wears the standard dark eyebrow title card; eyebrow = **`MARKET ANALYSIS · STUDY · LEARNING`** (`Type · Depth · Stage`, per `analysis-taxonomy`). The **stage word names the brain in action**: **`Learning`** = Learning Brain / source-gathering (this frame) vs **`Analyzing`/`Thinking`** = Thinking Brain. It settles to `Market Analysis · Study` at rest. (No separate STUDY badge — the depth folds into the eyebrow.)

### 12.4 Two mobile states
- **Immersive `724:2`** — header kept, **nav hidden**, count hero + list + graph + a closed peek drawer at the bottom. The impact moment.
- **Get-to-know `756:2`** — header + nav restored and the **white engagement-carousel Half drawer** rises (the ~3–5s follow-on). Both states share the *same stable title* so the top doesn't bounce as the sequence advances.

### 12.5 Still deferred at v3
The live animation (§3–7) is **spec-only in Figma** (static frames); it binds to the real SSE stream at code-build time, unchanged. The Theatre→Layout transition motion is still undesigned (§9 `layout_ready`).

---

## Open / parked

- **Drawer-pull trigger** for the list-only transition (Compact) — mechanism (auto threshold vs explicit user action) not decided.
- **Progressive vs fixed candidate spokes** — reconfirm against real Learning Brain category-activation sequencing once source-stream is live; may require spokes to appear over time rather than all at once.
- **Theatre → Layout Canvas transition motion** — not designed.
- **`cross_reference_detected` visualization** — parked as a v1.1+ enhancement, not v1.
- **Foldables / tablets** — not tuned; per `app-shell-framework.md §9` these map to Compact or Expanded by width, not their own third design.
- **Star-count + candidate-ratio math for the 25M+ universe** (§1) — deferred to post-build; revisit once the graph is live to decide whether a vaster universe should read as proportionally fewer connected nodes against a sparser field.
- **White-stage live animation** — §3–7 motion values were tuned against the dark stage; re-check twinkle/lock-in opacity ranges read correctly on white once animated in code (static Figma frames don't exercise this).

---

*Document: theater-visualization-spec.md · Owner: Joy · Locked 2026-07-11 · v3 white-stage + shell update 2026-07-29 (§12, 25M source universe).*
*Reference implementation: the live animated prototype built across this session's visualize-widget iterations (v1 → v11) — every parameter above traces to that working code, not to a description written after the fact.*
