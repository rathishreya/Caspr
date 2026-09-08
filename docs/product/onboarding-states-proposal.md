# Website → app: the states, and what is actually built

**2026-08-25. A proposal, nothing implemented.** For Joy's decisions at §4.

`onboarding-understanding.md` describes the *concept* and the five-step flow. It does not describe the **states** — what is true of a visitor at each moment, what carries between them, and what happens on every path that is not the happy one. This fills that gap, and starts by being honest about the distance between the spec and the build.

---

## 1 · What happens today

The trace Joy hit, verified in the running app:

| Step | Where | What |
|---|---|---|
| 1 | `/` signed out | Leaves for the site |
| 2 | Site → Login | `/signin` — correct |
| 3 | **"Start Free →"** | → `/signup` |
| 4 | `/signup` | `SignupPage` renders **`<GateTheaterPage />`** with `<SignupOverlay />` over it |

So one click from a cold login page lands on step 3–4 of a five-step journey: a theater analysing a prompt nobody wrote, over a conversation nobody had.

`SignupPage`'s own docstring is right about what it *is* — *"Not a standalone page: the signup card floats over the running Gate + Theater screen"* — which makes it a **state inside a journey**. It was also mounted as a route, and then linked to. That is the whole bug at step 3.

### The larger finding

**The unauthenticated journey is not the tool. It is three static frames.**

| File | What it does |
|---|---|
| `FirstTimeUserPage.tsx:50` | `submit()` → `navigate('/scope')` — **the prompt is discarded** |
| `ConversationLayoutPage.tsx:62` | `prompt = 'The UK electric vehicle market.'`, hardcoded |
| `GateTheaterPage.tsx:43` | the same string, hardcoded |
| all three | never touch `useAnalysisSession` |

Type *"Size the Indonesian fintech market"*, press send, and you are shown a scripted conversation about UK electric vehicles. That is the *"populating some conversation I never had"* Joy described, and it is not a wiring slip — no code path exists to carry a visitor's prompt anywhere.

The spec's premise is the opposite: *"the signup experience is **the real Caspr tool, running unauthenticated** … the user actually **uses** Caspr."* That is the sentence the activation thesis rests on, and it is the sentence that is not implemented.

**Why it went unnoticed:** each screen is a faithful reproduction of its frame, so every screen looks right in isolation and in a screenshot. Nothing tests a journey, only screens. Building from frames rather than from the flow produces exactly this — a slideshow that photographs correctly.

---

## 2 · The thing nobody wrote down

**The work has to survive signup.**

The model is *invest effort, then create an account*. If a visitor writes a prompt, scopes it through a conversation, approves a layout, and then signs up — that analysis must be waiting for them on the other side of the verification link.

If it is not, the model actively backfires: they invested more than a signup form would have cost, and lost it. They would have been better served by the form.

Nothing in the build or the spec covers this. It is the requirement most likely to be discovered late, because every screen works without it and only the *seam* between anonymous and authenticated exposes it — the same class of gap as everything else found this week.

It has a cost: the draft must be persisted while anonymous and **claimed** at verification. That is a real piece of work and it should be decided now rather than found in a fortnight.

---

## 3 · The states

Two axes describe any visitor. Nearly every question below is a question about one of them.

- **Identity** — anonymous · authenticating · verified
- **Investment** — nothing · prompt written · layout approved · generation requested

### Entry points

| | From | Lands | Notes |
|---|---|---|---|
| **E1** | Site → Login | Login screen | Built, correct |
| **E2** | Site → Start Free | **decision D1** | Broken today |
| **E3** | Deep link to a private route, signed out | Leaves for the site | Built today. **Loses the destination** — see D5 |
| **E4** | Verification link | First-run screen | Built today |
| **E5** | Reset link | Set-new-password | Built |
| **E6** | Returning, session valid | Home | Built |

### The unauthenticated tool

| | State | What the visitor has done | What is on screen |
|---|---|---|---|
| **T0** | Invitation | Nothing | *"You're in. Let's get to work."*, prompt bar, five cards |
| **T1** | Scoping | Written a prompt | Conversation in the pane, structure drafting in the centre |
| **T2** | Committed | Said *generate* in chat | Theater running, gate slid in |
| **T3** | Gated | Clicked the gate, or 3s of theater | **Signup overlay over whatever T-state is current** |

**T3 is a layer, not a screen.** It dims and floats over T1 or T2 as they actually stand. Today it is a page that brings its own fabricated T2 with it, which is the defect. Stated as a rule:

> The signup overlay never changes what is behind it. If a visitor is at T1, the overlay opens over T1 — a conversation with no theater — and that is correct, not a missing state.

### After signup

| | State | Notes |
|---|---|---|
| **P0** | Email sent | Built |
| **P1** | Verified | → first-run screen. **Must resume the work from T1/T2** — see D3 |

### The paths that are not the happy one

Each needs an answer; none is designed today.

- Visitor abandons at T1 and returns tomorrow — is the draft still there?
- Visitor at T2 already has an account — the overlay must offer *"Log in"*, and logging in must keep the work
- Verification link opened on a **different device** from the one holding the draft
- Two tabs, two drafts
- Visitor signs up with an address that already exists
- Visitor at T1 clicks Login in the header — same layer rule as T3

---

## 4 · Decisions

### D1 — What does "Start Free" on the website do?

| | Option | Consequence |
|---|---|---|
| **a** | A plain signup page, styled like Login | Familiar. **Throws away the activation thesis** — the model's whole claim is that people sign up after investing effort, and this asks first |
| **b** | The tool at **T0** | Matches the spec. The plain signup page still exists, reached from Login's *"New to Caspr? Start free"* and from the overlay |

**Recommended: (b), and build the plain page anyway.** They are not alternatives — a standalone signup page has to exist for somebody who simply wants an account, arrives from an ad, or is told to sign up by a colleague. The question is only what the website's primary CTA points at, and pointing it at a form discards the reason the gated model was designed.

### D2 — Does the unauthenticated tool actually run?

**Recommended: yes, and it is cheaper than it sounds.** Everything before the gate — conversation, clarifying questions, layout proposal — is cheap. **Generation is where money starts, and generation is exactly what the gate withholds.** So a visitor gets real scoping for free and pays or signs up before anything expensive runs. That is the model working as designed rather than a concession.

Needs: unauthenticated access to `propose_layout`, rate-limited by IP, and a decision on the cap. **This is a dependency on Jayant's service** and should go on the ask list tonight.

The alternative — a scripted demo — is what exists now, and Joy has just described what it feels like.

### D3 — Does anonymous work survive signup?

**Recommended: yes.** Persist the draft locally while anonymous; claim it against the account at verification. Without it the model asks for more effort than a form and returns less.

The honest limit: a link opened on a different device cannot recover a draft held in the first device's browser. Options are to accept that (the draft is lost, the account is fine) or to persist server-side against an anonymous id. **Accepting it is reasonable for launch** — most people open the link on the device they signed up on — and it should be a stated limit rather than an accident.

### D4 — What does the overlay do when the visitor already has an account?

**Recommended:** the overlay carries *"Already have an account? Log in"*, switching the card in place without touching what is behind it. Logging in claims the draft exactly as signing up would.

### D5 — A signed-out deep link

Today the guard sends them to the site and **the destination is lost**. Somebody following a shared report link, or returning to a bookmark after their session expired, is bounced to the marketing homepage with no way back to what they wanted.

**Recommended:** carry the destination and return to it after authentication. Small, and it is the difference between a session expiring being an inconvenience and being a dead end.

---

## 5 · What I would build, in order

Nothing starts until D1–D5 are answered.

1. **Stop the wrong link** — "Start Free" per D1; `/signup` stops being the overlay-over-theater route. *Small.*
2. **The plain signup page** — Login's twin. *Small.*
3. **Carry the prompt** — `FirstTimeUserPage` stops discarding it; T1 renders the visitor's own words. *Small, and it removes the fabricated conversation whichever way D2 goes.*
4. **The overlay becomes a layer** — opens over the current state, never substituting one. *Medium.*
5. **The tool runs unauthenticated** (D2). *Medium, blocked on Jayant.*
6. **Draft survives signup** (D3). *Medium.*
7. **Deep-link return** (D5). *Small.*

1–3 remove what Joy hit. 4 removes the class. 5–6 are the model actually working.

---

## 6 · The lesson worth keeping

Every screen here is a faithful reproduction of its Figma frame, and the journey between them was never built — because a frame is a photograph of one state and the flow is what connects them. Reproducing frames produces a product that is correct in every screenshot and wrong the moment somebody walks through it.

The check that would have caught it is not a design review. It is walking the journey as a person with no account and no prior state, which nothing in the test suite does and nobody had done until Joy did it.
