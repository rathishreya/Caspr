# Access model — build scope

**Dev session · 2026-08-27.** Scope for [`DEV-PROMPT-ACCESS-MODEL.md`](DEV-PROMPT-ACCESS-MODEL.md),
against [`docs/product/access-model.md`](../product/access-model.md).

**Written before executing, at Joy's instruction.** Everything in §1 is measured from the code, not
assumed — the point is to find what the prompt does not know about the build before moving anything.

---

## 1 · What the build already has

Three of the changes are **already done**, which narrows the work considerably.

| | State |
|---|---|
| **Depth prices `$15 · $80 · $300`** | ✅ Already `1_500 / 8_000 / 30_000` in `caspr-backend/src/app/pricing.py`, and the same three in the frontend's `features/gate/total.ts` and `mockClient` |
| **The `$399` à-la-carte price** | ✅ **Does not exist anywhere in code.** Nothing to retire — it lives only in `pricing-model.md` |
| **Platform fee 7%** | ✅ `PLATFORM_FEE_BPS = 700`, integer basis points, applied by `budget_for_charge()` |
| **Plan names** | ❌ `free_trial · professional · business · enterprise` in `PLANS` |
| **Feature gates** | ❌ Feature tuples per plan: `business` carries `("intelligence", "data_upload", "editing")` |
| **Billing** | ❌ One model for every plan. **No concept of committed spend** |
| **Collaboration** | ❌ **Does not exist.** No roles, no sharing, no second user on an account |
| **Data Room `confidentiality` / `visibility`** | ❌ Neither field exists yet |
| **`intelligence` depth** | ⚠ Priced but **not launchable** — `LAUNCH_DEPTHS = ("brief", "study")` |

**So the real work is: rename the plans, move one gate, add committed spend, add collaboration, add two
Data Room fields, and add three lint rules.** The pricing changes in §1 of the prompt are mostly already
true.

---

## 2 · ⚠ The thing the prompt does not mention: this changes a legal document

**The plan names and their billing are written into the Terms of Use**, which is live in the app as of
this week and dated **01 September 2026**.

`docs/legal/terms-of-use.md`:

| Line | Says | Under the new model |
|---|---|---|
| §4.2 table | **Professional** $200/month · **Business** $600/month · **Enterprise** $1,800/month | All three names change |
| §4.2 | Business unlocks *"Intelligence analyses, data upload, editing"* | **Editing moves down to Solo** |
| §4.1 | *"Delta recharge: Each billing cycle restores only the amount consumed"* — stated **universally** | **False for Org**, which is committed spend |
| §4.4 / §9 | Refund terms on unused budget | `refund-policy.md` §9.1 needs the Org carve-out the spec already flags as *"legal review, not a code change alone"* |

**This is not a rename I can do in code alone.** The app renders those documents from
`docs/legal/*.md`, so shipping renamed plans while the Terms still name the old ones would put the
product and its contract in disagreement — on a page a user has to accept to sign up.

`access-model.md` §7 flags the refund consequence. It does not flag that §4.1's delta-recharge sentence
becomes untrue, or that the plan table needs rewriting.

---

## 3 · The work, in dependency order

**A — safe now, no open questions.** Self-contained, reversible, blocks nothing.

1. **`COPY-11b`** — the *"only charged for what you run"* lint. **Do this first.** The claim is false
   today (`R = F + top_up`; $14 on a $200 budget at zero consumption) and it is the one that could reach
   public copy.
2. **`COPY-11a`** — Research Budget never framed as `/mo`.
3. **`COPY-07b`** — a depth name never appears without its deliverable type.
4. **`Monthly Brief` → `Updates`**, and delete `Caspr Signals`. **`The Signal`** — singular, the
   in-report sentiment layer — must not be swept.

**B — blocked on Q1 and Q2 below.** Plan renames and the gate move, in code *and* in the Terms.

**C — blocked on Q3.** Committed spend for Org: a second billing model, plus the refund carve-out.

**D — blocked on Q4, and much larger than it reads.** Collaboration is roles, invitations, per-analysis
share grants, the two-pots wallet rule and a "source named, no content" citation state. It is a feature,
not a change.

**E — blocked on Q5.** The Data Room `confidentiality` / `visibility` split, with a migration.

---

## 4 · Questions — the spec says do not guess, so these are asked rather than assumed

**Q1 · The Terms of Use.** Renaming the plans makes §4.2 wrong and §4.1's delta-recharge sentence untrue.
Do I (a) update `docs/legal/terms-of-use.md` alongside the code, (b) hold the rename until legal has
reviewed, or (c) ship the rename in-product and treat the Terms as a follow-up? **My recommendation: (b)
for anything user-visible.** A signup form whose contract names different plans than the product is a
worse problem than a delayed rename.

**Q2 · `free_trial` under the new names.** The four modes are `Try · Solo · Team · Org`, but the code's
fifth state is `free_trial`. Is **Try** the rename of `free_trial`, or is Try a *paying* PAYG mode with
the 90-day trial sitting inside it? §1's table shows Try with *"none — top up as you go"*, which reads
like PAYG rather than a trial.

**Q3 · Committed spend, mechanically.** *"Charged in full monthly, per seat, regardless of consumption"*
— does the Org budget still **carry forward within** the month, and simply not carry across the boundary?
Or does the balance reset at each cycle? These produce different ledgers, and the wallet UI shows a cycle.

**Q4 · Collaboration scope and timing.** This is the largest item by far and nothing in the build
anticipates a second user. Is it needed for the launch we are preparing, or is it the next phase? If it
is launch scope, I need to know before the wallet and analysis models settle, because the two-pots rule
changes who a charge belongs to.

**Q5 · The `public` → `confidentiality` migration.** §8 item 3 lists the engineering impact as open. On
our side the field does not exist yet, so there is nothing to migrate **in the app** — but
`document-taxonomy.md` §B1 describes it as existing. Is it live in Jayant's services? If it is, the
migration is theirs and I need the current shape.

**Q6 · Seats 4+ and Insights gating** are listed open in §8. I will build the seat model with a
configurable rate and leave Insights ungated, unless told otherwise — flagging rather than guessing.

---

## 5 · What I will do without further input

**Section A only** — the three lint rules and the `Updates` / `Signals` rename. They are self-contained,
they do not touch billing, and `COPY-11b` guards a false claim that is live in copy today.

Everything else waits on the answers above.
