# GTM Portal — Design Spec

**Figma:** [`Caspr — Team Portal`](https://www.figma.com/design/FIMPfQJiZKNGK0zBYCG3Wi) · file key `FIMPfQJiZKNGK0zBYCG3Wi`
**Functional spec:** [`portal-build-spec.md`](portal-build-spec.md) — *what it does.* This file is *what it looks like and why.*
**Operating manual:** [`operations-runbook.md`](operations-runbook.md)

*Version 2 — 2026-08-20. Written after four screens; §5 added after ten, when the navigation was restructured by workstream.*

---

## 1 · The position

**Same family as the Caspr product. Unmistakably not the product.**

Nobody using both should ever be unsure which surface they are on — but nobody should doubt they came from the same company. Every decision below serves one of those two.

**The test.** Screenshot any portal screen and any app screen, shrink both to 200px, show them to someone who uses both. They should identify each instantly, *and* say they are from the same company. If either half fails, the design is wrong.

### What stays identical — this is the family

Wordmark · the three type families · `#E8453C` exactly · the 0/2 radius scale · the spacing scale · icon construction rules · button geometry.

### What changes — this is the discrimination

| | Decision | Why |
|---|---|---|
| **1** | **Dark-first ground.** `#0C0B09` is default. The app is white chrome | Recognition inside 100ms, before a word is read. Also correct for an operations console people stare at, versus a document they read |
| **2** | **No display serif in the interface.** Inter and DM Mono only. Instrument Serif appears exactly once, in the wordmark | Changes the register from editorial to operational while every glyph still comes from the same family |
| **3** | **Two shell zones, not three.** Left nav plus one work area. The app is rail + pane + centre | Structure is what people navigate by. Different silhouette even as a blurred thumbnail |
| **4** | **Red is re-semanticised.** In the app red means *citation*. Here it means **attention** — rejected, stale, over threshold, defect | Same pigment, different job. Using it for both would actively confuse someone who uses both surfaces |

**Plus one explicit marker:** the wordmark is followed by `TEAM` in DM Mono, uppercase, letterspaced, in `text/tertiary`.

### The nuance on rule 3

The Review Item screen shows content and its checks side by side — because the task genuinely requires it. **That is not a third zone.** The facts panel lives *inside* the review card, on a tinted sub-surface, so it reads as one object. The shell stays nav + work area. Do not promote it to a shell-level column.

---

## 2 · Surface semantics — the rule that carries the most meaning

> **White means: this needs your decision. Dark means: this is yours to use.**

The content awaiting judgement sits on paper. Everything else — suggestions, lists, metrics, navigation — recedes into the ground. This reads without a legend, and it maps exactly to the runbook: personal comments do not pass the review gate, so they must not look like they are waiting on you.

**Consequences, applied consistently:**

- Review Item — the post is white. The nav, header and actions are dark
- Personal Queue — the post needing approval is white. Comment suggestions are `surface/raised`
- Ledger, Dashboard, Paid — **entirely dark.** No content is being judged, so nothing is white
- Action buttons sit on the dark ground *below* the card, not inside it — the console acts on the artefact

**Do not use white for emphasis.** It has one meaning and spending it elsewhere destroys the semantic.

---

## 3 · Tokens

Two variable collections. Values are canonical; do not hardcode hex.

### Portal / Colour

| Token | Value | Use |
|---|---|---|
| `surface/base` | `#0C0B09` | Default ground |
| `surface/raised` | `#161512` | Cards, tiles, panels, active nav row |
| `surface/hover` | `#211F1C` | Hover |
| `surface/card` | `#FFFFFF` | **Content under judgement only** |
| `surface/card-sub` | `#F6F5F3` | Tinted panel inside a white card |
| `border/default` | `#2E2C28` | Dividers, panel borders |
| `border/strong` | `#403E39` | Emphasised |
| `border/card` | `#E2E1DE` | Borders on white |
| `text/primary` | `#F5F4F0` | Primary on dark |
| `text/secondary` | `#9C9A94` | Supporting |
| `text/tertiary` | `#5C5A55` | Mono labels, meta |
| `text/on-card` | `#0A0A0A` | Primary on white |
| `text/on-card-sub` | `#5C5B58` | Supporting on white |
| `accent/attention` | `#E8453C` | **Attention only.** Never decoration, never a category |
| `accent/hover` | `#F05048` | |
| `accent/wash` | `#2A1512` | Tinted attention ground |

### Portal / Space

`space/1–8` = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 — the app's scale, unchanged.
`radius/none` = 0 · `radius/sm` = 2 — the app's scale, unchanged. **No other radii.**

### Type ramp — text styles

| Style | Family | Size / LH | Use |
|---|---|---|---|
| `Title / L` | Inter Medium | 20 / 28 | Screen title |
| `Title / M` | Inter Medium | 16 / 24 | Panel title |
| `Body / M` | Inter Regular | 14 / 20 | Default |
| `Body / S` | Inter Regular | 13 / 18 | Supporting |
| `Label` | Inter Medium | 12 / 16 | Buttons |
| `Meta` | DM Mono Regular | 11 / 16, +4% | Channel tags, timestamps, mono labels |
| `Meta / Bold` | DM Mono Medium | 11 / 16, +4% | Section labels, values |
| `Data / M` | DM Mono Medium | 14 / 20 | Inline figures |
| `Data / L` | DM Mono Medium | 28 / 32 | Stat-tile numbers |
| `Wordmark` | Instrument Serif | 20 / 24 | **The only serif use** |

**DM Mono is numbers, codes, timestamps and short uppercase labels. Never prose.** Inter never carries a metric that sits alone.

---

## 4 · Icons

**Construction convention lifted from the product app**, `y2F394I4CwEeSzH2kKuDCt` › `🧩 Components — Core`, read from the real glyphs:

> **24 × 24 · VECTOR children only · stroke `1.6` · align CENTER · cap ROUND · join ROUND · no fill.**

Any new icon follows this exactly. Strokes bind to a colour variable so they take colour from context — never a hardcoded hex.

**Built (17):** `queue · calendar · ledger · dashboard · paid · outreach · truth · check · close · chevron · alert · external · week · content · search · email · settings`

*`settings` was redrawn — a gear with radiating lines reads as a sun at 18px. It is sliders.*

**Why they were drawn rather than imported.** The app and website files are not reachable as published libraries from this file — `get_libraries` returns only community kits, and a design-system search for "Caspr" returns nothing. The app's own set is document-management (archive, trash, pencil, eye, lock, restore, star, checkboxes) and only `check` overlaps what a console needs. So the *construction rules* were inherited and the glyphs drawn to them. **If the libraries are ever published, re-check before adding more.**

---

## 5 · Information architecture — the tree

**Corrected 2026-08-20, after the first nine screens.** The original nav was a flat list —
*Queue · Calendar · Ledger · Dashboard · Paid · Outreach · Truth.* That is an index of how the
**system** works, not how the **team** thinks. A social specialist does not open the portal thinking
"I'll go to the Ledger"; they think *"what's my social work this week."*

Two concrete failures it caused:

- **"Where do I go?" had no answer.** Three specialists shared one Queue with a *Yours* filter. **A
  filter was doing the job of a destination.** Filters narrow; destinations orient.
- **Review items and human-only work were split.** Approve/reject items sat in Queue; directories,
  backlinks, community threads and guest posts sat in Outreach. One person's week lived in two
  places with no single view — and runbook §6 makes clear the human-only half is a large share of
  DM time.

### The tree

```
MY WEEK                    every person's landing. Aggregates across the
                           workstreams they own. Review items AND tasks,
                           together, with attachments and deadlines.

WORKSTREAMS
  Content & Social         Dashboard · Tasks · Library
  SEO                      Dashboard · Tasks · Backlog
  Performance              Dashboard · Tasks · Paid
  Email                    Dashboard · Tasks · Sequences

SYSTEM
  Calendar                 all-up, filterable by workstream
  Dashboard                the roll-up across workstreams
  Truth                    stale flags — cuts across everything
  Ledger                   reject calibration — cuts across everything
  Admin
```

**Dashboard and Tasks are universal. The third tab is that workstream's own object** — Library,
Backlog, Paid, Sequences. Per-workstream dashboards roll up into the System one; a specialist reading a
single shared dashboard reads mostly noise.

> **Corrected 2026-08-25.** The prose said *"the same three tabs"* while the tree gave Performance
> `Dashboard · Paid · Attribution` and Email `Dashboard · Sequences · Sends` — **neither with a Tasks tab.**
>
> **Tasks cannot be optional.** My Week aggregates *"review items AND tasks"* across the workstreams a
> person owns (§5 rule 3), and the TL owns Performance *and* Email. Without a Tasks tab on those two,
> their tasks have no home to aggregate from, and My Week silently under-reports the TL's week.
>
> **Attribution and Sends were never work — they are views of data.** They belong on their workstream's
> Dashboard, which is where every other read-only view already lives.

### Four rules that hold the structure

**1 · Two levels, never three.** Second level is tabs inside a workstream, never a third rail level.
Every level is a decision taken before work starts, and that is what kills ops tools.

**2 · Review is a mode, not a node.** It runs *over* the tree and pulls everything assigned to a
person regardless of workstream. If review fragments into four workstream inboxes, someone with items
in three has to visit three places and the "52 minutes left" estimate stops meaning anything. **The
three-minute review depends on one uninterrupted flow.**

**3 · Workstream ≠ person.** The mapping is not 1:1 — the TL owns Performance *and* Email; SEO owns
search *and* directories *and* backlinks. Workstreams are where work is **organised**; My Week is
where a person **starts**. The nav footer names which workstreams the signed-in person owns, so the
tree is never abstract.

**4 · Individual posting is not in this tree.** The core team's Personal Queue is a separate mobile
surface for seven people who never open the console. Keeping it out is what stops the console being
designed for two incompatible audiences.

### Decisions taken (Joy, 2026-08-20)

| | |
|---|---|
| **Performance is the parent of Paid** | The TL is a performance marketer — paid plus attribution sit under one node |
| **Content and Social are one workstream** | A blog post and its seven voiced variants are one artefact; splitting them would break the repurposing flow the CMS is built around |
| **Relationships is not in the portal** | A one-time effort already running outside it. Its work redistributes: **guest posts and directories → SEO** (both are backlink routes) · **podcasts and community threads → Content & Social** · **testimonials → out of portal** · **enterprise domain clusters → a System signal surfaced on Joy's My Week** |

---

## 5A · Review mode — resolving open item 0

**§5 rule 2 says review is a mode, not a node, and that *"the three-minute review depends on one
uninterrupted flow."* Nothing drawn delivers that.** `REVIEW` rows on My Week are rows: a person clicks one,
lands on Review Item, decides, and is returned to a list to find the next one. **That is a node, and the
return-to-list step is where three minutes becomes fifteen.**

**Designed before the workstream screens, and deliberately out of the §11 build order** — review mode is
cross-cutting, so the four *Tasks* tabs inherit whatever it establishes. Drawing them first guarantees rework.

### 5A.1 Seven decisions

| | Decision | Why |
|---|---|---|
| **1** | **Full-screen takeover.** Not a modal, not a pane, not a list | The rail and tabs are what fragment attention. *Uninterrupted* has to mean the tree is gone |
| **2** | **One entry point: My Week.** Workstream *Tasks* tabs show items but do not start the flow | Two entries mean two mental models of what "reviewing" is. The tabs link to My Week's start button |
| **3** | **The queue is the person's, across every workstream** | Rule 2. Fragmenting into four inboxes breaks both the flow and the minutes estimate |
| **4** | **Every action advances.** Approve, reject and hold all move to the next item | A decision that leaves you where you were invites re-reading a decided item |
| **5** | **Commit on action. No batch save, no undo stack** | Exiting mid-flow must always be safe. A reviewer interrupted at item 6 of 14 has genuinely decided six |
| **6** | **Keyboard-first, with the hints visible** | 23 items a week at ninety seconds each is a keyboard task. Hidden shortcuts are shortcuts nobody uses |
| **7** | **No edit affordance exists anywhere in the mode** | `portal-build-spec` §3.4: *no editing.* **The way to enforce that is to have nowhere to type**, not a disabled button |

### 5A.2 The flow

```
MY WEEK
  ┌─ [ Start reviewing — 14 items · ~22 min ]        ← primary, dark ground
  └─ rows remain, for scanning. They do not start the flow

REVIEW MODE  (full screen · dark chrome · white artefact)
  ┌── header:   4 of 14  ··········  ~16 min left        [ Exit ]
  ├── context:  channel · type · voice lane · scheduled for
  ├── THE ARTEFACT — white. The item exactly as it will publish
  ├── citation:  the source, resolved, with its publisher and date
  └── actions — dark ground, below the card:
        [ A Approve ]   [ R Reject… ]   [ H Hold ]

REJECT — inline panel, same screen, artefact stays visible
  ┌── ten reason codes, number-keyed 1–0
  └── note, required, ≤200 chars → [ Reject and regenerate ]

QUEUE CLEAR
  what was decided · what regenerated · what is held · [ Back to My Week ]
```

### 5A.3 Details that decide whether three minutes is real

**The citation is on screen, not behind a click.** `content-engine.md` §4.2 `L22` checks that a citation
resolves; **the reviewer's job is to judge whether it supports the claim**, and they cannot do that from a
URL they have to open. Publisher, date and the quoted figure, inline.

**Reject is one screen, never two.** The artefact stays visible while the reason is chosen — a reviewer who
has to remember what they objected to writes a worse note, and **the note is what feeds the regeneration
prompt and the ledger.**

**The reason codes are number-keyed** in the fixed order of `portal-build-spec` §3.4. Ten codes, `1`–`0`.
Muscle memory is the point.

**Minutes remaining is computed from `seconds_spent`**, not from a constant per item. §4's data model already
records it. **It is the only honest version of that number**, and an estimate that is visibly wrong twice
stops being read.

**`BANNED_TERM` is visually distinct.** It means the linter should have caught it — the reject panel says so,
and it raises a linter defect (`portal-build-spec` §3.5). **The reviewer is doing the machine's job in that
moment and should be told the machine will be fixed.**

**Exit is always available and never warns.** Commit-on-action makes it safe; a confirmation dialog would
imply it is not.

### 5A.4 Two things review mode is not

**Not mobile.** The DM trio review at a desk, ~2.5 hrs a week. The mobile surface is the core team's Personal
Queue — **a different audience with a different job** (§5 rule 4), and building one screen for both is what
§5 rule 4 exists to prevent. **The mobile Review Item in §11 serves the Personal Queue, not this mode.**

**Not a place where content improves.** A reviewer approves, rejects with a reason, or holds. **The content
gets better through regeneration, not through a human rewriting it at 9pm** — which is also the only way the
rejection ledger accumulates anything worth having.

### 5A.5 What this changes elsewhere

| | |
|---|---|
| **My Week** `36:592` | Gains the primary **Start reviewing** button with live item count and minutes. Rows stay for scanning |
| **Review Item** `10:2` | **Superseded by Review Mode — Item** `43:723`, which drops the nav rail and the NEXT IN QUEUE list. Keep `10:2` until the workstream Tasks tabs are re-pointed, then retire |
| **Review Queue** `17:60` | **Retire it.** §11 asked whether to keep it as the review-mode list. Review mode has no list — that is the point |
| Workstream **Tasks** tabs | Show assigned items and **link to My Week's start button**. They never begin the flow (decision 2) |

### 5A.7 The Library tiers approved copy — and that is deliberate

**Content & Social ▸ Library shows approved copy in its four tiers** — LEAD, SUPPORTING, CATEGORY EDUCATION
ONLY, and **RETIRED, marked BLOCKED in the accent colour**.

**This exists because the same list, untiered, was a live hazard.** The content library's `Voice Cheat Sheet`
carried retired lines under a heading reading *"APPROVED LINES (reuse verbatim where they fit)"* until it was
reconciled on 2026-08-24. **A flat list of good lines is how a retired line gets reused** — nobody re-reads
the governance doc, they copy from the nearest list.

**Showing the tier next to the line makes that mistake structurally hard**, and listing the retired ones
rather than deleting them stops anyone re-proposing them in good faith. The linter blocks them upstream
regardless; the Library is where a person finds out why.

### 5A.6 Added while drawing — not in the written design

**The linter-cleared strip.** Review Mode — Item carries a band listing the eight checks already run:
banned vocabulary, prohibited claims, stale numbers, citation resolves, duplication, channel limits,
competitor in lead copy, reader-labour framing.

**It exists because `portal-build-spec` §3.3 says *"a human should never be the first line of defence on
whether we wrote 'leverages'"* — and the reviewer has no way of knowing that unless the screen says so.**
Telling someone what they do **not** have to check is what makes ninety seconds an instruction rather than
an aspiration. It also fills the space a short artefact leaves, without a list.

**A tilde does not survive DM Mono.** `~16 MIN LEFT` renders with the tilde at mid-height and reads as
**`-16 MIN LEFT`**. **Use `EST 16 MIN LEFT`.** This has now been hit three times in this file; it is a
standing rule, not an observation.

---

## 6 · Layout

| | |
|---|---|
| **Desktop frame** | 1440 × 900 |
| **Nav rail** | 220 wide, `surface/base`, 1px right border. Wordmark + TEAM, seven destinations, reviewer at the foot |
| **Work area** | Fills remaining width. Padding 40 / 28 |
| **Mobile frame** | 375 × 812. No rail — single column, header only |
| **Tap targets** | **≥ 44px on mobile.** A 34px button was caught and corrected on the Personal Queue |
| **List rows** | 1px top border, no bottom border. Active or first row on `surface/raised` |

---

## 7 · Components

| Name | Node | Notes |
|---|---|---|
| `Console / Nav` | `16:57` | The rail, with icons. **Instance it on every console screen. Never rebuild** |
| `icon / *` | `13:6`–`13:67` | Twelve, per §4 |

**Clone, never hand-rebuild.** Standing instruction. It applies to work inside this file as much as to the app's library.

---

## 8 · Charts and data display

Guidance from the `dataviz` skill, resolved against a two-colour brand.

**Pick the form first.** A single headline figure is a **stat tile**, not a chart. Magnitude across categories is **horizontal bars**. Change over time is a **line**. Ask what the number's job is before drawing anything.

**Red is never a series colour.** Reject-by-reason is *one measure across eight categories*, not eight identities — so it is a single series, one neutral fill, direct-labelled, no legend. A bar turns red only when it breaches a threshold or flags a defect. **Colouring bars by category would make red mean "the fifth reason" and stop it meaning attention.**

**There is no categorical palette here, so the palette validator does not apply.** The brand is black, white and one red. Identity is carried by direct labels, magnitude by length. If a chart ever genuinely needs multiple series, that is a decision to escalate — not a licence to invent hues.

**Other rules that hold:** one axis, never two · thin marks, 2px ends to match the radius scale · recessive grid · text wears text tokens, never a mark colour · a health band shown where the runbook defines one (reject rate 5–15%).

---

## 9 · Content rule

**Every screen is populated with real content — never lorem, never placeholder.**

Copy comes from `icp-copy.md` v3, the runbook's actual item types, and real reason codes. This is not polish: a screen filled with plausible-looking nonsense cannot be judged for density, line length, or whether the voice survives the interface. It also catches errors — the Review Item card carries `SOURCE · icp-personas.md :57`, which is how rule 5 gets enforced in the interface rather than in a document nobody reads.

---

## 10 · The desktop / mobile split

Two postures, deliberately. **This is not one product at two breakpoints.**

| Surface | Posture | Who |
|---|---|---|
| **Personal Queue** — your posts, your comments | **Mobile-first.** Desktop is the same thing centred in a column | The seven core team, ~20 min/week, often on a phone |
| **Operations console** — queue, ledger, dashboards, CMS, outreach | **Desktop-first**, fluid down to 900px (**§10A**), **unsupported below 900px** — where the message *routes to the Personal Queue* rather than dead-ending | The three-person DM team, 2–3 hrs/week, at a desk |

**Why the split rather than mobile-first throughout:** the review console is the densest screen in the product and mobile-first would compromise it, or force designing it twice. The split is also **fewer frames** — 14 total, each designed once at the posture it is used in, versus 28 across two breakpoints.

It maps onto the permission model already in the build spec: Contributor sees only their own queue; Reviewer gets the console.

---

## 10A · Responsive behaviour

**Specified in full, and separately: [`portal-responsive-spec.md`](portal-responsive-spec.md).**

**§10 above said the console was *"responsive to tablet."* That was an assertion, not a specification** — every
console frame is drawn at a fixed 1440. The responsive spec closes that gap, and it is a separate file because
**it is the one document the build session needs in its entirety.**

**The shape of it, so this document reads without a detour:**

| Width | Behaviour |
|---|---|
| **≥ 1440** | As drawn |
| **1180–1439** | Rail unchanged; gutters compress before content; table columns flex |
| **900–1179** | **Rail collapses to icons**; work area full width; tables scroll in their own container |
| **< 900** | The message, `65:1584` — routes to the Personal Queue |

> **The finding that matters most: collapsing the rail from 220px to icons frees 156px and fixes four of the
> six tables that break at 900.** Build that first; scroll containers are a backstop.

**Everything else — the four rules, the measured per-table audit, and what not to chase — is in the
responsive spec. Do not restate it here; two live copies of a specification is a fork.**

---

## 11 · Screen inventory

Restructured 2026-08-20 when the navigation moved to workstreams (§5).

| Screen | Surface | Status | Node |
|---|---|---|---|
| **My Week** | Desktop | **Built.** Gained the **Start reviewing** band 2026-08-24 — the single entry point (§5A decision 2) | `36:592` |
| Personal Queue | Mobile | **Built** | `4:2` |
| **Personal Queue** | Desktop | **Built** 2026-08-25 — cloned from the mobile surface, 600px column. **Deliberately has no rail** — §14.1 | `70:1563` |
| Review Item | Desktop | **Built** | `10:2` |
| Rejection Ledger | Desktop | **Built** · System | `18:107` |
| Dashboard — roll-up | Desktop | **Built** · System. Needs per-workstream siblings | `19:154` |
| Content Calendar | Desktop | **Built** · System | `21:201` |
| Truth Layer | Desktop | **Built** · System | `22:248` |
| Blog CMS | Desktop | **Built** — becomes Content & Social ▸ Tasks | `24:342` |
| Review Queue | Desktop | **Retire** — §5A.5. Review mode has no list | `17:60` |
| Outreach | Desktop | **Dissolved** per §5 — redistributes to SEO and Content & Social | `23:295` |
| Content & Social ▸ **Tasks** | Desktop | **Already built** — this inventory was behind the file | `38:653` |
| Content & Social ▸ **Dashboard** | Desktop | **Built** 2026-08-25 · 1440×1292 | `50:723` |
| Content & Social ▸ **Library** | Desktop | **Built** 2026-08-25 · 1440×862 | `54:793` |
| SEO ▸ **Dashboard** | Desktop | **Built** 2026-08-25 · **corrected 2026-08-25** to three kill conditions on three clocks | `55:863` |
| SEO ▸ **Tasks** | Desktop | **Built** 2026-08-25 · **corrected** — `/alternatives/*` out, roundup outreach in | `56:933` |
| SEO ▸ **Backlog** | Desktop | **Built** 2026-08-25 · **corrected** — the keyword pass ran; nothing is BLOCKED on it | `57:1003` |
| Performance ▸ **Dashboard** | Desktop | **Built** 2026-08-25 — carries `x` and the funnel | `58:1073` |
| Performance ▸ **Tasks** | Desktop | **Built** 2026-08-25 | `60:1213` |
| Performance ▸ **Paid** | Desktop | **Built** 2026-08-25 — campaigns against kill rules | `59:1143` |
| Email ▸ **Dashboard** | Desktop | **Built** 2026-08-25 | `61:1283` |
| Email ▸ **Tasks** | Desktop | **Built** 2026-08-25 | `62:1544` |
| Email ▸ **Sequences** | Desktop | **Built** 2026-08-25 — the five send preconditions | `62:1353` |
| **Review Mode — Item** | Desktop | **Built** 2026-08-24 · §5A | `43:723` |
| **Review Mode — Reject** | Desktop | **Built** — inline panel, artefact stays visible | `46:723` |
| **Review Mode — Queue Clear** | Desktop | **Built** — entirely dark per §2 | `47:723` |
| **Admin** | Desktop | **Built** 2026-08-25 · 1440×2364 — throughput, what is switched on, people, integrations, limits. **Gained the people roster + invite/revoke 2026-08-25** — with no signup page it is the only route in (`portal-build-spec.md` §3.10b) | `63:1493` |
| **Login** | Desktop | **Built** 2026-08-25 — Cognito, one field, routes phone users to the Personal Queue | `65:1563` |
| **Console — under 900px** | Mobile | **Built** 2026-08-25 — §10. **Routes rather than dead-ends** | `65:1584` |
| **States — reference** | Desktop | **Built** 2026-08-25 · §11A | `66:1563` |
| Review Item — mobile | Mobile | **Not building.** §10: review is a desktop act. The mobile surface is the Personal Queue, which is built | — |

**Build order — complete 2026-08-25:** ~~review mode~~ → ~~Content & Social~~ → ~~SEO~~ → ~~Performance~~ → ~~Email~~ → ~~Admin and Login~~ → ~~states~~. **Every screen in this inventory is drawn.** Original order: **review mode first** (§5A — it is cross-cutting, and the four *Tasks* tabs inherit what it establishes) → Content & Social (largest workstream, absorbs the CMS) → SEO → Performance → Email → Admin and Login.

---

## 11A · States — resolving open item 2

*Built 2026-08-25 as one reference frame (`66:1563`) rather than per-screen variants — what matters is the pattern, and drawing 23 screens × 3 states would fix the wrong thing.*

### The distinction the reference exists to enforce

**Three kinds, and they look alike while meaning opposite things.**

| Kind | Says | Reader's next move |
|---|---|---|
| **EMPTY** | *Nothing here* | **Often nothing.** An empty state must say **which** — finished, unassigned, or correctly empty |
| **LOADING** | *Nothing yet* | **Wait.** Always name what is running and when it ends |
| **DEGRADED** | *Something stopped* | **Act.** Name what it **blocks**, never that "an error occurred" |

> **A generic `No data` hides which of the three you are in** — and the difference between *"you are done"*, *"come back in an hour"* and *"nothing can publish"* is the entire message.

### The four that are specific to this system

| | State | Why it is not generic |
|---|---|---|
| **1** | **Hygiene service unreachable** | **CLAUDE.md Rule 6 makes this a publishing halt, not a warning.** Approved items are **held, not dropped** — the queue's work is not lost because a service is down |
| **2** | **Index run halted — suppression above 20%** | Gate G6, [`index-engine.md`](index-engine.md) §5. **The engine has no human reviewer, so this state *is* the review** |
| **3** | **"No lane match this week"** | An **empty state that is a correct outcome.** Nothing in the source fit that person's lane, so nothing was generated. **An empty slot beats a lane violation**, and the screen has to say so or it reads as a failure |
| **4** | **"No credible published source gives this number"** | **The most important state in the system, and it is not an error.** It is the argument for the product, and it ships |

### The rule for the build

**No screen renders a bare `No data`, `Error`, or an untexted spinner.** Every state names its kind in the first line and its consequence in the second. **The three-column reference is the pattern; each screen's copy is written from it, not from a component library of generic states.**

---

## 12 · Figma gotchas — hit and solved

Recorded so the next session does not rediscover them.

| Problem | Cause | Fix |
|---|---|---|
| Wordmark imported as a white blob | `resize()` scales geometry but **not stroke weight** — the SVG's 16-unit stroke stayed 16px and filled the counters | Use **`rescale()`**, which scales strokes with the geometry |
| `~12 MIN` reads as `-12 MIN` | DM Mono's tilde sits high; at 11px it looks like a hyphen. **Happened twice** | Do not use `~` in mono at small sizes. Write the number plainly |
| `node.query()` threw on `[name=Button / Publish]` | The selector parser rejects `/` in an attribute value | Use `findOne(n => n.name === '…')` |
| Empty `viewport 0x0` on read | Browser pane not sized | Not Figma — resize the preview first |

**Also:** `use_figma` is atomic. A script that errors makes no changes at all, so fix and re-run rather than hunting for partial state.

---

## 14 · Two decisions taken 2026-08-25

### 14.1 The desktop Personal Queue is not the console

**Open item 3 assumed it was "the mobile screen centred in a column." It is a different surface, and the reason is access rather than layout.**

**A contributor has no workstream access at all** — Admin (`63:1493`) grants them *own queue only*. **Putting the rail on their screen would show four workstreams they cannot open**, which is worse than no rail: it advertises a permission boundary at every visit.

**So: wordmark, their name, their queue, nothing else.** The footer says it plainly — *"Approving your own posts is the whole of this screen. Everything else in the console belongs to someone whose job it is."*

**Built by cloning the mobile frame** (`4:2`) into a 600px column rather than rebuilding it, so the two surfaces cannot drift.

### 14.2 Motion — confirmed as almost none, with one exception

**Open item 4 asked to confirm rather than assume. Confirmed, and the exception is instructive.**

| | Rule |
|---|---|
| **1** | **No transitions on navigation, tabs, tables or state changes.** A number that changes should change. **This console is used for twenty concentrated minutes at a time** — motion spends the attention the review needs |
| **2** | **No spinners anywhere.** A loading state is **text that names what is running and when it ends** — §11A |
| **3** | **The one exception: advancing in review mode.** A **120ms cross-fade** as the next item replaces the current one. **Approve and next-item are the same keystroke, so without it the screen looks like it ignored you** — and a reviewer who is unsure whether the action registered will re-read a decided item, which is exactly what §5A.4 exists to prevent |
| **4** | **`prefers-reduced-motion` disables even that.** The cross-fade is a confirmation, and confirmation must not depend on motion — the item content changing already carries it |

> **The app moves because people enjoy using it. The console does not, because nobody is here to enjoy it.** Same brand, opposite job — the same logic as §2's white-chrome inversion.

---

## 13 · Open

| | Item |
|---|---|
| **0** | ~~Review-as-a-mode is not drawn~~ — **designed 2026-08-24, §5A.** Full-screen takeover, one entry point, every action advances, commit-on-action, keyboard-first, no edit affordance anywhere. **Drawn 2026-08-25** — `43:723`, `46:723`, `47:723` | ✅ |
| **1** | **Library access.** App and website files are not reachable as published libraries. Currently unblocking by inheriting construction rules and building locally. If published, re-check before adding components |
| **2** | ~~Empty, loading and error states~~ — **designed and drawn 2026-08-25, §11A.** Three kinds distinguished; four system-specific states written | ✅ |
| **3** | ~~Desktop Personal Queue~~ — **built 2026-08-25** (`70:1563`). **Not the console with a narrow column** — §14.1 | ✅ |
| **4** | ~~Motion~~ — **confirmed 2026-08-25, §14.2.** None, except a 120ms cross-fade on review-mode advance | ✅ |
| **5** | ~~The under-900px message~~ — **built 2026-08-25** (`65:1584`). **Routes to the Personal Queue rather than dead-ending**, since that is what a phone user is almost always there to do | ✅ |
