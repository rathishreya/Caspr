import { describe, expect, it } from 'vitest';

import { REJECT_CODES } from './content-item';
import {
  MAX_SECONDS_SPENT,
  NOTE_MAX_CHARS,
  estimateReviewMinutes,
  isDecidable,
  rejectCodeForKey,
  rejectCodeKey,
  statusAfter,
  validateDecision,
} from './decision';

describe('validateDecision', () => {
  it('accepts an approval and drops any stray reason code', () => {
    const result = validateDecision({ itemId: 'ci-1', action: 'approve', reasonCode: 'WEAK', secondsSpent: 40 });
    expect(result).toEqual({
      ok: true,
      value: { itemId: 'ci-1', action: 'approve', reasonCode: null, note: null, secondsSpent: 40 },
    });
  });

  /** Build spec §3.4 — "a required note of ≤200 characters accompanies every rejection." */
  it('refuses a rejection without a code or without a note', () => {
    expect(validateDecision({ itemId: 'ci-1', action: 'reject', note: 'Reads as marketing.' }).ok).toBe(false);
    expect(validateDecision({ itemId: 'ci-1', action: 'reject', reasonCode: 'OFF_VOICE', note: '   ' }).ok).toBe(false);
  });

  it('refuses a note over 200 characters and says by how much', () => {
    const result = validateDecision({
      itemId: 'ci-1',
      action: 'reject',
      reasonCode: 'WEAK',
      note: 'x'.repeat(NOTE_MAX_CHARS + 1),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(' ')).toContain('201');
  });

  it('accepts a hold with no note — a hold is a pause, not a verdict', () => {
    expect(validateDecision({ itemId: 'ci-1', action: 'hold', secondsSpent: 12 }).ok).toBe(true);
  });

  it('refuses an action outside the three', () => {
    expect(validateDecision({ itemId: 'ci-1', action: 'edit' }).ok).toBe(false);
  });

  /** A card left open over lunch is not a four-hour review, and it would shrink next week's queue. */
  it('clamps measured time to a sane range', () => {
    const long = validateDecision({ itemId: 'ci-1', action: 'approve', secondsSpent: 14_400 });
    const junk = validateDecision({ itemId: 'ci-1', action: 'approve', secondsSpent: 'soon' });
    expect(long.ok && long.value.secondsSpent).toBe(MAX_SECONDS_SPENT);
    expect(junk.ok && junk.value.secondsSpent).toBe(1);
  });
});

describe('the keyboard mapping', () => {
  /** Design spec §5A.3: the codes are number-keyed 1–0 in the fixed order. */
  it('keys the ten codes 1 to 9 then 0, and round-trips', () => {
    expect(REJECT_CODES.map(rejectCodeKey)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    for (const code of REJECT_CODES) expect(rejectCodeForKey(rejectCodeKey(code))).toBe(code);
    expect(rejectCodeForKey('a')).toBeNull();
  });
});

describe('what can still be decided', () => {
  it('lets undecided and held items take a decision, and nothing already decided', () => {
    expect(isDecidable({ status: 'in_review' })).toBe(true);
    expect(isDecidable({ status: 'holding' })).toBe(true);
    // Commit on action, no undo — design spec §5A decision 5.
    expect(isDecidable({ status: 'approved' })).toBe(false);
    expect(isDecidable({ status: 'rejected' })).toBe(false);
    expect(isDecidable({ status: 'published' })).toBe(false);
  });

  it('maps each action to the status it commits', () => {
    expect(statusAfter('approve')).toBe('approved');
    expect(statusAfter('reject')).toBe('rejected');
    expect(statusAfter('hold')).toBe('holding');
  });
});

describe('estimateReviewMinutes', () => {
  it('computes from measured seconds, rounding up', () => {
    expect(estimateReviewMinutes(6, 75)).toBe(8);
  });

  /** §5A.3 — with no history there is no honest number, so there is none. */
  it('returns null rather than guessing when nothing has been measured', () => {
    expect(estimateReviewMinutes(6, 0)).toBeNull();
    expect(estimateReviewMinutes(0, 0)).toBe(0);
  });
});
