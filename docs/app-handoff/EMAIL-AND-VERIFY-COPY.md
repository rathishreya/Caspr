# Email copy, email format, and the `/verify` states

**Draft for Joy, 2026-08-19.** Replaces the placeholder copy in
`ses-mailer.ts`. Nothing applied yet.

---

## First: Joy is right about the current copy

*"Nothing impactful — bare minimum effort type output."* Fair, and worth being
precise about why, because the fix is not "add adjectives".

The old copy is **correct but anonymous**. *"Confirm your address to start your
analysis"* would sit unchanged in any SaaS product's onboarding. Nothing in it
is something only Caspr would say. It passes the rules — no exclamation marks,
no padding — and still fails the voice, because the voice is not only a list of
prohibitions.

There is a real tension to hold, though: **a verification email has one job, and
over-writing it is a classic way to lose the click.** So the answer is not more
words. It is the same word count, with every line unmistakably Caspr.

The verification email is also **the first thing a new user ever receives from
Caspr** — sent at the highest-intent moment there is, seconds after they typed a
prompt and asked for an analysis. Spending that on a generic door is the actual
waste.

### The lever the old copy ignored

Caspr's differentiator is that every conclusion carries its source. The
transactional emails never mention it. One clause does the work:

> *"Every conclusion in your report will carry its source."*

And the product already has a copy pattern worth reusing — the scoped resets say
what **survives**: *"Your reports, Data Room and wallet stay untouched."* The
password-reset email should do the same. It is reassuring, specific, and
recognisably ours.

---

## Second: plain text or HTML?

**Both — and that part is not a design choice.** Every email should stay
multipart (`text/plain` + `text/html`). Some clients render only one, and a
missing plain-text part is a mild spam signal. The code already does this and
should keep doing it.

The real question is whether the **HTML should be designed**, and the answer is
yes — but not the way it is now.

### What is wrong with the current HTML

It is a generic SaaS card:

- `font-family: -apple-system, Segoe UI, Helvetica` — the system sans stack.
  Caspr is **heavy editorial serif**, FT/Economist register. The email looks
  like a different company's.
- The wordmark is bold sans with a red dot. The real wordmark is Instrument
  Serif.
- A bordered white card on cream, which is the standard SaaS shell.

### The direction instead

**Typographic and restrained.** No images beyond text, generous white space, and
the serif doing the work:

- **Serif headline and wordmark**, `Instrument Serif, Georgia, 'Times New
  Roman', serif`. Webfonts do not load reliably in email — Outlook and Gmail web
  will fall back — and **Georgia is the right fallback**: it is an editorial
  serif and holds the register. Design for the fallback, not the ideal.
- **The wordmark stays text**, never an image, so it survives the image
  blocking that is on by default in most clients.
- **Accent red on the button** (`#e8453c`), square corners — consistent with the
  product's own primary button, and the accent is ink rather than a wash.
- **Cream `#faf9f7` ground**, one hairline, and more space than feels necessary.
- **Dark mode:** clients invert aggressively. Set explicit background and text
  colours so an inverted client degrades to something legible rather than
  black-on-black.

The link keeps appearing twice — as a button and as raw text — because a
meaningful share of clients will not render the first.

---

## The five emails, rewritten

### 1 · Verification — the first thing they ever receive

> **Subject:** Confirm your address
>
> # One step left.
>
> Confirm this address and Caspr starts work. Every conclusion in your report
> will carry its source.
>
> `[ Confirm address ]`
>
> The link works once and expires in 24 hours. If you did not create a Caspr
> account, ignore this — nothing has been set up.

*Why:* the headline states a fact rather than instructing. The second sentence
is the only line that could not belong to another product. The footer closes the
loop for someone who did not ask for this — *nothing has been set up* is the
reassurance that matters.

### 2 · Password reset

> **Subject:** Reset your password
>
> # Set a new password.
>
> Choose one and you are back in. Your analyses, Data Room and wallet are
> untouched.
>
> `[ Set a new password ]`
>
> The link works once and expires in an hour. If you did not ask for this,
> ignore it — your password has not changed.

*Why:* reuses the product's own "what survives" pattern from the scoped resets.
Someone resetting a password is often mid-worry about what else has been
touched; answering that unasked is the considerate move.

### 3 · Already registered

Sent when somebody tries to sign up with an address that already has an account.

> **Subject:** This address already has an account
>
> # You are already here.
>
> Someone tried to sign up with this address. If that was you, log in instead —
> nothing has changed.
>
> `[ Log in ]`
>
> If it was not you, your account is untouched. Changing your password would be
> prudent.

*Why:* *"You are already here"* is warmer than the old *"You already have a Caspr
account"* without being chatty. *"Prudent"* carries the dry register — it is
advice from someone who is not alarmed.

### 4 · Reset requested for an address with no account

> **Subject:** No account for this address
>
> # There is nothing here to reset.
>
> Someone asked to reset a Caspr password for this address. No account exists
> for it, so nothing has changed.
>
> `[ Create an account ]`
>
> If that was not you, no action is needed.

*Why:* the headline is the whole message. It is also mildly, deliberately funny
in the dry way the brand allows — nothing here to reset.

### 5 · Email change — confirming the new address

**Approved by Joy, 2026-08-25.** Added after the other four: the email-change
flow was built later, so this copy was drafted alongside the endpoint rather
than lifted from this document, and it shipped unreconciled. That is now closed.

> **Subject:** Confirm your new address
>
> # Confirm the new address.
>
> Someone asked to move a Caspr account to this address. Confirm it and the
> account moves; until then nothing has changed.
>
> `[ Confirm new address ]`
>
> The link works once and expires in an hour. If you did not ask for this,
> ignore it — the account stays where it is.

*Why:* it goes to the **new** address, which may belong to someone who has never
heard of Caspr — so it says what the account is and what is being asked, without
assuming they recognise either. "Until then nothing has changed" is the same
reassurance pattern as 2, doing the same job: the reader's real question is what
has already happened to them, and it is answered before they ask.

The expiry is bound to `EMAIL_CHANGE_TTL` in `auth/service.py`. Move the
lifetime and this string moves with it, or the email starts lying.

### Why 3 and 4 exist at all

Worth keeping visible, because they look like edge cases and are not. Signup and
password reset both answer **identically** whether or not the address has an
account, so nobody can use those endpoints to discover who is registered. That
makes **email the only channel that can tell the actual owner what happened.**
Delete these two and someone whose address was used learns nothing.

---

## The `/verify` states

The screen someone lands on from the email link. It has four states, and three
of them are failures — which is why it deserves more than an error string.

**Shared shape:** the auth-screen layout, headline in Instrument Serif, one line
of body, one primary action. No stack traces, no codes, no apology.

### A · Confirmed (the success state)

> # Address confirmed.
>
> That is the last of the paperwork. Your analysis is waiting.
>
> `[ Continue ]`

*Why:* names the moment and gets out of the way. *"The last of the paperwork"*
is the dry note; it also quietly promises there is no more of it.

### B · Expired

> # This link has expired.
>
> Verification links last 24 hours. Ask for another and it will be with you in
> a moment.
>
> `[ Send a new link ]`

*Why:* states the rule so the expiry reads as policy rather than misfortune, and
the action is one tap. Never *"Sorry, your link has expired"* — the apology
invites the reader to be annoyed.

### C · Already used

> # This link has already been used.
>
> Your address is confirmed, which means there is nothing left to do here.
>
> `[ Log in ]`

*Why:* the important half is that **this is not a failure** — they are verified.
Distinguishing it from *expired* matters because the action is completely
different: log in, rather than request another link. Collapsing the two into one
generic error would send a verified user round a loop for nothing.

### D · Not valid

> # This link is not valid.
>
> It may have been copied incompletely, or it belongs to an account that no
> longer exists. Asking for a new one is the quickest way through.
>
> `[ Send a new link ]`

*Why:* offers the likely cause without accusing the reader of anything, and does
not confirm whether a token ever existed — the copy is deliberately vague on
that point, and that vagueness is a security property rather than sloppiness.

### One thing to decide

**Should `D` be distinguishable from `B` at all?** Merging them into *"this link
is no longer valid"* leaks marginally less. My recommendation is to keep them
apart: the actions are identical, so the only thing leaked is whether a string
was ever a real token — which is negligible — and a person who mis-copied a link
is helped by being told so.

---

## Two consistency notes

1. **The expiries are stated in the copy** — 24 hours and one hour. If the token
   lifetimes in `verification.ts` change, these strings must move with them.
   Worth a comment at both sites.
2. **`/verify` copy and the email copy have to agree.** The email says *"expires
   in 24 hours"*; state B says *"last 24 hours"*. Same number, and it should stay
   that way.
