# Caspr App — Copy Standards & ICP Vocabulary (Lingo)

**Purpose:** the copy rules for all product UI, and how ICP-variable terms resolve. Companion to the brand voice in `.agents/brand-guidelines.md` (`CLAUDE.md` summary) and the vocabulary model in `document-taxonomy.md §Lingo`. Applied in a copy-editing pass 2026-08-10.

---

## 1. Voice (recap)

**The Trusted Senior Analyst** — speaks in conclusions, not caveats; numbers, not adjectives; dry wit, never announced; respectful of the reader's intelligence. **No exclamation points, ever.** Calibration: *"15 minutes. 100 pages. Cited to source."*

**Never use:** exclamation points · platform · leverage(s) · algorithms · workflows · powerful AI · robust · seamless · revolutionary · game-changing · chatbot · web scraping · hallucinate · "excited to announce" · "Here's how:". *(A guardrail — the current UI copy contains none of these; keep it that way.)*

---

## 2. Copy standards (consistency — enforce in build)

- **Terminology:** "**budget**" never "plan"; "**analysis**" = the act, "**report / document**" = the output; capitalise **Data Room · Research Budget · Brief · Study · Intelligence**; file states are **Included / Excluded / Public / Private**.
- **"Top up"** (verb) / **"top-up"** (noun). Don't mix.
- **Currency:** exact balances → two decimals (`$186.00`, `$51.00`); round marketing/price figures → no decimals (`$80`, `$200/mo`). *(Legacy `$186` vs `$186.00` drift — standardise on build.)*
- **Sentence case** for UI labels and buttons (not Title Case), except brand/product proper nouns.
- **Errors** carry the reason + the reassurance (e.g. "Upload failed — file exceeded 25 MB limit"; "Payment declined … no funds were taken"). Red text only — no tint fills, no stripes.

### Edits applied this pass
| Where | Was | Now |
|---|---|---|
| Gate (compose) | "Happy to dig in. What angle —…" | "Let's scope it. What angle —…" |
| Wallet pane | "Increase your budget for more depth and features." | "More budget, more depth — Business unlocks upload, editing, Intelligence." |
| Payment failed | "…no money left your account." | "…no funds were taken." |

---

## 3. ICP-variable vocabulary — the **Lingo** layer

**Model (already locked — `document-taxonomy.md §Lingo`):** the schema stores only stable internal **slugs**; what the user sees is resolved by a `(slug × account-ICP) → label` lookup **in the personalization layer**. This is a **product-side decision, not a design or Caspr-editorial one** — the displayed word is chosen by the user's ICP, not hardcoded.

- **Canonical display** = the most common word the audience actually uses (jargon wins when it's the real term — "TAM", "DD", "IC Memo").
- **ICP alias** exists only where an ICP genuinely uses a different word. e.g. `business_case` → **Business Case** (default) · **Pitch Deck** (founder) · **Sales Deck** (sales) · **Board Paper** (strategy); `market_sizing` → **TAM**; `due_diligence` → **DD**.

### Which screen strings are Lingo tokens (resolve at runtime)
Only **deliverable Type / Sub-type labels**, wherever they surface:
- **Documents** — Type/Sub-type filter pills + any card type tag.
- **Gate** — the intent-confirmation deliverable options.
- **Compose / landing** — the discovery / accelerator chips.

### Fixed (NEVER ICP-variable)
Depths (**Brief / Study / Intelligence**), file states (Included / Excluded / Public / Private), wallet & budget terms, and all system/UI labels. These never alias.

### Design & dev rule
- **Figma always shows the canonical/default label** (analyst-neutral) — never a hardcoded ICP word. In the file, a Documents pill reads "Business Case", not "Pitch Deck".
- The screen specs **mark those strings as Lingo tokens** (`{lingo: business_case}`) so dev wires the `(slug × ICP)` lookup. Mapping table of record: `document-taxonomy.md §Lingo`.
- **Product-managed:** the alias table is owned in the personalization layer; adding/adjusting an ICP alias is a config change, not a design change.

**Consequence (from §Lingo §254):** discovery chips and intent-confirmation options must read in sub-type / situation lingo, not type names — a founder sees "Size my market (TAM)" and "Build my pitch deck," never "Market Research" / "Business Case."

---

*Owner: Joy · 2026-08-10. Enforced at build; Lingo table lives in `document-taxonomy.md §Lingo`.*
