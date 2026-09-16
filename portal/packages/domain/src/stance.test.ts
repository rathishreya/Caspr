import { describe, expect, it } from 'vitest';

import {
  DAILY_APPROVAL_CAP,
  MAX_PEOPLE_PER_EXTERNAL_POST,
  atBrigadingLimit,
  engagementPublishMode,
  surfacing,
} from './engagement';
import { lintDeterministic } from './lint';
import { REFERENCE_ENGAGEMENT } from './reference-engagement';
import { STANCE_LIBRARY, stance } from './stance';

describe('the stance library — activation framework §5', () => {
  it('covers every conversation shape the framework names', () => {
    expect(STANCE_LIBRARY).toHaveLength(9);
    for (const row of STANCE_LIBRARY) {
      expect(row.lines.length).toBeGreaterThan(0);
      expect(stance(row.id)).toBe(row);
    }
  });

  /**
   * The lines are quoted, so they are held to the same linter as anything else that leaves
   * the building. If an approved line cannot pass the rules, one of the two is wrong and it
   * is better to find out here than in a draft.
   */
  it('holds its own approved lines to the linter', () => {
    for (const row of STANCE_LIBRARY) {
      for (const line of row.lines) {
        expect(lintDeterministic(line).findings, `${row.id}: ${line}`).toEqual([]);
      }
    }
  });

  /** ⛔ §5: "no tool is ever named", including in the one category-education line. */
  it('never names a tool in a line a draft may use', () => {
    const named = /ChatGPT|Perplexity|Gemini|Copilot|Claude|Bard/i;
    for (const row of STANCE_LIBRARY) {
      for (const line of row.lines) expect(named.test(line), line).toBe(false);
    }
  });
});

describe('the drafts the desk writes — §6.4', () => {
  const acted = REFERENCE_ENGAGEMENT.filter((t) => t.drafts.length > 0);

  it('drafts only where a person is acting, and never for a filtered target', () => {
    for (const target of REFERENCE_ENGAGEMENT) {
      if (target.drafts.length === 0) continue;
      expect(surfacing(target).surfaced, target.id).toBe(true);
    }
    expect(acted.length).toBeGreaterThan(0);
  });

  it('gives each one two or three variants, in one lane, each with its own basis', () => {
    for (const target of acted) {
      expect(target.drafts.length, target.id).toBeGreaterThanOrEqual(2);
      expect(target.drafts.length, target.id).toBeLessThanOrEqual(3);
      for (const draft of target.drafts) {
        expect(draft.lane).toBe(target.assignedTo);
        expect(draft.basis.trim().length).toBeGreaterThan(0);
      }
    }
  });

  /** §6.7 rule 2: "No two people get the same or a similar draft." */
  it('never repeats a draft across targets', () => {
    const texts = REFERENCE_ENGAGEMENT.flatMap((t) => t.drafts.map((d) => d.text));
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('passes the linter, like everything else that leaves the building', () => {
    for (const target of acted) {
      for (const draft of target.drafts) {
        expect(lintDeterministic(draft.text).findings, draft.id).toEqual([]);
      }
    }
  });

  /** ⑰'s guard rail still holds: a draft exists only where there was a fact to bring. */
  it('never drafts where there is nothing to bring', () => {
    for (const target of REFERENCE_ENGAGEMENT) {
      if (target.drafts.length > 0) expect(target.factToBring, target.id).not.toBeNull();
    }
  });
});

describe('how a reply reaches the platform — §6.6 and §6.7', () => {
  it('is one tap everywhere the API would be penalised, and manual on Reddit', () => {
    expect(engagementPublishMode('linkedin')).toBe('one_tap');
    expect(engagementPublishMode('x')).toBe('one_tap');
    expect(engagementPublishMode('reddit')).toBe('manual');
  });

  it('caps us at ten approvals a day and two people on one post', () => {
    expect(DAILY_APPROVAL_CAP).toBe(10);
    expect(MAX_PEOPLE_PER_EXTERNAL_POST).toBe(2);
  });

  it('counts a skipped or not-my-lane card as nobody on the post', () => {
    const [first] = REFERENCE_ENGAGEMENT;
    const post = first!.post.id;
    const two = [first!, { ...first!, id: 'second' }];
    expect(atBrigadingLimit(two, post)).toBe(true);
    expect(atBrigadingLimit([first!, { ...first!, id: 'second', status: 'not_my_lane' as const }], post)).toBe(false);
  });
});
