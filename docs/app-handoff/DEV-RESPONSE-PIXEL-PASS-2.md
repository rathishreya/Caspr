# Dev response — pixel audit round 2

**Commit `57964db`.** Three items, all applied and measured at both breakpoints.

| Item | Applied |
|---|---|
| Q1 · Edge-prompt re-space | Both breakpoints, measured |
| Q2 · `COVER OPTIONS` | No change — already restored to what the frame says |
| Q3 · Signed-out shell | Guard added: the rail's 64px is held even with no rail |
| Q4 · `WalletBadge` | Deleted |
| — | Desktop width **336** confirmed in the build |

---

## Q1 · The body was 13, not 14 — that was mine

You were right that the box was showing one line of a paragraph, and your
numbers differ from mine for a reason I had wrong: I built the body at **14/21**.
At **13/16** it is three lines in a 48-tall box, which is exactly what you drew.

Measured after:

| | Desktop | Mobile |
|---|---|---|
| Card | `91/350 336×228` ✅ | drawer `y380 h408`, unchanged |
| Title | `y25 h30 w288` | `y415 **h31** w342` |
| Body | `y63 **h48** w288` | `y454 **h48** w342` |
| Button | `y131 h44` | `y695 h46` |
| `Not now` | `y189` | `y753` |

The consistent +1 against your numbers is the 1px border: Figma strokes are
inside the box, CSS borders are not. Same offset as pass 1.

**The `textAutoResize` sweep is the more valuable half of this.** Noted and
taken seriously: any geometry I read from that file before today is suspect,
because a node reporting `h10` for Instrument Serif 24 is not a rounding
difference, it is fiction. I have not gone back through everything already
built — flagging that rather than claiming otherwise. If Layer C measures a
height that disagrees with what I built, the frame is now more likely to be
right than it was this morning.

## Q2 · Nothing to do

Family-3 control labels keep the caps treatment; caps is retired for speech
only. The build already renders `1384:14` at Inter Semi Bold 10.5 / `#8a8a85` /
ls 0.84, measured 97 wide against the frame's 97.

Useful framing, and I have taken the rule as: **does it scroll with the thread
AND is it the app speaking?** Both, or it is a label. `Or just ask` is speech
that happens to sit near controls; `COVER OPTIONS` names the controls. The
"does it scroll" test alone would have got this one wrong, which is how I got
it wrong.

## Q3 · Guard added

You are right that the frames answer it and that no redesign is needed. I added
the guard you described, because "a real anonymous user should never reach an
app route" is a statement about intent, not a layout guarantee.

The shell now reserves the rail's 64px whether or not a rail is drawn.

| Signed out, `/generation` | Before | After |
|---|---|---|
| `aside` | `x=0` | **`x=64`** |
| Conversation column | `x=16` | **`x=80`** |
| Rail labels | 0 | 0 — still no rail, as intended |

Signed in is unchanged: four labels, `main x=64 w=1376`, column `x=80`. The
onboarding routes sit outside this shell entirely, which is why `/scope`
measured correctly all along.

## Q4 · Deleted — and you were right that my reason was wrong

I argued `WalletBadge` contradicted "no persistent budget chrome". It does not,
and your objection is the important one: that rule is about the **edit
allowance in the report context**, and a persistent money balance *is* approved
— it is in the rail and it is the mobile Wallet tab's label. Accept my argument
and someone deletes the rail balance next year citing this exchange.

The real reason is placement, and this repo had already written it down —
`MobileHeader.tsx:9`: *"The wallet balance is deliberately NOT here — it moved
to the Wallet tab."* `WalletBadge` was a header chip for a balance deliberately
moved out of the header. Deleted with that recorded as the reason.

Worth saying plainly: **I reached the right action through the wrong rule**,
which is the kind of thing that survives as precedent if nobody catches it.

---

## Withdrawals — noted, and the protocol fix is the right outcome

Nothing to do on 7, 11 or 9's mechanism. The protocol now opening with
*"establish a session first"* is worth more than any of the three findings
would have been.

One thing to carry forward: I reproduced your numbers signed out **before**
replying, and that is the only reason it settled in one round rather than
becoming a disagreement about whose measurement was real. Worth keeping as the
default on both sides.

---

## Still open

Nothing from this round. The two live items are yours:

- **Layer C signed in** — `/report/edge-prompt` is there for State 3, and the
  session snippet is in the protocol.
- **The 2px hairline on the seven Profile & Wallet frames** — agreed, build to
  the visual. Not shifting anything for it.

*Dev session · 2026-08-20. Round 2 closed from this side.*
