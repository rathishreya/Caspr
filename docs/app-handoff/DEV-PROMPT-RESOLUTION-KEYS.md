# DEV PROMPT — carry the report-guidance resolution keys through the app

**For:** the dev session (app + its own proxy APIs)
**From:** Joy · 2026-08-21
**Against:** `docs/product/api-spec-v2.md` · **Output:** a new contract version + app changes

---

## Why this exists

`docs/report-guidance/` (new, 2026-08-19/21) is the operative source for **how Caspr reports read and look**. Read [`docs/report-guidance/00-resolution-map.md`](../report-guidance/00-resolution-map.md) before starting — it is short and it is the contract.

It resolves guidance files from a small set of keys:

```
PASS 1 — ANALYSIS                      PASS 2 — RENDER
deliverable_type · sub_type · tier     format · tier (+ deliverable_type)
· icp · language
→ voice + type + ICP register          → page system + component set
```

**The mapping exists. The question is whether the keys reach the engine.** Mostly they do. Three do not, and one is ambiguous.

> ⚠ **Verify this analysis against the code before acting on it.** It was written from the specs, not the running app. An earlier pass of this same analysis was wrong because it read `architecture-alignment-final.md` instead of `api-spec-v2.md` — the shipped spec was considerably further ahead. Assume the same may be true of the app. **Where the code already does the right thing, say so and skip the item.**

---

## Where things actually stand

Against `api-spec-v2.md` §3 `trigger_generation`:

| Resolution key | Status | Note |
|---|---|---|
| `tier` | ✅ `depth` | `"brief" \| "study"` — Intelligence is Phase 2 |
| `language` | ✅ | `gate.output_prefs.language` (BCP-47) is the preferred one |
| `format` | ✅ | `gate.output_prefs.output_formats` |
| Data Room | ✅ | `file_ids` · `new_file_id` · `include_user_files` |
| **`icp`** | ⚠️ **present but untyped** | `client_knowledge.icp` exists — but the field is spec'd *"free-form, may be `{}`"*, and the example value is `"investor"`. L3 needs a **controlled key matching a `§10` profile.** Free-form text silently falls through to the generic profile |
| **`deliverable_type`** | ❌ **missing** | |
| **`sub_type`** | ❌ **missing** | |
| **`primary_data.method`** | ❌ **missing** | `premium_addons` could carry a synthetic-panel *purchase*, but nothing states the **method**. See item 3 — this one has a brand-integrity rule attached |
| `guidance_version` | ❌ not stamped | |

**Nothing here is broken today.** Everything degrades quietly to a defined state — which is precisely the problem: the output still looks correct, it is just never targeted. Degradation table at the end.

---

## 1 · `icp` — make it a controlled key, and confirm it is actually populated

**The value must be one of the ten `§10` profiles** in `docs/report-guidance/report-style-guide.md`:

```
consulting · strategy · investors · category_managers · agencies
grad_researchers · corporate_dev · startups · market_research_pros · null
```

`null` is legitimate and common — it resolves to **§10.9**, the fallback, which is **the most-used profile at launch** (every ICP-less user, including all 1,500 existing signups). Design for it as the normal case, not an error path.

**Three things to check in the app:**

1. **Is `users.icp_category` in Supabase actually written at onboarding?** The architecture doc lists it on the `users` table. If onboarding never populates it, every user is `null` and L3 is inert regardless of the wire.
2. **Does the app's own proxy forward it?** It must survive app → proxy → engine. A field dropped at the proxy is indistinguishable from a user with no ICP.
3. **Map Supabase's stored value to the profile keys above.** If onboarding stores a display label ("PE / VC investor") it must map to `investors`, not be passed through raw.

**Do not ask for ICP per analysis.** It is an account attribute. Asking per report contradicts the locked entry architecture (`app-shell-framework.md §1a`).

---

## 2 · `deliverable_type` and `sub_type` — stop discarding the user's confirmation

These are **confirmed by the user** at intent-confirmation (`app-shell-framework.md §6` phase 1b) — the beat where Caspr offers *"I can take this several ways…"* and the user picks.

Today only `prompt` travels. **The engine therefore re-detects from raw text, silently overriding the choice the user just made** — which defeats the entire purpose of that beat.

- **Capture** the confirmed type/sub-type on the draft analysis when the user picks.
- **Persist** it across the layout/gate phases (it must survive a tier change, which rebuilds the layout).
- **Send** it at `trigger_generation`.

Vocabularies: 5 deliverable types and their sub-types are in `00-resolution-map.md` and the `type-*.md` files. Send `null` if the user genuinely never confirmed — never guess a value client-side.

---

## 3 · `primary_data.method` — this one carries a hard rule

```jsonc
"primary_data": { "method": "none" | "synthetic" | "fielded" }
```

**Why it matters more than it looks.** `components.md` C1 makes this a **brand-integrity RULE**: synthetic panel output must carry the `AI-SIMULATED PANEL` label **and** the sentence *"Responses are model-simulated from audience profiles, not collected from people."* Both, in every format.

If the method never reaches the renderer, **simulated data can ship looking like real fieldwork.** That contradicts the security/brand posture directly (`brand-guidelines.md`, `security-posture.md`) and it is the single most damaging output the system can produce.

A `premium_addons` entry proves a *purchase*; it does not state a *method*. Make the method explicit.

---

## 4 · `gate.style` → `caspr_default` only — **RULED, Joy 2026-08-21**

The contract currently carries the same decision twice:

| Field | Values |
|---|---|
| `gate.style` | `mbb` · `big4` · `academic` · `pe` · `scholarly` · `enterprise` |
| `client_knowledge.icp` | `investor`, … |

**`mbb` / `big4` / `pe` / `academic` are audience labels — a crude ICP proxy.** That is what `icp` now carries properly, with ten researched profiles instead of six guesses. Two fields deciding one thing drift, and when `style: "pe"` disagrees with `icp: "consulting"` there is no defined winner.

> **The ruling:** **`gate.style` accepts exactly one value at launch — `caspr_default`.** The six house styles are **retired**. Register is resolved from `deliverable_type` × `tier` × `icp`; the Gate's Style row stays *"Caspr default · Included"* and the user never self-classifies.

**What to do:**
- Keep the field on the wire — this is a **narrowing of the accepted enum, not a removal.** Existing callers keep their shape.
- Send `caspr_default`. Treat any of the six legacy values as `caspr_default` and log it, rather than failing the request.
- Mirror it in `gate.output_prefs.style` (v2 §3.1 duplicates it — keep them equal).
- **Do not build a style picker.** `style` becomes the reserved slot for future user-defined templates (`gate-output-spec.md §5`, Phase 2), not a launch control.

This aligns the contract with the shipped product: `gate-output-spec.md §5` already says launch is *"a single Caspr template."* The enum was the outlier.

---

## 5 · Stamp `guidance_version`

Return it on the analysis record and carry it into output metadata. Gives reproducibility, tells us which reports ran under which rules, and lets a quality regression be traced to a guidance change rather than guessed at. Current value: `1.0.0`.

---

## What to produce

**A · App + proxy changes** — items 1–3 and 5, verified against the running code. **Report anything already correct rather than changing it.**

**B · A new contract version — `docs/product/api-spec-v3.md`.**
- Everything additive; a service ignoring all of it keeps working.
- Follow the house style of [`API-CONTRACT-REVISION-2026-08-18.md`](API-CONTRACT-REVISION-2026-08-18.md): numbered items, explicit degradation, a *"what happens if you do nothing"* table.
- **Do not delete `api-spec-v2.md`** — v1 was kept when v2 landed; keep the lineage. Mark v2 superseded with a pointer to v3.
- Carry item 4 as a **flagged decision for Joy**, not a unilateral change.

**C · Update every reference to point at v3.** Known referrers — verify, don't trust this list:

```
docs/app-handoff/API-CONTRACT-REVISION-2026-08-18.md   ("Against: api-spec-v2.md")
docs/app-handoff/JAYANT-ASKS.md
docs/app-handoff/QUESTIONS-FOR-JOY.md
docs/app-handoff/BUILD-STATUS.md
docs/product/api-spec-v2.md                            (add superseded banner)
content/pass3-change-proposal.md
content/_refresh/delta_5_voice_samples_api.md
```

**Also update, once the keys are on the wire:**
- `docs/report-guidance/00-resolution-map.md` § *Contract gap* — rewrite as resolved, citing v3.
- `docs/report-guidance/README.md` — remove the ⚠ read-first warning in § Integration notes.

**Reminder on file placement:** the contract and all notes are **documents** → Drive (`docs/`). Only code goes in the local repo. See `CLAUDE.md` rule 1.

---

## If you do nothing

| Missing | Consequence |
|---|---|
| `icp` untyped / unpopulated | Every report resolves to the **generic §10.9 profile**. Output looks fine; it is never targeted at anyone |
| `deliverable_type` · `sub_type` | Engine re-detects from the prompt, **silently overriding the user's confirmed choice** |
| `primary_data.method` | **C1 never renders. Synthetic data can ship unlabelled** — a brand-integrity breach |
| `gate.style` vs `icp` unreconciled | Two sources of truth for register; they disagree with no defined winner |
| `guidance_version` | No reproducibility; quality regressions untraceable |

**Only `primary_data.method` can produce a materially wrong claim to a user.** The rest degrade to bland-but-correct — which is why they will not surface as bugs, and why they need fixing deliberately.

---

*Questions to Joy. Guidance system: `docs/report-guidance/README.md`.*
