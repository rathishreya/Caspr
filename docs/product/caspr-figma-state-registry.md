# Caspr App — Figma State Registry (reference only, no plan)

Factual snapshot for resuming work. Figma file key **`y2F394I4CwEeSzH2kKuDCt`**.
Mandatory: invoke the **`figma-use`** skill before every `use_figma` call.

## Pages
| Page | id |
|---|---|
| 📝 Report Creation (all v3 work) | `184:2` |
| 🧩 Components — Core | `1:3` |
| 🎨 Tokens & Variables | `0:1` |
| 📦 Archive 2 (old frames + superseded components) | `942:2` |
| 🧭 Exploration · Mobile + Desktop | `71:2` |

## Frame node IDs (page 184:2)
**Working cluster — Desktop v3**
- Ask Caspr `810:2147` · Versions `831:2227` · Edit `837:2331` · Generate Output `923:2405`
- Documents `843:89` · Profile `847:2392`

**Report-creation flow — Desktop v3 / Mobile v3**
- Welcome `638:2` / `637:2` · Conversation `640:2` / `639:2` · Layout `692:2` / `694:2`
- Gate `708:2` / `722:2` · Theater `762:2` / `724:2`+`756:2` · Generation `775:2` / `777:83`

**Working cluster — Mobile v3 (first drafts)**
- Ask Caspr `944:1394` · Versions `946:1492` · Welcome·All-analyses (expanded) `965:1587`

## Component IDs
- Action Overlay v3 (switcher: Contents·Ask·Edit·Versions) `635:9`
- Screen Title — Dark v3 `659:2`
- Version Row v3 `926:2491` · Output Card v3 `926:2495` · Filter Pill v3 `926:2503` · Output Config Card v3 `929:2`
- Recent Analysis List Row (Welcome light-row, the chosen list style) `673:2`
- Docked Input Bar `217:339` · Drawer — v3 (white) `628:5` · User Bubble `145:20` · Suggestion Item v3 `634:16`
- Rail — v3 (slim) `626:76` · Bottom Nav — v3 `625:2` · Header — Mobile v3 `628:25`
- Red Dot Marker v3 `636:22` (exists, unused) · ToC Row v3 `635:34` (exists, unused)
- Search Field v3 `636:16` · Log Entry Row v3 & Output Version Row v3 = SUPERSEDED (in Archive 2 `636:12`/`636:3`)

## Locked decisions (full text in memory files)
- **Shell:** rail 64 + pane 390 + buffer 93 + content 800 + buffer 93 · content x=547 · pane heading top = divider top **y=68** · pane content start = Docs-glyph top **y=112**.
- **Background (both breakpoints):** drawers/panes **white** · centre = **`#f6f5f3`** desk · report = **white page** on desk. (No grey drawer anymore.)
- **Switcher:** Contents · Ask · Edit · Versions. **Ask = pure ask** (query only). **Edit = own surface** (contextual menu + own rewrite prompt + Save/Discard → new version). Chevron in switcher.
- **Versions:** one chronological timeline — versions = plain rows, outputs = bordered cards; divider only between two consecutive version rows. Outputs are version-pinned + generated on command (can be stale). `+Generate` (heading line) → Generate-Output frame (Gate-1 style: per-output cards → total → Generate).
- **Pane heading style:** Inter Semi Bold 14 · UPPERCASE · dark grey `{0.28,0.275,0.26}` · tracking 0.3px.
- **Four thread treatments:** reply = Inter, secondary grey `~0.36` · nudge = Suggestion Item `↳`, near-black · citation = Inter *italic* grey (red-dot triggered) · notification = Inter Semi Bold 9 UPPERCASE tracked between hairlines. No repeated "CASPR" label (alignment distinguishes speakers).
- **Back-chevron:** drill-in only; sits on heading line and moves with it.
- **Fonts:** Instrument Serif = display/section-title · Inter = UI/pane-headings/body · **DM Mono = figures ONLY**.
- **Citations = inline pulsating red dots** (click → scoped Ask answer). Full source list = report's last card. No numbered citations, no Sources view.
- **HARD RULE:** clone/reuse/component existing elements — never hand-rebuild.

## Current state / open items (factual)
- Mobile drafts exist only for Ask, Versions, and expanded-Welcome. No mobile for Edit / Documents / Profile / Generate.
- Mobile Ask/Versions drawers = `Drawer — v3` shell instance behind a transparent content frame; other hand-built mobile content is NOT yet on components.
- Contents (ToC) pane state not built. Red-dot citations are hand-drawn ellipses (Red Dot Marker component unused).
- Only spreadsheet in repo: `content/caspr-help-content-repository.xlsx` (help content — NOT a screen list).
- Old frames + superseded components live on 📦 Archive 2 `942:2`.
