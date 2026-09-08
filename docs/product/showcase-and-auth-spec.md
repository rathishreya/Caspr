# The product showcase and the auth overlays — spec

**2026-08-25. LOCKED by Joy.** Supersedes `onboarding-states-proposal.md` and `showcase-states-proposal-v2.md`, both of which were proposals. This is the decision.

For the design session (§5) and the dev session (§6). GTM's part is §7.

---

## 1 · The shape

**One rule carries most of this: login and signup are overlays over the demo, never pages, and never over anything else.**

| Triggered from | What happens |
|---|---|
| A website page | Navigate to the demo, then the overlay opens over it |
| Anywhere in the demo | The overlay opens over the demo **as it currently stands** |
| A cold link (`/login`, `/signup`) | Land on the demo at D0, overlay open |

**Why navigating from the website is right rather than a compromise** (Joy): a user who opens the login card and then changes their mind is left standing in the demo. They came to log in, decided not to, and are now one step *further* into the product instead of back on a marketing page. A cancelled auth becomes a trial rather than a bounce.

The literal alternative — scrim over the pricing page itself — would need the login card built a second time in the website's codebase, because the website and the app are separate programs sharing a domain. Two implementations of a login form is the worst place in the product to have two versions of the truth.

---

## 2 · Domains

| | Now | After cutover |
|---|---|---|
| Website | `new.caspr.ai/` | `caspr.ai/` |
| App | `new.caspr.ai/app` | `caspr.ai/app` |

**They move together**, tested end to end first, with the GTM announcement and the migration of the existing users. `new.caspr.ai` is the staging pair, not a separate product.

**Same origin, not a subdomain.** `app.caspr.ai` was considered and rejected: same origin means the website can see that somebody is signed in, an anonymous draft carries without server work, and the frozen website repo keeps its nine hardcoded CTAs. This closes `jayant-open-inputs.md` §19, which had recorded the same preference and never been answered.

Nothing is hardcoded to either domain. The app reads `websiteOrigin` from its runtime config, so **cutover is a ConfigMap change, not a rebuild** — the same image runs before and after.

---

## 3 · The states

### The demo

| | State | On screen |
|---|---|---|
| **D0** | Invitation | *"You're in. Let's get to work."* · prompt bar · five Type cards |
| **D1** | Scoping | The user's prompt, Caspr's questions in the pane, structure drafting in the centre |
| **D2** | Theater | Theater running, gate in the pane |

The user moves at their own pace. Nothing is timed until D2.

### The overlays

| | Opens when | Feels like |
|---|---|---|
| **Signup — volunteered** | The user clicks the signup CTA | A door they chose |
| **Signup — imposed** | **3 seconds after the theater starts**, or the gate button | An interruption |
| **Signup — required** | The user tries something that **needs an account** — today, attaching files | An answer to what they just did |
| **Login** | The user clicks Login, or *"Already have an account?"* inside signup | Either |

Same card, **three copy variants** for signup:

- **Volunteered** must not imply anything was blocking them. Nothing was.
- **Imposed** must acknowledge that something stopped. It did.
- **Required** must say *why it appeared*, which neither of the others has to. A card that materialises after a click, with no explanation, reads as a bug: *"Attaching your own sources needs an account."*

### The general rule behind "required"

**Anything that persists or exports the user's data needs an account.** Attaching files is the first instance and today the only one before the gate — but stating the rule rather than the case is what stops the next such control shipping unguarded.

It is also not merely a product preference. Holding documents uploaded by somebody we cannot identify is a data-protection position we would not want to defend, and there is no lawful basis to keep them against nobody.

---

## 4 · The six rules

**1 · The overlay never changes what is behind it.**
Open signup at D1 and there is a conversation behind it with no theater. That is correct, not a missing state. The reported bug — a signup card arriving with a fabricated theater and a conversation the user never had — is this rule being broken.

**2 · The header sits above the scrim and stays live.**
The scrim dims the content, not the chrome. The header is the escape from the imposed overlay: no close button on the card, no trap, and the way out is the control that has been there the whole time. **The header must be drawn as lit against dimmed content**, deliberately, rather than inheriting the dim.

**3 · Switching swaps the box, not the scrim.**
Login ↔ signup exchanges the card in place. The scrim does not flash, the background does not move, and nothing the user has typed elsewhere is lost.

**4 · The draft survives every exit.**
Signup, login, cancel, abandon-and-return. If somebody scopes an analysis and then creates an account, that analysis is waiting after verification. Without this the model asks for *more* effort than a form and returns less — it inverts its own thesis.

**5 · The demo is never prepopulated. D1 and D2 have no cold entry.**

A user can only be at D1 because **they** wrote a prompt, and at D2 because **they** approved a layout and asked to generate. These are states of a session, not destinations. Point a URL at them with no such history and you land at D0 with an empty prompt bar.

This is stronger than "carry the prompt", and deliberately so. Carrying the prompt fixes the symptom; this removes the possibility. **The concrete cause is that `/start` and `/scope` are production routes** rendering `ConversationLayoutPage` and `GateTheaterPage`, both of which hardcode `prompt = 'The UK electric vehicle market.'` and a scripted Caspr reply. Anything that reaches those paths — a link, a CTA, a bookmark, the current signup route — is shown a conversation somebody else had.

Those two screens are Figma-review surfaces and belong in `router.dev.tsx`, which is spread in only under `import.meta.env.DEV` and folds out of a production build entirely. **In production the only way into D1 is through D0.**

**6 · Back closes the overlay.**
Which makes the overlays routes, not component state. `/login` and `/signup` are real URLs — required anyway by password-reset completion, ads, partner links, and the re-engagement emails to the existing users.

---

## 4a · What the demo actually runs — the light call

**LOCKED, Joy 2026-08-25.** The demo uses the real Caspr APIs. It is **not** identical to a signed-in run, and the difference is precise:

| Runs for real in the demo | Does **not** run until signup |
|---|---|
| The prompt is understood | The full analysis |
| The clarifying questions — **correct ones, for this prompt** | Generation |
| The proposed layout — **relevant to this prompt** | Creation of the report |
| The gate — **actual** parameters and actual prices | |
| The sources shown in the theater — **real, and relevant to this analysis** | |

**The requirement underneath all of it is trust.** A layout that does not match the question, a gate showing invented prices, or a source-web animating a pre-populated list of random documents all say the same thing to a user evaluating an analyst: *this is a mock-up*. The demo exists to prove the opposite. **Nothing on screen may be representative rather than real.**

So it is a *version* of the API call, not the full one. Naming it here so it stops being described loosely: **the light call**.

### The charging model

The light call has a real cost. It is incurred while the visitor is anonymous and resolved after signup:

| | What happens |
|---|---|
| Visitor never signs up | **We absorb it.** This is the demo's cost of doing business, and it is what §8 meters |
| Signs up, then confirms | Full analysis proceeds; the **full price** is deducted from the $100 free credit |
| Signs up, then declines | Only the **light call's cost** is deducted from the $100 |

### The reconfirm

Signup is not the commit. After verification the user returns to **their own scoped analysis** — not the first-run screen — and is asked once more whether to run it. Only then does money move.

That second ask is not friction for its own sake. Signup interrupted them mid-decision; the confirm is where the decision they were making actually gets made, now that they can see what it costs against a balance that exists.

### Logging

Every light call is logged and attributed — anonymous session id, timestamp, cost — for three reasons: it is the input to the §8 ceiling, it is how an abuse pattern becomes visible before an invoice does, and it is what lets the charge be reconciled to a user once they sign up.

---

## 5 · What the design session needs to draw

Most of this exists. Genuinely new work is short.

### Already drawn — reuse

| Frame | Use |
|---|---|
| `1182:127` / `1303:429` | Signup overlay over theater — the **imposed** variant |
| `1167:146` / `1286:377` | Login **page** — its centred card becomes the overlay's content |
| `1979:119` | Legal overlay inside signup |
| `1170:146` / `1289:377` | D0 |
| `1301:3280` / `1309:3280` | D1 |
| `1177:3075` / `1302:397` | D2 |

### New

| | Frame | Note |
|---|---|---|
| **1** | **Login as an overlay** — desktop + mobile | Adapt `1167:146`'s card: drop the band, nav and footer, add the scrim. The card itself should not need redesigning |
| **2** | **Header above the scrim** | The load-bearing one. How the header reads lit while everything below is dimmed — and it must be legible as *interactive*, because it is the only way out of the imposed overlay |
| **3** | **Signup card — volunteered and required variants** | Same card as `1182:127`, different copy. Volunteered: nothing was blocking them. Required: says why it appeared — *"Attaching your own sources needs an account"* |
| **4** | **Website header** — desktop and mobile | Signup button + Login text. **Mobile: button + Login inside the hamburger** — the nav needs a hamburger regardless, so Login joins something that exists rather than adding an element. A new visitor should never hunt for the door; a returning user knows what they are looking for |
| **5** | **The login ↔ signup swap** | What moves and what does not. Rule 3 |

**2 and 5 are the ones that make the model real.** 1, 3 and 4 are adaptations of frames that already exist.

---

## 6 · Build order

| | Work | Size | Depends on |
|---|---|---|---|
| **1** | **Kill the prepopulated demo.** Move `/start` and `/scope` to the dev-only route table so no production path renders a scripted conversation; make D1 a state reached only by prompting, rendering the user's own words | S | Nothing |
| **2** | Website CTAs point at the demo; `/signup` stops being the overlay-over-theater route | S | GTM (§7) |
| **3** | Overlays become layers over the current state, with the header above the scrim | M | Frames 1, 2, 3, 5 |
| **4** | `/login` and `/signup` as routes; Back closes; cold arrival lands on D0 | S | — |
| **5** | The 3-second imposition after the theater starts | S | — |
| **6** | The draft survives into the app | M | §8 |
| **7** | Demo runs for real to the gate | M | Jayant — see §8 |

**Item 1 depends on nothing and removes the fabricated conversation on its own.** It is worth doing before the design work lands — and it is the one item that closes the reported bug rather than working around it.

---

## 7 · What GTM decides

The mechanism exposes three named actions. GTM decides which CTA on which page does which, and what each is called — no engineering change required to rearrange them.

| Action | Effect |
|---|---|
| `enterDemo()` | Navigate to the demo at D0 |
| `openSignup()` | Navigate to the demo, signup overlay open |
| `openLogin()` | Navigate to the demo, login overlay open |

**~~Open: the header signup wording.~~ ✅ Decided 2026-08-25 — [`../entry-routes-and-cta.md`](../entry-routes-and-cta.md).**

| | |
|---|---|
| **Header button, desktop** | **Run the analysis** → `enterOpenRun()` |
| **Header button, mobile** | **Run analysis** — the article drops at the existing mobile breakpoint. **Body CTAs keep the full phrase at every viewport** |
| **Header text, every page** | **Log in** → `openLogin()` |
| Everywhere else | **The same phrase.** No per-page and no per-ICP variants |
| The gate | **Unchanged** — *Start free — first $100 on Caspr* |

**⚠ Two renames follow, and the first is a guardrail rather than cosmetics.**

**`enterDemo()` becomes `enterOpenRun()`, and "demo" leaves the vocabulary entirely** — specs, copy and code.
§4a of this document requires that **"nothing on screen may be representative rather than real."** *Demo* is
the word that licenses the opposite, and a team using it will eventually fake something. The internal name is
**the open run**; **users never see it labelled at all.**

---

## 8 · Still open

Not blocking §6 items 1–5.

| | Question | Note |
|---|---|---|
| **A** | ~~Is the theater real work?~~ | **Answered** — see §4a. Real, via the light call |
| **B** | **Does the draft survive to a different device?** | The verification link may be opened on a phone while the draft is in a laptop. Accepting the loss is reasonable for launch; it should be stated rather than discovered |
| **C** | **Signed-out deep link** | Today the destination is lost — a shared report link or an expired session lands on the site with no way back. Small fix, real difference |
| **D** | **The light call's price** | Needs Jayant's compute cost — it is the figure deducted when somebody declines after signup, so it has to be right before launch. **A dependency**, worth adding to the deployment ask |
| ~~E~~ | ~~Is the light-call deduction disclosed?~~ | **Closed.** The gate showed the cost and they agreed to more. See §8a |


---

## 8a · Detecting abuse, and why the charging is fair

### The charging is settled

A user who declines after signup pays only the light call's cost. **That is fair because they already agreed to more**: they passed an actual gate showing an actual price and asked to generate. Backing out and paying the small part is more generous than what they consented to, not less.

**This depends entirely on the gate showing the cost.** `onboarding-understanding.md` step 3 said *"no cost shown"* — now marked superseded there, because building that version quietly removes the consent the charge rests on. If the gate hides the price, the user agreed to nothing and the deduction is unearned.

### Detection now, limits later

**Joy, 2026-08-25: do not meter yet.** A limit designed before there is traffic is a limit guessed, and the cost of guessing it low is degrading the experience for real users at exactly the moment scale arrives. The requirement today is narrower: **see automation, do not block it.**

So: instrument thoroughly, decide policy from real data. What must be true is that when a limit is eventually wanted, it can be designed from what actually happened rather than from a fresh guess.

**Log against an anonymous session id** — issued server-side on first contact. That id is attribution, not metering, and everything below is keyed on it.

| Signal | Why it separates a person from a script |
|---|---|
| **Request rate** per session and per IP | The blunt one, and the easiest to evade |
| **Cadence regularity** | A person pauses irregularly. A script is metronomic. Variance is a better tell than volume |
| **Prompt repetition** | Identical or templated prompts across sessions |
| **Journey shape** | A person walks D0 → D1 → D2 with hesitation. A script tends to go straight at the light call |
| **How the prompt arrived** | Typed over seconds, or materialised in one event. **Not identifying** — it is a property of the interaction, not of the person |

**Alert, do not refuse.** The output is a signal somebody looks at, not a door that closes.

**Still no device fingerprinting.** We sell on ISO 27001 and GDPR. A session id and an IP are ordinary operational data with an obvious purpose; a fingerprint is a different category and would have to be disclosed and justified.

**The one thing worth building before launch anyway** is a *visible* daily total of anonymous spend. Not a cap — a number somebody can look at. The failure this prevents is not abuse, it is discovering the cost of abuse in an invoice a month later.

---

## 9 · Why this went wrong the first time

Every onboarding screen is a faithful reproduction of its Figma frame, and the journey between them was never built. `FirstTimeUserPage` discards the prompt and navigates to a screen that hardcodes *"The UK electric vehicle market."* Both downstream screens hardcode the same string and neither touches the analysis session.

A frame is a photograph of one state. The flow is what connects them, and reproducing frames produces a product that is correct in every screenshot and wrong the moment somebody walks through it. Nothing in the test suite walks the journey as a person with no account and no prior state.

**That walk is the check this document exists to make possible**, and it should be run against every build before it is called done.
