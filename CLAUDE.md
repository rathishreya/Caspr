# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Rules

Mandatory constraints — apply in every session:

1. **One folder only — the hard access boundary (Joy, 2026-08-18).** A session rooted at **`G:\My Drive\Caspr\caspr-claude-core`** may read, write, and operate **only inside that folder**, with **every** tool — Read, Edit, Write, Glob, Grep, and the Bash / PowerShell shells alike. **Never touch anything outside it:** not the sibling `Caspr\1. … 8.` business folders or `Top Reports` (Joy's own), not any other Google Drive folder, not any `C:\…` local path. Do **not** add directories here (no `--add-dir`, no `additionalDirectories`). If a task seems to need a file outside this folder, stop and ask — do not reach for it. The only permitted out-of-folder touches are: (a) the session's own **harness scratchpad** for throwaway temp files, and (b) the **dev-session exception** below.
   - **Dev-session exception:** the dev session is launched with `--add-dir` for the LOCAL code folders under `C:\Users\joysh\Claude-Local\` — `caspr-website` (website), `caspr-app` (product **frontend**) and `caspr-backend` (product **backend**, split out 2026-08-22) — git/GitHub-managed, never copied to Drive. It reads specs from this Drive folder and writes code locally. No other session gets local access. (Reorganized 2026-08-18: the old `C:\Users\joysh\caspr\…` tree was consolidated into `C:\Users\joysh\Claude-Local\` and removed.)
   - **CODE ONLY in the local folders — HARD RULE (Joy, 2026-08-18).** The local repos hold **app code and their own README(s). Nothing else.** Every other file — specifications, decision records, design handoffs and responses, status trackers, question logs, configuration references, migration runbooks, research, copy — belongs on Drive under **`docs/app-handoff/`**, and belongs there *only*. Do not write a `.md` into the local repo, and do not keep a "convenient copy" of a Drive document beside the code.
     - **Why:** two live copies of a document is not redundancy, it is a fork. `THEATER-SOURCE-DECODE-MOTION.md` existed in both places and the copies drifted, so "the spec" stopped having a single answer. Drive is the single source of truth because that is where Joy and the design session read and write; the repo is a build artefact that gets cloned, moved and re-cloned. On 2026-08-18 the repo moved from `C:\Users\joysh\caspr\` to `C:\Users\joysh\Claude-Local\` — anything that had lived only in the repo would have moved with it, silently.
     - **The line:** code is source, tests, config, build files, and migration **SQL**. `README.md` and `README-DEV.md` stay, because a repo whose run instructions live elsewhere cannot be cloned and run. Everything else moves.
     - **Applied 2026-08-18:** 24 documents were moved out of `caspr-app` into `docs/app-handoff/` and removed from the repo — including `QUESTIONS-FOR-JOY.md`, `HANDOFF-2026-08-17-PROGRESS.md`, `BUILD-STATUS.md`, the whole `FIGMA-*` exchange, and `deploy/CONFIGURATION.md` → `docs/app-handoff/CONFIGURATION.md`.
   - **The team repositories — HARD RULE (Joy, 2026-08-20; split 2026-08-22; portal added 2026-08-25).** Three repos, shared with Jayant's team, and nothing pushes anywhere else:

     | Local folder | Remote | Holds |
     |---|---|---|
     | `Claude-Local\caspr-app` | `https://github.com/caspr-ai/caspr-frontend.git` | the SPA, `packages/*`, the reference AI service |
     | `Claude-Local\caspr-backend` | `https://github.com/caspr-ai/caspr-backend.git` | the Python API service |
| `Claude-Local\caspr-team-portal` | `https://github.com/caspr-ai/caspr-gtm-portal.git` | the GTM portal for `team.caspr.ai` — ⚠ **folder and remote are named differently**, and that is deliberate, not a mistake to "fix" |

     `caspr-product` was **renamed** to `caspr-frontend` by Jayant — GitHub still redirects, but the remote is set to the new name and the old one should not be typed. The earlier personal remote `Caspr-Joy/Caspr-app` is **retired: never push to it again**; it was removed from the local clone's git config rather than renamed, so a habitual `git push` cannot reach it.

     **Secrets follow the split, and that is the point of it.** Each repo has its own gitignored `.env`. The backend holds the database, SES, Stripe and legacy-S3 values; the frontend holds only `VITE_*`, which are public the moment the app is built. **Never put a server secret in the frontend repo** — the reason the split earns its cost is that the frontend tree no longer contains the RDS password.
   - **Enforcement:** file tools are confined to this folder because `additionalDirectories` is kept empty (`.claude/settings.json`); the shells are bound by this written rule. A May 2026 mistake — deliverables scattered into the business folders — is what this rule exists to prevent.
2. **Role: Autonomous marketing engineer.** Work is scoped to marketing engineering tasks — copy, campaigns, landing pages, analytics, automation, and related assets.
3. **No external data exfiltration.** Do not transmit files or content from this directory to external services without explicit user approval.
4. **Web access via `WebFetch`.** Use the built-in `WebFetch` tool for live web reads. Firecrawl is not installed. Do not bulk crawl without user approval.

5. **Working standard — depth before output (Joy, 2026-08-20).** The research and the recorded conversations *are* the asset. Producing from summaries when the source is available is the failure mode this rule exists to stop. Seven rules, each with a test:

   | | Rule | Test |
   |---|---|---|
   | **5.1** | **Name the sources before producing.** State which sources bear on the task and which were actually opened — by filename and section. If something relevant exists and was skipped, say so and why | Is there a visible list, naming files rather than categories? |
   | **5.2** | **Primary over summary. Always.** A table, index or reference doc is a map. Never write from a map when the territory exists. `icp-personas.md` over `site-truth` §2.1. A real report over a report spec. The live page over the doc describing it | Can a specific line from the primary source be quoted as the origin? |
   | **5.3** | **Prior sessions are a source, not history.** Months of decisions, rejected options and reasoning are searchable via `search_session_transcripts`. Search before assuming something is new, undecided or untried | Were transcripts searched before claiming something is open? |
   | **5.4** | **Existing output is evidence, not an anchor.** Read what exists — to know the bar and what is already solved. Then state explicitly what is kept and why, what is departed from and why. Never inherit its frame by default; never ignore it either | Is there an explicit keep/depart list with reasons? |
   | **5.5** | **Traceable, or flagged as invented.** If a headline, claim or recommendation cannot be pointed at a research finding, a recorded decision or a stated assumption, it is invented — and is labelled as invented rather than presented as derived | For each line, can its origin be named? |
   | **5.6** | **Diagnose the layer before redrafting.** When work is rejected, name whether it failed on input, structure or craft *before* touching it. If distinct substance per item cannot be stated, the problem is upstream and redrafting makes it worse | Was the failing layer named before v2? |
   | **5.7** | **If gathering feels like a detour, it is the work.** The moment "I should go look at that" is deferred because there is output waiting, this rule has already been broken | Was a lookup deferred in order to keep producing? |

   **Why this exists.** The strongest line on the website — *"Your library closed at 9pm. Your case brief doesn't care."* — was not invented. It was lifted from a day-in-the-life narrative at `icp-personas.md` line 709. Good copy here is **found in the research, not generated over it**. Working from the summary table instead produced eight interchangeable headlines. Rule 5.5 is the same standard the product itself is sold on: cited, or it does not ship.

6. **Text hygiene before publication — HARD RULE (Joy, 2026-08-19; written 2026-08-24).** **Nothing generated leaves this organisation for a public surface until it has been through a hygiene pass.** Applies to every published marketing artefact: web copy, blog and search pages, social posts, emails, outreach messages, ad creative, and any image or PDF published as a marketing asset.

   **Two skills, and they are not interchangeable:**

   | Skill | Does | Needs |
   |---|---|---|
   | **`anthropic-skills:clean-user-facing-text`** | Deterministic Unicode pass on prose — zero-width characters, homoglyphs, anomalous spaces — plus a single voice-preserving rewrite | Self-contained Python scripts. **No service.** This is the default |
   | **`anthropic-skills:remove-ai-marks`** | The same, plus container and image metadata (C2PA, EXIF, XMP AI flags) and optional detection | **An HTTP service** at `WATERMARKS_SERVICE_URL`. Currently **not reachable** |

   **Operational constraints, learned by reading the skills rather than assuming:**
   - **`remove-ai-marks` is a thin client over a service that must be running.** The engine runs on AWS, not on Joy's laptop — the standing instruction is *"remove the dependency on my laptop being turned on."* **The service deploys alongside the portal, or the rule is unenforceable in production**
   - Use `--no-normalize-spaces` by default. **Do not use `--aggressive-homoglyphs`, `--nfkc` or `--strip-emoji-glue`** — they alter multilingual text and typography
   - **Prose only.** Protect code, commands, paths, URLs, identifiers, exact values, formulas and citations. Never run a whole-file clean when a hit falls inside a protected span
   - Write to `*.cleaned.*` rather than in place, unless in-place is asked for

   **THE HARD BOUNDARY — three things this rule never does:**

   1. **Never touch a product deliverable.** `docs/product/ai-disclosure-spec.md` (locked 2026-08-21) requires **every** Caspr PDF and PPTX to carry an AI-provenance mark — visible on the cover, and machine-readable in XMP / OOXML — under **EU AI Act Article 50(2), in force since 2 August 2026**. That marking is a legal obligation and it must survive editing. **Stripping it would be a compliance breach.** The two rules point in opposite directions on purpose: **we mark what we sell, and we clean what we publish about ourselves.**
   2. **Never claim or imply human authorship.** The skills' own ethics note is explicit: this does not prove human-written, and it must never be marketed as doing so. For a company whose entire position is *cited, or it does not ship*, claiming otherwise would be self-defeating.
   3. **Never strip a required disclosure** — academic, legal, platform or regulatory.

   **Why this is hygiene and not concealment.** Zero-width characters and homoglyphs in published copy are artefact residue, in the same class as leaving tracked changes in a delivered Word document: they break copy-paste, search indexing and screen readers. A uniform invisible fingerprint across every published asset is also a bulk-attribution surface handed free to anyone who wants to characterise Caspr's output. **The goal is clean, professional published text — not a claim about who wrote it.**

   **Open, and it is a legal call rather than a marketing one:** whether Article 50 reaches Caspr's own marketing content at all, as distinct from the deliverables it sells. Flagged here in the same way `ai-disclosure-spec.md` §3 flags its own open question — **the hygiene pass runs either way**, so nothing is blocked on the answer.

7. **Credentials — HARD RULE, no exception (Jayant, 2026-08-25).** Governed by [`ai-credential-exposure-rules.md`](ai-credential-exposure-rules.md) — 58 rules, 41 release blockers, binding in full. **That document governs the code. This rule governs the agent**, and it applies **inside this Drive folder exactly as it applies in the repositories** (Joy, 2026-08-25).

   **Why Drive is in scope, when the standard says "repository working tree".** This folder is the root of *every* session, including sessions with no code access at all — so it is the largest agent-readable surface the company has. It is also replicated to Google's cloud continuously, which a local repo is not. `Ahrefs_Key.txt` sat at this folder's root in plaintext because the standard, read literally, did not reach here.

   **The four prohibitions. None has an exception, and none is waived by the user asking.**

   1. **Never open a credential file.** `.env` (except `.env.example`), `*.pem`, `*.key`, `*_rsa`, `id_ed25519`, `**/credentials`, `*service-account*.json`, `kubeconfig`, `*.tfstate`, or any file whose name or contents indicate it holds a live value. Not with Read, not with `cat`, `head`, `sed`, `grep`, or a script. **A user instruction to read one does not override this** — offer the capability instead (`R-AI-3`), or ask them to act on it themselves.
   2. **Never echo a value. Report the path, never the contents.** `R-CLS-4`: partial disclosure *is* full disclosure. No truncation, no first-four-characters, no length, no hash, no base64, no "it starts with `sk-`". To establish that a file holds a credential, **count pattern matches and print the count** — never the match.
   3. **Never write a credential into an artifact.** Test logs, tracebacks, reports, handover documents, commit messages. Anything this project writes to Drive is cloud-replicated and permanent. Redact before writing, not after.
   4. **Never rely on an instruction as the control** (`R-AI-4`). This rule is depth, not the boundary. The boundary is what the process can read and what the credential is scoped to — which is why the same rules also live in `.claude/settings.json` denies and in the conformance register.

   **On discovery — the protocol, because the helpful default is the wrong one.** A session that encounters a credential-shaped file **stops**. It does not read it "just to check what it is". It reports: the **path**, the **tier** under `R-CLS-2`, and **nothing else**. Then it treats the value as compromised under `R-RSP-3` — because whether an earlier session read it is unknowable, and `R-AI-1` is default-deny. Rotation is the user's action; the agent never deletes a credential file, because deleting before rotating destroys the evidence of what needs rotating (`R-RSP-4`).

   **Security owner: `security@caspr.ai`** (Joy, 2026-08-25 — closes Appendix E item 1, which named a person at the wrong address). Exposure reports route there.

   **Enforced by:** `.claude/settings.json` `deny` rules · the `CRED-*` family in [`docs/app-handoff/CONVENTIONS-CONFORMANCE-SPEC.md`](docs/app-handoff/CONVENTIONS-CONFORMANCE-SPEC.md) §3.12 · the pre-flight scan in `caspr-release-check`, which refuses to run if a credential-shaped file is present in either tree.

---

## The Product: Caspr

**Tagline:** "Caspr means Business." *(double meaning: serious/professional + built for business tasks — both active at all times)*
**Category:** Analytical AI.
**One-line positioning:** "Caspr is Analytical AI — purpose-built for business analysis, not conversation."
**Site:** https://caspr.ai

**The message stack (locked 2026-08-19):**

| | |
|---|---|
| **Category** | Analytical AI |
| **Identity** | **Not an assistant. An analyst.** |
| **Promise** | **Arrive certain.** |
| **Proof** | **Every source, credible. Every claim, triangulated. Every report, defensible.** |

**Three rules that come with it:**

1. **Never name a competitor or the LLM category in lead copy.** Naming them concedes we are in the same
   category. The contrast with generative AI is *category education* — it belongs on `/vs/*` pages, in social
   and in founder content, never in a hero, a headline or an ad.
2. **Never frame proof as work for the reader.** "Verify", "check the working", "traceable", "audit it
   yourself" all sell the reader more labour, which contradicts the promise. The evidence is present and
   surfaced on demand — it is never an instruction. Citations answer *"when the room asks"*, not
   *"so you can confirm we are telling the truth."*
3. **Analyst, not advisor and not expert.** Advisor competes with the buyer — consultants, strategy teams and
   agency strategists *are* the advisor. Expert asks to be trusted on reputation, which Caspr does not have.
   An analyst is trusted for how the work was done, which is the only trust Caspr can earn.


Caspr is **Analytical AI** — purpose-built for business analysis, not conversation. A user enters a single-line prompt, Caspr proposes a structured layout, asks clarifying questions, then delivers a boardroom-ready 100-page PDF or editable PPTX in under 15 minutes — citing every insight to a credible source.

Two proprietary systems power it:
**Three stages — and they are the proof line, restated as an architecture.** Full spec:
[`docs/source-assess-conclude.md`](docs/source-assess-conclude.md)

- **Source** — *every source, credible.* The 25M+ curated corpus, the live feeds that keep it current, and your own material
- **Assess** — *every claim, triangulated.* Reconciling what the sources disagree on, and separating a definitional difference from a genuine one
  - ⚠ **The middle word is *Assess*, not *Weigh* — settled 2026-08-27** ([`docs/source-assess-conclude.md`](docs/source-assess-conclude.md) §2A). This file carried *Weigh* against the new clause until 2026-09-01, which meant every session that loaded it reintroduced the retired word. Two reasons it lost: the clauses were **not parallel** — *source* and *report* are nouns, *weighed* was an adjective — and ***weigh* leans on *weights***, core ML vocabulary. Having just retired *thinking* for being colonised, adopting a second contested word would be the same mistake twice. **The units nest: source → claim → report**
- **Conclude** — *every report, defensible.* A position that survives the room, not a summary

**⛔ Retired 2026-08-27: the Thinking Brain and the Learning Brain, together.** *Thinking* is now a loading
state on every frontier model — the word said *we do what every chatbot does*. *Learning* was never accurate;
nothing learns. **Never reintroduce either, or the word *brain*.**

25M+ curated, credible sources (documents, government databases, news feeds — not web scraping). Zero hallucinations. Every insight shown with its source.

**Do not use "LAM."** The architecture claim is not yet ready to defend publicly. Use "Analytical AI," **"Source. Assess. Conclude."**, or "purpose-built for analysis."

**⛔ "The Signal" vs "Caspr Signals" — a live name collision. Get this right (Joy, 2026-08-26).**

| | What it is | Status |
|---|---|---|
| **The Signal** | The **opinion and sentiment layer inside a report** — synthesised blocks drawn from crowd-sourced-but-credible sources: Reddit, Quora, social, forums, news, sentiment analysis. Visually and epistemically distinct from cited findings. `app-shell-framework.md` §17 · `report-style-guide.md` §9a | **Real. Singular. The only correct use of the word** |
| ~~Caspr Signals~~ | A tiered watched-topic digest — *"1 topic / 3 topics / unlimited"* on the plan cards | **RETIRED.** It **folds into Insights**, and there is no separate product called Signals |

**Never write "Caspr Signals", never tier it, never sell watched topics.** Where a plan card or spec still lists
it, that text is stale. **The Signal is not a plan feature and is never priced** — it is part of what a report
contains.

**Still stale and needing a sweep:** `.agents/pricing-model.md` §12.2 and the tier tables · `.agents/product-marketing-context.md` feature gates · `.agents/gtm-strategy.md` §7 · `docs/legal/refund-policy.md` · `strategy/caspr-product-features-roadmap.md` · the Figma `/pricing` and `/enterprise` plan cards.

**Pricing (Research Budget model — pending Jayant compute cost validation):**
- **The four modes — renamed 2026-08-26. `Try · Solo · Team · Org` supersedes `Professional · Business · Enterprise`.** Full model: [`docs/product/access-model.md`](docs/product/access-model.md)

  | Mode | Budget | Unlocks |
  |---|---|---|
  | **Try** | none — $100 gifted, no card, 90-day expiry · then top up as you go | Every depth · every output purchasable · Ask Caspr · citations |
  | **Solo** | **$200 a month of research** *(~$186 for analyses)* | + editing · Updates · collaboration *(view)* |
  | **Team** ⭐ | **$600 a month of research** *(~$558)* | + Data Room · collaborative editing |
  | **Org** | **$1,800 a month, committed** *(~$1,674, pooled)* · 3 seats min | + Org-scoped Data Room · SSO · API · Projects · 24/7 · deployment quoted |

  **The plan name is the entity — deliberately.** `Org → Team(s) → User`, and the Data Room scopes reuse the same three words. **Team is the recommended mode** — the only rung that puts a second person in the account.
  **Org alone is committed spend** (used or lost); Try, Solo and Team delta-recharge.
- **$300 depth à la carte:** $399 one-off (no subscription required)
- **Custom template:** $1,000 one-time **per template** (three for $2,500) · Business and above may purchase · Enterprise includes the first · **Phase 1.5 — not live at launch, never present as available**. **Custom-template requests** answered **within 2 hours, round the clock, all year** — unqualified as to hours, and a positioning asset, not just an ops promise. **Scoped to that inbox only — never write it as general "2-hour support"**
- One charge per month. 7% platform fee is internal — never shown to users. Unused analysis balance carries forward automatically (delta recharge restores only what was consumed).
- **⛔ NEVER present the Research Budget as a subscription price.** It is money the user sets aside to spend on their own analyses, and the monthly charge tracks what they ran.

  **The arithmetic, exactly — `pricing-model` §3.1. `R = F + top_up`:**

  | $200 budget · `F` = $14 · cap `A` = $186 | Charged |
  |---|---|
  | Month 1 | **$200** *(balance becomes $186)* |
  | Ran nothing | **$14** — the fee alone |
  | Ran one $80 analysis | **$94** — $80 restores the balance, plus the fee |
  | Ran $175 | **$189** |

  **⚠ The fee is charged every month regardless of usage**, so *"you are only charged for what you run"* is **false** and must never be written. **What is true:** *unused balance carries forward* · *the next month restores only what you consumed* · *a quiet month costs much less than a busy one*.

  | ⛔ Never | ✅ Always |
  |---|---|
  | *from $200/mo* · *$200 per month* · *starting at $200* · *the $200 plan* | *$200 a month of research* · *set aside $200 for research* · *a $200 Research Budget* |

  **The number never travels alone.** It carries **_"unused balance carries forward"_** or **_"each month restores only what you consumed"_** in the same breath, or it reads as a bill. **⛔ Never *"only what you run is recharged"*** — that phrasing denies the fee and is the false claim above. **Applies everywhere the figure appears — website, GTM collateral, decks, emails, and inside the app.** Enforced as `COPY-11a` / `COPY-11b`.
- **Analysis prices — three depths: `$15 · $80 · $300`. The price points are universal. The names are not.**

  | Deliverable type | $15 | $80 | $300 |
  |---|---|---|---|
  | Market Research | Brief | Study | Intelligence |
  | Investment & Deal | Screen | Thesis | Diligence |
  | Business Case | Pitch *(no $300)* | Sales deck · Board paper · Proposal | Board paper · Strategic options |
  | Academic Research | **$8** Brief | **$40** Study | *(none)* |

  **⛔ Never write a depth name without its type.** *"Brief · Study · Intelligence"* on its own is the
  **Market Research** ladder being passed off as universal — it is the single most-repeated error in this
  project, and it has reached the website, the Figma file and the content library more than once. Write
  **"the $300 depth"** when you mean the rung across all types; write **"a Study"** only when the subject is
  Market Research. Availability exceptions are real and must travel with the ladder wherever it appears:
  **Market Sizing has no $15 · Executive Profile has no $300 · pitch decks have no $300 · Strategic Options has no $15.**

  $300 depth à la carte **$399** · Premium Data Add-on **$20–60** (opt-in, shown pre-run) · **Primary data is an
  add-on, not a type** — synthetic panels are **AI-simulated**, never "primary research"; fielded survey is deferred, quote-based
- Full model, payment rules, refund policy, and engineering specs: [`.agents/pricing-model.md`](.agents/pricing-model.md)

Full detail: [`.agents/product-marketing-context.md`](.agents/product-marketing-context.md) — the master reference

---

## Content Pillars

Every piece of content maps to at least one:

**Reordered 2026-08-20 and synced here 2026-08-24.** This table had kept the retired four-pillar order while [`brand-guidelines.md`](.agents/brand-guidelines.md) carried the reordered five — which is where the content library's `Pillar` column got its now-corrected numbering from. **`brand-guidelines.md` §Content Pillars is the authority; this is a summary of it.**

| Pillar | Promise | Proof | Weight |
|---|---|---|---|
| **1. An Analyst, Not an Assistant** | Caspr does the analyst's work — reads the market, reconciles what the sources disagree on, reaches a conclusion | **Source · Assess · Conclude**, 25M+ curated sources, live data, **every claim triangulated** | **~42%** |
| **2. Analytical AI** | Purpose-built for analysis, not conversation | Analysis is scoped, methodical, and it concludes. **Category education only** — `/vs/*`, `/alternatives/*`, social and founder content. Never a hero, headline or ad | ~18% |
| **3. From Weeks to Minutes** | Analyst-grade output in under 15 minutes | Boardroom-ready PDF or PPTX, follow-up refinement. **Supporting, not leading** — speed commoditises and cannot carry the position | ~8% |
| **4. A Fraction of the Cost** | Institutional quality, no institutional price | A Study at $80 against $5,000–50,000. **The third act, never the hook** | ~20% |
| **5. Your Data is Your Data** | Enterprise-grade security, built in rather than bolted on | ISO 27001:2022 · GDPR · uploaded data never trains a model. **Never the lead** — it surfaces at the moment of trust | ~12% |

**Weights are the twelve-week output share** ([`docs/gtm/content-calendar.md`](docs/gtm/content-calendar.md) §4), not a ranking of importance.

**Retired numbering, for reading anything written before 2026-08-20:** `1 Weeks-to-Minutes · 2 Analyst-Grade · 3 Fraction-of-Cost · 4 Analytical AI`. Maps to the above as **1→3, 2→1, 3→4, 4→2**.

---

## Brand Identity

**Visual:** Heavy editorial serif + red dot period. Palette: Black · White · Red (~`#E8453C`). Register: FT / Bloomberg / The Economist — premium business press, not a tech startup.

**Voice: The Trusted Senior Analyst**
Speaks like the most credible person in the room. Arrives with the numbers done, speaks in conclusions not caveats, never wastes a word. Not a helpful colleague — the authoritative source you trust in front of a board.

| Attribute | Meaning |
|---|---|
| Precise | Every word earns its place. No padding. |
| Authoritative | Conclusions, not descriptions. No hedging. No exclamation points — ever. |
| Dry wit | Intelligence is the humour. Never announced, never explained. |
| Commercially sharp | Numbers anchor everything. "15 minutes" not "fast." "90% cheaper" not "affordable." |
| Respectful | Trusts the reader's intelligence. Never over-explains. |

**Approved copy (tone calibration).** Tiered — a line's tier is where it may appear, not how good it is.

**Lead copy — hero-eligible**
- *"Not an assistant. An analyst."* — **the homepage H1** (locked 2026-08-20)
- *"Any question your board will ask — answered, sourced, and ready before they ask it."* — homepage subhead
- *"Arrive certain."*
- *"Every source, credible. Every claim, triangulated. Every report, defensible."*
- *"You were hired to evaluate businesses. Not to be a research librarian."* — `/investors`
- *"Your library closed at 9pm. Your case brief doesn't care."* — `/academic`
- *"You research for a living. You still have to research before you can research."* — `/market-research`

**Supporting — folds, proof lines and ad creative. Never a hero**
- *"15 minutes. 100 pages. Cited to source."* — **demoted 2026-08-20.** True, and still good on the how-it-works fold. Leading on speed and length puts Caspr in a race it loses as the category commoditises
- *"The $200,000 question. For $80."* — cost is the third act
- *"Analyst-grade insights. Without the analyst retainer."*

**Category education only — `/vs/*`, social, founder content. Never a hero, headline or ad**
- *"While the world was building generative AI, we built analytical AI."*

**Retired**
- *"Stop Googling. Start analyzing."* — names a competitor's product, and instructs the reader that they are doing it wrong. Both off-register
- *"Your competitors are still waiting for the research."* — speed-led and combative; the voice is calm authority, not rivalry
**Avoid:** exclamation points, platform, leverages, algorithms, workflows, powerful AI, revolutionary, game-changing, chatbot, web scraping, hallucinate, "excited to announce", "Here's how:"

Full brand guidelines: [`.agents/brand-guidelines.md`](.agents/brand-guidelines.md)

---

## ICP (Ideal Customer Profile)

1. **Consulting firms** — speed up desk research, cut junior analyst hours
2. **Strategy teams / C-suite — incl. Corporate Development** — on-demand intelligence without retaining a firm; corp dev is a strategy function that executes through acquisition
3. **Investors** (PE, VC, Hedge Funds, Family Offices) — deal sourcing, due diligence, M&A as financial deal-making
4. **Category managers** (retail, eCommerce) — market sizing, competitive landscape
5. **Marketing & Ad agencies** — client industry deep-dives, pitch research
6. **Graduate researchers** (Masters, PhD) — market context, literature synthesis
7. **Market Research professionals** — the unbillable pre-fieldwork desk research layer on every engagement
8. **Startups (fundraising)** — investor-ready business cases, market sizing

*Candidate, not developed:* **Lawyers / in-house counsel** — surfaced by the Legal Document deliverable type; postponed (no landing page or app surface yet).

**The two acquirer lenses (Joy, 2026-08-19).** Corporate Development and Investors look at the same acquisition and want different reports. A **financial acquirer** (ICP 3) buys for *return on capital* — the asset stands alone. A **strategic acquirer** (corp dev, under ICP 2) buys for *fit with the business already owning it* — synergy, capability, defensive position. The output shape is similar; **the vocabulary and lead metric differ.** Encoded in `docs/report-guidance/report-style-guide.md` §10.2 / §10.3 / §10.7.

**Core pain:** They pay $50K–$500K+ and wait weeks. Caspr delivers comparable output in 15 minutes from $14/month access — up to 90% cheaper.

---

## Funnel & Success Metrics

### The old cohort — history, not a baseline (restated 2026-08-20, Joy)

| Stage | Status |
|---|---|
| Signups | **1,600+** |
| Activated (≥1 report generated) | **Unknown — never measured** |
| Paid users | **~2** (<0.1% conversion) |

**These numbers describe a retired pitch, not Caspr.** That cohort arrived through positioning that no longer exists (*"AI for Market Research"*), retired pricing (Free / Plus $50 / Pro $200), website messaging that contradicted the product, and targeting that was never ICP-specific. **A conversion rate measured on a cohort acquired that way describes the acquisition, not the product** — the likelier reading is that the wrong people signed up with the wrong expectation.

**Do not quote 0.1% as evidence about the product, and do not size plans against it.**

### The strategy is forward-looking

A net-new funnel run correctly for the first time: **the right message, in front of the right ICP, arriving with an accurate understanding of the value, carried from awareness to paid.** Repeatable, instrumentable, scalable. **Whatever the existing 1,600 yields is a bonus, not the plan.**

**Nothing activates until the rebuilt website and app are both live.** No campaign, no sequence, no paid, no content push. Driving anyone into the old surfaces spends the one thing that cannot be re-spent — a first impression. Waiting two weeks costs nothing when what follows is materially better.

Full reasoning: [`.agents/gtm-strategy.md`](.agents/gtm-strategy.md) §1 and §2.

### KPIs
| Metric | Target |
|---|---|
| Activation rate (signup → first report) | **Net-new cohort.** Baseline → 40%+ |
| Trial-to-paid | **Net-new cohort.** Target 3–5% |
| Time-to-first-report | Minimise |
| MRR | Track weekly |

**Success filter:** Positive ROI across the full pipeline. Signups without activation = failure.

**Proof points available:** Senior market research professionals willing to give written + video testimonials — collecting these is the highest-priority conversion asset.

---

## Marketing Framework: Corey Haines

### 1. Foundational Positioning
Anchor: *"Your research workflow is broken. Caspr fixes it — analyst-grade output, 15 minutes, from $14/month."* Every asset speaks to a specific pain. Broad messaging is a failure state.

### 2. Distribution Loops (Watering Hole Strategy)
Find where each ICP already spends time before creating content:
- **Consulting / Strategy:** LinkedIn strategy hashtags, MBA forums, Management Consulted community
- **Investors:** VC/PE Twitter-X, LP newsletters, AngelList
- **Agencies:** Agency Slack groups, LinkedIn agency communities
- **Academics:** ResearchGate, university communities

### 3. Content as an Asset
- **Programmatic SEO:** *"[industry] market research report"*, *"business case for [X] in [country]"*, *"market size of [industry]"*, *"acquisition targets in [sector]"*
- **Educational:** Answer the exact questions the ICP asks before/during/after buying. Every piece needs clear search intent and a clear next step.

### 4. Conversion
Path: landing page → free signup → first report generated → Aha! moment → upgrade. Optimise for minimum steps to first report. Caspr's free tier and zero-contract model removes every friction point — lead with it.

---

## Immediate Priorities

1. Ship the rebuilt website and app — **the gate on everything else**
2. Collect written + video testimonials from senior market research professionals
3. Instrument the net-new funnel before launch (`docs/gtm/tracking-spec.md`) · re-engage the 1,600 once live — a bonus, not the plan

---

## Reference Files

- [`.agents/product-marketing-context.md`](.agents/product-marketing-context.md) — **the master reference.** Product identity, user journey, business model, all 8 ICPs, competitive positioning, messaging architecture, claims, objections, customer language, funnel data. *(Was `strategy/caspr-gtm-reference.md` until 2026-08-20.)*
- [`.agents/brand-guidelines.md`](.agents/brand-guidelines.md) — voice, tone, content pillars, copy rules, approved/rejected examples
- [`.agents/pricing-model.md`](.agents/pricing-model.md) — Research Budget model, analysis prices, feature milestones, billing rules, refund policy, engineering specs
- [`docs/report-guidance/README.md`](docs/report-guidance/README.md) — **how Caspr reports read and look.** The single operative source for output generation and rendering: voice, per-type content constraints, ICP registers, visual system across PDF/PPTX/data. Start here, not at the individual specs. *(Absorbed `docs/report-design/`, which no longer exists.)*
- [`2. Caspr.ai - Content Guidelines.pdf`](2.%20Caspr.ai%20-%20Content%20Guidelines.pdf) — original draft (superseded by brand-guidelines.md)
- [`CONCEPTS.md`](CONCEPTS.md) — shared domain vocabulary: what Depth, Hold, Research Budget, Persona and Half mean here. Relevant when orienting to the product or writing about it.
- [`docs/solutions/`](docs/solutions/) — documented solutions to past problems, organised by category with YAML frontmatter (`module`, `tags`, `problem_type`). Relevant when implementing or debugging in an area somebody has already been wrong about.
