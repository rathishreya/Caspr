/**
 * A review decision — four actions.
 *
 * `portal-build-spec.md` §3.4: "Approve · Reject with reason · Hold for discussion. **No
 * editing.** Reviewers do not rewrite." And the design spec's review-mode rules this file
 * encodes so every surface that takes a decision takes the same one (§5A.1):
 *
 *  · decision 5 — commit on action, no batch save, no undo
 *  · the reject taxonomy is fixed, number-keyed `1`–`0`, and a note is required
 *
 * Validation lives here rather than in the form, because a form is one caller and the
 * server action is another, and a rule enforced in only one of them is a rule with a hole.
 */

import { REJECT_CODES, isUnreviewed, type ContentItem, type ItemStatus, type RejectCode } from './content-item';

export const DECISION_ACTIONS = ['approve', 'reject', 'hold', 'revise'] as const;
export type DecisionAction = (typeof DECISION_ACTIONS)[number];

/**
 * ⚑ **`revise` added 2026-09-16**, at the Content & Social owner's request: *"user can
 * interact with the posts and can change it using prompts."*
 *
 * It is a departure from §3.4's *"No editing. Reviewers do not rewrite"* — and what that
 * rule protects is kept: **the reviewer still does not type the post.** They type an
 * instruction, the writer re-writes, and the new version comes back through the same review.
 * So the audit trail holds (every version is a version, every instruction is in the ledger),
 * the voice stays the engine's rather than seven people's, and nobody edits published text
 * in place.
 *
 * It is not a rejection, and the ledger keeps them apart: a rejection says *this was wrong*
 * and feeds the reject rate that calibrates the generator; a revision says *make it this
 * instead*. Counting the second as the first would make a well-calibrated queue look broken.
 *
 * ⚠ ⑩ the Writer is not built. Until it is, a revision records the instruction and the item
 * waits — the screen says so rather than implying a rewrite is on its way.
 */
export const PROMPT_MAX_CHARS = 400;

/** §3.4: "A required note of ≤200 characters accompanies every rejection." */
export const NOTE_MAX_CHARS = 200;

/**
 * An upper bound on one decision's measured time.
 *
 * `seconds_spent` sizes next week's volume (build spec §4). A card left open over lunch is
 * not a four-hour review, and letting it through would shrink next week's queue for a
 * reason nobody chose.
 */
export const MAX_SECONDS_SPENT = 900;

/** The meaning of each code, verbatim from build spec §3.4, in its fixed order. */
export const REJECT_CODE_MEANING: Readonly<Record<RejectCode, string>> = {
  FACT_WRONG: 'A factual claim is incorrect',
  STALE_NUMBER: 'A figure contradicts current truth',
  UNSUPPORTED_CLAIM: 'Asserted without a citable source',
  OFF_VOICE: 'Breaches brand voice',
  BANNED_TERM: 'Prohibited vocabulary — also raises a linter defect',
  WRONG_CTA: 'Wrong destination or offer',
  DUPLICATE: 'Too close to published material',
  LEGAL_RISK: 'Regulatory or claims exposure',
  BOUNDARY_BREACH: 'Brand-separation issue',
  WEAK: 'Correct but not worth publishing',
};

/** `1`–`9` then `0`, in taxonomy order. Design spec §5A.3: "Muscle memory is the point." */
export function rejectCodeKey(code: RejectCode): string {
  const index = REJECT_CODES.indexOf(code);
  return index === 9 ? '0' : String(index + 1);
}

export function rejectCodeForKey(key: string): RejectCode | null {
  if (!/^\d$/.test(key)) return null;
  const index = key === '0' ? 9 : Number(key) - 1;
  return REJECT_CODES[index] ?? null;
}

export interface DecisionInput {
  readonly itemId: string;
  readonly action: DecisionAction;
  readonly reasonCode: RejectCode | null;
  readonly note: string | null;
  readonly secondsSpent: number;
}

export type Validated<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly errors: readonly string[] };

/**
 * Validate a decision from untrusted input — a form post, most often.
 *
 * Errors are written to be shown to the reviewer as they are: they say what is wrong and
 * what to do, never "invalid input".
 */
export function validateDecision(raw: {
  readonly itemId?: unknown;
  readonly action?: unknown;
  readonly reasonCode?: unknown;
  readonly note?: unknown;
  readonly secondsSpent?: unknown;
}): Validated<DecisionInput> {
  const errors: string[] = [];

  const itemId = typeof raw.itemId === 'string' ? raw.itemId.trim() : '';
  if (itemId.length === 0) errors.push('The post this decision belongs to is missing. Reload the page and decide again.');

  const action = DECISION_ACTIONS.find((candidate) => candidate === raw.action);
  if (!action) errors.push('Choose approve, reject, hold or revise.');

  const note = typeof raw.note === 'string' ? raw.note.trim() : '';
  const code = REJECT_CODES.find((candidate) => candidate === raw.reasonCode) ?? null;

  if (action === 'reject') {
    if (code === null) errors.push('Pick the reason for the rejection — one of the ten codes.');
    if (note.length === 0) errors.push('Add a note. It goes into the regeneration prompt and the ledger.');
  }
  if (action === 'revise' && note.length === 0) {
    errors.push('Say what to change. The instruction is what the writer works from.');
  }
  const limit = action === 'revise' ? PROMPT_MAX_CHARS : NOTE_MAX_CHARS;
  if (note.length > limit) {
    errors.push(`Keep it to ${limit} characters. It is ${note.length}.`);
  }

  const seconds = Number(raw.secondsSpent);
  const secondsSpent = Number.isFinite(seconds) ? Math.round(Math.min(Math.max(seconds, 1), MAX_SECONDS_SPENT)) : 1;

  if (errors.length > 0 || !action) return { ok: false, errors };

  return {
    ok: true,
    value: {
      itemId,
      action,
      // A reason code on an approval would put a rejection code in the ledger for a post
      // nobody rejected. Only a rejection carries one.
      reasonCode: action === 'reject' ? code : null,
      note: note.length > 0 ? note : null,
      secondsSpent,
    },
  };
}

/** What an item's status becomes once a decision commits. */
/** Which actions carry free text, and what that text is called on screen. */
export const DECISION_NOTE_LABEL: Readonly<Record<DecisionAction, string | null>> = {
  approve: null,
  hold: null,
  reject: 'Note — it goes into the regeneration prompt and the ledger',
  revise: 'What to change — this becomes the instruction the writer works from',
};

export function statusAfter(action: DecisionAction): ItemStatus {
  switch (action) {
    case 'approve':
      return 'approved';
    case 'reject':
      return 'rejected';
    case 'hold':
      return 'holding';
    /**
     * A revision leaves the calendar the same way a rejection does — the version on the
     * page is not the one that will publish. The ledger keeps which of the two it was, so
     * the board can say "revising" rather than "rejected" and the reject rate stays honest.
     */
    case 'revise':
      return 'rejected';
  }
}

/**
 * Whether an item can still take a decision.
 *
 * Undecided items can. So can held ones — "hold for discussion" is a pause, and the
 * discussion ends in a decision. Approved, rejected and published items cannot: decision 5
 * is commit on action, and a surface that let a reviewer quietly re-decide would be undo
 * by another name.
 */
export function isDecidable(item: Pick<ContentItem, 'status'>): boolean {
  return isUnreviewed(item) || item.status === 'holding';
}

/**
 * Minutes left in the queue, from what reviewing has actually cost.
 *
 * Design spec §5A.3: "Minutes remaining is computed from `seconds_spent`, not from a
 * constant per item. It is the only honest version of that number." With no history there
 * is nothing honest to compute, so the answer is `null` rather than a guess.
 */
export function estimateReviewMinutes(itemsLeft: number, meanSecondsPerDecision: number): number | null {
  if (itemsLeft === 0) return 0;
  if (meanSecondsPerDecision <= 0) return null;
  return Math.max(1, Math.ceil((itemsLeft * meanSecondsPerDecision) / 60));
}
