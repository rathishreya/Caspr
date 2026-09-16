import { describe, expect, it } from 'vitest';

import { coldKilled, coldSendable, COLD_VOLUME, EMAIL_EXCEPTIONS, LIFECYCLE_TRIGGERS, STREAMS } from './email';
import { burstSplit, KILL_RULES, LAUNCH_BURST_TOTAL, META_AUDIENCE_MINIMUM, paidEngine, PAID_CONDITIONS } from './paid';
import {
  BASKET_TARGET,
  CORE_BASKET,
  CONSULTANTS_BASKET,
  INVESTORS_BASKET,
  PRESENCE_SURFACES,
  SECTOR_SHAPE_CAP,
  basketFor,
  checksPerMonth,
  countsAsHit,
  isBranded,
  isNearMiss,
  jobBasket,
  presenceVerdict,
  readPresence,
  type SurfaceReading,
} from './presence';
import { REFERENCE_BACKLOG, REFERENCE_RANKS } from './reference-seo';
import { openBacklog, rankOrder, rankPlay, rankSummary, readOutCoverage } from './seo';

/**
 * `p` is the metric with the most ways to quietly become a vanity number, and
 * `presence-metric.md` §2 says so outright: the construction rules have to be fixed *before*
 * anyone optimises against them. These tests are those rules, so that loosening one is a
 * deliberate act with a failing test attached rather than an edit nobody notices.
 */
describe('the presence basket', () => {
  it('contains no branded question — rule 2.1', () => {
    for (const question of [...CORE_BASKET, ...INVESTORS_BASKET, ...CONSULTANTS_BASKET]) {
      expect(isBranded(question.text), `${question.id} names us`).toBe(false);
    }
  });

  it('catches the brand in every spelling a question might smuggle it in as', () => {
    expect(isBranded('best AI tool like Caspr')).toBe(true);
    expect(isBranded('casper alternatives')).toBe(true);
    expect(isBranded('cheaper ways to get industry reports')).toBe(false);
  });

  it('never counts "Casper" — decision 30', () => {
    expect(isNearMiss('Casper')).toBe(true);
    expect(isNearMiss('Caspr')).toBe(false);
  });

  it('is a shared core of 15 plus a job basket, read across all 50', () => {
    expect(CORE_BASKET).toHaveLength(15);
    expect(BASKET_TARGET).toBe(50);
    expect(basketFor('investors')).toHaveLength(CORE_BASKET.length + INVESTORS_BASKET.length);
  });

  it('keeps every question id unique across a whole basket', () => {
    const ids = basketFor('consultants').map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('holds sector-shape questions under the cap — no more than 5 of any 35', () => {
    for (const icp of ['investors', 'consultants'] as const) {
      const shapes = jobBasket(icp).filter((question) => question.sectorShape === true);
      expect(shapes.length, `${icp} sector shapes`).toBeLessThanOrEqual(SECTOR_SHAPE_CAP);
    }
  });

  it('leaves agencies and strategy unwritten until those ICPs open — §4.2', () => {
    expect(jobBasket('agencies')).toHaveLength(0);
    expect(jobBasket('strategy')).toHaveLength(0);
  });
});

describe('reading p', () => {
  const hit = (questionId: string, extra: Partial<SurfaceReading> = {}): SurfaceReading => ({
    questionId,
    surface: 'google_page_one',
    appeared: ['own_page'],
    ...extra,
  });

  it('counts a question once however many surfaces it appeared on', () => {
    const reading = readPresence('investors', [
      hit('C1'),
      hit('C1', { surface: 'ai_overview', appeared: ['cited'] }),
    ]);
    expect(reading.hits).toBe(1);
  });

  it('divides by the whole basket, not by what was asked', () => {
    const reading = readPresence('investors', [hit('C1')]);
    expect(reading.asked).toBe(basketFor('investors').length);
    expect(reading.p).toBeCloseTo(1 / basketFor('investors').length);
  });

  it('ignores a reading for a question that is not in that ICP’s basket', () => {
    // K1 is the consultants' basket. A reading of it must not raise p_investors.
    expect(readPresence('investors', [hit('K1')]).hits).toBe(0);
  });

  it('needs two of three samples on a generative surface — decision 29', () => {
    const two: SurfaceReading = { questionId: 'C1', surface: 'chatgpt', appeared: ['cited'], samples: [true, true, false] };
    const one: SurfaceReading = { questionId: 'C1', surface: 'chatgpt', appeared: ['cited'], samples: [true, false, false] };
    expect(countsAsHit(two)).toBe(true);
    expect(countsAsHit(one)).toBe(false);
  });

  it('reads a single unsampled surface once', () => {
    expect(countsAsHit({ questionId: 'C1', surface: 'google_page_one', appeared: ['own_page'] })).toBe(true);
  });

  /**
   * Decision 28. The tempting bug is to treat an absent Overview as no-data and drop it from
   * the denominator, which would quietly raise `p` on every question Google chose not to
   * summarise.
   */
  it('counts no AI Overview as a miss on that surface, never as no data', () => {
    const reading = readPresence('investors', [{ questionId: 'C1', surface: 'ai_overview', appeared: [] }]);
    const overview = reading.bySurface.find((row) => row.surface === 'ai_overview');
    expect(overview).toEqual({ surface: 'ai_overview', asked: 1, hits: 0 });
    expect(reading.hits).toBe(0);
  });

  it('records near-misses without counting them', () => {
    const reading = readPresence('investors', [
      { questionId: 'C1', surface: 'google_page_one', appeared: [], nearMiss: true },
    ]);
    expect(reading.hits).toBe(0);
    expect(reading.nearMisses).toBe(1);
  });

  it('says the basket is incomplete while 20 of each job basket are unwritten', () => {
    expect(readPresence('investors', []).basketComplete).toBe(false);
  });

  it('sets no threshold until three readings exist — §5.2', () => {
    expect(presenceVerdict(0)).toMatch(/baseline/i);
    expect(presenceVerdict(1)).toMatch(/no threshold/i);
    expect(presenceVerdict(3)).toMatch(/against x/i);
  });

  it('counts the core once across both launch ICPs', () => {
    // §6: 2 ICPs × 50 × 4 surfaces is 400; 340 actual, because the core is asked once.
    const naive = basketFor('investors').length * PRESENCE_SURFACES.length * 2;
    expect(naive).toBe(240);
    expect(checksPerMonth(['investors', 'consultants'])).toBe(180);
  });
});

/**
 * The read-out is deliberately outside `p` (decision 28), and its whole value is the play
 * column — which is derived, so that it cannot become a column of opinions.
 */
describe('the SEO read-out', () => {
  it('sends a question with no page to the backlog before anything else', () => {
    const play = rankPlay({ questionId: 'C1', position: null, url: null, above: [], overview: 'none' });
    expect(play.play).toBe('write_the_page');
  });

  it('prefers getting listed over out-ranking a roundup', () => {
    const play = rankPlay({
      questionId: 'C1',
      position: 40,
      url: 'https://caspr.ai/x',
      above: [{ domain: 'g2.com', kind: 'roundup', position: 1 }],
      overview: 'none',
    });
    expect(play.play).toBe('get_listed');
    expect(play.what).toMatch(/6\.5×/);
  });

  it('does not tell a top-three page to go and get listed', () => {
    const play = rankPlay({
      questionId: 'C14',
      position: 2,
      url: 'https://caspr.ai/x',
      above: [{ domain: 'g2.com', kind: 'roundup', position: 1 }],
      overview: 'none',
    });
    expect(play.play).toBe('defend');
  });

  it('flags a ranking page whose Overview cites somebody else', () => {
    const play = rankPlay({
      questionId: 'C14',
      position: 2,
      url: 'https://caspr.ai/x',
      above: [],
      overview: 'others',
    });
    expect(play.what).toMatch(/click may not be/i);
  });

  it('separates a page that does not rank from a question with no page', () => {
    const noPage = rankPlay({ questionId: 'K10', position: null, url: null, above: [], overview: 'none' });
    const noRank = rankPlay({ questionId: 'I6', position: null, url: 'https://caspr.ai/x', above: [], overview: 'none' });
    expect(noPage.play).toBe('write_the_page');
    expect(noRank.play).toBe('the_page_does_not_rank');
  });

  it('puts the free wins at the top of the table', () => {
    const first = rankOrder(REFERENCE_RANKS)[0];
    expect(first).toBeDefined();
    expect(rankPlay(first!).play).toBe('the_page_does_not_rank');
  });

  it('summarises the reference reading without claiming presence it does not have', () => {
    const summary = rankSummary(REFERENCE_RANKS);
    expect(summary.read).toBe(REFERENCE_RANKS.length);
    expect(summary.noPage).toBeGreaterThan(0);
    expect(summary.overviewsOurs).toBeLessThan(summary.overviewsSeen);
  });

  it('marks every reference row as illustrative — no reading exists yet', () => {
    for (const row of REFERENCE_RANKS) expect(row.illustrative, row.questionId).toBe(true);
    for (const item of REFERENCE_BACKLOG) expect(item.illustrative, item.id).toBe(true);
  });

  it('reads the read-out against the basket it follows', () => {
    const coverage = readOutCoverage('investors', REFERENCE_RANKS);
    expect(coverage.basket).toBe(basketFor('investors').length);
    expect(coverage.read).toBeGreaterThan(0);
    expect(coverage.read).toBeLessThan(coverage.basket);
  });

  it('leaves live and declined work out of the open backlog', () => {
    const open = openBacklog(REFERENCE_BACKLOG);
    expect(open.every((item) => item.state !== 'live' && item.state !== 'declined')).toBe(true);
    expect(open[0]?.state).toBe('in_progress');
  });
});

describe('the paid engine', () => {
  it('stays dormant until all four conditions hold, not any', () => {
    const three = PAID_CONDITIONS.map((condition, index) => ({ ...condition, met: index < 3 }));
    expect(paidEngine(three).state).toBe('dormant');
    expect(paidEngine(three).blocking).toHaveLength(1);
  });

  it('wakes only when every condition is met', () => {
    const all = PAID_CONDITIONS.map((condition) => ({ ...condition, met: true }));
    expect(paidEngine(all).state).toBe('ready');
  });

  it('holds all $1,500 on search when the Meta audience is under 1,000 — decision 23', () => {
    const split = burstSplit(META_AUDIENCE_MINIMUM - 1);
    expect(split.search).toBe(LAUNCH_BURST_TOTAL);
    expect(split.meta).toBe(0);
  });

  it('splits only once the audience will actually be served', () => {
    const split = burstSplit(META_AUDIENCE_MINIMUM);
    expect(split.search).toBe(1000);
    expect(split.meta).toBe(500);
  });

  it('does not decide the split before week 8', () => {
    expect(burstSplit(5000, 4).meta).toBe(0);
  });

  it('always spends the whole burst and no more', () => {
    for (const size of [0, 999, 1000, 20000]) {
      const split = burstSplit(size);
      expect(split.search + split.meta).toBe(LAUNCH_BURST_TOTAL);
    }
  });

  it('keeps the two rules that make the burst safe without a reviewer automatic', () => {
    const automatic = KILL_RULES.filter((rule) => rule.automatic);
    expect(automatic.map((rule) => rule.trigger)).toEqual([
      'CAC above $300',
      'Zero conversions after 100 clicks',
    ]);
  });
});

describe('email', () => {
  it('keeps four streams and never merges them', () => {
    expect(STREAMS).toHaveLength(4);
    expect(new Set(STREAMS.map((stream) => stream.id)).size).toBe(4);
  });

  it('sends cold outreach from its own domain, never the marketing one', () => {
    const cold = STREAMS.find((stream) => stream.id === 'cold');
    expect(cold?.domain).toBe('cold');
    expect(STREAMS.filter((stream) => stream.domain === 'cold')).toHaveLength(1);
  });

  it('has a trigger for every lifecycle email, and no calendar', () => {
    expect(LIFECYCLE_TRIGGERS).toHaveLength(7);
    for (const trigger of LIFECYCLE_TRIGGERS) {
      expect(trigger.trigger.length).toBeGreaterThan(0);
      expect(trigger.why.length).toBeGreaterThan(0);
    }
  });

  it('refuses a cold send with no finding attached', () => {
    const verdict = coldSendable({ finding: null, frameApproved: true, recipientRegion: 'US', sentThisWeek: 0 });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/skipped/i);
  });

  it('refuses a cold send before Joy has approved the frame', () => {
    expect(coldSendable({ finding: 'a sourced figure', frameApproved: false, recipientRegion: 'US', sentThisWeek: 0 }).ok).toBe(
      false,
    );
  });

  it('excludes EU and UK recipients entirely', () => {
    for (const region of ['EU', 'UK', 'uk']) {
      expect(
        coldSendable({ finding: 'a sourced figure', frameApproved: true, recipientRegion: region, sentThisWeek: 0 }).ok,
        region,
      ).toBe(false);
    }
  });

  it('stops at the weekly cap', () => {
    const verdict = coldSendable({
      finding: 'a sourced figure',
      frameApproved: true,
      recipientRegion: 'US',
      sentThisWeek: COLD_VOLUME.max,
    });
    expect(verdict.ok).toBe(false);
  });

  it('sends when the frame is approved, a finding is attached and it is inside the cap', () => {
    expect(
      coldSendable({ finding: 'a sourced figure', frameApproved: true, recipientRegion: 'US', sentThisWeek: 10 }).ok,
    ).toBe(true);
  });

  it('does not kill the stream before 100 messages have gone out', () => {
    expect(coldKilled(99, 0)).toBe(false);
    expect(coldKilled(100, 9)).toBe(true);
    expect(coldKilled(100, 10)).toBe(false);
  });

  it('pauses every exception before it reaches a person', () => {
    // The one row with no automatic action is the one-time domain setup, not an exception
    // that can fire during a send.
    const live = EMAIL_EXCEPTIONS.filter((exception) => exception.automatic !== '—');
    expect(live).toHaveLength(4);
    for (const exception of live) expect(exception.reaches.length).toBeGreaterThan(0);
  });
});
