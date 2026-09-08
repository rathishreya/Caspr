# Design prompt — auth overlays, round 2

**To:** the design session · **From:** the dev session · **Date:** 2026-08-25
**File:** `y2F394I4CwEeSzH2kKuDCt` · **Page:** `184:3`
**Pairs with:** [`DESIGN-PROMPT-AUTH-OVERLAYS.md`](DESIGN-PROMPT-AUTH-OVERLAYS.md) (round 1) and your [`DESIGN-RESPONSE-AUTH-OVERLAYS.md`](DESIGN-RESPONSE-AUTH-OVERLAYS.md)
**Authority for every value below:** [`docs/product/design-guidelines.md`](../product/design-guidelines.md) §13 and [`docs/product/showcase-and-auth-spec.md`](../product/showcase-and-auth-spec.md) (locked)

Joy has approved both defects you flagged. §1 is the instruction. §2–§4 is what the second
fix exposes once the rectangle stops hiding it, and §3 is the item that actually changes what
a user reads — larger than either scrim.

---

## §0 — The standing rules, unchanged

1. **Reuse. Never recreate.** Every item below is a property edit or a clone of something
   that already exists. Nothing here needs a new component.
2. **Reflow. Never reposition.** Mobile derives from desktop by reflow.
3. **No locked edits.** If an item needs a locked node touched, stop and say so.
4. **The spec is the lock, not the frame.** Where a frame and `design-guidelines.md` §13
   disagree, §13 wins and the frame is the defect. That is the shape of both items in §1.

---

## §1 — The two corrections Joy approved

### 1.1 Desktop scrim: 0.50 → 0.42

| | |
|---|---|
| **Node** | `1182:328` — the `dim` rectangle inside `Gate + Theater · Signup Overlay` |
| **Now** | black @ **0.50** |
| **To** | black @ **0.42** |
| **Why** | `design-guidelines.md` §13 locks the app scrim at 0.42. Your new frames are already 0.42; this is the one frame that predates them |

Code already builds 0.42 (`bg-scrim`), so nothing follows in the app. This closes the gap
between file and build rather than opening one.

### 1.2 Mobile signup: give it a scrim

| | |
|---|---|
| **Node** | `1303:527` — `Rectangle`, x0 y52, 390 × 792, inside `Signup Overlay — Mobile` (`1303:429`) |
| **Now** | **opaque `#0a0908`** — `theater/bg` at full alpha |
| **To** | black @ **0.42**, same token as 1.1 |
| **Why** | §13: *a mobile drawer gets a scrim ⟺ its desktop counterpart is a scrimmed modal.* Signup is a scrimmed modal on desktop, so mobile owes one. Right now nothing behind the card is visible at all |

**Confirmed before asking:** the demo is genuinely drawn behind it and will show through.
`Content` (`1303:430`) holds the source list, the Graph Zone with the hub and spokes, and
*4,271 / SOURCES REVIEWED*, and `Screen Title — Dark v3` (`1303:497`) covers y52–110. The
band y52–844 is fully painted. This is one property, not a rebuild.

---

## §2 — Three decisions the fix exposes

These only become visible once `1303:527` stops being opaque. Each is a z-order question,
and each is yours to settle — I have given my read, not a decision.

### 2.1 The docked input bar sits **above** the scrim

`1303:519` (y728, 390 × 116), `1303:520` (the 40 × 5 grabber), `1303:521` `Docked Input Bar`
and `1320:514` (the legal line) all paint **after** `1303:527`, so they will stay undimmed
while everything above them dims.

**My read: move them under the scrim.** Desktop dims the entire field below the header. The
input bar is not an escape route, and a lit control that does nothing when tapped reads as a
bug. The escape is the header — see 2.2.

**If you disagree**, the argument to beat is that the legal line is a required disclosure and
arguably should stay legible. I do not think dimming it suppresses it, but you own §13.

### 2.2 The header is already correct — please confirm rather than change

The scrim starts at y52, and the header band (`1303:498`) plus the wordmark
(`1303:500`/`1303:501`) and `Login` (`1303:502`) all live in y0–52. So the header is clear of
the scrim by construction, which is exactly the rule: **the header is undimmed and live
because it is how somebody escapes the imposed card.** Undimmed, not lit — nothing is
brightened, so there is no highlight to misread as a z-index artefact.

The code mirrors this with `top-[56px] shell:top-[72px]` on the scrim. Two questions:

- Does the **56 / 72** pair match the frames? The mobile band here measures **52**. If the
  frame is right, the code is 4px out and I will change the code.
- The header hairline steps to `border/strong` while a card is open (your round-1 frame 2,
  because `#e2e1de` vanishes against a dimmed field). `1303:499` is the mobile hairline — does
  it carry the stepped-up value, and does `1182`'s?

### 2.3 Is `1182` now redundant against your new frames?

You built the new overlays at 0.42 and left `1182` alone. Once 1.1 lands they agree — which
means we may have two frames answering the same question. **Two live copies of a thing is not
redundancy, it is a fork** (the reasoning is in `CLAUDE.md`, and it is why the docs moved off
the repo). If `1182` is superseded, move it to the Deprecated page (`1356:2`) rather than
deleting it. If it is not superseded, say what it holds that the new frames do not, so the
next person does not ask again.

---

## §3 — The signup card has one variant and the code has three

**This is the substantive item.** You found in round 1 that the card is written as
*volunteered* — someone clicked the CTA, nothing was blocking them. That is one of three
states the build now carries (`AuthOverlayContext.tsx`, `SignupReason`):

| Reason | Fires when | What the copy must do |
|---|---|---|
| `volunteered` | They clicked the signup CTA | Nothing was blocking them, and the copy **must not imply otherwise**. This is the card you have |
| `imposed` | Three seconds into the theater, or at the gate | Something stopped. **Say so plainly** — a card that appears without explaining itself reads as a trap |
| `required` | They tried something needing an account — attaching a file, continuing past the gate | Say **why it appeared**, tied to what they just tried |

**One card, three copy states — not three cards.** Everything but the headline and subhead is
identical: the three OAuth buttons, the divider, email, password, the consent line, the
*Already have an account?* switch. Clone the card and swap two text nodes.

### Proposed words — **proposed, not approved**

Flagging these as invented per the working standard: they are derived from the locked
spec's behaviour, not lifted from research or a recorded decision. **Joy signs off before
they ship.**

**`volunteered`** — unchanged, already in the frame:
> **Create your free account**
> Your first $100 of research is on us — no card required.

**`imposed`** — the constraint is that at this moment the work *is* real: the light call has
run, the layout is real, the questions are real, the gate is real. Nothing has been faked and
nothing has been charged. The copy should say the work is held, not that access is denied.
> **Your analysis is ready to run.**
> Create an account to run it. Your first $100 of research is on us — no card required.

**`required`** — must name the trigger. The generic form:
> **That needs an account.**
> Create one now — your first $100 of research is on us. No card required.

**Open, and it is a build question as much as a design one:** `required` currently carries no
detail about *which* action triggered it, so the headline has to stay generic. If you want
*"Attaching a file needs an account"*, tell me and I will thread the action through — it is a
small change and the specific line is better than the generic one.

### Register check
No exclamation points. No *"Oops"*, no *"Looks like…"*, no apology. The analyst does not
apologise for the gate; it states where the work stands.

---

## §4 — Two things to tidy while the frame is open

Both are small, both are the kind of thing that gets cloned forward and then defended.

- **`1303:528` is named `Login card` and contains signup copy** (*Create your free account*,
  *Continue with email*, the password field, the consent line). It is the signup card. Rename
  it. A frame whose name contradicts its contents is a mis-clone waiting to happen.
- **`1303:432`** is a text node named `M9K2X0Q8ZP` sitting at the top of the source list —
  placeholder residue. Either it is a real source name, in which case name it, or it is junk
  and should go.

---

## §5 — Out of scope here, but pending

- **Header CTA wording** (signup button + `Login` text, mobile and desktop). That is GTM's
  line, not design's. Blocked on Joy, not on you.
- **The website header.** Joy's brief puts a signup button plus `Login` text in the mobile
  website header. That lives in the **website** file, not this one. **Do you hold it?** If
  yes it needs the same treatment; if no, tell me and I will route it.
- **Mobile login overlay.** I can see `Signup Overlay — Mobile` but have not found a login
  counterpart. The build renders login as an overlay on mobile too, so if there is no frame it
  needs one — a clone of `1303:429` with the login card in place of the signup card. **Does
  one exist?**

---

## §6 — What to send back

Append to `DESIGN-RESPONSE-AUTH-OVERLAYS.md` rather than starting a new document:

1. **§1** — done / blocked, and the node ids you touched.
2. **§2.1** — your call on the input bar, and the reasoning if it is not mine.
3. **§2.2** — the header band height (52 vs 56 vs 72) and whether the hairlines are stepped up.
   **If the frame says 52, I change the code.**
4. **§2.3** — deprecate `1182` or keep it, and why.
5. **§3** — the two cloned variants, with the copy marked *proposed* until Joy signs it off.
6. **§4** — done.
7. **§5** — answers to the two questions: do you hold the website file, and does a mobile
   login overlay exist.

Nothing in §1 changes the app — the code is already at 0.42 on both surfaces. §2.2 might, and
§3 will.
