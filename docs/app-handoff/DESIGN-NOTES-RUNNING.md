# Design notes — running list

**Append-only. Fixed in a single pass, not one at a time** (Joy, 2026-08-27).

Small design observations found while building or testing. Each entry says what
was seen, where, and why it looks wrong — not what to draw. The design session
decides the answer.

**Not for functional bugs.** Those are fixed in the build as they are found.
This is for things where the *frame* is the question.

---

## Open

### 1 · The nav carries a bottom divider that does not earn its place

**Where:** the app shell's navigation.
**Seen:** 2026-08-27, Joy, testing locally.

> *"There seems to be a bottom divider line/border on the nav. I don't think
> that makes sense to have."*

Worth checking against `design-guidelines.md` §on dividers when this is picked
up: the rule elsewhere in the system is that a divider separates things that
would otherwise run together, and chrome sitting on a different surface from the
content already reads as separate. If the nav has its own background, the line
is doing the job twice.

---

### 2 · There is no drawn state for "Caspr is answering"

**Where:** the scoping conversation pane — `1301:3280` desktop / `1309:3280`
mobile — and, when it is wired, Ask Caspr.
**Seen:** 2026-08-27, Joy, testing locally.

> *"My reply to the questions didn't give anything back from Caspr."*

The cause was a missing API call, now added, so the reply arrives — **streamed**,
a few hundred milliseconds after the user sends. The frames have no state for
that gap: they draw the user's bubble and Caspr's finished reply, and nothing
in between.

The build ships the plainest thing that works — the word *Thinking…* in
`CasprReply`'s type at `text-tertiary` — because inventing a treatment here
would put an undesigned element in front of a user. It needs a designed answer,
and the same one should cover every streamed surface: scoping, Ask Caspr, and
the Edit pane's proposals.

Two things worth deciding together:

- **Does the pending state sit where the reply will land, or replace nothing?**
  If it sits in place, the reply grows out of it and the column does not jump.
- **Does the reply stream visibly, token by token, or appear complete?** The
  transport streams either way; this is purely whether the user watches it
  arrive. Related to the decode-flip decision already taken for Theater.

---

## Closed

*(none yet)*
