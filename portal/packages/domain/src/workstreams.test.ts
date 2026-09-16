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
import {
  AEO_STANDARD,
  ENTITY_SIGNALS,
  SITE_DEBT,
  aeoMissing,
  readConversionTest,
} from './aeo';
import {
  APPROACH_SHAPES,
  SHAPE_OWNER,
  approachProgress,
  canAdvance,
  lapsedApproaches,
  nextApproaches,
  openTasks,
} from './approach';
import {
  COMPONENT_REGISTER,
  LEVERS,
  audienceFromCpc,
  component,
  readClock,
} from './discoverability';
import {
  BASELINE,
  CATEGORY_READING,
  KEYWORD_SHAPES,
  REFERENCE_APPROACHES,
  REFERENCE_PAGES,
  REFERENCE_SEO_TASKS,
} from './reference-seo';

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
 * Three components, three clocks, three kill conditions.
 *
 * `docs/seo/decision.md` §1 is the correction these hold: one kill condition measured the
 * slowest, riskiest third of the channel and ignored the two-thirds that pay fastest. The
 * easiest way to undo it is to quietly reintroduce a single verdict, so the tests assert
 * that each clock reads on its own terms.
 */
describe('the three clocks', () => {
  const NOW = new Date('2026-09-16T12:00:00Z');

  it('has one component per kill condition, and no aggregate', () => {
    expect(COMPONENT_REGISTER).toHaveLength(3);
    expect(COMPONENT_REGISTER.map((row) => row.id)).toEqual(['presence', 'citation', 'ranking']);
    for (const row of COMPONENT_REGISTER) expect(row.kill.length).toBeGreaterThan(10);
  });

  it('orders them by speed, not by importance — the fastest needs nothing published', () => {
    expect(component('presence').readsAfterMonths).toBe(0);
    expect(component('citation').readsAfterMonths).toBe(3);
    expect(component('ranking').readsAfterMonths).toBe(6);
  });

  /**
   * The failure this exists to catch: a six-month clock nobody started reading as "on track"
   * because it has not failed yet. §3A.2 — the DR-40 domain is only available in month 12 if
   * the work started in month 1.
   */
  it('says a clock that has not started has not started, and what would start it', () => {
    const reading = readClock({ component: 'ranking', startedOn: null, have: 0, of: 12 }, NOW);
    expect(reading.state).toBe('not_started');
    expect(reading.killed).toBe(false);
    expect(reading.says).toMatch(/indexed/i);
    expect(reading.sampleShare).toBe(0);
  });

  it('never kills a slow clock before its months have run', () => {
    const reading = readClock({ component: 'ranking', startedOn: '2026-09-01', have: 0, of: 12 }, NOW);
    expect(reading.state).toBe('running');
    expect(reading.killed).toBe(false);
    expect(reading.says).toMatch(/does not fail fast/i);
  });

  it('kills a slow clock once its months have run and the bar is unmet', () => {
    const reading = readClock({ component: 'ranking', startedOn: '2026-01-01', have: 0, of: 12 }, NOW);
    expect(reading.state).toBe('readable');
    expect(reading.killed).toBe(true);
  });

  it('does not kill it when the bar is met', () => {
    const reading = readClock({ component: 'ranking', startedOn: '2026-01-01', have: 2, of: 12 }, NOW);
    expect(reading.killed).toBe(false);
  });

  /**
   * Presence reads on a sample of approaches rather than on a calendar — 3 inclusions after
   * 25. Reading it at four approaches would kill the fastest component of the channel in its
   * second week, which is the mirror image of the mistake the correction fixed.
   */
  it('does not read presence before 25 approaches have gone out', () => {
    const reading = readClock({ component: 'presence', startedOn: '2026-08-25', have: 0, sent: 4 }, NOW);
    expect(reading.state).toBe('running');
    expect(reading.killed).toBe(false);
    expect(reading.says).toMatch(/21 more/);
  });

  it('kills presence at 25 approaches with under 3 inclusions', () => {
    const reading = readClock({ component: 'presence', startedOn: '2026-08-25', have: 2, sent: 25 }, NOW);
    expect(reading.state).toBe('readable');
    expect(reading.killed).toBe(true);
  });

  it('does not kill presence at exactly the bar', () => {
    expect(readClock({ component: 'presence', startedOn: '2026-08-25', have: 3, sent: 25 }, NOW).killed).toBe(false);
  });

  /**
   * The card's denominator is the target, never the progress. A presence card reading
   * `0 / 0` because nothing has gone out is true and useless — the denominator is there to
   * say how much work the reading needs.
   */
  it('shows the sample as the denominator, not the approaches already sent', () => {
    const reading = readClock({ component: 'presence', startedOn: null, have: 0, of: 25, sent: 0 }, NOW);
    expect(reading.of).toBe(25);
  });

  it('starts every lever in the first fortnight — only the data pages have a gate', () => {
    expect(LEVERS).toHaveLength(6);
    const gated = LEVERS.filter((lever) => /conversion test/i.test(lever.scalesOn));
    expect(gated.map((lever) => lever.id)).toEqual(['data_pages']);
  });

  /** CPC discriminates buyer from student far better than volume does. */
  it('reads $300 as a buyer and $9 as a student', () => {
    expect(audienceFromCpc(300)).toBe('buyer');
    expect(audienceFromCpc(9)).toBe('student');
    expect(audienceFromCpc(null)).toBe('mixed');
  });
});

describe('the target list', () => {
  /**
   * ⚠ The bar here is deliberately low. Several rows read only "Vendor blog roundup" because
   * that is the whole of what the baseline recorded about them, and padding a fixture to pass
   * a prettier assertion would be inventing detail about a real target list.
   */
  it('came from the baseline, and keeps each domain’s shape and reason', () => {
    expect(REFERENCE_APPROACHES.length).toBeGreaterThan(10);
    for (const row of REFERENCE_APPROACHES) {
      expect(APPROACH_SHAPES, row.domain).toContain(row.shape);
      expect(row.why.length, row.domain).toBeGreaterThan(0);
      expect(row.questionId, row.domain).toMatch(/^[CIK]\d+$/);
    }
  });

  it('marks exactly one priority — the target confirmed across two query families', () => {
    const priority = REFERENCE_APPROACHES.filter((row) => row.priority === true);
    expect(priority.map((row) => row.domain)).toEqual(['cybernews.com']);
  });

  /**
   * The shape decides who does the work, and the SEO / Earned Media boundary runs straight
   * through this list. A weak candidate calls all four shapes "outreach".
   */
  it('routes a form to SEO, a pitch to Earned Media and a thread to a person', () => {
    expect(SHAPE_OWNER['directory']).toBe('seo');
    expect(SHAPE_OWNER['roundup']).toBe('earned_media');
    expect(SHAPE_OWNER['forum']).toBe('social');
  });

  it('never offers a forum thread as something to automate', () => {
    const forum = REFERENCE_APPROACHES.find((row) => row.shape === 'forum');
    expect(forum?.why).toMatch(/never automate/i);
  });

  it('only lets an approach move the way the state machine allows', () => {
    expect(canAdvance('identified', 'approached')).toBe(true);
    expect(canAdvance('identified', 'included')).toBe(false);
    expect(canAdvance('approached', 'included')).toBe(true);
    expect(canAdvance('included', 'approached')).toBe(false);
    expect(canAdvance('declined', 'approached')).toBe(false);
  });

  /** "No reply" counts toward the sample exactly as a decline does. */
  it('counts every row that left identified toward the sample', () => {
    const progress = approachProgress([
      { ...REFERENCE_APPROACHES[0]!, state: 'included' },
      { ...REFERENCE_APPROACHES[1]!, state: 'declined' },
      { ...REFERENCE_APPROACHES[2]!, state: 'no_reply' },
      { ...REFERENCE_APPROACHES[3]!, state: 'identified' },
    ]);
    expect(progress.approached).toBe(3);
    expect(progress.included).toBe(1);
    expect(progress.readable).toBe(false);
  });

  it('offers only what can actually be sent today', () => {
    const next = nextApproaches(REFERENCE_APPROACHES);
    expect(next.length).toBeGreaterThan(0);
    // Competitor pages and skips are not work. Editorial pitches are work nobody can do.
    expect(next.some((row) => row.shape === 'competitor' || row.shape === 'skip')).toBe(false);
    expect(next.some((row) => SHAPE_OWNER[row.shape] === 'earned_media')).toBe(false);
    expect(next[0]?.shape).toBe('directory');
  });

  /**
   * The uncomfortable one, and it is worth a test so nobody quietly promotes it back into the
   * queue to make the queue look better: the single best target on the list — confirmed
   * across two independent query families — is a pitch, and nobody can send it.
   */
  it('leaves the priority target lapsed, because it is a pitch and there is no pitcher', () => {
    const lapsed = lapsedApproaches(REFERENCE_APPROACHES);
    expect(lapsed.some((row) => row.priority === true)).toBe(true);
    expect(nextApproaches(REFERENCE_APPROACHES).some((row) => row.priority === true)).toBe(false);
  });

  it('counts the pitches nobody can send as lapsed rather than as a queue', () => {
    expect(approachProgress(REFERENCE_APPROACHES).lapsed).toBe(lapsedApproaches(REFERENCE_APPROACHES).length);
  });
});

describe('the AEO standard and the site’s debt', () => {
  it('holds five checks, and a page meets all five or it does not', () => {
    expect(AEO_STANDARD).toHaveLength(5);
    const empty = REFERENCE_PAGES[0]!;
    expect(aeoMissing(empty)).toHaveLength(5);
    expect(aeoMissing({ ...empty, meets: ['schema', 'freshness'] })).toHaveLength(3);
  });

  it('names what each debt blocks, never just what it is', () => {
    for (const row of SITE_DEBT) expect(row.blocks.length).toBeGreaterThan(20);
  });

  it('keeps a self-authored Wikipedia page marked forbidden, not merely undone', () => {
    const wikipedia = ENTITY_SIGNALS.find((row) => row.id === 'no-wikipedia');
    expect(wikipedia?.forbidden).toBe(true);
  });

  /**
   * §3A.1 moved the gate from start to scale. Failing T4 means not going from 40 pages to
   * 4,000; it does not mean the 40 should not exist.
   */
  it('does not read the conversion test before 1,000 sessions', () => {
    const early = readConversionTest(400, 0);
    expect(early.readable).toBe(false);
    expect(early.passed).toBe(false);
    expect(early.says).toMatch(/exist either way/i);
  });

  it('passes at the 1% bar and fails under it', () => {
    expect(readConversionTest(1000, 10).passed).toBe(true);
    expect(readConversionTest(1000, 9).passed).toBe(false);
    expect(readConversionTest(1000, 9).says).toMatch(/citation asset/i);
  });
});

describe('the measured baseline', () => {
  it('records a zero that was measured, on every question run', () => {
    expect(BASELINE.length).toBeGreaterThan(0);
    for (const row of BASELINE) expect(row.present).toBe(false);
  });

  it('carries both readings of the category finding, never one', () => {
    expect(CATEGORY_READING.opportunity.length).toBeGreaterThan(40);
    expect(CATEGORY_READING.problem.length).toBeGreaterThan(40);
    expect(CATEGORY_READING.unresolved).toMatch(/have not answered/i);
  });

  /** The largest-volume family in the set is the one that was dropped. */
  it('drops the highest-volume family because its CPC says student', () => {
    const methodology = KEYWORD_SHAPES.find((shape) => shape.id === 'methodology');
    expect(methodology?.build).toBe('dropped');
    expect(audienceFromCpc(methodology?.cpc ?? null)).toBe('student');
    const highest = [...KEYWORD_SHAPES].sort((a, b) => b.volume - a.volume)[0];
    expect(highest?.id).toBe('methodology');
  });

  it('opens the task list with the leg of the baseline that cannot be reconstructed', () => {
    expect(REFERENCE_SEO_TASKS[0]?.id).toBe('st-ai-leg');
    expect(REFERENCE_SEO_TASKS[0]?.what).toMatch(/cannot be reconstructed/i);
  });

  it('leaves every seeded task open — none of this has started', () => {
    expect(openTasks(REFERENCE_SEO_TASKS)).toHaveLength(REFERENCE_SEO_TASKS.length);
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
