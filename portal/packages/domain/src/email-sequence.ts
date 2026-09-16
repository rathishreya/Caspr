/**
 * Email, as something you run rather than something you read about.
 *
 * ⚑ Rebuilt 2026-09-17 on the owner's instruction: *"I don't want reading stuff here. I need
 * proper execution."* The first version described four streams correctly and gave nobody
 * anything to do.
 *
 * The objects are the ones the specs already define, and they are objects rather than prose:
 *
 *   PRECONDITION  five things that must hold before a single email sends. **All five.**
 *                 *"This is a one-shot asset and sending early wastes it"*
 *   SEGMENT       S0–S4, each with its own treatment. Without them this is one generic blast
 *                 to four audiences
 *   EMAIL         a real email — sender, subject, preview, body — that is approved, copied,
 *                 and scheduled. Joy signs off the first of any sequence
 *   TRIGGER       the seven behaviour triggers. Armed or not, and armed is a decision
 *
 * **Nothing sends from this console and nothing pretends to.** The ESP sends; a person pastes.
 * What the console owns is the gate, the approval and the record.
 */

/** Who the email comes from. Founder-signed, and the reply goes to a person. */
export const SENDERS = ['joy', 'jayant', 'both'] as const;
export type Sender = (typeof SENDERS)[number];

export const SENDER_LABEL: Readonly<Record<Sender, string>> = {
  joy: 'Joy at Caspr <joy@caspr.ai>',
  jayant: 'Jayant at Caspr <jayant@caspr.ai>',
  both: 'Joy and Jayant at Caspr',
};

export const EMAIL_STATES = ['draft', 'approved', 'scheduled', 'sent', 'paused'] as const;
export type EmailState = (typeof EMAIL_STATES)[number];

export const EMAIL_STATE_LABEL: Readonly<Record<EmailState, string>> = {
  draft: 'Needs sign-off',
  approved: 'Approved',
  scheduled: 'Scheduled',
  sent: 'Sent',
  paused: 'Paused',
};

/**
 * ⚑ **`approved` does not mean scheduled, and that gap is the whole safety of this
 * workstream.** An email can be signed off months before the preconditions hold. Collapsing
 * the two would mean approving copy was the same act as sending it to 1,600 people.
 */
export const EMAIL_NEXT: Readonly<Record<EmailState, readonly EmailState[]>> = {
  draft: ['approved'],
  approved: ['scheduled'],
  scheduled: ['paused'],
  sent: [],
  paused: ['scheduled'],
};

export function canMoveEmail(from: EmailState, to: EmailState): boolean {
  return EMAIL_NEXT[from].includes(to);
}

export interface EmailDraft {
  readonly id: string;
  readonly sequenceId: string;
  /** Day in the sequence, from the trigger. Day 0 sends on the event. */
  readonly day: number;
  readonly sender: Sender;
  readonly subject: string;
  /** The line the inbox shows after the subject. It is read more than the body. */
  readonly preview: string;
  readonly body: readonly string[];
  /** The one action, or null where the email deliberately asks for nothing. */
  readonly cta: string | null;
  readonly state: EmailState;
  /** Why this email exists and what it is for. One line, from the spec. */
  readonly purpose: string;
  /** Segments that get a different version of this one. */
  readonly variantFor?: readonly string[];
  readonly revision?: { readonly note: string; readonly at: string };
}

export interface Sequence {
  readonly id: string;
  readonly name: string;
  readonly stream: 'existing' | 'new_signups' | 'record' | 'cold';
  readonly audience: string;
  readonly trigger: string;
  readonly goal: string;
  readonly exit: string;
  readonly specifiedIn: string;
}

/**
 * The five preconditions — `reengagement-sequence.md` §2.
 *
 * *"All five. This is a one-shot asset and sending early wastes it."* And §2's closing line
 * is the one that decides the order of work: **precondition 5 has the longest lead time and
 * nothing else depends on it, so it starts first.**
 */
export interface Precondition {
  readonly id: string;
  readonly what: string;
  readonly why: string;
  readonly owner: string;
  readonly met: boolean;
}

export const SEND_PRECONDITIONS: readonly Precondition[] = [
  {
    id: 'product-live',
    what: 'The product is live and onboarding works end to end',
    why: 'Email 3 sends people into it.',
    owner: 'Jayant',
    met: false,
  },
  {
    id: 'samples',
    what: '/samples holds three real reports',
    why: 'Email 4 shows output. A “coming soon” page kills the sequence at its most persuasive moment.',
    owner: 'Joy',
    met: false,
  },
  {
    id: 'segmentation',
    what: 'The segmentation export is back',
    why: 'Without it this is one generic blast to four audiences.',
    owner: 'Jayant’s team',
    met: false,
  },
  {
    id: 'credit',
    what: 'The founding-member credit exists in the product',
    why: 'Downgraded 2026-08-26 from blocker to accelerant — an expired trial has a viable path without it: top up and run one analysis.',
    owner: 'Jayant',
    met: true,
  },
  {
    id: 'domain',
    what: 'The sending domain is warmed',
    why: '1,600 cold addresses from a new sender land in spam whatever the copy says. Roughly three weeks, and nothing else depends on it — so it starts first.',
    owner: 'Jayant / DM TL',
    met: false,
  },
];

export interface SendGate {
  readonly met: number;
  readonly total: number;
  readonly blocking: readonly Precondition[];
  readonly canSend: boolean;
  readonly says: string;
}

export function readSendGate(preconditions: readonly Precondition[] = SEND_PRECONDITIONS): SendGate {
  const blocking = preconditions.filter((row) => !row.met);
  return {
    met: preconditions.length - blocking.length,
    total: preconditions.length,
    blocking,
    canSend: blocking.length === 0,
    says:
      blocking.length === 0
        ? 'All five hold. The sequence can be scheduled.'
        : `${blocking.length} of ${preconditions.length} unmet. Nothing schedules — this is a one-shot asset and sending early wastes it.`,
  };
}

/**
 * Segments — `reengagement-sequence.md` §3, from the segmentation ask.
 *
 * The treatments differ because the audiences do. **S4 gets a personal note from both
 * founders before anything automated reaches them**, which is the one rule here that a
 * scheduling tool will break if nobody writes it down.
 */
export interface Segment {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly treatment: string;
  /** Null where the segment is suppressed and nothing is sent. */
  readonly emails: string | null;
  readonly size: number | null;
}

export const SEGMENTS: readonly Segment[] = [
  {
    id: 'S0',
    name: 'Suppress',
    definition: 'Test, internal, deleted, hard-bounced, unsubscribed',
    treatment: 'Nothing. Suppression is enforced automatically on every send and never overridden.',
    emails: null,
    size: null,
  },
  {
    id: 'S1',
    name: 'Never activated',
    definition: 'Zero completed analyses — the bulk of the list',
    treatment: 'The full five.',
    emails: 'All five',
    size: null,
  },
  {
    id: 'S2',
    name: 'Activated once',
    definition: 'Exactly one completed analysis',
    treatment: 'Full five, with a different Email 1 — they saw the output and did not return, and we want to know why.',
    emails: 'All five, variant 1',
    size: null,
  },
  {
    id: 'S3',
    name: 'Repeat users',
    definition: 'Two or more completed analyses',
    treatment: 'They do not need convincing. They are the testimonial and referral pool.',
    emails: '1, 2 and 5',
    size: null,
  },
  {
    id: 'S4',
    name: 'Ever paid',
    definition: 'Any revenue',
    treatment: '⚠ A personal note from both founders before anything automated reaches them. Then 2 and 5.',
    emails: '2 and 5, after a personal note',
    size: null,
  },
];

/** Whether an email may be scheduled: signed off, and the gate open. */
export function emailSchedulable(email: EmailDraft, gate: SendGate): { readonly ok: boolean; readonly why: string } {
  if (email.state !== 'approved') {
    return { ok: false, why: 'Not signed off. Joy signs off the first email of any sequence.' };
  }
  if (!gate.canSend) {
    return { ok: false, why: gate.says };
  }
  return { ok: true, why: 'Signed off, and every precondition holds.' };
}

/**
 * What the copy must not do — checked before sign-off, like an ad's.
 *
 * These are the two that would be wrong in an inbox with a founder's name on them: the
 * budget written as a subscription price (`COPY-11a`), and a retired line. Everything else
 * about voice is the reviewer's judgement, and this does not pretend otherwise.
 */
const PRICE_AS_SUBSCRIPTION = /\b(?:from|starting at)\s*\$\d|\$\d[\d,.]*\s*(?:\/\s*mo\b|\/\s*month\b|a month\b(?! of research))|\bthe \$\d[\d,.]*\s+plan\b|only what you run is recharged/i;
const RETIRED = /\b(stop googling|your competitors are still waiting|thinking brain|learning brain|caspr signals)\b/i;

export interface EmailProblem {
  readonly what: string;
  readonly fix: string;
}

export function checkEmail(email: EmailDraft): readonly EmailProblem[] {
  const problems: EmailProblem[] = [];
  const all = [email.subject, email.preview, ...email.body, email.cta ?? ''].join('\n');

  if (PRICE_AS_SUBSCRIPTION.test(all)) {
    problems.push({
      what: 'The Research Budget is written as a subscription price.',
      fix: '“$200 a month of research”, never “from $200/mo” — and it never travels without “unused balance carries forward”.',
    });
  }
  if (RETIRED.test(all)) {
    problems.push({
      what: `Uses a retired line: “${RETIRED.exec(all)?.[0]}”.`,
      fix: 'Retired lines are listed rather than deleted so nobody re-proposes them in good faith. This one lost an argument.',
    });
  }
  if (email.subject.includes('!') || email.preview.includes('!')) {
    problems.push({
      what: 'An exclamation point in the subject or preview.',
      fix: 'Never, in any copy. The voice is the most credible person in the room, and they do not shout.',
    });
  }
  if (email.preview.trim().length === 0) {
    problems.push({
      what: 'No preview text.',
      fix: 'The inbox shows it beside the subject, and without one it shows the first line of the body instead.',
    });
  }
  return problems;
}

/** `operations-runbook.md` §7 — Tuesday to Thursday, 08:00 in the recipient's timezone. */
export const SEND_WINDOW = 'Tuesday to Thursday, 08:00 in the recipient’s timezone — otherwise 08:00 GMT';
