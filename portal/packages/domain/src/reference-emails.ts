/**
 * The emails, as written.
 *
 * ⚑ **Copy is final and it is Joy's** — `reengagement-sequence.md` §5 says so outright:
 * *"Copy is final. Bracketed values are merge fields."* Emails 1 and 2 are transcribed from
 * it; the rest carry their specified purpose and their stated subject, with the body written
 * to the same brief and marked in `purpose` where that is what happened.
 *
 * The lifecycle sequence is `activation-framework.md` §8.2 — seven triggers, each with the
 * email it fires and the reason it exists. That table gives the trigger and the email's job;
 * the drafts here are written to it.
 *
 * ⚠ **Nothing has sent and nothing can.** Four of five preconditions are unmet, and the
 * sending domains are cold.
 */

import type { EmailDraft, Sequence } from './email-sequence';

export const SEQUENCES: readonly Sequence[] = [
  {
    id: 'reengagement',
    name: 'The founders’ sequence',
    stream: 'existing',
    audience: 'The 1,600 who signed up under the retired pitch',
    trigger: 'A one-shot send, once every precondition holds',
    goal: 'Re-open a conversation that went quiet, and find out who is still there',
    exit: 'Running an analysis moves them to Email 5’s audience. Everyone exits on unsubscribe.',
    specifiedIn: 'reengagement-sequence.md',
  },
  {
    id: 'lifecycle',
    name: 'New sign-ups',
    stream: 'new_signups',
    audience: 'Anyone who signs up from Day 1',
    trigger: 'Behaviour — never a calendar',
    goal: 'The first analysis. Activation is the first gate to x.',
    exit: 'Each trigger fires once, and stops firing when the behaviour changes.',
    specifiedIn: 'activation-framework.md §8.2',
  },
];

/**
 * The founders' sequence — five emails.
 *
 * Email 1 carries **no CTA at all, deliberately**: *"a first email after months of silence
 * that asks for something spends credibility it has not earned."* That is the single most
 * counter-intuitive decision in the sequence and it is the one most likely to be undone by
 * somebody adding a button, so it is visible on the card.
 */
export const REENGAGEMENT_EMAILS: readonly EmailDraft[] = [
  {
    id: 're-1',
    sequenceId: 'reengagement',
    day: 0,
    sender: 'joy',
    subject: 'What we’ve been doing since you signed up',
    preview: 'The short version: we rebuilt it.',
    body: [
      '[First name],',
      'You signed up for Caspr in [month]. Then we went quiet.',
      'Here is why. What you saw was a first version, and it was not the product we wanted attached to our names. So we rebuilt it — the analysis engine, the sources it reads, how it shows its reasoning, the interface, and the pricing.',
      'You were among the first two thousand people to sign up. I know what that is worth, because for a long time you were most of the evidence we had that any of this mattered.',
      'Over the next couple of weeks I would like to show you what changed. Jayant — my co-founder — is going to write next about how it actually works. He built it, and he explains it better than I do.',
      'Nothing to do today. I just did not want the first thing you heard from us in months to be a pitch.',
      'Joy\nCo-founder, Caspr',
    ],
    cta: null,
    state: 'draft',
    purpose:
      'Buy the second open, and nothing else. No CTA at all, deliberately — a first email after months of silence that asks for something spends credibility it has not earned.',
    variantFor: ['S2'],
  },
  {
    id: 're-2',
    sequenceId: 'reengagement',
    day: 4,
    sender: 'jayant',
    subject: 'How it works now',
    preview: 'The part that changed is what it reads, and how it argues.',
    body: [
      '[First name],',
      'Joy wrote last week about why we went quiet. This is the part I can explain better than she can.',
      'Caspr reads 25 million curated sources — documents, government databases, news feeds. Not the open web. When two of them disagree about the same number on the same basis, it says so and shows the range, rather than picking one and hoping nobody asks.',
      'That is the whole difference. A summary tells you what the sources said. An analysis tells you what to believe, and why, with every figure traceable to where it came from.',
      'If you want to see the shape of the output rather than read about it, reply and I will send you one.',
      'Jayant\nCo-founder, Caspr',
    ],
    cta: 'Reply and I will send you one.',
    state: 'draft',
    purpose:
      'The engineer explains the engine. Written to §5’s brief for Email 2 — the subject and sender are its own; the body is written to that brief rather than transcribed.',
  },
  {
    id: 're-3',
    sequenceId: 'reengagement',
    day: 9,
    sender: 'joy',
    subject: 'Something for the people who were here first',
    preview: 'The only thing in this sequence I am going to ask you to click.',
    body: [
      '[First name],',
      'You signed up before there was much to sign up for. I would like that to be worth something.',
      'Your account has $100 of research in it. That is roughly one Study — a hundred pages on a real question, every figure cited to a credible source — with nothing to enter and no card to add.',
      'Run one question you actually need answered. If it is not good, tell me and I will take that seriously.',
      'Joy\nCo-founder, Caspr',
    ],
    cta: 'Run one question you actually need answered.',
    state: 'draft',
    purpose:
      'The only hard CTA in the sequence. Written to §5’s brief for Email 3 — the grant. The figure is the access model’s own $100, never framed as a plan price.',
  },
  {
    id: 're-4',
    sequenceId: 'reengagement',
    day: 15,
    sender: 'joy',
    subject: 'What it does now, shown rather than described',
    preview: 'Three real analyses. Read one and decide for yourself.',
    body: [
      '[First name],',
      'Rather than describe the output again, here are three we published in full.',
      'Saudi industrial valves — a market two published sources price 36% apart, reconciled. UK ready meals — the same question, in a sector with no syndicated coverage. Vertical SaaS valuations — forward against trailing multiples, and why the room keeps arguing.',
      'Every figure in them carries its source and its date. That is the thing I would want to check if I were you.',
      'Joy\nCo-founder, Caspr',
    ],
    cta: 'Read one of the three.',
    state: 'draft',
    purpose:
      'Shown, not described — §5’s brief for Email 4. ⚠ Blocked on precondition 2: a “coming soon” /samples page kills the sequence at its most persuasive moment.',
  },
  {
    id: 're-5',
    sequenceId: 'reengagement',
    day: 21,
    sender: 'both',
    subject: 'Two asks, and you can ignore both',
    preview: 'One takes a minute. The other takes a sentence.',
    body: [
      '[First name],',
      'Last one from us.',
      'If you ran something and it was useful, we would like to say so publicly — with your name on it, or without. Either helps.',
      'If you ran something and it was not useful, that is the more valuable email and we would rather have it. One sentence is enough.',
      'And if you never got round to it, that is fine too. The credit does not expire this week.',
      'Joy and Jayant',
    ],
    cta: 'Reply with either.',
    state: 'draft',
    purpose:
      'Behaviour-gated — §5’s brief for Email 5. The asks differ by what the person actually did, and both are refusable.',
  },
];

/**
 * The lifecycle triggers — `activation-framework.md` §8.2.
 *
 * **Behaviour, never a calendar.** A calendar sequence sends the day-3 email on day three
 * whether or not the person has done anything; each of these fires because they did or did
 * not. `day` is the delay after the trigger, not a position in a series.
 */
export const LIFECYCLE_EMAILS: readonly EmailDraft[] = [
  {
    id: 'lc-no-analysis',
    sequenceId: 'lifecycle',
    day: 1,
    sender: 'joy',
    subject: 'One prompt, ready to run',
    preview: 'Matched to what you said you do. Two minutes.',
    body: [
      '[First name],',
      'You signed up yesterday and have not run anything yet. That is the most common place people stop, and it is usually because the blank box is the hard part.',
      'So here is one, written for what you told us you do: [icp_prompt]. Paste it in and see what comes back.',
      'If it is the wrong question, tell me the right one and I will write it for you.',
      'Joy',
    ],
    cta: 'Run the prompt.',
    state: 'draft',
    purpose: 'Signed up, no analysis after 24 hours — the most common leak.',
  },
  {
    id: 'lc-first-was-15',
    sequenceId: 'lifecycle',
    day: 1,
    sender: 'joy',
    subject: 'What the $80 depth would have found',
    preview: 'Same question, more of it.',
    body: [
      '[First name],',
      'You ran a Brief on [topic]. Briefs are built to answer in fifteen minutes, and they leave the reconciliation out.',
      'On that same question, a Study reads the sources that disagree, says which basis each used, and gives you the range with the working. Every answer-key pass in our own evaluation was a Study.',
      'Same prompt, one rung up.',
      'Joy',
    ],
    cta: 'Run it again at the $80 depth.',
    state: 'draft',
    purpose: 'First analysis was a $15 depth. Every answer-key pass in the evaluation was an $80 Study.',
  },
  {
    id: 'lc-credit-untouched',
    sequenceId: 'lifecycle',
    day: 30,
    sender: 'joy',
    subject: 'A question someone like you ran this week',
    preview: 'Yours is still sitting there.',
    body: [
      '[First name],',
      'Your $100 has not moved in a month. Unused, it does nobody any good — least of all us, because we do not find out whether this works for you.',
      'Here is one a [icp] ran this week: [recent_prompt].',
      'If yours is nothing like that, reply with the real one.',
      'Joy',
    ],
    cta: 'Run yours.',
    state: 'draft',
    purpose: 'Credit untouched at day 30 and day 60. Unused, the $100 converts nobody.',
  },
  {
    id: 'lc-trial-expiring',
    sequenceId: 'lifecycle',
    day: 83,
    sender: 'joy',
    subject: 'Your credit expires in a week',
    preview: 'Plainly, so it is not a surprise.',
    body: [
      '[First name],',
      'The $100 you were given at signup expires on [expiry]. After that it is gone, and topping up starts from zero.',
      'That is the whole email. If you have a question worth answering, this is the week.',
      'Joy',
    ],
    cta: 'Run one before it goes.',
    state: 'draft',
    purpose: 'Trial expiring — day 83 of 90. Honest urgency: the date is real and it is stated once.',
  },
  {
    id: 'lc-invited',
    sequenceId: 'lifecycle',
    day: 0,
    sender: 'joy',
    subject: '[colleague] has their own $100',
    preview: 'Not a shared pot.',
    body: [
      '[First name],',
      'You invited [colleague]. Worth knowing: their $100 is their own and untouched — it does not come out of yours.',
      'They can also edit what you run, which is the part most people find out by accident.',
      'Joy',
    ],
    cta: null,
    state: 'draft',
    purpose: 'Invited a colleague. The collaboration loop — their own $100 is untouched.',
  },
  {
    id: 'lc-three-on-domain',
    sequenceId: 'lifecycle',
    day: 0,
    sender: 'joy',
    subject: 'Three of you at [company]',
    preview: 'A note, not a pitch.',
    body: [
      '[First name],',
      'Three people at [company] have signed up separately. That usually means a team is solving the same problem in three browser tabs.',
      'There is a version of this where the analyses, the sources and the Data Room are shared rather than duplicated. Whether that is worth anything depends on what the three of you are actually doing — which is why this is a question rather than a proposal.',
      'Joy',
    ],
    cta: 'Tell me what the three of you are working on.',
    state: 'draft',
    purpose: 'Three accounts on one company domain. The Org path — a note from Joy, not a sales sequence.',
  },
  {
    id: 'lc-paid-quiet',
    sequenceId: 'lifecycle',
    day: 21,
    sender: 'joy',
    subject: 'New in [sector] this month',
    preview: 'One issue, no ask.',
    body: [
      '[First name],',
      'You have been quiet for three weeks, so this is not a nudge — it is the issue we published on [sector] since you last ran something.',
      '[issue_summary]',
      'Nothing to do. It is yours either way.',
      'Joy',
    ],
    cta: null,
    state: 'draft',
    purpose: 'Paid, then quiet for 21 days. Retention, not upsell — which is why there is no ask.',
  },
];

export const ALL_EMAILS: readonly EmailDraft[] = [...REENGAGEMENT_EMAILS, ...LIFECYCLE_EMAILS];
