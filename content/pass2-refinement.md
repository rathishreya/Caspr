# Content Repository — Pass 2 Refinement

*Autonomous pass, 2026-08-08. Reconciles the content set against the dev-session functionality specs finalized this session (`docs/product/*`). Governs the workbook update + the pass-2 writing/visual production.*

## Sources read
- `data-room-screens.md` (NEW, 2026-08-08) — the Data Room feature
- `account-wallet-screens.md` (2026-08-08) — Account/Wallet/Profile/Security **and the in-app Get Help screen spec (§6b)**
- `gate-output-spec.md` — gate, output formats, languages, style, generation, Ask/Contents/Versions/Outputs/Updates
- `caspr-figma-state-registry.md` — the real frame node IDs (replaces the generic F1–F22 placeholders)

## Decision 1 — Surface split (website vs app)
The in-app **Get Help** screen (`account-wallet-screens.md §6b`) curates the FAQ under **6 pills: All · Basics · Analyses · Pricing · Reports · Account**, reading answers straight from this repository. That fixes the split:

| Category | Surface | In-app Help pill |
|---|---|---|
| A Getting Started | **Both** | Basics |
| B What Makes Caspr Different | **Website** (positioning/SEO) | — |
| C Running an Analysis | **App** (+Both) | Analyses |
| D Understanding Your Report | **App** | Reports |
| E Editing & Refining | **App** | Reports/Analyses |
| F Pricing & Budget | **Both** | Pricing |
| G Account, Security & Teams | **App** | Account |
| H Use Cases by Role | **Website** | — |
| I Troubleshooting | **App** | (folded into relevant pills) |
| J Glossary | **Both** (SEO pages + in-app tooltips) | — |
| **K Data & the Data Room** (NEW) | **App** | Account/Analyses |

Rule of thumb: **Website** = demand-creation (differentiators, use-cases, glossary, pricing). **App** = the how-to/support a signed-in user needs. **Both** = pricing, getting-started, glossary.

## Decision 2 — New cards to add (~28)
Functionality that had no card. Briefs carry the key facts from the specs so writers need no further reading.

**K · Data & the Data Room (App)** — 10 cards
- K-01 What is the Data Room? · K-02 What file types can I upload (PDF/XLSX/CSV/DOCX + paste-a-link) · K-03 How to upload a file · K-04 Private vs Public files · K-05 Included vs Excluded · K-06 Stop Caspr using a file without deleting it (→ Excluded) · K-07 How to delete a file (delete vs Excluded) · K-08 Connect a source — Bloomberg/Refinitiv/S&P/PitchBook (**Coming soon**) · K-09 Are my uploaded files private & secure · K-10 Can I organise files into Projects

**C · Running an Analysis (App)** — 3
- C-10 What is the gate (confirm before you generate) · C-11 Change the report before it generates (Tier/formats/language/style; Tier rebuilds layout) · C-12 Can I pause or stop a generation (no — atomic; edit after)

**D · Understanding Your Report (App)** — 7
- D-08 Output formats by tier · D-09 Report in another language · D-10 Change the style/template · D-11 What is Ask Caspr · D-12 How citations work (in-app: inline red dots → scoped answer; sources = last card) · D-13 What are Versions · D-14 What is the Contents view · D-15 What are Updates (**Coming soon**) · D-16 What is Theater · D-17 The charts & visuals in my report

**E · Editing (App)** — 1
- E-05 Get more formats/languages after generation (Outputs tab → Generate Output)

**G · Account/Wallet (App)** — 6
- G-08 The Wallet / where I see my balance · G-09 The Research profile / how Caspr learns about me · G-10 Change language or output style (Preferences) · G-11 Secure my account (password, 2FA, devices) · G-12 Reset vs Delete account · G-13 Contact support / Get Help (in-app: browse FAQ + message support)

**A · Getting Started (Both)** — 1
- A-12 What happens when I sign up (signup drops you into the tool; first checkpoint = the gate)

## Decision 3 — Reconciliations & flags
- **C-05** (upload data) → superseded by **K**; keep as a pointer, retarget to Business-tier + Data Room.
- **B-05 / D-12** — B-05 is the website "how citations work" positioning piece; **D-12** is the in-app mechanic (red-dot → scoped Ask; full sources on the report's last card).
- **Output pricing evolved:** base output set is **included by tier** (Brief: PDF·MD; Study/Intelligence: PDF·PPTX·XLSX·CSV·MD); beyond base = **per-output** (PDF/DOCX/XLSX/CSV $5, PPTX $10, MD free); extra languages = per-output. **No quota / no top-up pack** (retired). Pricing cards flag `[VERIFY vs .agents/pricing-model.md §4.6]`.
- **Coming soon (do not present as live):** Connect-a-source, Updates, custom templates, Intelligence-depth phase-2 items.

## Decision 4 — Frames are ready
All "Await Figma frames" cards flip to **buildable**; generic F1–F22 placeholders are replaced with the real node IDs from `caspr-figma-state-registry.md` (see workbook `Figma Frames Needed` + `Frame Manifest`). F20 (a real generated sample report export) is the only remaining external dependency for 3 sample-report cards.

## Totals
82 existing + 28 new = **110 cards**. Pass-2 writing = 33 previously-deferred + 28 new = **61 answers**. Pass-1's 49 answers + 30 non-UI visuals already done.
