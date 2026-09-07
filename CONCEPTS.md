# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

Seeded 2026-08-25 from the wallet, research-profile and screen-shell areas — the three the first learnings touched. Terms outside those areas are not yet defined.

---

## Analysis

### Analysis
A single commissioned piece of research: one question, scoped and confirmed by the user, producing a cited report. The unit everything else is counted and charged in — a user does not buy time or seats, they buy analyses.

### Depth
How far an Analysis goes, chosen before it runs and fixing its price: **`$15 · $80 · $300`**, in ascending order of cost and scope. Depth is orthogonal to Type — any deliverable can be run at any depth its type offers.

**The price points are universal. The names are not.** Each Deliverable Type names its own rungs — Market Research says *Brief · Study · Intelligence*, Investment & Deal says *Screen · Thesis · Diligence*, Academic prices its two at *$8 · $40*. **Never write a depth name without its type**; *"Brief · Study · Intelligence"* standing alone is the Market Research ladder passed off as universal, and it is the most-repeated error in this project. Enforced as `COPY-07b`.

A depth may be **priced but not offered**: the price must exist so the wallet can refuse it coherently, while the depth stays absent from the gate because it cannot yet be generated. The two facts are deliberately separate rather than one list with a flag.

### Gate
The single confirmation shown before an Analysis runs, stating everything that affects cost and output — depth, formats, language, style. It is the only moment spend is committed, and nothing after it can change the price. Parameters are locked once it is passed.

---

## Money

### Research Budget
The monthly allowance a plan makes available for running analyses. **Distinct from what the card is billed**: the charge is larger, and the difference is the Platform Fee. Both figures are shown to the user; the difference between them is not.

Unused budget carries forward. The following month's charge restores only what was consumed, so a light month costs less rather than expiring.

### Platform Fee
The share of a monthly charge that does not become Research Budget. **Internal**: it is never sent to a client and never shown to a user, and no figure that would let it be reconstructed may be published either — which is why a next-recharge estimate is omitted rather than approximated.

### Hold
Money committed to an Analysis at the Gate and not yet spent. A Hold reduces what can be spent without moving any balance, so a run that fails costs nothing and needs no refund — the money was never taken.

A Hold is created once per Analysis however many times the commit is retried, and is closed exactly once, by being **settled** (the report was delivered) or **released** (the failure was ours). A closed Hold cannot be reopened or reversed, and a request to close one the other way is refused rather than obeyed. A Hold that is never closed is money belonging to neither party, which is why closing it is reachable by naming either the Hold itself or the Analysis it was placed for.

### Spendable balance
What a user could commit right now: their balances less everything under Hold. Computed by the server and sent, never derived by a client — a subtraction done in two places is a subtraction that will eventually disagree with the bill.

---

## Research profile

### Memory
One thing Caspr has learned about a user — a plain sentence, keyed to the question that produced it, shown to the user and individually removable. A Memory is stated (the user answered) or inferred (their behaviour implied it), and anything stated beats anything inferred about the same key.

Memories are the user's to delete, and deletion is honoured everywhere rather than only where it was performed — so where two copies exist, the authoritative one wins outright rather than being merged with a local copy that might resurrect a deletion.

### Persona
A short description of a user, composed deterministically from their Memories and sent with every Analysis so the work is written for them. It is a projection, not a stored document: the same Memories always compose the same Persona, and changing a Memory changes the Persona with no separate update step.

---

## The screen shell

### Half
One of the two renderings of a screen — **desktop** and **compact** — that a page produces. Both are built into the page at once and one is hidden, rather than one being chosen; the switch is a width, not a route.

The consequence is load-bearing and easy to forget: a change to a screen is a change to two Halves, and anything that searches the page finds whichever Half is written first. A fix applied to one Half is invisible to a reader, a screenshot and most tests.

### Pane
The navigating column beside the centre of a screen — a table of contents rather than a place work happens. Selecting in a Pane changes what the centre presents and leaves the Pane itself standing. On the compact Half a Pane becomes a drawer, which is a genuine difference in shape rather than drift.

---

### The Signal
The opinion and sentiment layer **inside a report** — synthesised blocks drawn from crowd-sourced-but-credible sources (Reddit, Quora, forums, social, news, sentiment analysis), rendered visually and epistemically distinct from cited findings. It is part of what a report contains: **never a plan feature, never tiered, never priced.**

**Singular, and always "The Signal".** ~~Caspr Signals~~ — a tiered watched-topic digest sold as *"1 topic / 3 / unlimited"* — is **retired and folds into Insights**. Any spec or plan card still listing it is stale.

---

## Flagged ambiguities

- **"Balance" alone is ambiguous** and should not be used unqualified: the total held across a user's ledgers, and the Spendable balance, differ by whatever is under Hold. Say which.
- **"Type" and "Depth" were used interchangeably** for a period. They are orthogonal: Depth is how far an Analysis goes, Type is what kind of report it is.
- **"Signal" collides.** *The Signal* is a section inside a report. *Caspr Signals* was a subscription feature and no longer exists. Plural, capitalised as a product name, it is always wrong.
- **"Monthly Brief" collides with Updates, and folds into it (Joy, 2026-08-26).** Both are *Caspr tells you something changed*; two names for one idea is how the Signals confusion started. **The feature is Updates.** ⚠ Stale in `pricing-model.md` §5 and §9, `product-marketing-context.md` tier tables, `docs/legal/refund-policy.md`, `strategy/caspr-product-features-roadmap.md`, and the Figma plan cards — all still say *Monthly Brief*.
- **Phase, not status.** Website and app go live together, so *"is it built yet"* is never the question — the only question is which **phase** a capability belongs to. A live-today feature is never marked coming soon on the site.
