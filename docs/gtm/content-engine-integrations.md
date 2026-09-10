# Content Engine — Integrations & Tooling Register

*2026-09-09. What connects, where, with what auth, who owns it, what it costs, and what is blocking.*

**An addition to [`content-engine-runtime-spec.md`](content-engine-runtime-spec.md), not a revision of it.**
The runtime spec says what each station does. This says **what each station has to be plugged into before it
can do it**, on one page.

---

## 0 · Why this file exists, stated honestly

The runtime spec covers the integration surface **correctly but in twenty-one places.** ⑤ carries the Caspr
API, ⑩ carries model tiering, ⑯ carries five publishing channels, ⑳ carries four measurement sources. **Nobody
can look at that and answer "what do we need to connect, and what is stopping us."**

Consolidating it surfaced three things that were **not covered anywhere**, and all three sit on the creative
side:

| | Found | Where it should have been |
|---|---|---|
| **1** | **The existing SVGs are a parameterised template, not a library.** ⑪ calls them *"hand-made assets… a library to draw from, not a pipeline."* **That is half right and it undersells them** — §6.1 | ⑪ |
| **2** | **Nothing renders a chart into a file.** `propose_visuals` returns **chart *data***, never an image. Every one of ⑪'s three routes still needs a renderer, a font-embedding step and a rasteriser, and none is named | ⑪, open question 5 |
| **3** | **Generated images have nowhere to live.** No bucket, no CDN, no URL scheme. An OG image needs a stable public URL and no document says where it comes from | ⑯, §6.7 |

**What was already covered and is only reorganised here:** the Caspr API (§2), model tiering (§3), all five
publishing channels (§4), all four measurement sources (§5). Those sections cite the station they come from
and add nothing.

---

## 1 · The register — everything, one table

**Legend:** 🟢 ready · 🟡 needs an action we can take · 🔴 blocked on someone else · ✅ **decided —** [`content-engine-decisions.md`](content-engine-decisions.md)

**⚠ A1 is now TWO principals**, not one — the index engine's safety test asserts `trigger_generation` is
**absent** from its scopes while this engine requires it present, so one principal cannot serve both.

| | Integration | Station | Auth | Owner | Status |
|---|---|---|---|---|---|
| **A · Caspr's own API** ||||||
| A1 | `retrieve_analysis` · `fact_lookup` · `trigger_generation` · `demand_signal` | ⑤ ⑧ 6.10 | **Service principal** — machine JWT | **Jayant** | 🔴 **not issued. Blocks ⑤ and everything downstream** |
| **B · Model APIs** ||||||
| B1 | Frontier model — origination | ⑩ | API key, Secrets Manager | Portal | 🟡 key needed |
| B2 | Haiku — transforms, ~80% of volume | ⑩ | same key | Portal | 🟡 |
| B3 | Semantic linter calls `L20`–`L24` | ⑫ | same key | Portal | 🟡 |
| **C · Publishing** ||||||
| C1 | **caspr.ai CMS** — write + build trigger | ⑯ | CMS token | **Website session** | 🔴 `portal-build-spec.md` §8.1 — *time-critical* |
| C2 | **AWS SES** | ⑯ 6.7 | IAM | Portal | 🔴 **sandbox — 200/day, verified addresses only.** Production access is a **day-1** request; approval takes days |
| C3 | **LinkedIn personal** — `w_member_social` | ⑯ ⑰ | OAuth per person | Each person | 🟡 **5 of 7 granted.** Open permission, no approval |
| C4 | **LinkedIn Company Page** — Community Management API | ⑯ | App-level | Portal | 🟡 Development tier granted on application. ⛔ **Do not pursue Standard. Do not request `r_member_social`** |
| C5 | **X** — free tier writes | ⑯ | OAuth | Portal | 🟢 sufficient for our volume. Read is unavailable at free tier, so X monitoring is out of scope |
| C6 | **Communities** — Reddit and forums | ⑯ ⑰ ㉑ | **none** | — | 🟢 ⛔ **A human posts. Always. There is no integration and none is built** |
| **D · Measurement** ||||||
| D1 | Google Search Console | ⑳ ⑱ | OAuth / service account | Portal | 🟡 2–3 day lag is inherent |
| D2 | LinkedIn Page analytics | ⑳ | C4's grant | Portal | 🟡 |
| D3 | Personal-profile reach | ⑳ | **a weekly form** | Social | 🟢 ⚠ **no API exists — nobody solves this, including commercial schedulers** |
| D4 | Google Ads · Meta · LinkedIn Ads | ⑳ | OAuth | Portal | 🟡 **⛔ read-only in v1** |
| D5 | Product event stream | ⑱ ⑳ ㉑ | internal | Product | 🔴 needs the app live |
| **E · Creative & rendering — §6** ||||||
| E1 | `propose_visuals` — chart **data** | ⑪ | A1's principal | Jayant | 🔴 with A1 · ✅ **route decided — Q5** |
| E2 | **Chart renderer** — data → SVG | ⑪ | — | Portal | 🔴 **does not exist. Not named in any document** |
| E3 | **Template layer** — the house card | ⑪ | — | Portal | 🟡 **more exists than ⑪ claims — §6.1** |
| E4 | **Text measurement** — for the red dot | ⑪ | — | Portal | 🔴 **§6.3, and it is the fiddly one** |
| E5 | **Rasteriser** — SVG/HTML → PNG | ⑪ | — | Portal | 🟡 **Chromium is already in the org's stack — §6.4** |
| E6 | **Fonts** — Instrument Serif · Inter | ⑪ | licence | Portal | ✅ **ship the files, pinned — Q20.** Licence is a confirmation, not a decision |
| E7 | **Image storage + CDN** | ⑪ ⑯ | IAM | Portal | 🔴 **does not exist — §6.7** |
| E8 | `WATERMARKS_SERVICE_URL` — image metadata | ⑪ ⑮ | service | **Deploys with the portal** | 🔴 **not reachable. Rule 6 is unenforceable for images until it is** |
| E9 | `anthropic-skills:clean-user-facing-text` — prose | ⑮ | **none** | — | 🟢 **self-contained scripts, no service.** This is the default |

**Read the status column as a plan:** four 🔴 are someone else's (A1, C1, C2 approval, D5) and are asks, not
work. **The rest of the red is E** — the creative pipeline — and it is ours.

---

## 2 · Group A — the Caspr API

**Reorganised from ⑤. Nothing here is new.**

**The call order is a rule, not a preference** — `gtm-api-contract.md` §2:

| | Call | Cost | Question it answers |
|---|---|---|---|
| **1** | `retrieve_analysis` | **Free** | Have we already run an analysis that answers this? |
| **2** | `fact_lookup` | **Cheap** | Is this one fact rather than a piece of research? |
| **3** | `trigger_generation` | **Billable** | Commission new work — **and it requires `{"commissioned_by": "…"}` or the call is rejected** |

> *"This is the interface making an editorial policy unforgettable rather than trusting the engine to
> remember it."*

**The principal** — `gtm-api-contract.md` §1: machine JWT, `principal_type: "service"`, **scopes enumerated
and enforced server-side** as `["fact_lookup", "demand_signal", "retrieve_analysis", "trigger_generation"]`,
≤60 minutes, same JWKS, **no token in a URL, ever**. No Data Room, no personal documents, no user history —
*"so that a compromised engine cannot read customer analyses."*

**Budget:** one ceiling for the whole principal — **150,000 credits/month**, enforced in Caspr's backend.
Soft alert at 70%. On breach `403 gtm_budget_exhausted` — *"Not a queue, not a silent degrade. The engine
surfaces it and halts."* **Cache hits charge nothing.**

**⚠ The index engine takes the same principal minus one scope.** `index-engine-runtime-spec.md` §2 requires
`trigger_generation` to be **absent** from its scope list, and asserts that absence in a test. **If both
engines share one principal, that test cannot pass.** Either two principals are issued or the index engine
gets its own. **✅ Decided: TWO principals** — `content-engine-decisions.md` §1.

---

## 3 · Group B — the model APIs

**Reorganised from ⑩ and ⑫.**

| Tier | Used by | Volume |
|---|---|---|
| **Frontier** | Published-analysis framing · search answers · permission layer · founder posts · outreach first drafts · **anything taking a position** | ~20% |
| **Haiku** | Every derivative — voiced variants, threads, glossary entries, metadata, subtitles, internal-link updates | **~80%** |

**Tiering is a cost control, not a preference. ~80% Haiku is what keeps the bill at $40–100/month.**

**Two things that need saying and are not in the spec:**

- **⑫'s semantic rules `L20`–`L24` are also model calls** and they run on **every** item, including the ones
  Haiku wrote. They are not free and they are not in the $40–100. **Meter them separately** so the linter's
  cost is visible next to what it saves in review minutes.
- **`L22` must FETCH the source.** That is an outbound HTTP call to a third-party URL from the portal, on a
  schedule. It needs a timeout, a retry ceiling and a user agent — **and a failed fetch is not a pass.**

---

## 4 · Group C — publishing, and the real limits

**Reorganised from ⑯ and `portal-build-spec.md` §6. Stated plainly so nothing is discovered in week three.**

| Channel | Limit that actually binds |
|---|---|
| **caspr.ai blog** | The write path is a **website-session dependency** (§8.1), and it is time-critical |
| **SES** | **Sandbox is 200/day to verified addresses only.** *"The single most likely cause of 'SES is configured but no email arrives.'"* Also required as build scope, not nice-to-have: SPF, DKIM, DMARC, one-click `List-Unsubscribe`, complaint rate <0.3%. **Warming ramps at ~100–150/day**, which sets the re-engagement schedule — not campaign preference |
| **LinkedIn personal** | 150 req/member/day. Orders of magnitude above our volume |
| **LinkedIn Page** | 500 req/app/day, 100/member/day. Comfortable for 2–3 posts a week |
| **X** | Free-tier writes are enough. **Read is effectively unavailable**, so X monitoring is out |
| **Communities** | ⛔ **Not an integration.** A human posts |

**⛔ Two prohibitions carried forward verbatim:** do not request `r_member_social` — *"reading member feeds
forces the Standard-tier requirement onto the whole app."* Do not pursue LinkedIn Standard tier — *"a
screencast, test credentials, a vetting process, and LinkedIn responds within 60 days only where they see
strong partnership fit."*

**Token expiry is an operational event, not an error.** `operations-runbook.md` §11: a social token expires →
the dashboard flags it → **a named alert to the affected person**, because only they can re-grant it.

---

## 5 · Group D — measurement

**Reorganised from ⑳.** Four sources, four different lags, and **⑳'s rule governs all of them: a failed
collector renders "not collected", never 0.**

The one worth repeating here: **personal-profile post analytics do not exist via API.** v1 takes self-reported
impressions through a two-field weekly form, rendered marked as self-reported. *"Directional, and honest about
being directional."*

---

## 6 · Group E — the creative toolchain

**This is the part that was missing.** ⑪ correctly flags the gap and asks Joy **which route**. It never says
what the pipeline needs **regardless of route** — and the answer is six pieces, of which we have one and a
half.

### 6.1 · What already exists is more than ⑪ claims

⑪ describes `content/assets/visuals/*` as *"hand-made assets, not generated ones… a library to draw from and a
house style to match — **not a pipeline**."* **Opening one changes that reading.** Here is a real social card,
verbatim from `content/assets/visuals/social/a09_no_card.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<rect width="1080" height="1080" fill="#0b0b09"/>
<text x="100" y="190" font-family="Inter, …" font-size="22" font-weight="600"
      fill="#e8453c" letter-spacing="3">GET STARTED</text>
<line x1="100" y1="212" x2="170" y2="212" stroke="#e8453c" stroke-width="3"/>
<text x="100" y="377" font-family="Instrument Serif, …" font-size="76" fill="#ffffff">No credit card.</text>
<text x="100" y="463" font-family="Instrument Serif, …" font-size="76" fill="#ffffff">$100 to start.</text>
<circle cx="582.16" cy="439" r="11" fill="#e8453c"/>          ← the red dot period
<text x="100" y="543" font-family="Inter, …" font-size="26" fill="#8a8984">15 minutes. 100 pages. Cited to source.</text>
<line x1="100" y1="960" x2="980" y2="960" stroke="#2a2a27" stroke-width="1"/>
<text x="100" y="990" font-family="Instrument Serif, …" font-size="40" fill="#ffffff">Caspr</text>
<circle cx="208" cy="979" r="7" fill="#e8453c"/>
<text x="980" y="990" font-family="Inter, …" font-size="24" fill="#8a8984" text-anchor="end">caspr.ai</text>
</svg>
```

**Every value in that file is a parameter except six.** Eyebrow, rule, two headline lines, a standfirst, a
footer lockup — **that is a template with slots.** The palette is fixed (`#0b0b09` ground, `#ffffff`,
`#e8453c`, `#8a8984` muted, `#2a2a27` rule), the geometry is fixed (100px gutter, 76px serif headline, 86px
line step, footer rule at y=960), and the only things that change per card are the strings.

> **The tell is `cx="582.16"`.** Somebody measured the rendered width of *"$100 to start."* by hand to place
> the red dot. **That single number is the whole argument of §6.3** — it is exactly the work a generator has
> to do, and it is the reason "just fill in a template" is not sufficient.

**So the correction to ⑪ is:** the library is a **pipeline missing its runtime**, not a set of one-offs. Route
(b) — *template + data* — is materially cheaper than ⑪ implies, because the templates are already written.

### 6.2 · Four canvases, and they are not interchangeable

| Folder | Size | Ground | Format | Count |
|---|---|---|---|---|
| `social/` | **1080 × 1080** | **dark `#0b0b09`** | SVG | 12 |
| `infographics/` | **1080 × 1350** | white `#ffffff` | SVG | 9 |
| `diagrams/` | **1200 × 760** | white `#ffffff` | SVG | 6 |
| `screenshots/` · `video/` | — | — | **HTML** | 15 + 8 |

**Two consequences.** The atom and the social cards are the **dark 1080² canvas** — §6.5 explains why that is
a compliance fact, not a taste. And `screenshots/` and `video/` are **HTML, not SVG** — 15 HTML files sit
beside **16 raw PNGs**, which means someone already rendered HTML → PNG by hand. **That step is E5, and it has
been done manually at least sixteen times.**

### 6.3 · Six pieces. We have one and a half

| | Piece | Have it? | What it does |
|---|---|---|---|
| **1** | **Chart data** | 🔴 with A1 | `propose_visuals` returns 2–3 proposals, each with complete `chart_data`. **Never a rendered image** |
| **2** | **Chart renderer** — data → SVG paths | 🔴 **nothing** | Axes, bars, labels, the source stamp |
| **3** | **Template layer** — the house card | 🟡 **written as SVG, not as code** | §6.1 |
| **4** | **Text measurement** | 🔴 **nothing** | Where the red dot goes; whether a headline wraps; whether it overflows |
| **5** | **Rasteriser** — SVG/HTML → PNG | 🟡 **Chromium is in the org already** | LinkedIn and X want PNG; OG tags want PNG |
| **6** | **Storage + CDN** | 🔴 **nothing** | §6.7 |

**Piece 4 is the one that gets underestimated.** *"Fill the template"* fails on the first headline that is one
character longer than the sample: the dot lands inside the last letter, or the line runs past the 980px right
edge, and **the card is wrong in a way the linter cannot see because the linter reads text, not pixels.**

**Two things follow, and both are cheap:**
- **The renderer measures, and the measurement is the layout.** Not a fixed `cx`.
- **The renderer asserts and refuses.** Headline over the safe width, or over two lines → **the item is not
  produced**, exactly as ⑩ refuses with a control token. `VISUAL_OVERFLOW` proposed as a fifth control token —
  **open question 18.** A refusal is a success here for the same reason it is at ⑩.

### 6.4 · The recommended stack, and the reason is reuse

⚠ **Recommendation, not a decision — open question 19.**

| Piece | Proposed | Why |
|---|---|---|
| **2, 3, 4** | **Author the card as HTML/CSS, not as hand-built SVG** | The browser does text measurement, wrapping and overflow **for free** — which is pieces 3 and 4 solved by using a layout engine instead of writing one. The red dot becomes an inline element after the last word, not a computed `cx` |
| **5** | **Headless Chromium screenshot** | **Already in the org's toolchain** — `docs/superpowers/plans/2026-08-12-testing-phase-1.md` runs Playwright + Chromium in CI today. Same binary, no new dependency, and the same engine that renders `screenshots/` and `video/` |
| **fallback** | SVG string templates + a rasteriser | Lighter, but pieces 3 and 4 become ours to write, and piece 4 is where it goes wrong |

**The argument for HTML over SVG is `cx="582.16"`.** Written as HTML, that number never has to exist.

**And the existing assets do not have to be thrown away** — the 27 SVGs stay as the visual reference the
HTML template is built to match, exactly as ⑪ requires: *"inventory before commissioning anything new."*

### 6.5 · ⛔ Two constraints that bind the generator

**1 · Accessibility, and the dark ground is the compliance.**
`docs/app-handoff/DESIGN-INPUTS-RESPONSE.md`: **2,094 nodes fail 4.5:1.** `#e8453c` measures **3.93:1** —
below the text minimum, though it passes the 3:1 UI minimum. **And the finding that matters here:**

> *"All 2,094 sit on `#ffffff` or `#f6f5f3`. **None on the dark cards.**"*

**So the social template is already compliant, and it is compliant because its ground is dark.** A generator
that renders the same card on a light ground, or puts accent-coloured body text on `infographics/`' white
canvas, **manufactures the same defect at volume** — under the **European Accessibility Act**, in force since
**28 June 2025**. Two rules, and the second is the generator's:

- **`#e8453c` may never be a text fill on a light surface.** It is the accent, the dot and the rule — not copy
- **The 1080² social canvas keeps its dark ground.** Not a style preference

**2 · Hygiene, and images are the half that does not work today.**
`CLAUDE.md` Rule 6: prose goes through `clean-user-facing-text` — 🟢 self-contained, no service. **Images need
`remove-ai-marks`**, which is *"a thin client over an HTTP service at `WATERMARKS_SERVICE_URL`"* — 🔴 **not
reachable.** Until it deploys, **every published image carries unstripped generation metadata (C2PA, EXIF,
XMP).** Joy's standing instruction is *"remove the dependency on my laptop being turned on"* — **it deploys
with the portal, or the rule is unenforceable in production.**

**⛔ And the boundary this never crosses:** a **Caspr PDF deliverable** carries a legally required AI-provenance
mark under **EU AI Act Article 50(2)**, in force since **2 August 2026**. **Stripping it is a compliance
breach.** ⑮ branches on `artefact_type` for exactly this reason. **We mark what we sell, and we clean what we
publish about ourselves.**

### 6.6 · Fonts — and they must be embedded, not referenced

The assets name **`Instrument Serif`** (headline) and **`Inter`** (everything else), with fallbacks
`Georgia, 'Times New Roman', serif` and `Helvetica, Arial, sans-serif`.

**A rasteriser renders with whatever fonts the machine has.** On a bare Lambda or container that is neither —
so **every card silently falls back to Georgia and Arial**, and nobody notices until a card is already on
LinkedIn. **The font files ship with the renderer**, from the repo, pinned.

⚠ **Both appear to be open-licence and embeddable, but that is my reading and not this repo's** —
**confirm the licence before shipping, and record it.** Rule 5.5: flagged as unverified rather than presented
as established. **Open question 20.**

### 6.7 · Storage and serving — 🔴 nothing exists

A generated card needs a **stable public URL**, because:

- **LinkedIn and X fetch the image**, they do not accept a local path
- **`og:image` must be an absolute URL** on every blog post and `/market-size/*` page
- **The atom is designed to travel** — *"read with no surrounding context, pasted into someone else's deck."*
  A URL that dies takes the travelled copy with it

**Nothing in any document says where these live.** Proposal, and it is deliberately boring:

| | |
|---|---|
| **Bucket** | S3, versioned, public-read via CloudFront. **Same account, matching `portal-build-spec.md` §5's AWS-native rule** |
| **Key** | `visuals/{content_item_id}/{visual_type}-{version}.png` — **content-addressed by item and version**, so a regenerated card never overwrites a card already live on LinkedIn |
| **Retention** | **Never delete a published asset.** An `og:image` 404 is a broken page long after the item is retired |
| **Recorded** | `visual_url` on `ContentItem`, `asset_urls[]` on `PublishRecord` — so ⑲'s stale sweep can reach images too |

**⚠ The last row is the one to notice.** ⑲ currently sweeps **text** for a superseded fact. **A wrong number
baked into a PNG is invisible to it** — and a card is exactly where a number like `25M+` gets set in 76pt
type. **Open question 21.**

---

## 7 · Secrets — names only

**Per `CLAUDE.md` Rule 7 and `portal-build-spec.md` §5: Secrets Manager, no token in the repo, ever.**

> **No value, prefix, length or hash appears in this document or in any document this engine writes.**
> Rule 7 §2: *partial disclosure is full disclosure.* What follows is a list of **names and owners**.

| Secret | Issued by | Used at |
|---|---|---|
| Caspr service-principal credential | **Jayant** | ⑤ ⑧ 6.10 |
| Model API key | Portal | ⑩ ⑫ |
| CMS write token | Website session | ⑯ |
| SES — IAM role, not a key | Portal | ⑯ |
| LinkedIn app secret + 7 personal refresh tokens | Portal + each person | ⑯ ⑰ |
| X app credential | Portal | ⑯ |
| GSC + 3 ad-platform OAuth credentials | Portal | ⑳ |
| `WATERMARKS_SERVICE_URL` + its credential | Deploys with the portal | ⑪ ⑮ |

**⚠ The portal holds the customer email list, seven people's social tokens and three ad-account
credentials.** `portal-build-spec.md` §7: *"A company selling ISO 27001 cannot have a leaky marketing
portal."*

**One rule that belongs to this engine specifically:** ⑭ the Ledger stores rejected drafts, ⑬ stores reviewer
notes, and ⑳ renders errors. **A failed API call must never write its request headers into any of them.**
Rule 7 §3 — anything written here is permanent.

---

## 8 · What is actually blocking, in order

| | Blocked | On whom | Consequence |
|---|---|---|---|
| **1** | **Service principal** (A1) | **Jayant** | ⑤, ⑧'s figure lookups, ⑪'s chart data, the 40 `/market-size/*` pages, **and the whole index engine.** *"The blocking item; nothing else can be integrated without it"* |
| **2** | **SES production access** (C2) | **Us — request it day 1** | Approval takes days and warming takes weeks. **Nothing else on this list has a lead time we cannot shorten** |
| **3** | **CMS write path** (C1) | **Website session** | ⑯ cannot publish a blog post. §8.1 marks it time-critical |
| **4** | **`WATERMARKS_SERVICE_URL`** (E8) | Deploys with the portal | Rule 6 unenforceable for images. **Images can be produced and held, not published** |
| **5** | **The creative pipeline** (E2–E7) | **Us**, once Q5 and Q19 are answered | ⑪ produces nothing. The atom is the primary input to `p`, and `p` is **0** |
| **6** | Product event stream (D5) | Product | ⑱ and ⑳'s Funnel band |

**Two of the six are ours and neither is blocked by an open question: request SES today, and build the
creative pipeline.**

---

## 9 · Cost

| | Monthly | Basis |
|---|---|---|
| Model calls, generation | **$40–100** | ⑩ — the ~80% Haiku split |
| Model calls, semantic linter | **not estimated** | §3 — `L20`–`L24` on every item |
| Caspr API | **$0 marginal** | 150,000 credits, internal. **⚠ Booked as marked-up compute, never at list price — Trap 1** |
| Publishing | **$0** | All free tiers, all within limits |
| Measurement | **$0** | GSC, LinkedIn, ad APIs are free |
| **Rendering** | **≈$0** | Chromium on existing compute. **This is the argument for §6.4** |
| **Storage + CDN** | **single dollars** | A card is ~200KB; ~40/month |

**The whole integration surface is $40–100/month plus an unestimated linter line.** The expensive thing in
this engine is **not** the integrations — it is the **85–115 minutes a week of human review**, which is
`operations-runbook.md`'s point and the reason ⑬ is the ceiling.

---

## 10 · Open questions — **all taken.** See [`content-engine-decisions.md`](content-engine-decisions.md)

| # | Question | Blocks | Why it is not ours |
|---|---|---|---|
| **17** | **One service principal or two?** The index engine's safety test asserts `trigger_generation` is **absent** from its scopes; the content engine requires it present. **One shared principal cannot satisfy both** | ⑤ · the whole index engine | It changes what Jayant issues |
| **18** | **`VISUAL_OVERFLOW` as a fifth control token?** A headline that overruns the safe width produces a broken card the linter cannot see. Proposed: **the item is not produced**, same as ⑩'s four | ⑪ ⑫ | It adds to a fixed list you set |
| **19** | **HTML + headless Chromium, or SVG templates?** Recommending HTML — the browser does text measurement and wrapping for free, and Chromium is already in the org's CI. The 27 SVGs stay as the reference | ⑪ | A build decision with a cost, alongside Q5 |
| **20** | **Instrument Serif and Inter — cleared for embedding?** Both look open-licence; **that is my reading, not this repo's.** The files must ship with the renderer or every card falls back to Georgia and Arial | ⑪ | A licence question, and it should be recorded once |
| **21** | **Does ⑲'s stale sweep reach images?** A superseded number baked into a PNG at 76pt is invisible to a text sweep — and a card is exactly where `25M+` gets set large. Proposed: `asset_urls[]` on `PublishRecord`, and a **regenerate** action rather than a text diff | ⑲ ⑪ | It widens what a stale flag means |

---

*Document: `content-engine-integrations.md` · 2026-09-09 · An addition to
[`content-engine-runtime-spec.md`](content-engine-runtime-spec.md), not a revision of it. §2 through §5 are
reorganised from stations ⑤ ⑩ ⑯ ⑳ and add nothing. **§6 and §7 are new** — §6 because ⑪ asked which creative
route to take without stating what every route needs, and §7 because the secret surface was never listed in
one place. Five open questions, 17 to 21, continue the runtime spec's numbering.*
