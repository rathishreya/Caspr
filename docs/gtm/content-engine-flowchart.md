# Content Engine — The Flowcharts

*2026-09-08. The picture of [`content-engine-runtime-spec.md`](content-engine-runtime-spec.md).*

**This file holds the diagrams and nothing else.** Every rule, citation and open question lives in the runtime
spec; this is the same mechanism drawn. Station numbers ①–⑱ are the spec's numbering.

**Worked examples:** [`content-engine-example.md`](content-engine-example.md).

---

## Legend

| | |
|---|---|
| 🟢 **green** | Joy has specified it. Cited in the spec |
| 🟡 **amber** | **NEW** — our addition, inside her rules |
| 🔴 **red** | **GAP** — no spec exists yet |
| ⬛ **dark** | **HARD STOP** — the item is not produced, or does not publish |
| ⏱ | Daily clock |
| 📅 | Weekly clock |

---

## 1 · The master flow — two clocks, eighteen stations

```mermaid
flowchart TD
    subgraph ACT1["ACT 1 — LISTEN &amp; DECIDE"]
        direction TB
        S1["① WATCHLIST<br/><small>config · Joy owns · Q1</small>"]
        S2["② LISTENER<br/><small>read-only · daily<br/>never posts, votes or follows</small>"]
        S3["③ TREND READER<br/><small>cluster · velocity · audience<br/>velocity beats volume</small>"]
        S4["④ CLAIM READER<br/><small>basis is mandatory</small>"]
        S5{"⑤ VERIFIER<br/><small>calls Caspr · see §2</small>"}
        S6{"⑥ ANGLE DESK<br/><small>4 gates · routes the clock</small>"}
        S1 --> S2 --> S3 --> S4 --> S5 --> S6
    end

    S6 -->|"📅 Type A or Type B"| S7
    S6 -->|"⏱ Type D"| S8D
    S6 -->|"no_data + distribution finding"| OUT["OUTREACH<br/><small>owner: SEO · Q12</small>"]
    S6 -->|"NO_ANGLE"| STOP1["⬛ not produced"]

    subgraph ACT2["ACT 2 — PLAN"]
        direction TB
        S7["⑦ TOPIC BOARD<br/><small>ranked + evidence<br/>A HUMAN PICKS<br/>Wed 15:00 · no screen · Q4</small>"]
        S8W["⑧ WORK ORDER — 📅<br/><small>Thu 06:00 · ~23 rows<br/>sized to review budget</small>"]
        S8D["⑧ WORK ORDER — ⏱<br/><small>daily · 1–3 rows<br/>no calendar slot</small>"]
        S7 --> S8W
    end

    subgraph ACT3["ACT 3 — MAKE"]
        direction TB
        S9["⑨ ASSEMBLY DESK<br/><small>9 context blocks<br/>~25 braces filled</small>"]
        S10["⑩ WRITER<br/><small>frontier = originate<br/>Haiku = transform</small>"]
        S11["⑪ VISUAL DESK<br/><small>atom chart · social cards<br/>NO PROMPT EXISTS · Q5</small>"]
        S12{"⑫ LINTER<br/><small>L01–L11 deterministic<br/>L20–L24 semantic</small>"}
        S9 --> S10 --> S11 --> S12
    end

    S8W --> S9
    S8D --> S9
    S12 -->|"fail · max 3"| S10
    S12 -->|"3rd fail"| BLOCK["⬛ linter_blocked<br/><small>surfaced, not looped</small>"]
    S12 -->|"pass"| S13

    subgraph ACT4["ACT 4 — APPROVE &amp; SHIP"]
        direction TB
        S13{"⑬ REVIEW ROOM<br/><small>approve · reject+reason · hold<br/>full screen · no editing<br/>commit on action</small>"}
        S14["⑭ LEDGER<br/><small>active failure modes<br/>60-day expiry</small>"]
        S15["⑮ HYGIENE BENCH<br/><small>branches on artefact_type</small>"]
        S16["⑯ PUBLISHER<br/><small>utm_* + icp_hint on every link</small>"]
        S13 -->|"reject + code + note"| S14
        S13 -->|"approve"| S15 --> S16
    end

    S14 -.->|"regenerate"| S10
    S13 -->|"⏱ unreviewed in 24h"| EXP["⬛ DISCARDED<br/><small>never carried forward</small>"]
    S13 -->|"📅 unreviewed by Mon 18:00"| HOLD["⬛ HOLDS<br/><small>skip the week is valid<br/>publishing unreviewed is not</small>"]

    S16 --> S17["⑰ COMMENT DESK<br/><small>which post · which fact · who<br/>a human posts, always</small>"]
    S16 --> FAN["FAN-OUT<br/><small>Type A only → 16–23 items<br/>spread over 2 weeks</small>"]
    FAN -.->|"re-enters once per derivative"| S9

    S16 --> S18["⑱ METER<br/><small>x@3 · x@6 · p</small>"]
    S17 --> S18

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef new fill:#fff8e1,stroke:#f9a825,stroke-width:1.5px,color:#7f5f00
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff

    class S1,S2,S3,S4,S6,S8D,S17 new
    class S5,S7,S8W,S9,S10,S12,S13,S14,S15,S16,S18,FAN,OUT joy
    class S11 gap
    class STOP1,BLOCK,EXP,HOLD stop
```

---

## 2 · ⑤ The Verifier — the only station that calls Caspr

```mermaid
flowchart TD
    IN["④ Claim + basis"] --> CACHE{"own recent verdict?<br/><small>⏱ daily track checks first</small>"}
    CACHE -->|"hit"| REUSE["reuse verdict<br/><small>no call · no credits</small>"]
    CACHE -->|"miss"| ST1

    ST1{"STEP 1<br/>retrieve_analysis<br/><small>FREE</small>"}
    ST1 -->|"hit"| VERD
    ST1 -->|"miss"| ST2

    ST2{"STEP 2<br/>fact_lookup<br/><small>CHEAP · batch the day's probes<br/>charged per query, not per request</small>"}
    ST2 -->|"found"| VERD
    ST2 -->|"thin / not_found"| ST3

    ST3{"STEP 3<br/>trigger_generation<br/><small>BILLABLE</small>"}
    ST3 -->|"📅 weekly · with commissioned_by"| VERD
    ST3 -->|"⏱ daily"| CLOSED["⬛ CLOSED ON THE DAILY TRACK<br/><small>no named human at 09:30<br/>a loop that can start billable work<br/>is the most expensive bug here</small>"]
    CLOSED --> PROMOTE["candidate PROMOTED to ⑦<br/><small>a human may commission it<br/>nothing is lost — it changes clock</small>"]

    REUSE --> VERD
    VERD{"THE VERDICT"}
    VERD -->|"bases MATCH, numbers differ"| DIV["diverges<br/><small>HIGHEST VALUE<br/>these measure the same thing<br/>and do not agree</small>"]
    VERD -->|"bases DIFFER"| DEF["definitional<br/><small>these measure different things<br/>the finding is nobody says so</small>"]
    VERD -->|"crowd is right"| CONF["confirmed<br/><small>low value</small>"]
    VERD -->|"no credible source"| ND["no_data<br/><small>→ INSUFFICIENT_SOURCE</small>"]

    DIV --> GATE
    DEF --> GATE
    CONF --> GATE
    GATE{"source_last_verified<br/>&lt; 30 days?"}
    GATE -->|"yes"| OK["→ ⑥ Angle Desk"]
    GATE -->|"no"| SUP["⬛ row SUPPRESSED<br/><small>publishing 'this is the latest'<br/>without checking is the most<br/>likely error</small>"]

    ND --> NDOUT["→ ⑥ · never the daily track<br/><small>may still carry a distribution finding</small>"]

    B403["403 gtm_budget_exhausted"] -.->|"⏱ daily halts first"| CLOSED
    B403 -.->|"📅 weekly continues"| ST1

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff
    classDef hot fill:#fff3e0,stroke:#e65100,stroke-width:2.5px,color:#bf360c
    class IN,CACHE,REUSE,ST1,ST2,ST3,VERD,GATE,OK,DEF,CONF,ND,NDOUT,PROMOTE,B403 joy
    class CLOSED,SUP stop
    class DIV hot
```

> **The `basis` field decides `diverges` against `definitional`, and it is enforced structurally — the model is
> never asked to make that call.** Reporting a definitional difference as a disagreement is *"the exact
> sloppiness we sell against."*

---

## 3 · ⑥ The Angle Desk — which clock a trend goes to

```mermaid
flowchart TD
    IN["⑤ verdict + trend"] --> G1{"GATE 1 · Source<br/><small>cited, or it does not ship</small>"}
    G1 -->|"no_data, no finding"| X1["⬛ NO_ANGLE"]
    G1 -->|"pass"| G2

    G2{"GATE 2 · Lane<br/><small>whose lane covers this subject?</small>"}
    G2 -->|"no lane fits"| X2["⬛ not generated<br/><small>an empty slot beats<br/>a lane violation</small>"]
    G2 -->|"pass"| G3

    G3{"GATE 3 · Collision<br/><small>anyone else on this subject<br/>this week?</small>"}
    G3 -->|"taken"| X3["⬛ not generated"]
    G3 -->|"free"| G4

    G4{"GATE 4 · Channel and Pillar<br/><small>L21 · Pillar 2 cap<br/>message-stack rule 1</small>"}
    G4 -->|"headline / hero / ad<br/>naming a competitor<br/>or the LLM category"| X4["⬛ BLOCKED<br/><small>the one thing the positioning<br/>exists to avoid</small>"]
    G4 -->|"pass"| ROUTE

    ROUTE{"WHICH CLOCK?"}
    ROUTE -->|"a post responding to<br/>something said today"| D["⏱ DAILY TRACK<br/><small>Type D only<br/>same day · expires 24h</small>"]
    ROUTE -->|"an analysis to commission<br/>or an evergreen answer"| W["📅 WEEKLY TRACK<br/><small>Type A / B<br/>topic board → Wed pick</small>"]
    ROUTE -->|"a distribution finding,<br/>not a content one"| O["OUTREACH<br/><small>roundups · directories<br/>owner: SEO · Q12</small>"]

    X4 -.->|"the exempt channels"| EX["/vs/* · /alternatives/*<br/>social · founder content<br/><small>body copy only</small>"]
    EX --> D

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef new fill:#fff8e1,stroke:#f9a825,stroke-width:1.5px,color:#7f5f00
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff
    class IN,G1,G2,G3,G4,W,EX joy
    class ROUTE,D,O new
    class X1,X2,X3,X4 stop
```

> **Case B in the example is a Gate 4 case.** The highest-velocity trend the engine will see is the one that
> must not become a headline — so it routes to outreach and to a founder post, never to a blog.

---

## 4 · ⑨⑩⑪⑫ Make — and the four ways the model refuses

```mermaid
flowchart TD
    subgraph ASM["⑨ ASSEMBLY DESK — 9 blocks, Joy's order"]
        direction TB
        B1["1 · canonical facts<br/><small>truth layer · halt if missing</small>"]
        B2["2 · prohibitions<br/><small>linter rules as instructions</small>"]
        B3["3 · voice<br/><small>brand-guidelines + CLAUDE.md<br/>NEVER the Voice Cheat Sheet</small>"]
        B4["4 · active failure modes<br/><small>live list, last 60 days</small>"]
        B5["5 · the item brief<br/><small>card schema</small>"]
        B6["6 · source material<br/><small>parent item or retrieve_analysis</small>"]
        B7["7 · ICP message set"]
        B8["8 · voice lane<br/><small>personal posts only</small>"]
        B9["9 · channel constraints"]
        B1 --> B2 --> B3 --> B4 --> B5 --> B6 --> B7 --> B8 --> B9
    end

    B9 --> W["⑩ WRITER"]
    W --> TIER{"model tier"}
    TIER -->|"originate<br/>anything taking a position"| FR["FRONTIER<br/><small>Type A · B · C · founder posts</small>"]
    TIER -->|"transform"| HK["HAIKU<br/><small>~80% of volume<br/>keeps the bill at $40–100/mo</small>"]

    FR --> TOK
    HK --> TOK
    TOK{"control token?"}
    TOK -->|"no source or attribution"| T1["⬛ INSUFFICIENT_SOURCE"]
    TOK -->|"subject outside the lane"| T2["⬛ LANE_MISMATCH"]
    TOK -->|"thread not on topic"| T3["⬛ NOT_RELEVANT"]
    TOK -->|"only reason is a job title"| T4["⬛ INSUFFICIENT_RELEVANCE"]
    TOK -->|"clean"| VIS

    VIS["⑪ VISUAL DESK<br/><small>the atom chart · social cards<br/>NO PROMPT EXISTS · Q5</small>"]
    VIS --> LINT

    subgraph LINT["⑫ LINTER"]
        direction TB
        DET["L01–L11 · DETERMINISTIC<br/><small>regex or table · no model call<br/>banned words · exclamation points<br/>LAM · SOC 2 · stale numbers</small>"]
        SEM["L20–L24 · SEMANTIC<br/><small>a model call each<br/>L20 reader-labour — highest FP risk<br/>L22 must FETCH the source</small>"]
        DET --> SEM
    end

    SEM -->|"fail"| RG{"attempt &lt; 3?"}
    RG -->|"yes"| W
    RG -->|"no"| BL["⬛ linter_blocked<br/><small>surfaced on the dashboard<br/>never looped</small>"]
    SEM -->|"pass"| OUT["→ ⑬ Review Room"]

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,W,TIER,FR,HK,TOK,DET,SEM,RG,OUT joy
    class VIS gap
    class T1,T2,T3,T4,BL stop
```

> **A control token is a success, not an error. It is never retried.** *"The generator refusing is cheaper than
> the linter rejecting, and far cheaper than a reviewer approving something unsourced on a Friday."*

---

## 5 · ⑬⑭ Review and the loop that compounds

```mermaid
flowchart TD
    Q["item in the queue"] --> ENTRY{"which clock?"}
    ENTRY -->|"📅"| N1["Thu 07:00 · one notification<br/>Mon 09:00 · one reminder<br/><small>two a week. no more</small>"]
    ENTRY -->|"⏱"| N2["badge on My Week<br/><small>ZERO notifications</small>"]

    N1 --> MW["MY WEEK<br/><small>the single entry point</small>"]
    N2 --> MW
    MW --> RM["REVIEW MODE<br/><small>full-screen takeover<br/>rail and tabs gone<br/>every action advances<br/>commit on action, no undo</small>"]

    RM --> ACT{"three actions.<br/>no fourth"}
    ACT -->|"APPROVE"| AP["→ ⑮ Hygiene"]
    ACT -->|"HOLD"| HD["stays for discussion"]
    ACT -->|"REJECT"| RJ

    RJ["code + note ≤200 chars<br/><small>10 fixed codes<br/>free text is additional,<br/>never a substitute</small>"]
    RJ --> LG["⑭ LEDGER"]

    LG --> M1["active failure modes<br/><small>→ block 4 of every<br/>later generation</small>"]
    LG --> M2["reject rate by reason<br/>and by channel"]
    LG --> M3["linter defect list<br/><small>every BANNED_TERM is<br/>a rule the linter missed</small>"]

    M1 -.->|"regenerate with the<br/>correction applied"| RM
    M2 --> HEALTH{"reject rate"}
    HEALTH -->|"above 20%"| H1["fix the GENERATOR<br/><small>not the humans</small>"]
    HEALTH -->|"5–15%"| H2["healthy"]
    HEALTH -->|"below 2%"| H3["rubber-stamping<br/><small>tighten criteria, audit a sample</small>"]

    RM -.->|"⏱ 24h elapsed"| EX["⬛ DISCARDED"]
    RM -.->|"📅 Mon 18:00"| HO["⬛ HOLDS<br/><small>TL extends or skips the week<br/>skipping is valid<br/>publishing unreviewed is not</small>"]

    NOEDIT["⛔ NO EDITING<br/><small>reviewers do not rewrite</small>"] -.-> ACT

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef new fill:#fff8e1,stroke:#f9a825,stroke-width:1.5px,color:#7f5f00
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff
    class Q,ENTRY,N1,MW,RM,ACT,AP,HD,RJ,LG,M1,M2,M3,HEALTH,H1,H2,H3,NOEDIT joy
    class N2 new
    class EX,HO stop
```

---

## 6 · ⑮⑯ Hygiene and publish — the branch that is a compliance boundary

```mermaid
flowchart TD
    AP["approved item"] --> BR{"artefact_type<br/><small>branch on the ARTEFACT,<br/>never the item</small>"}

    BR -->|"generated PDF deliverable"| PDF["⛔ NEVER TOUCHED<br/><small>carries a required AI-provenance<br/>mark under EU AI Act Art. 50 2<br/>stripping it is a compliance breach</small>"]
    BR -->|"report page · standfirst ·<br/>atom · every derivative"| PROSE["✅ CLEANED<br/><small>clean-user-facing-text<br/>--no-normalize-spaces<br/>NEVER --aggressive-homoglyphs</small>"]
    BR -->|"images"| IMG["⚠ needs remove-ai-marks<br/><small>WATERMARKS_SERVICE_URL<br/>NOT REACHABLE TODAY · Q6</small>"]

    PROT["PROTECTED SPANS<br/><small>code · commands · paths · URLs<br/>identifiers · exact values<br/>CITATIONS</small>"] -.-> PROSE

    PDF --> PUB
    PROSE --> PUB
    IMG -.->|"blocked until deployed"| PUB

    PUB["⑯ PUBLISHER<br/>Mon 20:00 scheduled<br/>Tue–Sun published"]

    PUB --> CH1["BLOG → caspr.ai<br/><small>CMS write + build trigger<br/>Article · BreadcrumbList · Organization<br/>NEVER aggregateRating</small>"]
    PUB --> CH2["EMAIL → AWS SES<br/><small>⚠ sandbox today · 200/day</small>"]
    PUB --> CH3["LINKEDIN — company<br/><small>Community Mgmt API · dev tier<br/>never request r_member_social</small>"]
    PUB --> CH4["LINKEDIN — personal<br/><small>w_member_social · open permission<br/>5 of 7 granted</small>"]
    PUB --> CH5["X<br/><small>free tier · writes only</small>"]
    PUB --> CH6["COMMUNITIES<br/><small>⛔ NEVER AUTOMATED<br/>the portal drafts. a human posts.<br/>automation burns the channel</small>"]

    STAMP["✅ every outbound link carries<br/>utm_* + icp_hint<br/><small>without it, x is unprovable</small>"] -.-> PUB

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff
    classDef good fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    class AP,BR,PROSE,PROT,PUB,CH1,CH2,CH3,CH4,CH5 joy
    class IMG gap
    class PDF,CH6 stop
    class STAMP good
```

---

## 7 · The fan-out — one analysis becomes 16–23 items

```mermaid
flowchart LR
    A["PUBLISHED ANALYSIS<br/>Type A · 1 per 3 weeks<br/><small>ONE STUDY — $80 at list</small>"]

    A --> I1["report page + PDF<br/><small>×1 · SEO+TL</small>"]
    A --> I2["LinkedIn — Joy<br/><small>×1 · analyst lane</small>"]
    A --> I3["LinkedIn — Jayant<br/><small>×1 · builder lane, OWN ANGLE<br/>never marketing claims or pricing</small>"]
    A --> I4["LinkedIn — rotating<br/><small>×1–2 · own lanes only</small>"]
    A --> I5["X posts<br/><small>×3</small>"]
    A --> I6["THE ATOM<br/><small>×1 · one chart, source-stamped<br/>NO PROMPT EXISTS · Q5</small>"]
    A --> I7["charts as social cards<br/><small>×1–3 · Q5</small>"]
    A --> I8["community contributions<br/><small>×2–4 · human posts</small>"]
    A --> I9["email block<br/><small>×1</small>"]
    A --> I10["search-page updates<br/><small>×2–3 · SEO</small>"]
    A --> I11["outreach hooks<br/><small>×2–3</small>"]

    R1["LANE INTEGRITY<br/><small>no lane fits → not generated<br/>an empty slot beats a violation</small>"] -.-> A
    R2["ONE SUBJECT, ONE PERSON,<br/>ONE WEEK"] -.-> A
    R3["SPREAD ACROSS TWO WEEKS<br/><small>deliberately, not dumped</small>"] -.-> A

    B["SEARCH ANSWER<br/>Type B · 2 per week"] --> J1["×1 X post"]
    B --> J2["×1 team LinkedIn<br/><small>lane-matched</small>"]
    B --> J3["glossary + internal links"]

    MS["/market-size/* pages"] --> MSN["⚠ GENERATED, NOT FANNED OUT<br/><small>the TEMPLATE is reviewed once.<br/>the pages are NOT review-queue items.<br/>this is why the volume plan fits</small>"]

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    classDef rule fill:#f3e5f5,stroke:#6a1b9a,stroke-width:1.5px,color:#4a148c
    class A,I1,I2,I3,I4,I5,I8,I9,I10,I11,B,J1,J2,J3,MS,MSN joy
    class I6,I7 gap
    class R1,R2,R3 rule
```

---

## 8 · ⑱ How it all reaches `x`

```mermaid
flowchart TD
    P["⑯ PUBLISHED<br/><small>every link stamped<br/>utm_campaign + icp_hint</small>"]
    P --> ES["PRODUCT EVENT STREAM<br/><small>tracking-spec.md</small>"]
    ES --> E1["prompt_submitted"] --> E2["signup_completed"] --> E3["analysis_completed"] --> E4["payment_succeeded"]
    E4 --> CO["COHORT<br/><small>signup month<br/>+ first-touch utm_campaign<br/>+ icp_hint</small>"]
    CO --> REV["REVENUE<br/><small>Σ payment_succeeded at 3 and 6 months<br/>CHARGES ACTUALLY TAKEN<br/>never budgets authorised</small>"]
    REV --> X["x = revenue ÷ total GTM spend"]
    X --> X3["x@3<br/><small>the fast signal</small>"]
    X --> X6["x@6<br/><small>the scale gate</small>"]
    X6 --> GATE{"x@6 &gt; 2 ?"}
    GATE -->|"yes"| SCALE["paid opens · Product Hunt<br/>ICPs widen<br/><small>a config change, not a build</small>"]
    GATE -->|"no"| KILL["the machine is not working<br/><small>more media will not fix it</small>"]

    T1["⛔ TRAP 1<br/>booking our own analyses at LIST PRICE<br/><small>overstates spend, understates x<br/>= killing a channel that works<br/>charge ACTUAL MARKED-UP COMPUTE</small>"] -.-> X
    T2["⛔ TRAP 2<br/>counting PAID USERS not REVENUE<br/><small>paying_dormant: $200 authorised,<br/>nothing run, $14 fee<br/>trial-to-paid is retired</small>"] -.-> X

    ATOM["⑪ THE ATOM<br/><small>built to travel<br/>pasted into someone else's deck</small>"] --> PP
    S17["⑰ COMMENTS"] --> PP
    OUT["OUTREACH<br/><small>roundups · directories</small>"] --> PP
    PP["p — PRESENCE<br/><small>one frozen basket per ICP<br/>unbranded only · CPC-tested<br/>baseline 2026-08-25: p = 0</small>"]
    PP --> W1["cited in an AI answer"]
    PP --> W2["listed on a page-one third party<br/><small>6.5× of citations come from here</small>"]
    PP --> W3["our own page ranks page one"]
    W1 --> LEAD["p LEADS · x LAGS<br/><small>x measures whether the machine pays.<br/>p measures whether we exist<br/>at the moment the buyer looks.</small>"]
    W2 --> LEAD
    W3 --> LEAD
    LEAD -.-> X

    classDef joy fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    classDef stop fill:#37474f,stroke:#263238,stroke-width:1.5px,color:#ffffff
    classDef good fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    class P,ES,E1,E2,E3,E4,CO,REV,X,X3,X6,GATE,SCALE,S17,OUT,PP,W1,W2,W3,LEAD joy
    class ATOM gap
    class T1,T2,KILL stop
```

---

## 9 · Who does what — the swimlane

```mermaid
flowchart TD
    subgraph MACHINE["⚙ MACHINE — minutes, unattended"]
        M1["② listen · ③ trend · ④ claim"]
        M2["⑤ verify — Caspr calls"]
        M3["⑥ angle · ⑧ work order"]
        M4["⑨ assemble · ⑩ write · ⑫ lint"]
        M5["⑮ hygiene · ⑯ publish"]
        M6["⑭ ledger · ⑱ meter"]
    end

    subgraph HUMAN["👤 HUMAN — where the clock actually goes"]
        H1["⑦ TOPIC BOARD — Joy picks<br/><small>Wed 15:00 · the highest-leverage<br/>decision in the system</small>"]
        H2["trigger_generation<br/><small>commissioned_by: a named person.<br/>rejected if absent</small>"]
        H3["⑬ REVIEW — 3 people<br/><small>origination 8–15 min<br/>derivative 1–2 min<br/>62–77 of ~450 weekly minutes</small>"]
        H4["⑰ COMMENTS — 14/week<br/><small>2 per person · outside the gate<br/>a fact, a number, a counter-example</small>"]
        H5["COMMUNITY POSTS<br/><small>always, without exception</small>"]
    end

    subgraph JAYANT["🔒 BLOCKED ON JAYANT"]
        B1["service principal<br/><small>the blocking item — nothing<br/>integrates without it · Q3</small>"]
        B2["AI__BASE_URL confirmation"]
    end

    subgraph DECIDE["❓ BLOCKED ON JOY — 13 open questions"]
        D1["Q1 the watchlist"]
        D2["Q4 topic board screen"]
        D3["Q5 how the atom chart is made"]
        D4["Q6 hygiene service deploy"]
        D5["Q13 the daily track — approved?"]
    end

    M1 --> M2 --> M3 --> M4 --> M5
    M3 -.->|"📅 weekly only"| H1
    H1 --> H2
    M4 --> H3 --> M5
    M5 --> H4 --> H5
    M5 --> M6

    B1 -.->|"blocks"| M2
    D1 -.->|"blocks"| M1
    D3 -.->|"blocks"| M4
    D5 -.->|"blocks"| M3

    classDef mach fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef hum fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef blk fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    class M1,M2,M3,M4,M5,M6 mach
    class H1,H2,H3,H4,H5 hum
    class B1,B2,D1,D2,D3,D4,D5 blk
```

---

## 10 · Build order

```mermaid
flowchart LR
    P1["PHASE 1<br/>⑨ assembly · ⑩ writer<br/>⑫ linter · ⑭ ledger<br/><small>BLOCKED ON NOTHING<br/>the data model falls out of ⑨</small>"]
    P2["PHASE 2<br/>⑧ work order · ⑬ review<br/><small>one item end to end<br/>against mocks</small>"]
    P3["PHASE 3<br/>⑮ hygiene · ⑯ publisher<br/><small>needs SES production<br/>+ CMS write path</small>"]
    P4["PHASE 4<br/>⑤ verifier<br/><small>needs the SERVICE PRINCIPAL</small>"]
    P5["PHASE 5<br/>② ③ ④ ⑥ ⑦<br/><small>the intake half<br/>needs Q1 Q2 Q4 Q10</small>"]
    P6["PHASE 6<br/>⑪ visual · ⑰ comments<br/><small>needs Q5 Q6 Q8</small>"]
    P6B["PHASE 6b<br/>⏱ daily track<br/><small>a trigger, a flag, a timer<br/>needs Q13</small>"]
    P7["PHASE 7<br/>⑱ meter<br/><small>needs the app live</small>"]

    P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P6B --> P7

    START["START HERE<br/><small>list every brace in ⑨ and name its source.<br/>the data model for all eighteen stations<br/>falls out of that one exercise, and no<br/>open question touches it</small>"] --> P1

    classDef go fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef wait fill:#fff8e1,stroke:#f9a825,stroke-width:1.5px,color:#7f5f00
    classDef start fill:#e3f2fd,stroke:#1565c0,stroke-width:2.5px,color:#0d47a1
    class P1,P2 go
    class P3,P4,P5,P6,P6B,P7 wait
    class START start
```

---

*Document: `content-engine-flowchart.md` · 2026-09-08 · The diagrams for
[`content-engine-runtime-spec.md`](content-engine-runtime-spec.md). **This file holds no rules.** Where a
diagram and the spec disagree, the spec is correct and the diagram is a bug — report it rather than following
it. Worked examples: [`content-engine-example.md`](content-engine-example.md).*
