# Polish backlog — known-imperfect, deliberately deferred

**Opened 2026-09-04 (Joy).** *"Get it to a 90% status and then we push to live and
fix these minor things while the testing is going on. Make a note of such issues
in a separate file and let's keep updating them."*

---

## What belongs here, and what does not

This is for things that **work and could be better** — copy that reads flat, a
layout that is defensible but not designed, an interaction that is honest but
plain. The point of the file is that noticing something is not a reason to stop
and fix it, and not writing it down is how it gets lost.

**Three things do not belong here and must not be parked:**

| | Goes where |
|---|---|
| **Anything that is wrong rather than plain** — a wrong number, a dead control, a fabricated turn | Fixed now. These are the class of defect that has cost the most time in this build, and every one of them looked minor first |
| **Anything the design session owns** — a treatment that needs drawing | [`DESIGN-NOTES-RUNNING.md`](DESIGN-NOTES-RUNNING.md) |
| **Anything Jayant's team owns** | [`JAYANT-ASKS.md`](JAYANT-ASKS.md) |

**Every entry states what is imperfect, why it was shipped anyway, and what
"better" would mean** — so whoever picks it up is not re-deriving the judgement.

---

## Open

### 1 · The attach workflow's UI and copy

**Where:** `features/attachments/Attachments.tsx`, on the welcome prompt bar.
**Raised:** 2026-09-04, Joy — *"the UI and copies you have created for the attach
workflow could be better."*

**What ships:** the clip opens a real picker, chosen files list as removable
chips under the bar, and one line reads *"Attached files stay in your browser for
this session. Create a free account for secure processing and retention."*

**Why it is not right yet.** Three things, and the first is the one that matters:

- **The chips are invented furniture.** No frame draws an attached-file state on
  the landing bar, so their size, placement and behaviour are mine rather than
  designed. They sit *below* the bar; inside it may well be correct.
- **The caution is doing two jobs in one sentence** — describing what happens to
  the file, and selling an account. Either could be sharper alone.
- **It appears only once a file is attached**, which is deliberate (a warning
  before anyone has attached anything is a rule announced at somebody who has not
  broken it) but means the limit is discovered after the act rather than before.

**What better looks like:** a drawn attached-file state, and copy that separates
the fact from the invitation.

⚠ **Not in this file:** carrying the attachment into the analysis needs a
pre-gate upload path that `api-spec-v2.md` does not have. That is a contract
item, not polish — [`API-CONTRACT-GAPS-CONVERSATION.md`](API-CONTRACT-GAPS-CONVERSATION.md).

---

### 2 · The prompt bar's grown state is undrawn

**Where:** `FirstTimeUserPage`, the 720 × 60 landing bar.
**Raised:** 2026-09-03, while fixing the clip and send button sitting low.

`1171:5` draws one line, and the fix aligned to it — clip and send both centre on
30, which is what the frame specifies. **The bar grows to 3–4 lines and that
state is not drawn.** The controls currently stay centred; the docked bar keeps
its controls beside the last line instead.

Both are defensible. Neither is decided, and the two bars now differ.

---

### 3 · "Thinking…" is a placeholder for a state nobody designed

**Where:** `features/conversation/Conversation.tsx`, `CasprPending`.

Caspr's replies stream, so there is a gap of a few hundred milliseconds between
the user's turn and the first word back. The frames draw the user's bubble and
the finished reply, and nothing in between.

The build shows the word *Thinking…* in the reply's own type at
`text-tertiary` — the plainest thing that works, because inventing a treatment
would put an undesigned element in front of a user. **Already logged as design
note 2**; repeated here because it is visible on every scoping turn and is the
kind of thing that reads as unfinished to a first-time visitor.

---

### 4 · The reference service's assent vocabulary is a word list

**Where:** `services/reference-ai/src/scope.ts`, `isSettled`.

Deciding that a sentence means *go ahead* is a language judgement.
**Jayant's engine does it properly**; ours matches a set of whole-turn phrases
plus a few unambiguous ones inside a sentence.

It is already been wrong once in a way that cost an evening: the first version
required `generate it`, Joy typed `generate`, and nothing happened. The second
used a word-count heuristic and fired on *"Start-ups in the payments space"*.

**It will be wrong again**, and the failure is one-sided by design: when it
cannot tell, it does not fire and the conversation carries on. That is the right
failure, but a visitor who phrases it unusually is left with no way forward and
nothing telling them why. **Worth revisiting once the real engine is behind it**
— at which point this whole rule is deleted rather than improved.

---

### 5 · The gate block inside the scoping pane is not the drawn one

**Where:** `GatePage`'s inline `GateBlock`, and the same block as it will appear
inside the app shell.
**Raised:** 2026-09-04, Joy — *"the UI for the gate in scope screen should match
the way it is designed in Figma, and how it would also work inside the app."*

**Two things in one, and they are worth separating.**

1. **It should match the frame.** The block was built from the frame's rows and
   totals but not audited against it line by line, so spacing, row treatment and
   the depth selector are approximations rather than transcriptions.
2. **It has to work in two chrome contexts** — the open run's marketing header
   and the signed-in app shell — where the pane is a different width and the
   docked slots sit differently. Only the first is currently exercised.

The numbers it shows are right, which is why this is polish: the tiers, the
add-on pricing and the total all come from the server (`pricing.py`), and
`COPY-11a` / `COPY-07b` hold. **The presentation is what is unfinished.**

---

### 6 · Clicking `Analyses` in the rail does nothing when you are already home

**Where:** `Rail`, the `Analyses` item.
**Raised:** 2026-09-04, Joy — *"clicking on Analyses icon in the nav rail doesn't
do anything; ideally it should open the LHS panel with the recent analyses as
designed."*

**The complaint is real. The expectation may be a new design decision, and that
is the thing to settle first.**

`Analyses` links to `/`, which is Home — *Analyses IS Home* per the nav
framework. So clicking it while already there navigates to where you are, and
nothing moves.

**But the drawn frame is pane-less.** `638:2` contains a 64px rail, the greeting
at x=352, the prompt bar, `RECENT ANALYSES` and three rows — **no pane
instance** — and the wordmark collapses to `C.` precisely *because* there is no
pane for it to spill onto (`design-guidelines.md` §4/§10). The recent analyses
are in the **centre**, by design.

So there are two different asks hiding here, and they want different answers:

- **If the pane is a new decision**, it changes this screen's whole grammar —
  pane-less becomes paned, and the rail brand mark changes with it. That is a
  design-session item, not a build fix.
- **If it is not**, the honest fix is much smaller: a rail item you are already
  on should *say so* rather than looking inert. That is an active-state
  question.

**Not built either way, deliberately** — inventing a pane would be inventing the
screen's grammar.


## Closed

*(none yet)*
