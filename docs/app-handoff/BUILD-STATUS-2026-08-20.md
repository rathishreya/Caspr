> **⛔ HISTORICAL DOCUMENT — vocabulary below is superseded.**
> This predates **2026-08-27**, when **the Thinking Brain and the Learning Brain were retired together.**
> The architecture is now **Source. Assess. Conclude.** — [`source-assess-conclude.md`](../source-assess-conclude.md).
> **The body is left unedited on purpose:** it records what was true when it was written. **Do not copy
> vocabulary out of it.**

# Build status — DEV-BRIEF pass complete

**2026-08-20.** Branch `main`, pushed to the **team repo**
`https://github.com/caspr-ai/caspr-product.git` — 139 commits, full history.
The old personal remote `Caspr-Joy/Caspr-app` is **retired and removed from the
clone's git config**; nothing goes there again.

Gate: 0 typecheck errors, 0 lint, **723 tests**, build clean.

---

## What landed

| Commit | What |
|---|---|
| `1ee991b` | Conversation system — the two voices (§2) |
| `061badc` | Edit credits, the three budget states, top-up presets (§3.1–3.3) |
| `a97e202` | Output pricing, `Delete all documents`, sample mechanism (§3.4, §4.3, §4.7) |
| `08b9d38` | Sweep — credits not tokens, DM Mono on figures (§1.6) |
| `096e519` | Wiring pass — budget, edge-prompt, output pricing; four `/verify` states |

Earlier today, same session: cover-card collision, Theater decode / Caspr
alphabet, review-3 Learning state, review-6 Creating cutoff, review-7 scoped
resets, early insights, legacy reports, the creation queue, metering, and the
relationship engine.

---

## The four things that changed behaviour, not just pixels

**1 · Phase markers stopped being labels.** `Initiating Learning Brain` was
centred caps between two short rules; it is now a full-width hairline with a
quiet product-voice line beneath, sentence case. The caps read as a document
divider. This reads as the app saying where things stand — and it means the
thread has one voice system rather than a voice plus a labelling convention.

**2 · The product now speaks in italic with a 7px outline mark.** It was upright
and indistinguishable from Caspr, which is the distinction the whole thread
rests on. The mark is inline rather than a bullet — one per turn, never a list,
because a list would indent every line and change what the thread means.

**3 · The revision quota is gone and the credit ledger is real.** Included
allowance per report (Brief 15,000 · Study 80,000 · Intelligence 300,000), spent
first, then the money balance. Silent, then one line, then one prompt — no bar,
no counter, no ticking number.

**4 · Outputs are per-output with no quota.** Each additional language counts as
one output, because it is one: a second native generation, not a copy.

---

## Decisions I made without you, and why

You gave standing authority at ~04:00. These are the calls that used it.

- **`Delete all documents` restored.** I dropped it earlier as superseded by the
  selection flow. The brief lists it, and on reflection the two are different
  acts: select-all-then-delete is a bulk operation on what you are looking at;
  this is a stated intention to empty the library, and it belongs with the other
  scoped resets so the three read as one family.
- **The frame's sample get-to-know exchange was removed from the page.** The
  engine owns those four turns now, and hardcoding them alongside a live engine
  rendered the same question twice on one screen. Found in the browser.
- **The conversation column moved to 16 in from the pane edge**, sharing its
  left edge with the docked prompt bar. It was 24, which aligned with nothing.
- **`out` means the next edit cannot be covered**, not that the balance is low.
  Someone with $2 left is not out until they try something costing $3 —
  otherwise the edge-prompt interrupts people who were never going to overflow.
- **Unknown tier defaults to the $20 top-up preset**, not $100. Defaulting
  someone upward because we do not know their plan is the wrong direction to
  guess in.
- **`sharp` added as a devDependency** to rasterise the wordmark for email.

---

## The wiring audit — five things were built and connected to nothing

Asked whether the app was finished, I ran the same audit that caught the
memories fixture earlier and it found five modules referenced only by their own
definition. Three are now wired: the **edit budget** (it decides whether an edit
happens at all, and raises the edge-prompt rather than half-applying one), the
**State-2 crossing line**, and **output pricing into the gate total**.

Two remain unwired **because their other half does not exist**, and both now say
so in the code:

- **`ledgerLine`** — there is no ledger endpoint in the contract. Building a
  client-side ledger would put a second source of truth beside the one that
  will arrive.
- **`samplesToSeed`** — seeding is a server job and there is nothing to seed
  until the sample content exists.

Also fixed: `/verify` had three states and needed four. The missing one matters
most — **already used** is not a failure, that person is verified, and folding
it into "expired" sends someone who is already done round the signup loop.

## Not built, deliberately — each is a decision, not an omission

- **`Insights` (§7, `184:6`)** — marked 🔴 *not built, full build not a sweep*
  and explicitly **Phase 2 / coming soon**. It ships as its coming-soon state.
- **The per-report edit ledger line in the Wallet from real data** — the row
  pattern and the roll-up logic exist and are tested; the Wallet renders it once
  there is real spend to render. Listed under §8 *not yet drawn*.
- **The "From balance" intermediate budget state** — §8 says States 1 and 3 are
  drawn and this one is not. The model supports it; there is no frame.
- **The decode's hidden word (`CITED`)** — §48. The spec asks for it but does
  not say where a 5-letter word sits on a line sized to a 14-letter source name.
- **Sample content** — the mechanism is built and tested; the reports are yours
  to generate post-launch.

## Still open on others

**Jayant** — the six API items in `API-CONTRACT-REVISION-2026-08-18.md`, plus
cost-per-credit, the 50% refresh ratio, and the AI service URLs. Nothing blocks
testing: the app runs against the reference implementation.

**You** — the two §8 items: Documents-desktop select-all placement, and a voice
pass on the get-to-know lines (they read in Caspr's first person, *"while I
work"*; they are product voice now). Both marked *not a blocker*.

---

## For the testing session

```bash
npm install
npm run dev
```

Three processes: backend 8787, reference AI 8788, web 5173. `.env` holds the
SES and Stripe values Jayant's team sent — real emails will send.

**Expected, not defects:**

- **401s in the console on wallet and library calls** with no signed-in user.
  That is the backend refusing correctly.
- **The library starts empty**, so Documents shows the frame's demo composition
  until something is generated.
- **Analysis content is synthetic** — the reference implementation, not
  Jayant's engine.
- **Three mobile drawers clip at the pinned input.** Reviewed and accepted
  (§8): the thread is longer than a Half drawer holds and clips cleanly.

**Useful routes:** `/generation` and `/generation/creating` (conversation
system, Creating cutoff) · `/layout/learning` · `/report/legacy` ·
`/account/research` (the engine's memories) · `/wallet/top-up`.

**To reset the relationship engine between runs:**
`localStorage.removeItem('caspr.research-profile.v1')`, or *Reset research
profile* in Account.
