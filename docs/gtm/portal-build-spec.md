# GTM Portal — Build Specification

**Target:** `team.caspr.ai`
**Build window:** 3 weeks, concurrent with the website and app going live
**Built by:** the dev session, in a new repo
**Companion:** [`operations-runbook.md`](operations-runbook.md) — how it is run once built

---

## 0 · ⚠ Feed readiness — read before starting

*Added 2026-08-25, because the question "is everything that feeds the portal already built" has an answer and
it is no.*

**Nothing that feeds this portal is fully built. That is not a reason to wait** — but it decides the build
order, and **two items are genuine blockers rather than mock-able gaps.**

| Feed | State | Blocks |
|---|---|---|
| **Service principal** (`gtm-api-contract.md` §1) | **BLOCKED — not issued** | **Every AI-service call.** The contract calls it *"the blocking item; nothing else can be integrated without it"* |
| **Text-hygiene service** (CLAUDE.md Rule 6) | **BLOCKED — not reachable** | **Publishing. All of it.** Rule 6 is unenforceable without it, so nothing may leave the portal |
| `fact_lookup` | **BLOCKED** — new, not built | Truth-layer lookups, the data pages, the index engine |
| **AWS SES production access** | **PARTIAL — sandboxed**, 200/day to verified addresses | The email module sending anything real. **Request in week 1; approval takes days** |
| Product event tracking (`tracking-spec.md`) | **PARTIAL** — needs the app live | The dashboard funnel band, and **`x` entirely** |
| Website CMS write path (§8.1) | **PARTIAL** — in the one dev round | The publisher module having anywhere to publish |
| LinkedIn OAuth × 7 | **PARTIAL — 5 of 7 granted** | Two accounts. Not structural |
| `demand_signal` | **READY in principle** — product-side, no AI-service ask (§3.10a) | Nothing. No data until the app takes prompts, which is expected |
| Content library (82 cards) | **READY** | — |
| Truth-layer source documents | **READY** — this repo | — |
| Figma design | **READY — every screen drawn** | — |
| Sample reports · testimonials | **PARTIAL** — 23 commissioned, 0 produced; testimonials in production | What the portal can *publish*, not whether it runs |

### What this means for the build

> **Build against mocks for everything BLOCKED and PARTIAL. The portal is a shell that renders, queues and
> records — it can be built end to end before a single upstream feed exists.**

**Two things must be chased in parallel, and neither is dev work:**

| | |
|---|---|
| **1** | **The service principal from Jayant.** Cheap for him, and nothing integrates without it |
| **2** | **The hygiene service deployed.** The standing instruction is *"remove the dependency on my laptop being turned on"* — **it deploys alongside the portal, or Rule 6 is unenforceable in production** |

**Everything else is a mock behind a real interface.** §9's sequence already assumes this.

---

## 1 · The operating constraint

This is built in project mode. One hard push, then operation.

> **Everything required for steady-state weekly operation ships inside the build window.** Nothing in the operating loop may be deferred. If a feature is needed to run a normal week, it is in scope. If it is not, it waits for a scheduled build sprint (§12).

Two consequences that shape every decision below:

- **No laptop dependency.** Generation runs on a schedule in AWS. Nothing requires a session to be open or a person to be at a machine.
- **Complete beats elegant.** A plain module that works unattended beats a sophisticated one that needs weekly attention.
- **Capability complete, throughput configurable.** Build every capability the engine will need. **Run it narrow.** Widening — more ICPs, more channels, higher volume — is a **configuration change, never a build.** Anything that would require Joy to return and commission an add-on when a signal fires is a design failure: the signal surfaces automatically, and the response is one action.


---

## 2 · What it is

A single surface where the week's marketing work is generated, reviewed, published and measured.

```
  TRUTH LAYER ──► GENERATOR ──► LINTER ──► REVIEW QUEUE ──► PUBLISHER ──► CHANNELS
   (canonical        (tiered      (auto     (approve /       (CMS, SES,
    specs)           models)      checks)    reject)          social)
        │                             ▲            │                │
        │                             │            ▼                ▼
        └──► change detection    REJECTION LEDGER   └──────►  DASHBOARD  ◄── paid APIs
             flags stale             (compounds)                          ◄── product events
             published content
```

Alongside the content loop, two things the machine does not do: the **outreach pipeline** (human relationship work, tracked and target-driven) and the **paid dashboard** (read-only aggregation).

---

## 3 · Modules

### 3.1 Truth layer

The portal generates from the canonical specs rather than from a prompt someone wrote once.

**Sources** (read from the Drive folder, versioned on ingest):
`site-truth.md` · `.agents/pricing-model.md` · `.agents/brand-guidelines.md` · `.agents/icp-personas.md` · `.agents/icp-copy.md` · `.agents/security-posture.md` · `.agents/caspr-brand-integration-brief.md` · `docs/product/document-taxonomy.md` · `docs/product/gate-output-spec.md`

**Behaviour:**
- On ingest, extract a **canonical facts table** — every number, claim and prohibition, each with its source file and line. This is the generation context and the linter's rule set.
- On change, diff against the previous version. Any changed fact triggers **content invalidation**: every published item containing the superseded value is flagged in the dashboard with its channel, URL and publish date.

**Why this matters:** `1M+ → 25M+` is currently wrong in roughly six places across Figma and the live site, and nobody has a list. That failure repeats every time a number moves. This module is the reason it stops repeating.

> ⛔ **Do not add `content/caspr-help-content-repository.xlsx` to the source list.** Its `Voice Cheat Sheet`
> tab carried retired copy under a heading reading *"APPROVED LINES (reuse verbatim)"*. **It was reconciled on
> 2026-08-24** — retired lines removed, the rest tiered, the message stack added — but the workbook remains a
> **content asset, not a truth source.** Voice authority is `brand-guidelines.md` plus the tiered copy list in
> `CLAUDE.md`.
>
> **The general rule this is an instance of: a file that instructs writers is not the same as a file that
> states facts.** Ingesting the first as the second means the linter's rules and the generator's context come
> from the same wrong place, and nothing downstream can catch it.

### 3.2 Generator

Runs on an EventBridge schedule. Produces the week's queue.

**Model tiering — required, not an optimisation:**

| Task | Model |
|---|---|
| Origination — blog posts, founder posts, campaign angles, outreach drafts | Frontier |
| Transformation — repurposing a post into voiced variants, threads, glossary entries, metadata, subtitle cleanup | Haiku |

Roughly 80% of volume is transformation. Tiering is what keeps the API bill at $40–100/month rather than $200–300.

**Generation context per item:** canonical facts · brand voice rules · the rejection ledger's active failure modes · the target channel and its constraints · the assigned voice lane (for personal posts) · the source material.

**The hard rule, enforced at generation:**

> **Cited, or it does not ship.** Every item must carry either a finding traceable to a real Caspr analysis, or an attributed opinion from a named person. An item with neither is not generated.

This is the defence against a company whose entire positioning is "we are not the generative-AI slop machine" publishing generative-AI slop.

**Volume is a function of review capacity, not ambition.** The generator reads the configured weekly review budget in minutes and sizes its output to fit. It never overshoots. See the runbook §4 for the opening volume.

**Topic selection is demand-driven, and it probes before it ranks.** Four signals feed a ranked candidate
list (`content-engine.md` §2): prompt clusters, search demand, community question flow, sector event flow.
**Three run pre-launch; prompt clusters do not.**

> **Every candidate is probed against `fact_lookup` before ranking.** The `sourceable` verdict —
> `found | thin | not_found` — **demotes a candidate regardless of its demand.** A high-volume question Caspr
> cannot source well produces a weak analysis, and a weak analysis published under our own name costs more
> than the traffic is worth.

**The pipeline ranks. A person picks from the top of the list.** Not an assumption, and not an automaton.

### 3.3 Linter

Runs automatically before anything reaches a human. Failures are regenerated silently, never queued.

| Check | Rule |
|---|---|
| Banned vocabulary | *platform · leverages · algorithms · workflows · powerful AI · revolutionary · game-changing · chatbot · web scraping · hallucinate · "excited to announce" · "Here's how:"* |
| Prohibited claims | **"LAM" / "Large Analysis Model"** · "SOC 2 certified" (only *"SOC 2 Type I audit in progress"*) · any fieldwork claim for synthetic panels (only *"AI-simulated"*) |
| Punctuation | No exclamation points. Anywhere |
| Stale numbers | Any figure contradicting the canonical facts table |
| Brand boundary | **Any reference to Ghost Research** in Caspr-published material |
| Citation presence | Every claim of fact carries a source |
| Channel constraints | Length, format, hashtag and link limits per channel |
| Duplication | Similarity threshold against everything published in the last 90 days |

A human should never be the first line of defence on whether we wrote "leverages." That is what makes a strict three-minute review realistic.

> **The table above is the summary. The implementable rule set is [`content-engine.md`](content-engine.md)
> §4**, which splits the checks into **deterministic** (`L01`–`L11` — regex or table lookup, no model call)
> and **semantic** (`L20`–`L24` — a model call, each with a stated false-positive cost). Build from that.

**Two that need care and are easy to get wrong:**

- **`L20` reader-labour** is the highest false-positive risk in the set. *"Every source is here"* passes;
  *"check every source"* fails. **Run it supervised for a month**, logging every catch, before it rejects
  unattended
- **`L22` citation resolves** must **fetch the source**, not merely check the field is non-empty. **A
  populated-but-dead citation is worse than no citation** — it looks like proof and is not

### 3.4 Review queue

The core of the product. Three actions and no fourth.

**Approve** · **Reject with reason** · **Hold for discussion**

**No editing.** Reviewers do not rewrite. A rejection with a reason regenerates the item immediately with the correction applied, and the new version returns to the queue.

**Reject reason taxonomy — fixed. Free text is an additional note, never a substitute:**

| Code | Meaning |
|---|---|
| `FACT_WRONG` | A factual claim is incorrect |
| `STALE_NUMBER` | A figure contradicts current truth |
| `UNSUPPORTED_CLAIM` | Asserted without a citable source |
| `OFF_VOICE` | Breaches brand voice |
| `BANNED_TERM` | Prohibited vocabulary — **also raises a linter defect**, since this should have been caught upstream |
| `WRONG_CTA` | Wrong destination or offer |
| `DUPLICATE` | Too close to published material |
| `LEGAL_RISK` | Regulatory or claims exposure |
| `BOUNDARY_BREACH` | Brand-separation issue |
| `WEAK` | Correct but not worth publishing |

A required note of ≤200 characters accompanies every rejection. It goes into the regeneration prompt and into the ledger.

**Queue behaviour:** items assigned by channel to the reviewer who owns it · one notification when the queue opens, one reminder · a per-reviewer minutes-remaining estimate · **unreviewed items hold and never publish.**

### 3.5 Rejection ledger

The portal's compounding asset.

Every rejection is stored with its reason code, note, the original item, the regenerated item, and whether the regeneration was accepted. The ledger produces:

- **Active failure modes** — injected into every subsequent generation prompt, so the same mistake is not made twice
- **Reject rate by reason and by channel** — the calibration signal
- **Linter defect list** — every `BANNED_TERM` rejection is a rule the linter should have caught

Health thresholds: **above 20%** the generator is miscalibrated and gets fixed rather than the humans absorbing it. **Below 2%** reviewers are rubber-stamping and the criteria need tightening.

### 3.6 Publisher

| Channel | Mechanism | Reality |
|---|---|---|
| **Blog → caspr.ai** | CMS write + build trigger | Fully automated. Our own site |
| **Email** | **AWS SES** | Fully automated. See §6.2 |
| **LinkedIn Company Page** | LinkedIn API | Automated, subject to app approval |
| **LinkedIn personal profiles** | Share on LinkedIn (`w_member_social`) | **Automated.** Open permission, no approval needed. One OAuth grant per person. See §6.1 |
| **X** | API free tier — writes only | Automated posting. No read/monitoring at free tier |
| **Reddit, WSO, ESOMAR, PrepLounge, forums** | **Never automated** | The portal surfaces the thread and drafts the reply. A human posts it. Automated posting here gets accounts banned and burns the channel permanently |

**Unreviewed content never publishes.** There is no timeout that pushes it live.

### 3.6a The hygiene stage — required, and it branches

`CLAUDE.md` **Rule 6** is a hard rule: nothing generated reaches a public surface without a text-hygiene
pass. **The publisher is where that happens.**

```
review queue → APPROVED → [ HYGIENE ] → publish
```

**After approval, deliberately** — a reviewer should read what was written, not a cleaned version of it.

**Default tool: `anthropic-skills:clean-user-facing-text`** — self-contained, no service. Flags fixed:
`--no-normalize-spaces`; **never `--aggressive-homoglyphs`, `--nfkc` or `--strip-emoji-glue`.** Prose only:
protect code, commands, paths, URLs, identifiers, exact values and citations. **A mangled citation URL is a
broken proof.**

**`anthropic-skills:remove-ai-marks` additionally handles image and container metadata — but it is a thin
client over an HTTP service at `WATERMARKS_SERVICE_URL`, and that service is not currently reachable.**
**Deploy it alongside the portal.** The engine runs on AWS, not on a laptop; without it this stage silently
degrades to the text-only path, which is fine for prose and insufficient for published images.

> ⛔ **Branch on artefact type, not item type.** One issue of *The Record* is two objects with opposite rules:
>
> | Object | Hygiene pass |
> |---|---|
> | **The generated PDF deliverable** | **NEVER.** Every Caspr PDF carries a legally required AI-provenance mark under EU AI Act Article 50(2) (`docs/product/ai-disclosure-spec.md`). **Stripping it is a compliance breach** |
> | The report web page, the standfirst, the atom, every derivative | **Yes.** Published marketing prose |
>
> An item whose payload includes a generated PDF **passes the PDF through untouched** and cleans only the
> surrounding prose.

**Two things this stage never does:** claim or imply human authorship, and strip a required disclosure —
including the standing note on any issue touching the research sector.

### 3.7 CMS and repurposing graph

The blog is authored in the portal and published to caspr.ai. On approval, one post fans out automatically into the derived set:

> ⛔ **The graph below was wrong and is replaced.** It fanned a *blog post* into **seven** LinkedIn
> variants, one per voice lane. **That violates two rules at once:** `audit.md` §5 states *"never two people
> on the same subject in the same week"*, and the lanes are not interchangeable — Jayant's excludes marketing
> claims and pricing, Kartikey's excludes anything speaking for the company. **And the source was wrong:** the
> 17–24 item fan-out comes from a **published analysis**, not a blog post. A search answer fans out to 3–5.

**The corrected graph** — full version and per-item reviewers in [`content-engine.md`](content-engine.md) §5.2:

```
PUBLISHED ANALYSIS  (Type A · 1 per 3 weeks · frontier)      →  16–23 items
  report page + PDF · LinkedIn × lane-eligible people only
  · X posts · the atom (one source-stamped chart) · social cards
  · community drafts · email block · search-page updates · outreach hooks

SEARCH ANSWER      (Type B · 2 per week · frontier)          →  3–5 items
PERMISSION LAYER   (Type C · ~10 once)                      →  0 recurring
```

**Two rules the graph enforces at generation:**

- **Lane integrity.** A derivative is generated only for a person whose lane covers the subject. **If no lane
  fits, it is not generated** — the prompt outputs `LANE_MISMATCH`. **An empty slot beats a lane violation**
- **One subject, one person, one week.** The graph checks the week's assignments before generating

**The `/market-size/*` pages are generated, not fanned out**, and never enter the review queue as individual
items — **the template is reviewed once; the pages are not.**

Derived items enter the queue as normal — generated by the cheap tier, reviewed by the same gate. The
114-card *"One Answer Four Surfaces"* library in `content/` is the working prototype of this model; **reuse
its structure rather than inventing a second one** — see §4.

**Screen copy correction:** the CMS surface reads *"one blog post becomes twenty items."* **That is true only
of a published analysis.** Change it to **"one published analysis"** — a blog post is a search answer, and
those fan out to three to five.

**Published pages carry structured data automatically** — `Article`/`BlogPosting`, `BreadcrumbList`, `Organization`, and `VideoObject` on any page carrying a testimonial film. See §8.1.

### 3.8 Dashboard

One page. Four bands.

| Band | Contents |
|---|---|
| **Pipeline** | Queue state, items awaiting each reviewer, minutes outstanding, reject rate by reason, linter defects, stale-content flags from §3.1 |
| **Organic** | Publish log by channel · Search Console impressions, clicks, positions · LinkedIn Company Page metrics · self-reported personal-profile reach (§6.1) |
| **Paid** | Google Ads, Meta, LinkedIn Ads — spend, clicks, CPC, conversions, CAC by campaign. Read-only |
| **Funnel** | From the product event stream (`tracking-spec.md`): prompt → signup → first analysis → paid, split by `utm_campaign` and `icp_hint`. **This is the band that proves RoI** |

### 3.9 Outreach pipeline

The human work, tracked and target-driven. Not content — relationships.

**Entities:** guest-blog prospects · podcast targets · influencers and practitioners · testimonial participants · community threads worth answering · directory and listing submissions · enterprise domain clusters (from the tracking spec's 3+ users on one domain).

**For each:** owner, stage, next action, next-action date, last contact, outcome.

The portal **sources and drafts** — research the target, draft the approach, surface the thread. A person **sends and talks**. Monthly targets per person, tracked here (runbook §6).

### 3.10b User management — added 2026-08-25

**⚠ There is no signup page. Invite from Admin is the only route into the portal**, which makes this
load-bearing rather than administrative: without it, nobody but the first account can ever get in.

| | Requirement |
|---|---|
| **1** | **Invite by email, role chosen at invite.** Three roles, no fourth. Cognito sends the invite; the invitee sets their own password |
| **2** | **⛔ No seat cap. Do not build one.** *(Corrected 2026-08-25 — an earlier draft of this spec invented a 10-seat limit. Ten is the current headcount, not a constraint: Cognito is ours and nothing is priced per seat.)* **The real constraint is reviewer throughput** — adding a Contributor costs nothing, adding a Reviewer draws on the 450-minute weekly review budget. **Surface that, not a headcount** |
| **3** | **Status is visible per person** — Active · Invited, never signed in · revoked. **An invite that was never accepted is the most common real-world state and the easiest to miss** |
| **4** | **Resend and revoke on an unaccepted invite** |
| **5** | **⛔ The last Owner cannot be revoked or demoted.** Enforce server-side. Locking everyone out of a portal that has no signup page is unrecoverable without touching Cognito directly |
| **6** | **MFA state shown per person.** §7 requires MFA on the Owner role — **an Owner without it is a security defect the roster should surface, not hide** |
| **7** | **Role change is a confirm, not a toggle.** Contributor → Reviewer grants sight of the whole review queue. Reviewer → Contributor removes it |
| **8** | **Revoking a Reviewer mid-queue loses nothing.** §3.4 commits on action, so decisions already taken stand. **Their undecided items return to the pool** |
| **9** | **Every invite, role change and revoke is audit-logged** — §7 already requires this for config changes |

**Design:** roster and invite affordance are in the Admin frame, `63:1493`.

### 3.10a ⚠ `demand_signal` is product-side — corrected 2026-08-25

**Earlier drafts treated the `classification` label as an ask on Jayant's AI service. It is not, and the
reasoning that put it there was wrong** — `propose_layout` reads the prompt anyway, so moving classification
across a team boundary bought no privacy. **The boundary that matters is product → portal, and it sits
downstream either way.**

**The portal consumes an aggregation over our own event stream.** Suppression below `min_count` (default 10),
consent honoured, `signup_rate` joined from `signup_completed`.

**`suppressed_clusters` and `suppressed_count_total` must be displayed.** A demand picture that silently drops
small clusters reads as complete when it is not — **and thin tails are where new segments appear first.**

### 3.10 Admin

Ten users via Cognito. Three roles: **Reviewer** (DM team — full review rights), **Contributor** (core team — own personal queue only), **Owner** (Joy — targets, config, override, final approval).

---

### 3.11 States — three kinds, and they are not interchangeable

**Designed 2026-08-25.** Reference frame `66:1563`; rules at
[`portal-design-spec.md`](portal-design-spec.md) §11A.

| Kind | Says | Rule |
|---|---|---|
| **Empty** | *Nothing here* | **Must say which** — finished, unassigned, or correctly empty. An empty state that does not say what to do is a dead end |
| **Loading** | *Nothing yet* | **Always name what is running and when it ends.** No untexted spinners |
| **Degraded** | *Something stopped* | **Name what it blocks**, never that "an error occurred" |

**No screen renders a bare `No data`, `Error`, or an untexted spinner.** Four states are specific to this
system and their copy is written rather than generic: **hygiene service unreachable** (approved items are
*held, not dropped*), **index run halted above 20% suppression**, **"no lane match this week"** (a correct
outcome, not a gap), and **"no credible published source gives this number"** — **which is not an error at
all.**

### 3.11a Responsive behaviour — read the separate spec in full

**[`portal-responsive-spec.md`](portal-responsive-spec.md).** Self-contained, and the only document that
covers this. **Do not infer responsive behaviour from the Figma frames** — they are all drawn at a fixed
1440, and **1280 is a common laptop** sitting inside the unspecified band.

**The three things that change what you build:**

| | |
|---|---|
| **1** | **The rail collapse comes first.** 220px → icons frees 156px, taking the 900px work area from 600 to 756 — **which fixes four of the six tables that break there.** Horizontal-scroll containers are a backstop, not the primary mechanism |
| **2** | **Only the Admin roster still overflows after that**, by 12px. Drop **MFA** and **LAST SEEN**; **PERSON** and the actions never drop |
| **3** | **Review mode has no fixed-width text and must stay that way.** It is the one screen that has to work at every width from 900 up |

**Two frames in the audit are retired and should not be built:** `Review Queue` (`17:60`), `Outreach`
(`23:295`).

### 3.12 Motion — almost none, and one exception

**Confirmed 2026-08-25**, [`portal-design-spec.md`](portal-design-spec.md) §14.2.

**No transitions on navigation, tabs, tables or state changes. No spinners.** The console is used for twenty
concentrated minutes at a time, and motion spends the attention the review needs.

**The one exception: a 120ms cross-fade when review mode advances.** Approve and next-item are the same
keystroke, so **without it the screen looks like it ignored you** — and a reviewer unsure whether the action
registered will re-read a decided item, which is exactly what §3.4 exists to prevent.
**`prefers-reduced-motion` disables even that.**

### 3.13 Auth surfaces

| Surface | Node | Note |
|---|---|---|
| **Login** | `65:1563` | Cognito, one field. Ten seats |
| **Under 900px** | `65:1584` | **Routes to the Personal Queue rather than dead-ending** — that is what a phone user is almost always there for |
| **Personal Queue — desktop** | `70:1563` | ⚠ **Not the console with a narrow column.** Contributors have own-queue-only access, so a rail showing four workstreams they cannot open advertises the permission boundary at every visit |

---

## 4 · Data model

Core entities. Names are indicative; shapes are not.

| Entity | Key fields |
|---|---|
| `TruthDoc` | source_path, version_hash, ingested_at |
| `CanonicalFact` | key, value, source_doc, source_line, effective_from |
| `ContentItem` | id, channel, type, voice_lane, assigned_reviewer, status, scheduled_for, source_refs[], citation[] |
| `ContentVersion` | item_id, version_n, body, model_used, generated_at, prompt_context_hash |
| `ReviewDecision` | version_id, reviewer, action, reason_code, note, decided_at, seconds_spent |
| `PublishRecord` | item_id, channel, external_id, url, published_at |
| `StaleFlag` | publish_record_id, fact_key, old_value, new_value, raised_at, resolved_at |
| `OutreachTarget` | name, category, owner, stage, next_action, next_action_at |
| `MetricSnapshot` | source, metric, value, dimension, captured_at |

`seconds_spent` on review decisions is not surveillance — it is how the generator sizes next week's volume to the real review budget.

### 4.1 `ContentItem` adopts the existing card schema — do not invent a second one

**`content/caspr-help-content-repository.xlsx` → `Answer Cards` already carries the item schema**, populated
for 114 items. Strip the help-desk-specific columns and what remains **is a generation brief**:

`Question (customer words)` · `Working Title` · `ICP` · `Buyer Stage` · `Pillar` · `Target Keyword` ·
**`Writing Brief (what to cover)`** · **`Proof Points / Sources to cite`** · `CTA` · `Word Count` ·
`Visual Type` · `Surfaces` · `Status` · `Owner` · `Destination`

**Extend `ContentItem` with those fields rather than paralleling them.** A second schema means two places to
change when the model moves, and they will diverge.

**Two notes on importing it:**

- **`Pillar` was remapped on 2026-08-24** to the post-reorder numbering; the pre-reorder values are preserved
  in `Pillar (pre-2026-08-20)`. **Import the current column**
- **30 cards are marketing content already specced** — `B` ×10 differentiators, `H` ×12 use cases, `J` ×8
  glossary. **`H-09`–`H-12` are type-B search answers, already briefed with target keywords** — they are the
  first four search answers and they are not new work

**Also add:** `sourceable` (the `fact_lookup` probe verdict, §3.2) and `hygiene_applied_at` (§3.6a) to
`ContentItem`; `artefact_type` to `PublishRecord`, since the hygiene stage branches on it.

---

## 5 · Stack

AWS-native, matching the product so there is one operational surface.

| Layer | Choice |
|---|---|
| App | Next.js, deployed on Amplify |
| Scheduling | EventBridge → Lambda |
| Generation pipeline | Step Functions (retries, partial failure, observability) |
| Data | Aurora Serverless v2 or DynamoDB — dev session's call |
| Email | SES |
| Auth | Cognito |
| Secrets | Secrets Manager — no token in the repo, ever |
| Product events | Read from the stream defined in `tracking-spec.md` |

**Repo:** `C:\Users\joysh\Claude-Local\caspr-team-portal` → **`https://github.com/caspr-ai/caspr-gtm-portal.git`** (created 2026-08-25, baseline pushed). **The folder and the remote are named differently** — deliberate, recorded in CLAUDE.md, not a mistake to correct.

**Stack decisions taken at scaffold time**, both of which §5 left open:

| | |
|---|---|
| **Postgres, not DynamoDB** | The model is a chain of one-to-manys — item → version → decision → publish → stale flag — the dashboard is aggregate joins over exactly that chain, and volume is ~23 items a week. **DynamoDB would force denormalisation to buy scale we will never need** |
| **Drizzle + `postgres.js`** | Migrations in the repo, Aurora Serverless v2 compatible |
| **npm workspaces, ESM, vitest, eslint 9** | Matches `caspr-app`, including its `gate` script pattern |

**Code only in the repo.** This spec, the runbook and every subsequent document live on Drive under `docs/gtm/`. Per the standing rule, no `.md` other than the README goes in the repo.

---

## 6 · Integrations and their real limits

Stated plainly so nothing is discovered in week three.

### 6.1 LinkedIn

**Corrected 2026-08-19 — better than originally specced.** Personal-profile posting does *not* require Community Management API approval. The two are separate products.

- **Personal profiles — fully automatable.** `w_member_social`, delivered by the **Share on LinkedIn** product, is an **open permission requiring no approval**. It covers posting to the authenticated member's own feed, plus commenting and liking as that member. Limits are 150 requests per member per day and 100,000 per app per day — orders of magnitude above our volume. Each of the seven grants OAuth once. **The one-tap assisted queue is no longer needed.**
- **Company Page — requires the Community Management API.** Development tier is granted on application and allows 500 requests per app and 100 per member per day, which comfortably covers a Page posting two to three times a week. **Standard tier is not required** and should not be pursued: it demands a screencast, test credentials, a vetting process, and LinkedIn responds within 60 days only where they see "strong partnership fit."
- **Do not request `r_member_social`.** Reading member feeds forces the Standard-tier requirement onto the whole app. We only need write access.
- **Personal-profile post analytics remain unavailable via API.** Nobody solves this, including the commercial schedulers. v1 captures self-reported impressions via a two-field weekly form. Directional, and honest about being directional.

Application instructions for the DM team: [`03-linkedin-developer-app/README.md`](../../caspr-dm-handover/03-linkedin-developer-app/README.md).

### 6.2 AWS SES

- **Request production access in week 1.** Sandbox is 200/day to verified addresses only, and approval takes days. This is a silent blocker.
- **Separate sending identity from transactional mail.** Distinct subdomain and distinct configuration set. Marketing complaints must not degrade deliverability of password resets and "your report is ready" notifications.
- **Bulk-sender compliance is build scope, not a nice-to-have:** SPF, DKIM, DMARC, one-click `List-Unsubscribe`, complaint rate held under 0.3%.
- **The ESP layer is ours to build:** sequences, suppression list, templates, send scheduling, open/click attribution. SES publishes send, open, click, bounce and complaint events to SNS → our store → the dashboard.
- **Warming:** first-time bulk sending ramps at ~100–150/day. The re-engagement campaign's schedule is set by this, not by campaign preference.

### 6.3 Paid platforms

Google Ads API, Meta Marketing API and LinkedIn Ads API are all available and free. **Read-only in v1.** No automated bid or budget changes.

### 6.4 X

Free tier writes are sufficient for posting volume. Read access is effectively unavailable at free tier, so X monitoring is out of scope. Revisit only if X proves itself as a channel.

---

## 7 · Security

The portal will hold the customer email list, seven people's social tokens, and three ad-account credentials. A company selling ISO 27001 cannot have a leaky marketing portal.

- All secrets in Secrets Manager. Nothing in the repo, nothing in environment files committed to git
- Cognito auth, no shared logins, MFA on the Owner role
- The email list is never exported to a third-party tool
- Audit log on every publish, every approval and every config change
- Personal data confined to the email module; the content and outreach modules hold names and public professional detail only

---

## 8 · Dependencies outside this build

Three things sit outside the portal but block it. Each has an owner and a deadline.

### 8.1 Website dev handover — **time-critical**

The site is untouched until one dev round after the Figma freeze. These must be in that handover or they miss the window entirely:

| Item | Detail |
|---|---|
| **Structured data** | `Organization` · `BreadcrumbList` · `Article`/`BlogPosting` · `VideoObject` · `SoftwareApplication`. The site currently has **zero JSON-LD on any page**. **Do not add `aggregateRating`** on our own pages — self-serving review markup breaches Google's guidelines |
| **`FAQPage` — reclassify** | `website-workplan.md` §1.6 puts this in Tier 0 justified on FAQ rich results. Google deprecated those on **7 May 2026**. Keep the markup for answer engines; drop the Tier 0 justification |
| **Orphan pages** | 12 live pages linked from no nav or footer. They are also why the site earns no organic sitelinks — Google reads zero internal link equity into them |
| **CTA parameters** | Every outbound CTA carries `utm_*` and `icp_hint`, so the app's onboarding personalisation and the portal's attribution both work |
| **CMS write path** | The blog must be writable by the portal — API route or repo commit trigger |

### 8.2 Product event tracking

Per [`tracking-spec.md`](tracking-spec.md), built into the app. The dashboard's funnel band reads from it. **Without it the portal cannot prove RoI**, which is the whole point.

### 8.3 Content prerequisites

Three real sample reports, and the testimonial programme underway. Neither is portal work; both gate what the portal can publish.

---

## 9 · Build sequence

Three weeks. Ordered so nothing is blocked waiting.

### Week 1 — Foundations
- Repo, AWS account structure, Amplify, Cognito, Secrets Manager
- **SES production access requested — day 1**
- **Text-hygiene service deployed** (`WATERMARKS_SERVICE_URL`) — infra, not application code, and it is **not reachable today**. `CLAUDE.md` Rule 6 is unenforceable in production without it
- LinkedIn app submitted for review — day 1, it is the longest lead time
- Truth layer: ingest, canonical facts table, change detection
- Data model and migrations
- Linter with the full rule set from §3.3

### Week 2 — The loop
- Generator with model tiering and the citation rule
- Review queue, reject taxonomy, instant regeneration
- Rejection ledger and feedback into generation
- CMS and blog publish path
- **Hygiene stage wired between approval and publish** (§3.6a), branching on artefact type
- SES module: sequences, suppression, unsubscribe, templates, event ingestion
- Notification and reminder scheduling

### Week 3 — Surfaces and close
- Publisher: LinkedIn Company Page, X, assisted personal-post queue
- Paid API connectors, read-only
- Dashboard, all four bands
- Outreach pipeline and targets
- Audit log, roles, admin
- **Dry run: one full simulated week, end to end, with the DM team reviewing real generated content**

The dry run is not optional. It is the only way to discover that the review load is wrong, the notifications fire at the wrong time, or the queue assignment makes no sense — while there is still time to fix it.

---

## 10 · Definition of Done

The portal is done when every line is true. Not before, and nothing on this list is deferrable.

**Generation and review**
- ☐ Truth layer ingests all nine source documents and produces the canonical facts table
- ☐ A change to any source document raises stale flags against affected published content
- ☐ Generator runs unattended on schedule and produces a full week's queue
- ☐ Model tiering is live — origination and transformation routed to different models
- ☐ Every generated item carries a citation or a named attribution; items without either are not produced
- ☐ Linter enforces all eight check categories and silently regenerates failures
- ☐ Queue supports approve, reject-with-reason, and hold — and **no edit path exists**
- ☐ Rejection regenerates the item immediately with the correction applied
- ☐ **Every candidate topic is probed against `fact_lookup` before ranking**, and `not_found` demotes it regardless of demand (§3.2)
- ☐ **Lane integrity holds** — a derivative is never generated for a person whose lane does not cover the subject, and the week's assignments are checked before generation (§3.7)
- ☐ **The hygiene stage runs on every item between approval and publish** (§3.6a)
- ☐ **The hygiene stage branches on artefact type** — a generated PDF passes through untouched, its AI-provenance mark intact; surrounding prose is cleaned
- ☐ **The hygiene service is deployed and reachable**, not degrading silently to the text-only path
- ☐ Rejection ledger feeds active failure modes into subsequent generation
- ☐ Reviewers receive one notification and one reminder, automatically
- ☐ Unreviewed content cannot publish under any condition

**Publishing**
- ☐ Blog publishes to caspr.ai on approval, with structured data attached
- ☐ Repurposing graph fans one post out into the derived set
- ☐ SES sends from a separate identity, with DKIM, SPF, DMARC and one-click unsubscribe verified
- ☐ Suppression list enforced on every send
- ☐ LinkedIn Company Page and X publish on schedule
- ☐ All seven personal profiles OAuth-granted and posting automatically via `w_member_social`

**Measurement**
- ☐ Dashboard renders all four bands with live data
- ☐ Funnel band reads product events and splits by `utm_campaign` and `icp_hint`
- ☐ Paid connectors return spend, clicks, CPC and conversions for all three platforms
- ☐ Weekly metric snapshot captured automatically

**Operations**
- ☐ Outreach pipeline live with per-person monthly targets
- ☐ Ten users provisioned across three roles
- ☐ Audit log on publish, approval and config change
- ☐ All secrets in Secrets Manager; none in the repo
- ☐ **One full simulated week completed end to end with the real DM team**
- ☐ Operations runbook handed over and walked through with the DM team lead

---

## 11 · Explicitly out of scope

Named so they are not smuggled in.

- Automated bid or budget management on any ad platform
- Automated posting to Reddit, WSO, ESOMAR, PrepLounge or any community — permanently out of scope, by design
- X monitoring and analytics
- Personal LinkedIn analytics beyond self-reporting
- Video editing — the DM team's editor owns this
- Any second live copy of a Drive document

---

## 12 · How it changes without becoming a build project again

The failure mode for a tool like this is continuous fiddling — which is exactly the mode that does not fit how this team works.

- **Change requests are logged in the portal, not actioned on sight.** Anyone can raise one; nothing is built on request.
- **Build sprints are scheduled, roughly quarterly.** The accumulated backlog is triaged in one push, in project mode.
- **Two exceptions bypass the queue**: anything broken in the weekly loop, and anything that has become factually wrong.
- **Truth changes are not build work.** A pricing or claim change updates a source document, and the portal absorbs it automatically. That is the entire point of §3.1.
