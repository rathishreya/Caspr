# Content Engine — One Case, Drawn

*2026-09-09. The whole machine, as one trend moving through it.*

**This is [`content-engine-example.md`](content-engine-example.md) drawn instead of described.** Same case,
same numbers, same citations — the reasoning and the sources live there. **Where the two differ, the example is
correct and this is a bug.**

The abstract diagrams are in [`content-engine-flowchart.md`](content-engine-flowchart.md); the rules are in
[`content-engine-runtime-spec.md`](content-engine-runtime-spec.md).

---

## The case

> **Two research firms size the UK ready meals market differently.**
> 🟢 One says `$5.86bn` at `4.95%` CAGR. The other says `$6.46bn` at `12.4%`.
> **Same definition. Same base year. Neither page mentions the other.**

🟢 Real — [`index-engine.md`](index-engine.md) §1. And 🟢 the analysis already exists in the corpus:
*UK Ready Meals Market: Sizing and Analysis v1*, one of the three going on `/samples`.

🔵 Only the thread that starts it is illustrative — no listener is live yet.

---

## The whole thing on one page

```mermaid
flowchart TD
    T["🔵 A consultant asks in a public thread:<br/><b>'IBISWorld and Mintel are ~10% apart.<br/>Which one goes in the client deck?'</b>"]
    T --> ENG(["THE ENGINE"])

    ENG --> CHK{"Can we source it?<br/><b>ask Caspr</b>"}
    CHK -->|"no"| NOTHING["⬛ Nothing is written.<br/>Nothing goes out."]
    CHK -->|"yes — and the sources<br/>genuinely disagree"| SPLIT

    SPLIT{"How fast does<br/>this need to move?"}
    SPLIT -->|"⏱ today"| DAY["<b>SAME DAY</b><br/>an X post + a LinkedIn post<br/>saying WHAT IS HAPPENING"]
    SPLIT -->|"📅 properly"| WK["<b>WEEK 6</b><br/>the published analysis<br/>saying WHAT IS TRUE"]

    DAY --> H1{"a person<br/>approves<br/><small>90 seconds</small>"}
    WK --> H2{"a person<br/>approves<br/><small>10–15 min</small>"}

    H1 --> OUT1["live in 40 minutes"]
    H2 --> OUT2["live in week 6<br/>+ <b>16–23 more items</b><br/>over the next two weeks"]

    OUT1 --> M["Did it bring revenue?<br/><b>every link is tagged</b>"]
    OUT2 --> M

    classDef start fill:#f5f4f2,stroke:#3c3c3a,stroke-width:1.5px,color:#1a1a19
    classDef eng fill:#fdecea,stroke:#e8453c,stroke-width:2.5px,color:#8e2019
    classDef day fill:#fff8e1,stroke:#f9a825,stroke-width:2px,color:#7f5f00
    classDef wk fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef hum fill:#e3f2fd,stroke:#1565c0,stroke-width:2.5px,color:#0d47a1
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    class T,M start
    class ENG,CHK,SPLIT eng
    class DAY,OUT1 day
    class WK,OUT2 wk
    class H1,H2 hum
    class NOTHING stop
```

> **That is the whole engine.** Everything below is the same journey, one step at a time, with the real values
> in the boxes.

---

## Step 1 · The thread is read

```mermaid
flowchart LR
    W["<b>THE WATCHLIST</b><br/>the rooms our buyers are in<br/><small>Joy names them · Q1</small>"]
    W --> R["reddit · r/consulting"]
    R --> P["🔵 <b>'Client wants a UK ready meals<br/>market size. IBISWorld and Mintel<br/>are ~10% apart and I can't tell<br/>which to put in the deck.'</b><br/><small>71 upvotes · 23 replies · practitioner</small>"]

    P --> STORE[("stored<br/><small>text · url · time<br/>engagement · author type</small>")]

    NEVER["⛔ <b>NEVER</b><br/>posts · replies · votes · follows<br/><small>automated posting here burns<br/>the channel permanently</small>"] -.-> R

    classDef a fill:#f5f4f2,stroke:#3c3c3a,stroke-width:1.5px,color:#1a1a19
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    class W,R,P,STORE a
    class NEVER stop
```

**Read-only. Every day.**

---

## Step 2 · It turns out to be a trend, not a one-off

```mermaid
flowchart LR
    A["🔵 last week<br/><b>6 mentions</b>"]
    B["🔵 this week<br/><b>31 mentions</b>"]
    A --> B
    B --> V{"rising?"}
    V -->|"5× in a week"| YES["<b>TREND</b><br/><small>it has a window</small>"]

    C["a question asked<br/>100× every week"] --> V2{"rising?"}
    V2 -->|"flat"| NO["<b>CONSTANT</b><br/><small>not news — that is<br/>an evergreen SEO page</small>"]

    YES --> AUD{"who is asking?"}
    AUD -->|"🔵 78% practitioners"| KEEP["<b>PROMOTE</b>"]
    AUD -->|"students"| DROP["demote<br/><small>advertisers will not pay $300<br/>to reach an undergraduate</small>"]

    classDef a fill:#f5f4f2,stroke:#3c3c3a,stroke-width:1.5px,color:#1a1a19
    classDef good fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef meh fill:#eceff1,stroke:#78909c,color:#37474f
    class A,B,C,V,V2,AUD a
    class YES,KEEP good
    class NO,DROP meh
```

> **Velocity, not volume.** A question asked constantly belongs to SEO. A question rising this week has a
> window, and the window is the point.

---

## Step 3 · The claim is pulled out — with its **basis**

```mermaid
flowchart TD
    T["the trend<br/><small>'conflicting market size estimates'</small>"]
    T --> C1["<b>CLAIM 1</b><br/>UK ready meals ≈ $5.9bn<br/><small>basis: retail packaged, 2024<br/>source: IBISWorld</small>"]
    T --> C2["<b>CLAIM 2</b><br/>UK ready meals ≈ $6.5bn<br/><small>basis: retail packaged, 2024<br/>source: Mintel</small>"]

    C1 --> B{"does it carry<br/>a <b>basis</b>?"}
    C2 --> B
    B -->|"yes"| GO["→ ask Caspr"]
    B -->|"no"| STOP["⬛ unusable<br/><small>we do not guess what<br/>a number is measuring</small>"]

    NOTE["<b>basis</b> = what is actually being measured<br/><small>retail packaged · incl. meal kits · EBITDA multiple · NTM revenue</small><br/><br/><b>This one field decides everything in step 4.</b>"] -.-> B

    classDef a fill:#f5f4f2,stroke:#3c3c3a,stroke-width:1.5px,color:#1a1a19
    classDef key fill:#fdecea,stroke:#e8453c,stroke-width:2.5px,color:#8e2019
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    class T,C1,C2,B,GO a
    class NOTE key
    class STOP stop
```

---

## Step 4 · Caspr is asked — and it costs nothing

```mermaid
flowchart TD
    S["🔵 <b>09:30</b> · the claims"]
    S --> Z{"asked this<br/>recently?"}
    Z -->|"yes"| REUSE["reuse · <b>no call</b>"]
    Z -->|"no — first sighting"| S1

    S1{"<b>STEP 1</b><br/>have we already<br/>analysed this?<br/><small>FREE</small>"}
    S1 -->|"✅ <b>HIT</b>"| FOUND["🟢 <b>'UK Ready Meals Market:<br/>Sizing and Analysis v1'</b><br/><small>209 KB · already in the corpus<br/>credits charged: <b>0</b></small>"]
    S1 -->|"miss"| S2

    S2{"<b>STEP 2</b><br/>is it a single fact?<br/><small>CHEAP</small>"}
    S2 -->|"found"| FOUND
    S2 -->|"nothing"| S3

    S3{"<b>STEP 3</b><br/>commission new research<br/><small>BILLABLE</small>"}
    S3 -->|"📅 weekly · a NAMED person asks"| OKC["allowed"]
    S3 -->|"⏱ daily · nobody is there at 09:30"| NOC["⬛ <b>CLOSED</b><br/><small>a loop that can start billable<br/>work is the most expensive<br/>bug available here</small>"]
    NOC --> PROM["the question is <b>handed to<br/>next Wednesday's list</b><br/><small>a person can commission it there.<br/>nothing is lost — it changes clock</small>"]

    FOUND --> V{"<b>THE VERDICT</b>"}
    REUSE --> V

    V -->|"bases MATCH,<br/>numbers differ"| D1["🔥 <b>THEY DISAGREE</b><br/>$5.86bn / 4.95%<br/>vs $6.46bn / 12.4%<br/><small>THIS IS THE STORY</small>"]
    V -->|"bases DIFFER"| D2["<b>THEY MEASURE<br/>DIFFERENT THINGS</b><br/>$5.75bn narrow →<br/>$8.70bn incl. pizza + meal kits<br/><small>and nobody says so</small>"]
    V -->|"the crowd is right"| D3["confirmed<br/><small>low value</small>"]
    V -->|"no credible source"| D4["⬛ <b>nothing is written</b>"]

    classDef a fill:#f5f4f2,stroke:#3c3c3a,stroke-width:1.5px,color:#1a1a19
    classDef good fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef hot fill:#fff3e0,stroke:#e65100,stroke-width:3px,color:#bf360c
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    class S,Z,REUSE,S1,S2,S3,V,OKC,PROM,D2,D3 a
    class FOUND good
    class D1 hot
    class NOC,D4 stop
```

> **This case produced two verdicts, and that is the finding.** Most of the spread is definitional. **What
> survives after you control for definition is a real disagreement — and no page says which is which.**

---

## Step 5 · Four gates, then the fork

```mermaid
flowchart TD
    IN["the verified trend"]
    IN --> G1{"<b>1 · Can we cite it?</b>"}
    G1 -->|"no"| X1["⬛ nothing"]
    G1 -->|"✅"| G2

    G2{"<b>2 · Whose subject is this?</b>"}
    G2 -->|"nobody's"| X2["⬛ nothing<br/><small>an empty slot beats<br/>writing outside a lane</small>"]
    G2 -->|"✅ <b>Joy — the analyst</b>"| G3

    G3{"<b>3 · Is anyone else<br/>on this subject this week?</b>"}
    G3 -->|"taken"| X3["⬛ nothing"]
    G3 -->|"✅ free"| G4

    G4{"<b>4 · Does the channel<br/>allow it?</b>"}
    G4 -->|"a headline naming<br/>a competitor"| X4["⬛ blocked"]
    G4 -->|"✅"| FORK

    FORK{"<b>WHICH CLOCK?</b>"}
    FORK -->|"a post about what<br/>is happening today"| D["⏱ <b>DAILY</b><br/><small>same day</small>"]
    FORK -->|"an analysis worth<br/>publishing properly"| W["📅 <b>WEEKLY</b><br/><small>next Wednesday's list</small>"]

    BOTH["🔵 <b>This case went BOTH ways.</b><br/>A post today. An analysis in week 6."] -.-> FORK

    classDef a fill:#f5f4f2,stroke:#3c3c3a,stroke-width:1.5px,color:#1a1a19
    classDef day fill:#fff8e1,stroke:#f9a825,stroke-width:2px,color:#7f5f00
    classDef wk fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    classDef key fill:#fdecea,stroke:#e8453c,stroke-width:2.5px,color:#8e2019
    class IN,G1,G2,G3,G4,FORK a
    class D day
    class W wk
    class X1,X2,X3,X4 stop
    class BOTH key
```

---

## Step 6 · ⏱ The daily track — live in forty minutes

```mermaid
flowchart LR
    A["<b>09:40</b><br/>verdict"] --> B["<b>09:50</b><br/>2 items ordered<br/><small>no calendar slot used</small>"]
    B --> C["<b>09:55</b><br/>drafted<br/><small>cheap model — it is<br/>transforming, not writing</small>"]
    C --> D["<b>10:05</b><br/>machine checks the voice<br/><small>banned words · no exclamation<br/>· sources resolve</small>"]
    D --> E["<b>10:10</b><br/>👤 <b>a person approves</b><br/><small>90 seconds<br/>no notification — a badge</small>"]
    E --> F["<b>10:15</b><br/>cleaned"]
    F --> G["<b>10:20</b><br/>🚀 <b>LIVE</b><br/><small>tagged so we can trace it</small>"]

    OUT["🔵 <b>'Two research firms size the UK ready meals market on the<br/>same 2024 basis. One says $5.86bn at 4.95% CAGR. The other<br/>says $6.46bn at 12.4%. Neither page mentions the other.'</b>"] -.- G

    EXP["⏱ <b>if nobody approves in 24h<br/>it is DISCARDED</b><br/><small>a stale response is not a response.<br/>this is what stops a backlog</small>"] -.-> E

    NOT["<b>What it did NOT do:</b><br/>resolve the gap · name a winner · average them<br/><small>that is the analysis's job</small>"] -.- OUT

    classDef a fill:#fff8e1,stroke:#f9a825,stroke-width:1.5px,color:#7f5f00
    classDef hum fill:#e3f2fd,stroke:#1565c0,stroke-width:2.5px,color:#0d47a1
    classDef live fill:#e8f5e9,stroke:#2e7d32,stroke-width:2.5px,color:#1b5e20
    classDef note fill:#f5f4f2,stroke:#9e9e9a,color:#3c3c3a
    class A,B,C,D,F a
    class E hum
    class G live
    class OUT,NOT,EXP note
```

---

## Step 7 · 📅 The weekly track — a person picks

```mermaid
flowchart TD
    L["<b>Wednesday 15:00</b><br/>the 30-minute review<br/><small>same agenda every week</small>"]
    L --> LIST["🔵 <b>THE LIST</b>"]

    LIST --> R1["1 · AI research tool comparisons<br/><small>44 mentions · rising<br/>⚠️ <b>we cannot source it well</b></small>"]
    LIST --> R2["2 · vet practice multiples<br/><small>38 mentions · rising<br/>✅ sourced · but the crowd is right</small>"]
    LIST --> R3["3 · <b>conflicting market size estimates</b><br/><small>31 mentions · rising<br/>✅ sourced · <b>and they disagree</b></small>"]

    R1 -.->|"most mentions —<br/>and demoted anyway"| WHY["<b>a question we cannot<br/>source well makes a<br/>weak analysis</b>"]

    R3 --> PICK["👤 <b>Joy picks #3</b>"]
    PICK --> COMM["she commissions it<br/><small>her name goes in the record.<br/>the call is rejected without it</small>"]

    NOTE["<b>The best question is often the third.</b><br/><small>high demand, genuinely answerable,<br/>and nobody credible has answered it</small>"] -.- PICK

    GAP["🔴 <b>NO SCREEN EXISTS FOR THIS</b><br/><small>23 screens are drawn. this is not one of them · Q4</small>"] -.-> LIST

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef hum fill:#e3f2fd,stroke:#1565c0,stroke-width:2.5px,color:#0d47a1
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2.5px,color:#8e0000
    classDef note fill:#f5f4f2,stroke:#9e9e9a,color:#3c3c3a
    class L,LIST,R1,R2,R3,COMM a
    class PICK hum
    class GAP gap
    class NOTE,WHY note
```

---

## Step 8 · Thursday 06:00 — the week is built in one run

```mermaid
flowchart LR
    CAL["<b>the calendar says</b><br/><small>week 6 · analysis lands<br/>theme: where numbers come from<br/>audience: consultants</small>"]
    TOP["<b>Joy's pick</b><br/><small>UK ready meals</small>"]
    CAL --> WO
    TOP --> WO

    WO["<b>ONE RUN · Thursday 06:00</b><br/><small>minutes, not days</small>"]

    WO --> I1["<b>1</b> the analysis"]
    WO --> I2["<b>2</b> blog answers"]
    WO --> I3["<b>5</b> LinkedIn posts"]
    WO --> I4["<b>3</b> X posts"]
    WO --> I5["<b>5</b> community drafts"]
    WO --> I6["<b>4</b> outreach drafts"]
    WO --> I7["<b>3</b> SEO tasks"]

    I1 --> TOT["<b>~23 items</b><br/><small>62–77 minutes to approve<br/>against ~450 available</small>"]
    I4 --> TOT

    SIZE["<b>the engine reads how many review<br/>minutes exist and never exceeds them</b>"] -.-> WO
    PLUS["<b>+ 14 comments</b> · outside the queue<br/><b>+ market-size pages</b> · template reviewed once, pages not"] -.- TOT

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef key fill:#fdecea,stroke:#e8453c,stroke-width:2px,color:#8e2019
    classDef note fill:#f5f4f2,stroke:#9e9e9a,color:#3c3c3a
    class CAL,TOP,WO,I1,I2,I3,I4,I5,I6,I7,TOT a
    class SIZE key
    class PLUS note
```

---

## Step 9 · Thursday to Monday — a person decides

```mermaid
flowchart TD
    Q["23 items waiting"] --> MW["<b>My Week</b><br/><small>one notification Thursday<br/>one reminder Monday<br/>that is all</small>"]
    MW --> RM["<b>full screen</b><br/><small>nav disappears.<br/>one item at a time.</small>"]

    RM --> A1["✅ the analysis"]
    RM --> A2["✅ blog answers"]
    RM --> A3["✅ Joy's LinkedIn"]
    RM --> A4["❌ <b>Amit's LinkedIn</b>"]
    RM --> A5["✅ X posts · community drafts"]

    A4 --> RJ["<b>reject with a reason</b><br/>🔵 <small>OFF VOICE — 'reads as marketing.<br/>Amit's lane is what shipped and<br/>what broke, not positioning'</small>"]

    RJ --> LG["<b>the ledger remembers</b>"]
    LG --> REGEN["it is rewritten with<br/>the correction applied"]
    LG --> FUT["<b>and that note goes into every<br/>future draft for 60 days</b><br/><small>so the same mistake does not return</small>"]

    NOEDIT["⛔ <b>reviewers never rewrite.</b><br/><small>they reject. the engine fixes it.</small>"] -.-> RM
    HEALTH["🔵 <b>1 rejection in 23 = 4.3%</b><br/><small>above 20% → fix the engine, not the people<br/>below 2% → people are rubber-stamping</small>"] -.- LG

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef hum fill:#e3f2fd,stroke:#1565c0,stroke-width:2.5px,color:#0d47a1
    classDef note fill:#f5f4f2,stroke:#9e9e9a,color:#3c3c3a
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    class Q,MW,A1,A2,A3,A5,RJ,LG,REGEN,FUT a
    class RM hum
    class A4 stop
    class NOEDIT,HEALTH note
```

---

## Step 10 · Monday 20:00 — the branch that is a legal boundary

```mermaid
flowchart TD
    OK["approved"] --> BR{"<b>what kind of thing is it?</b>"}

    BR -->|"the PDF we generated"| PDF["⛔ <b>DO NOT TOUCH IT</b><br/><small>it carries a legally required<br/>AI mark under EU law.<br/>stripping it is a breach</small>"]
    BR -->|"the web page, the post,<br/>the summary"| PROSE["✅ <b>clean it</b><br/><small>invisible characters that break<br/>copy-paste and screen readers</small>"]
    BR -->|"images"| IMG["⚠️ <b>needs a service<br/>that is not running yet</b><br/><small>Q6 — until it deploys,<br/>images do not publish</small>"]

    PROT["<b>never touched, even in prose:</b><br/>links · numbers · <b>citations</b><br/><small>a mangled citation is a broken proof</small>"] -.-> PROSE

    PDF --> PUB["<b>PUBLISH</b>"]
    PROSE --> PUB

    KEY["<b>Same item. Opposite rules.</b><br/><small>we MARK what we sell.<br/>we CLEAN what we publish about ourselves.</small>"] -.- BR

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2.5px,color:#8e0000
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    classDef key fill:#fdecea,stroke:#e8453c,stroke-width:2.5px,color:#8e2019
    class OK,BR,PROSE,PROT,PUB a
    class IMG gap
    class PDF stop
    class KEY key
```

---

## Step 11 · Tuesday to Sunday — it goes out

```mermaid
flowchart LR
    P["approved + cleaned"] --> TUE["<b>TUE</b><br/>the report page + PDF<br/>Joy's LinkedIn<br/>1 X post"]
    P --> WED["<b>WED</b><br/>company page · 1 X post<br/>👤 community drafts —<br/><b>a human posts them</b>"]
    P --> THU["<b>THU</b><br/>Jayant's LinkedIn<br/><small>his own angle: why<br/>reconciling sources is hard</small>"]
    P --> FRI["<b>FRI</b><br/>2nd blog answer<br/>1 X post"]
    P --> MON["<b>MON</b><br/>team post · email"]

    TAG["✅ <b>every single link carries a tag</b><br/><small>without it we can never say which<br/>post earned which customer</small>"] -.- P

    WHY["<b>Joy posts Tuesday</b> because colleagues<br/>need to comment within the hour<br/>and a mid-week morning is when<br/>that is realistic"] -.- TUE

    LANE["<b>Jayant's is not a version of Joy's.</b><br/><small>his lane excludes pricing and marketing claims,<br/>so he writes about the engineering</small>"] -.- THU

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef note fill:#f5f4f2,stroke:#9e9e9a,color:#3c3c3a
    classDef key fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    class P,TUE,WED,THU,FRI,MON a
    class WHY,LANE note
    class TAG key
```

---

## Step 12 · One analysis becomes twenty items

```mermaid
flowchart LR
    A["<b>ONE ANALYSIS</b><br/>🟢 one Study — <b>$80</b>"]

    A --> O1["report page + PDF"]
    A --> O2["Joy's LinkedIn"]
    A --> O3["Jayant's LinkedIn"]
    A --> O4["team posts ×1–2"]
    A --> O5["X posts ×3"]
    A --> O6["🔴 the chart<br/><small>no prompt exists · Q5</small>"]
    A --> O7["🔴 social cards ×1–3<br/><small>Q5</small>"]
    A --> O8["community drafts ×2–4"]
    A --> O9["email block"]
    A --> O10["search-page updates ×2–3"]
    A --> O11["outreach hooks ×2–3"]

    O1 --> T["<b>16–23 items</b><br/><small>spread across two weeks,<br/>never dumped in one</small>"]
    O11 --> T

    R["<b>the engine is not a writing machine.</b><br/><b>it is a fan-out machine.</b><br/><small>2–3 real pieces of research a week<br/>become forty pieces of content</small>"] -.- A

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef gap fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#8e0000
    classDef key fill:#fdecea,stroke:#e8453c,stroke-width:2.5px,color:#8e2019
    class A,O1,O2,O3,O4,O5,O8,O9,O10,O11,T a
    class O6,O7 gap
    class R key
```

---

## Step 13 · Did it work?

```mermaid
flowchart TD
    PUB["published · every link tagged"] --> EV["someone clicks"]
    EV --> S["they sign up"]
    S --> R["they run an analysis"]
    R --> PAY["<b>they pay</b>"]
    PAY --> X["<b>we can say which post<br/>brought that revenue</b>"]

    X --> M3["<b>month 3</b> · the early read"]
    X --> M6["<b>month 6</b> · <b>the decision</b>"]
    M6 --> G{"did every $1 of spend<br/>bring more than $2?"}
    G -->|"yes"| SCALE["<b>open paid.</b> widen the audience.<br/><small>a settings change, not a rebuild</small>"]
    G -->|"no"| STOP2["<b>the machine is not working —<br/>and more advertising will not fix it</b>"]

    T1["⛔ <b>TRAP</b><br/>charging ourselves list price for<br/>our own research would make the<br/>spend look bigger than it is —<br/><b>and kill a channel that works</b>"] -.-> X
    T2["⛔ <b>TRAP</b><br/>counting paid <i>users</i> instead of <i>revenue</i><br/>hides someone who authorised $200,<br/>ran nothing, and paid $14"] -.-> X

    P["<b>and the leading signal:</b><br/>does Caspr appear when a buyer<br/>searches or asks an AI?<br/><small>today, on every question tested: <b>no</b></small>"] -.- X

    classDef a fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef stop fill:#37474f,stroke:#263238,color:#ffffff
    classDef key fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    class PUB,EV,S,R,PAY,X,M3,M6,G,SCALE a
    class T1,T2,STOP2 stop
    class P key
```

---

## What this one case cost

| | |
|---|---|
| **Caspr credits** | 🟢 **$0** — the analysis already existed, so the lookup was free |
| **Same-day post** | 🔵 **~2 minutes** of a person's time, live in 40 |
| **The week's 23 items** | 🟢 **62–77 minutes**, across three people |
| **The analysis itself** | 🟢 **$80** — one Study, and the parent of 16–23 items |
| **Things a person wrote from scratch** | 🟢 **2.5** for the whole week |

---

## Where it would have stopped

**Nine hard stops appear in the diagrams above. Every one is deliberate.**

| Where | What happens |
|---|---|
| No source | ⬛ **Nothing is written.** The engine refuses before the checker has to reject |
| A claim with no basis | ⬛ Unusable. We do not guess what a number measures |
| Sources older than 30 days | ⬛ Suppressed rather than published |
| Nobody's lane covers it | ⬛ **An empty slot beats writing outside a lane** |
| Someone else has the subject this week | ⬛ Not generated |
| A headline naming a competitor | ⬛ Blocked — that is the one thing the positioning exists to avoid |
| The voice check fails three times | ⬛ Flagged to a person. Never looped |
| ⏱ Nobody approves within 24 hours | ⬛ **Discarded.** Never carried forward |
| 📅 Nobody approves by Monday | ⬛ **It holds. We skip the week** — and skipping is a valid outcome |

> **The engine's most-used feature is refusing to publish.**

---

## Three things this case shows that are not yet built

| | 🔴 |
|---|---|
| **Step 7** | **No screen exists for the list Joy picks from.** 23 screens are drawn; this is not one · **Q4** |
| **Step 12** | **No prompt exists for the chart or the social cards** the fan-out already promises · **Q5** |
| **Step 10** | **The image-cleaning service is not reachable**, so images cannot publish · **Q6** |

**And one thing nobody can start without:** 🔴 the **machine credential** that lets the engine call Caspr at
all is not issued · **Q3**.

---

*Document: `content-engine-walkthrough.md` · 2026-09-09 · The same case as
[`content-engine-example.md`](content-engine-example.md), drawn rather than described. **Where the two differ,
the example is correct.** Rules: [`content-engine-runtime-spec.md`](content-engine-runtime-spec.md).
Abstract diagrams: [`content-engine-flowchart.md`](content-engine-flowchart.md).*
