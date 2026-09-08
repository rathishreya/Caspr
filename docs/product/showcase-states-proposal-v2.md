# The product showcase: website → demo → app

**2026-08-25, v2.** Supersedes `onboarding-states-proposal.md`, which was written before Joy's brief and treated the demo as a funnel. It is not one — the header travels with the user, so login and signup are reachable from every moment. That single fact changes the model.

**Nothing implemented. Decisions at §6.**

---

## 1 · What the brief settles

| | Settled |
|---|---|
| Website header | **Both** — a signup **button** and **Login** as text |
| Login | → the existing login page (`1167:146`), already designed |
| Signup button | → **the demo**, not a form |
| The demo | A **functional preview of Caspr in action** — dynamic, not scripted |
| Enforcement | Signup is enforced **3 seconds into the theater** |
| Everywhere | The user may switch to login or signup **at any point** |

Two things follow immediately, and they are the reason this document is not the last one.

---

## 2 · The header travels, so the demo is not a funnel

A funnel has one exit and you design the path to it. This has an exit on every screen, permanently visible. That means:

**There are two kinds of signup, and they are not the same event.**

| | **Volunteered** | **Enforced** |
|---|---|---|
| Trigger | The user clicks the header button | 3s of theater, or the gate button |
| They were | Deciding | Interrupted |
| Copy | *"Start free — first $100 on Caspr"* | *"Your analysis is running. Create an account to see it."* |
| Dismissible | Yes, obviously | **Yes — see below** |

**The enforced card must still be dismissible, and the wall is not the modal.** Trapping somebody in a card they cannot close is hostile and reads as a bug. The wall is that *the output never arrives* — close the card and you are back in the demo with a theater that has stopped and no report. That is a firm boundary without being a hostage situation.

---

## 3 · The thing the brief creates, which nobody has decided

**If the header's signup button enters the demo, what does that button do once you are already in the demo?**

It cannot mean "enter the demo" — you are in it. And it cannot vanish, because signup must be reachable from everywhere.

**Proposal: the CTA slot changes meaning by surface.** One slot, three meanings, and the user never sees two of them at once:

| Surface | Button | Login text |
|---|---|---|
| **Website** | *Start free* → enters the demo at D0 | → login page |
| **Demo** | *Sign up* → opens the signup **layer** over the current state | → login **layer**, same rule |
| **App** (signed in) | — the marketing header is gone entirely | — |

The difference matters: on the website the CTA **navigates**; inside the demo it **layers**. Layering is what preserves the user's work and what stops a signup card arriving with a fabricated screen behind it.

**Login also becomes a layer inside the demo**, for the same reason. A user three steps into scoping who clicks Login must not be thrown to a full page and lose the draft.

---

## 4 · The states

### Surfaces

| | Surface | Chrome |
|---|---|---|
| **W** | Website | Marketing header · *Start free* + Login |
| **D0** | Demo — invitation | Marketing header · *Sign up* + Login · prompt bar + 5 cards |
| **D1** | Demo — scoping | Same header · conversation in the pane, structure drafting in the centre |
| **D2** | Demo — theater | Same header · theater running, gate in the pane |
| **A** | App | App shell. No marketing header |

### Layers — over W, D0, D1 or D2, never replacing them

| | Layer | Opens from |
|---|---|---|
| **S** | Signup card | Header button (volunteered) · gate button · 3s of theater (enforced) |
| **L** | Login card | Header Login · *"Already have an account?"* inside S |

**The rule that fixes what Joy hit:**

> A layer never changes what is behind it. Open the signup card at D1 and there is a conversation behind it with no theater — that is correct, not a missing state.

### After the layer

| | State |
|---|---|
| **P0** | Email sent — check your inbox |
| **P1** | Verified → the app, **resuming the draft from D1/D2** |
| **P2** | Logged in (existing account) → the app, **same draft, same resumption** |

---

## 5 · The four rules

**1. The layer never changes what is behind it.** Stated above; it is the whole of the reported bug.

**2. The draft survives every path out of the demo.** Signup, login, abandon-and-return. If a user scopes an analysis and then signs up, that analysis is waiting after verification. Without this the model asks for *more* effort than a form and returns less — it inverts its own thesis.

**3. Login and signup are the same door from the user's side.** Somebody who clicks *Sign up* and turns out to have an account must reach Login without losing anything, and the reverse. The cards swap in place.

**4. Nothing expensive runs before an account exists.** Conversation and layout proposal are cheap and run for real. Generation is the cost, and generation is exactly what is withheld. This is what lets the demo be genuinely functional rather than a recording.

---

## 6 · Decisions

### D1 — The header signup wording

I could not find an approved header CTA. What exists across the docs:

| Found | Where |
|---|---|
| *Start Free — first $100 on Caspr* | the **gate** button, `onboarding-understanding.md` |
| *First $100 on Caspr — no credit card* | pricing surface |
| *START FOR FREE* · *Get Started* | website drafts |
| *Your first $100. On us.* | `website-copy-deck.md`, final-CTA slot |

A header button needs to be short. **Recommended: *Start free*** in the header, keeping *Start free — first $100 on Caspr* for the gate, where the offer is doing persuasive work at the moment of commitment. The header's job is to be a door, not to sell.

**Joy: confirm, or give me the GTM wording — I did not find it and I would rather not guess at a primary CTA.**

### D2 — Mobile header

Both a button and Login is too much. Three options:

| | Option | Consequence |
|---|---|---|
| **a** | Button + Login inside the hamburger | Conversion action is one tap; returning users take two |
| **b** | Login text + signup as the page's own CTA | Header is calm; the primary conversion action leaves the header |
| **c** | Button only; Login inside the hamburger *and* on the login-adjacent surfaces | Same as (a) but Login is genuinely buried |

**Recommended: (a).** The nav links need a hamburger regardless, so Login joins something that already exists rather than adding an element. And the asymmetry is right: a new visitor should never hunt for the way in, while a returning user knows what they are looking for and tolerates one tap.

### D3 — Is the theater real work?

The spec says it is: *"the Theater is real work — it can't start before the user says go."* But signup is enforced 3 seconds in, so we would be spending on an anonymous visitor.

| | Option | Consequence |
|---|---|---|
| **a** | Real, ~3s, stops at the wall | Truthful. Costs a little per visitor. Abusable without a rate limit |
| **b** | Representational until signup, real after | Costs nothing. The spectacle is a promise rather than a report of work |

**Recommended: (b) for launch, (a) later.** Three seconds of real source-reading is not a meaningfully better demo than three seconds of the same animation, and (b) removes both a cost and an abuse surface on the path most exposed to the open internet. It is reversible once there is a rate limit worth trusting.

**This is a defensible-claims question as much as an engineering one** — if the theater says *"reading 513,805 sources"* and is not, that is a claim we would not want to defend. Under (b) the theater must not state counts it is not producing.

### D4 — Does the draft survive to a different device?

The verification link may be opened on a phone when the draft is in a laptop's browser.

**Recommended: accept the limit for launch.** The draft is lost, the account is fine, and the user lands on the first-run screen. Persisting server-side against an anonymous id is the complete answer and is not launch-critical — but it should be a **stated** limit rather than a surprise.

### D5 — Signed-out deep link

Today the guard sends them to the site and **the destination is lost**. A shared report link, or a bookmark after a session expires, lands on the homepage.

**Recommended: carry the destination and return to it after auth.** Small, and it is the difference between an expired session being an inconvenience and being a dead end.

---

## 7 · What the design session needs to draw

Existing frames cover the demo screens and the over-theater signup. These do not exist:

| | Frame | Why it is new |
|---|---|---|
| 1 | **Website header, desktop** — button + Login together | Today's header carries one CTA |
| 2 | **Website header, mobile** — per D2 | |
| 3 | **Demo header** — desktop + mobile, CTA reading *Sign up* | The demo currently borrows the website header unchanged |
| 4 | **Signup layer over D1** (conversation, no theater) | Only the over-theater version exists — this is the one Joy hit |
| 5 | **Login layer over D0 / D1 / D2** | Login exists only as a full page |
| 6 | **Signup card, volunteered variant** | Different copy from the enforced one; same card |
| 7 | **Standalone signup page** | Login's twin, for anyone arriving wanting an account |
| 8 | **Enforced card dismissed** — theater stopped, demo intact | The state after closing the wall; currently undefined |

4, 5 and 8 are the ones that make the *"at any point"* requirement real. 1–3 are the header. 6–7 are small.

---

## 8 · Build order, after approval

| | Work | Size | Blocked on |
|---|---|---|---|
| 1 | Header CTA per D1/D2; *Start free* → demo, not the overlay route | S | D1, D2 |
| 2 | Standalone signup page | S | frame 7 |
| 3 | **Carry the prompt** — the demo stops discarding it | S | — |
| 4 | Layers: signup and login open over the current state | M | frames 4–6 |
| 5 | Demo runs for real to the gate | M | Jayant — unauthenticated `propose_layout`, rate-limited |
| 6 | Draft survives to the app | M | D4 |
| 7 | Deep-link return | S | D5 |

**3 alone removes the fabricated conversation**, whichever way everything else goes, and depends on nothing. It is worth doing first regardless.

---

## 9 · The ask for Jayant, if D3 goes to (a) or when (b) is upgraded

Unauthenticated access to `propose_layout`, rate-limited by IP, with a cap we agree. Worth adding to tonight's deployment ask so it is not discovered later — it is the only external dependency in the whole plan.
