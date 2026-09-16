/**
 * Email — four streams, never merged.
 *
 * `activation-framework.md` §8 and §0.5 decision 25. The shape of this workstream is unlike
 * the others and the console has to say so on the first line:
 *
 * > **Email has no standing owner — it runs once approved. Joy owns the exceptions.**
 * > **On a normal week, nobody touches email.**
 *
 * So the Email surface is not a queue of work. It is **a statement of what is running, and
 * what has stopped itself** — §8.5: every exception pauses first and reaches a person
 * second. A surface that asked someone to check on email daily would be the wrong shape for
 * a thing designed to need nobody.
 */

export const EMAIL_STREAMS = ['existing', 'new_signups', 'record', 'cold'] as const;
export type EmailStream = (typeof EMAIL_STREAMS)[number];

export interface StreamDefinition {
  readonly id: EmailStream;
  readonly label: string;
  readonly who: string;
  readonly status: string;
  readonly specifiedIn: string;
  /** Which sending identity it goes from. §8.1 — the two are never the same. */
  readonly domain: 'marketing' | 'cold';
  readonly live: boolean;
  readonly blockedBy: string | null;
}

/**
 * §8's four, with §8.1's rule stated where it bites: **four lists, never merged.**
 *
 * *"Someone who subscribed to be told about research did not ask for product email."* The
 * merge is always tempting and always the same mistake — one list is easier to manage and
 * one complaint rate is easier to read, right up to the send that loses the domain.
 */
export const STREAMS: readonly StreamDefinition[] = [
  {
    id: 'existing',
    label: 'Existing sign-ups',
    who: 'The 1,600 from the retired pitch',
    status:
      'Specified. Partner-production accounts suppressed (2026-09-14). A bonus, never the plan — that cohort arrived through positioning that no longer exists.',
    specifiedIn: 'reengagement-sequence.md',
    domain: 'marketing',
    live: false,
    blockedBy: 'Domain warming — ~3 weeks, and the longest lead time in the project',
  },
  {
    id: 'new_signups',
    label: 'New sign-ups',
    who: 'Anyone who signs up from Day 1',
    status:
      'The highest-leverage email we send, because activation is the first gate to x. One action per email, founder-signed. Behaviour-triggered — never a calendar.',
    specifiedIn: 'activation-framework.md §8.2',
    domain: 'marketing',
    live: false,
    blockedBy: 'Domain warming, and the triggers are not built yet',
  },
  {
    id: 'record',
    label: 'The Record’s subscribers',
    who: 'People who asked to be told when an issue lands',
    status:
      'A welcome, then the issues. The subscription is to be told, not to gain access — so there is no nurture sequence pushing them to sign up. An issue’s email sends automatically once the issue is approved; it is already reviewed as origination, and a second release adds nothing.',
    specifiedIn: 'launch-plan.md §6',
    domain: 'marketing',
    live: false,
    blockedBy: 'Issue 1 lands in week 3',
  },
  {
    id: 'cold',
    label: 'Cold outreach',
    who: 'Named people from public sources. No bought lists',
    status:
      'Research-led, fully automated, and gated on one approval from Joy — of the frames rendered on ~10 real examples, so she approves what recipients will read rather than an abstract template.',
    specifiedIn: 'activation-framework.md §8.4',
    domain: 'cold',
    live: false,
    blockedBy: 'Joy’s one-time frame approval, and the cold domain’s ~3 weeks of warming',
  },
];

/** §8.1 — the rules that hold across all four. */
export const EMAIL_RULES: readonly { readonly rule: string; readonly detail: string }[] = [
  {
    rule: 'Four lists, never merged',
    detail: 'Someone who subscribed to be told about research did not ask for product email.',
  },
  {
    rule: 'Every budget figure follows COPY-11a / COPY-11b',
    detail:
      '“$200 a month of research”, never a subscription price, and never “only what you run is recharged” — the fee is charged whether or not anything runs.',
  },
  {
    rule: 'The marketing subdomain only',
    detail: 'Never the transactional identity. Cold outreach sends from its own domain entirely.',
  },
];

/**
 * §8.2 — new sign-ups, triggered by what they do.
 *
 * **Replaces** the calendar outline in `.agents/gtm-strategy.md` §9, which was written for
 * the retired pricing. A calendar sequence sends the day-3 email on day 3 whether or not the
 * person has done anything; a trigger sends because they did or did not.
 */
export interface LifecycleTrigger {
  readonly id: string;
  readonly trigger: string;
  readonly email: string;
  readonly why: string;
}

export const LIFECYCLE_TRIGGERS: readonly LifecycleTrigger[] = [
  {
    id: 'no-analysis-24h',
    trigger: 'Signed up, no analysis after 24 hours',
    email: 'One prompt matched to their ICP, ready to run',
    why: 'The most common leak',
  },
  {
    id: 'first-was-15',
    trigger: 'First analysis was a $15 depth',
    email: 'What the $80 depth would have found on the same question',
    why: 'Every answer-key pass in the evaluation was an $80 Study',
  },
  {
    id: 'credit-untouched',
    trigger: 'Credit untouched at day 30 and day 60',
    email: 'A question someone like them just ran',
    why: 'Unused, the $100 converts nobody',
  },
  {
    id: 'trial-expiring',
    trigger: 'Trial expiring — day 83 of 90',
    email: 'What they lose, plainly',
    why: 'Honest urgency',
  },
  {
    id: 'invited-colleague',
    trigger: 'Invited a colleague',
    email: 'What the colleague can do — their own $100 is untouched',
    why: 'The collaboration loop, channel-model.md §3.9',
  },
  {
    id: 'three-on-one-domain',
    trigger: 'Three accounts on one company domain',
    email: 'A note from Joy',
    why: 'The Org path',
  },
  {
    id: 'paid-then-quiet',
    trigger: 'Paid, then quiet for 21 days',
    email: 'A new issue in their sector',
    why: 'Retention, not upsell',
  },
];

/**
 * §8.4 — cold outreach.
 *
 * **The constraint that makes this not-spam is mechanical, not editorial:** no finding, no
 * send. `fact_lookup` returns a sourced finding about the recipient's sector or it does not,
 * and if it does not the recipient is skipped. There is no fallback frame, because a
 * fallback frame is how research-led outreach becomes a mail merge.
 */
export const COLD_VOLUME = { min: 20, max: 40 } as const;
export const COLD_KILL_RESPONSE_RATE = 0.1;
export const COLD_KILL_SAMPLE = 100;

export const COLD_RULES: readonly { readonly rule: string; readonly detail: string }[] = [
  {
    rule: 'No finding, no send',
    detail: 'Nothing well-sourced returned from fact_lookup → the recipient is skipped. There is no fallback frame.',
  },
  {
    rule: 'A lookup, never an analysis',
    detail: 'fact_lookup is a lookup. Never an $80 analysis per prospect.',
  },
  {
    rule: 'Replies stop the sequence',
    detail: 'And reach Joy’s inbox — the emails are founder-signed. “Replies — never. One exchange and it breaks.”',
  },
  {
    rule: 'Named people from public sources',
    detail: 'No bought lists.',
  },
  {
    rule: 'CAN-SPAM, and a narrower geography than the law requires',
    detail: 'A real postal address, a working opt-out, an honest subject line. EU and UK recipients excluded entirely.',
  },
  {
    rule: 'Re-approval is for frames, not messages',
    detail: 'A new frame, a new type of finding, or a kill condition tripping. Never individual messages.',
  },
];

/**
 * Whether a drafted cold email may send.
 *
 * §11's schema constraint, enforced rather than documented: *"cold email cannot send without
 * a `fact_lookup` finding attached."*
 */
export function coldSendable(draft: {
  readonly finding: string | null;
  readonly frameApproved: boolean;
  readonly recipientRegion: string;
  readonly sentThisWeek: number;
}): { readonly ok: boolean; readonly reason: string } {
  if (!draft.frameApproved) {
    return { ok: false, reason: 'The frame is not approved. Joy approves frames once, rendered on ~10 real examples.' };
  }
  if (draft.finding === null) {
    return { ok: false, reason: 'No finding — fact_lookup returned nothing well-sourced, so the recipient is skipped.' };
  }
  if (/^(EU|UK)$/i.test(draft.recipientRegion)) {
    return { ok: false, reason: 'EU and UK recipients are excluded from cold outreach entirely.' };
  }
  if (draft.sentThisWeek >= COLD_VOLUME.max) {
    return { ok: false, reason: `${COLD_VOLUME.max} is the weekly cap. The rest wait for next week.` };
  }
  return { ok: true, reason: 'Frame approved, finding attached, inside the cap.' };
}

/** Whether the cold stream has killed itself — §8.4. */
export function coldKilled(sent: number, replies: number): boolean {
  return sent >= COLD_KILL_SAMPLE && replies / sent < COLD_KILL_RESPONSE_RATE;
}

/**
 * §8.5 — the exceptions, which are the whole surface.
 *
 * Every row pauses **before** it reaches anyone. That ordering is the design: a person who
 * has to notice a deliverability breach in order to stop it will notice it on Monday.
 */
export interface EmailException {
  readonly id: string;
  readonly exception: string;
  readonly automatic: string;
  readonly reaches: string;
}

export const EMAIL_EXCEPTIONS: readonly EmailException[] = [
  {
    id: 'reply',
    exception: 'A reply',
    automatic: 'The sequence stops for that person',
    reaches: 'Joy’s inbox — the emails are founder-signed',
  },
  {
    id: 'deliverability',
    exception: 'Deliverability breach — complaints above 0.1%, a bounce spike, a blocklisting',
    automatic: 'Sending pauses',
    reaches: 'Joy',
  },
  {
    id: 'kill',
    exception: 'A kill condition — cold response under 10% over 100',
    automatic: 'That stream pauses',
    reaches: 'Joy decides whether it resumes',
  },
  {
    id: 'stale',
    exception: 'An approved email goes stale — pricing or the product changes',
    automatic: 'Change detection flags it — email templates are registered with it',
    reaches: 'Joy, to re-approve',
  },
  {
    id: 'domains',
    exception: 'The two sending domains',
    automatic: '—',
    reaches: 'A one-time technical setup, not ongoing',
  },
];

/** `operations-runbook.md` §8 — the thresholds a send is held to. */
export const COMPLAINT_INVESTIGATE = 0.001;
export const COMPLAINT_CEILING = 0.003;
export const WARMING_PER_DAY = { min: 100, max: 150 } as const;
export const WARMING_WEEKS = 3;

export interface SendingDomain {
  readonly id: 'marketing' | 'cold';
  readonly label: string;
  readonly carries: string;
  readonly warmedFrom: string | null;
  readonly ready: boolean;
}

/**
 * §14 dependency 5 — **the longest lead time in the project.**
 *
 * Two domains, ~3 weeks each, and nothing in this workstream sends until they are warm. The
 * console shows them first for that reason: every other row here is waiting on these two.
 */
export const SENDING_DOMAINS: readonly SendingDomain[] = [
  {
    id: 'marketing',
    label: 'Marketing subdomain',
    carries: 'Existing sign-ups · new sign-ups · The Record',
    warmedFrom: null,
    ready: false,
  },
  {
    id: 'cold',
    label: 'The cold domain',
    carries: 'Cold outreach only — never the marketing identity, and never the transactional one',
    warmedFrom: null,
    ready: false,
  },
];
