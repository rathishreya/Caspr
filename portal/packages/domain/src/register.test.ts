import { describe, expect, it } from 'vitest';

import { CHANNEL_PUBLISH_MODE, REJECT_CODES, STAGES_CARRYING_ICP_HINT } from './content-item';
import { COPY_LIBRARY, COPY_TIER_REGISTER, copyLinesByTier } from './library';
import { NARRATIVE_REGISTER, narrativeMix } from './narrative';
import { PRIOR_WINDOW_COUNTS, REFERENCE_WEEK } from './reference-week';
import { VOICE_LANES, laneCollisions, personName } from './roster';

describe('the reject taxonomy', () => {
  /**
   * Design spec §5A.3 keys the ten codes `1`–`0` in review mode: "muscle memory is the
   * point". Reordering the array silently rebinds ten shortcuts for three people.
   */
  it('is ten codes in the order the build spec fixes', () => {
    expect(REJECT_CODES).toEqual([
      'FACT_WRONG',
      'STALE_NUMBER',
      'UNSUPPORTED_CLAIM',
      'OFF_VOICE',
      'BANNED_TERM',
      'WRONG_CTA',
      'DUPLICATE',
      'LEGAL_RISK',
      'BOUNDARY_BREACH',
      'WEAK',
    ]);
  });
});

describe('channels that are never automated', () => {
  /**
   * Build spec §11 puts community posting permanently out of scope: "Automated posting
   * here gets accounts banned and burns the channel permanently."
   */
  it('keeps community and outreach human-only', () => {
    expect(CHANNEL_PUBLISH_MODE.community).toBe('human_only');
    expect(CHANNEL_PUBLISH_MODE.outreach).toBe('human_only');
  });
});

describe('the roster', () => {
  it('carries all seven lanes, with Naman on comments only', () => {
    expect(VOICE_LANES).toHaveLength(7);
    expect(VOICE_LANES.find((lane) => lane.id === 'naman')?.cadence).toBeNull();
  });

  it('keeps the two lanes that never speak for the company', () => {
    const restricted = VOICE_LANES.filter((lane) =>
      lane.never.includes('Anything speaking for the company'),
    ).map((lane) => lane.id);
    expect(restricted).toEqual(['kartikey', 'keshav']);
  });

  it('never renders a blank author', () => {
    expect(personName(null)).toBe('Caspr');
    expect(personName('joy')).toBe('Joy');
    expect(personName('unknown-lane')).toBe('unknown-lane');
  });
});

describe('one subject, one person, one week', () => {
  it('finds nothing in the reference week', () => {
    expect(laneCollisions(REFERENCE_WEEK)).toEqual([]);
  });

  it('reports a topic carried by two lanes, naming both', () => {
    const collisions = laneCollisions([
      { topicId: 'retrieval-evaluation', voiceLane: 'dixit' },
      { topicId: 'retrieval-evaluation', voiceLane: 'jayant' },
      { topicId: 'ship-notes-w34', voiceLane: 'amit' },
    ]);
    expect(collisions).toEqual([{ topicId: 'retrieval-evaluation', lanes: ['dixit', 'jayant'] }]);
  });

  it('ignores company-voice items, which have no lane to collide', () => {
    expect(
      laneCollisions([
        { topicId: 'category-review-2026-08', voiceLane: null },
        { topicId: 'category-review-2026-08', voiceLane: null },
      ]),
    ).toEqual([]);
  });
});

describe('narrative caps', () => {
  const mix = narrativeMix(REFERENCE_WEEK, PRIOR_WINDOW_COUNTS);

  it('covers all eight narratives whether or not the week used them', () => {
    expect(mix).toHaveLength(8);
    expect(NARRATIVE_REGISTER.map((n) => n.id)).toEqual(mix.map((row) => row.id));
  });

  it('holds N5 under 15% and N4 within one per four weeks', () => {
    const n5 = mix.find((row) => row.id === 'N5');
    const n4 = mix.find((row) => row.id === 'N4');
    expect(n5?.share).toBeLessThanOrEqual(0.15);
    expect(n5?.overCap).toBe(false);
    expect(n4?.overCap).toBe(false);
  });

  it('flags N5 the moment the product share passes 15%', () => {
    const overweight = [
      { narrative: 'N5' },
      { narrative: 'N5' },
      { narrative: 'N1' },
      { narrative: 'N1' },
      { narrative: 'N1' },
    ];
    expect(narrativeMix(overweight).find((row) => row.id === 'N5')?.overCap).toBe(true);
  });

  it('flags N4 using the four-week window, not this week alone', () => {
    const oneJourney = [{ narrative: 'N4' }, { narrative: 'N1' }];
    expect(narrativeMix(oneJourney).find((row) => row.id === 'N4')?.overCap).toBe(false);
    expect(
      narrativeMix(oneJourney, new Map([['N4', 1]])).find((row) => row.id === 'N4')?.overCap,
    ).toBe(true);
  });

  it('never divides by zero on an empty week', () => {
    expect(narrativeMix([]).every((row) => row.share === 0 && !row.overCap)).toBe(true);
  });
});

describe('the copy library', () => {
  it('tiers every line — a flat list is how a retired line gets reused', () => {
    for (const line of COPY_LIBRARY) {
      expect(COPY_TIER_REGISTER.some((tier) => tier.id === line.tier)).toBe(true);
    }
  });

  it('marks exactly one tier as blocked, and it is the retired one', () => {
    const blocked = COPY_TIER_REGISTER.filter((tier) => tier.blocked);
    expect(blocked.map((tier) => tier.id)).toEqual(['retired']);
  });

  it('keeps the retired lines listed rather than deleted', () => {
    expect(copyLinesByTier('retired').map((line) => line.line)).toEqual([
      'Stop Googling. Start analyzing.',
      'Your competitors are still waiting for the research.',
    ]);
  });

  it('holds the locked homepage H1 in the lead tier', () => {
    const h1 = COPY_LIBRARY.find((line) => line.id === 'lead-h1');
    expect(h1?.tier).toBe('lead');
    expect(h1?.line).toBe('Not an assistant. An analyst.');
  });

  /** CLAUDE.md, Brand Identity: no exclamation points — ever. */
  it('contains no exclamation point anywhere', () => {
    expect(COPY_LIBRARY.some((line) => line.line.includes('!'))).toBe(false);
  });
});

describe('link stamping', () => {
  /**
   * Operating model ㉗: an awareness post has no link to stamp, which is why awareness
   * cannot be measured by the Performance Desk and must not be judged by it.
   */
  it('stamps consideration and intent only', () => {
    expect([...STAGES_CARRYING_ICP_HINT].sort()).toEqual(['consideration', 'intent']);
  });
});
