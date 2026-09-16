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
  adApprovable,
  adCreativeSpec,
  canMoveAd,
  canReviseAd,
  checkAdCopy,
  platformRule,
  readAd,
  readSpend,
  type AdMetrics,
} from './ad';
import { AD_BUDGET_MONTHLY, REFERENCE_ADS } from './reference-ads';
import { checkContent, contentHealth } from './content-seo';
import type { PostBody } from './post';
import { REFERENCE_POSTS } from './reference-posts';
import {
  LINK_ROUTES,
  MIN_INBOUND_LINKS,
  TECHNICAL,
  checkPage,
  postPage,
  siteHealth,
  slugify,
  urlProblems,
} from './page-seo';
import { SITE_PAGES } from './reference-pages';
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

/**
 * The site, page by page. These hold the architecture's own rules — the ones that are easy to
 * lose in a redesign because nothing fails loudly when they break.
 */
describe('the site', () => {
  it('carries every page from the architecture, with its phase', () => {
    expect(SITE_PAGES.length).toBeGreaterThanOrEqual(30);
    expect(new Set(SITE_PAGES.map((page) => page.path)).size).toBe(SITE_PAGES.length);
    for (const page of SITE_PAGES) expect([1, 2, 3]).toContain(page.phase);
  });

  it('keeps every URL to the site’s own conventions', () => {
    for (const page of SITE_PAGES) {
      expect(urlProblems(page.path), page.path).toEqual([]);
    }
  });

  it('catches an underscore, a capital, a trailing slash and a date', () => {
    expect(urlProblems('/for_consulting')).toHaveLength(1);
    expect(urlProblems('/For-Consulting')).toHaveLength(1);
    expect(urlProblems('/consulting/')).toHaveLength(1);
    expect(urlProblems('/blog/2026/a-post')).toHaveLength(1);
    expect(urlProblems('/use-cases/due-diligence')).toEqual([]);
  });

  /**
   * "No orphan pages. Every page receives minimum 2 inbound internal links." The plan itself
   * leaves some pages short, and that is a planning defect worth seeing before it is a crawl
   * result — so this asserts the check fires, not that the site is clean.
   */
  it('fails a page the linking plan leaves orphaned', () => {
    const orphan = SITE_PAGES.find((page) => page.linkedFrom.length === 0);
    expect(orphan).toBeDefined();
    const links = checkPage(orphan!).find((check) => check.id === 'inbound_links');
    expect(links?.pass).toBe(false);
    expect(links?.weight).toBe('blocking');
  });

  it('counts a page with two inbound links as linked', () => {
    const linked = SITE_PAGES.find((page) => page.linkedFrom.length >= MIN_INBOUND_LINKS);
    expect(checkPage(linked!).find((check) => check.id === 'inbound_links')?.pass).toBe(true);
  });

  it('gives every failing check an instruction, never only a diagnosis', () => {
    for (const page of SITE_PAGES) {
      for (const check of checkPage(page)) {
        if (check.pass) continue;
        expect(check.fix.length, `${page.path} · ${check.id}`).toBeGreaterThan(20);
      }
    }
  });

  it('calls nothing ready while nothing is live', () => {
    const health = siteHealth(SITE_PAGES);
    expect(health.live).toBe(0);
    expect(health.ready).toBe(0);
    expect(health.indexed).toBe(0);
    // Zero JSON-LD on any page is the standing fact; a few templates declare an intent.
    expect(health.withSchema).toBeLessThan(health.pages);
  });

  it('names the commonest failure, because that one is a template fix', () => {
    expect(siteHealth(SITE_PAGES).commonest?.count).toBeGreaterThan(1);
  });

  it('turns a post into a page without keeping a second list of posts', () => {
    const page = postPage(
      { id: 'x', title: 'Two published estimates, one market', channel: 'blog', status: 'approved' } as never,
      undefined,
    );
    expect(page.path).toBe('/blog/two-published-estimates-one-market');
    expect(page.kind).toBe('blog');
    // No version yet means no brief, which means no target keyword — and the check says so.
    expect(page.primaryKeyword).toBeNull();
  });

  it('slugifies the way a CMS would, so the URL checks read the real thing', () => {
    expect(slugify('How much does market research cost?')).toBe('how-much-does-market-research-cost');
    expect(slugify('  Spaces   and — punctuation!  ')).toBe('spaces-and-punctuation');
  });

  it('never lists paid links as a route', () => {
    const paid = LINK_ROUTES.find((route) => route.id === 'paid-links');
    expect(paid?.forbidden).toBe(true);
    expect(paid?.owner).toBe('nobody');
  });

  it('names what every technical item affects, so a template fix is visible as one', () => {
    expect(TECHNICAL.length).toBeGreaterThan(4);
    for (const item of TECHNICAL) expect(item.fix.length).toBeGreaterThan(20);
  });
});

/**
 * Content SEO — the writing, not the envelope.
 *
 * Every rule is `content-engine-runtime-spec.md` §6.1's Type B contract. There is no
 * keyword-density check and there will not be one, because nobody here ever asked for it —
 * these hold Joy's rules, not generic SEO folklore.
 */
describe('content SEO', () => {
  const good: PostBody = {
    kind: 'blog',
    slug: 'how-much-does-market-research-cost',
    headline: 'How much does market research cost',
    standfirst:
      'Commissioned market research costs $15,000 to $50,000 a study, and a syndicated report sits nearer $4,000. How much you pay is a question of scope rather than quality — and most of it buys desk research you could have had in an afternoon, which is the part nobody quotes separately.',
    paragraphs: [
      'The $153bn figure for the global industry comes from ESOMAR, and it counts fieldwork. Source: ESOMAR, 2025.',
      'Desk research before every study sits outside that figure, because nobody bills for it. According to our own buyer research, four hours is the median.',
      'What a buyer actually needs is the reconciliation, not another number.',
    ],
    cta: 'What does your last study actually cost you, once the desk work is counted?',
    targetQuery: 'how much does market research cost',
  };

  /**
   * ⚠ Depth is deliberately not in this list. A 600-word bar is right for a published search
   * answer and absurd in a fixture, so it gets its own test rather than 600 words of filler
   * that would make every other assertion here harder to read.
   */
  it('passes a post that meets the contract', () => {
    const failing = checkContent(good)
      .filter((check) => !check.pass)
      .filter((check) => !check.label.startsWith('Enough of an answer'));
    expect(failing.map((check) => check.label)).toEqual([]);
  });

  it('fails a post too thin to rank', () => {
    const depth = checkContent(good).find((check) => check.label.startsWith('Enough of an answer'));
    expect(depth?.pass).toBe(false);
    expect(depth?.standing).toMatch(/\d+ words/);
  });

  /** "Search readers do not scroll to find out whether you know." */
  it('fails a post that does not answer in the first two sentences', () => {
    const late = { ...good, standfirst: 'Let us begin with a little history of the industry.', paragraphs: ['Some context.', ...good.paragraphs] };
    const answered = checkContent(late as PostBody).find((check) => check.label.startsWith('Answers the question'));
    expect(answered?.pass).toBe(false);
    expect(answered?.weight).toBe('blocking');
  });

  /** ⛔ "Nobody searches 'analytical AI'." */
  it('fails a post that opens on the category rather than the job', () => {
    const category = { ...good, standfirst: 'Analytical AI is a new category of tool for business research, and it changes how a study is costed.' };
    const job = checkContent(category as PostBody).find((check) => check.label.startsWith('Meets the reader'));
    expect(job?.pass).toBe(false);
    expect(job?.weight).toBe('blocking');
  });

  it('fails a figure with no source in the same paragraph', () => {
    const unsourced = { ...good, paragraphs: ['The global industry is worth $153bn.', ...good.paragraphs.slice(1)] };
    const sourced = checkContent(unsourced as PostBody).find((check) => check.label.startsWith('Every figure'));
    expect(sourced?.pass).toBe(false);
    expect(sourced?.standing).toMatch(/\$153bn/);
  });

  it('does not count a source three paragraphs away as nearby', () => {
    const far = {
      ...good,
      paragraphs: ['A market worth $725m.', 'Unrelated.', 'Source: IMARC, 2025.'],
    };
    expect(checkContent(far as PostBody).find((check) => check.label.startsWith('Every figure'))?.pass).toBe(false);
  });

  it('passes a post with no figures at all', () => {
    const none = { ...good, standfirst: 'Most buyers are paying for desk research they could have had in an afternoon, and it is the part nobody quotes separately in a proposal they are asked to sign off on today.', paragraphs: ['No numbers here.'] };
    expect(checkContent(none as PostBody).find((check) => check.label.startsWith('Every figure'))?.standing).toMatch(
      /No figures/,
    );
  });

  /** §6.1: one CTA, at the end, never mid-body. */
  it('fails a call to action in the middle of the body', () => {
    const interrupted = {
      ...good,
      paragraphs: [good.paragraphs[0]!, 'Sign up to run your own.', good.paragraphs[2]!],
    };
    const cta = checkContent(interrupted as PostBody).find((check) => check.label.startsWith('One CTA'));
    expect(cta?.pass).toBe(false);
    expect(cta?.standing).toMatch(/mid-body/);
  });

  it('holds the answer block to 40–60 words', () => {
    const short = { ...good, standfirst: 'It depends.' };
    expect(checkContent(short as PostBody).find((check) => check.label.includes('answer block'))?.pass).toBe(false);
  });

  it('reads nothing on a post that is not a blog', () => {
    expect(checkContent({ kind: 'x', text: 'hello', link: null, attachment: null } as never)).toEqual([]);
    expect(contentHealth(undefined).checked).toBe(false);
  });

  it('uses the same check shape as the page checks, so a row speaks one vocabulary', () => {
    for (const check of checkContent(good)) {
      expect(check.fix.length).toBeGreaterThan(20);
      expect(['blocking', 'quality']).toContain(check.weight);
    }
  });

  it('reads every blog post in the reference week without throwing', () => {
    const posts = REFERENCE_POSTS.filter((version) => version.body.kind === 'blog');
    expect(posts.length).toBeGreaterThan(0);
    for (const version of posts) {
      const health = contentHealth(version.body);
      expect(health.checked).toBe(true);
      expect(health.total).toBeGreaterThan(0);
    }
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

/**
 * Ads.
 *
 * Paid is a validation instrument, and these hold the two things that make it one: a kill
 * rule that reads only when its sample exists, and a killed angle that stays killed.
 */
describe('ads', () => {
  const metrics = (over: Partial<AdMetrics> = {}): AdMetrics => ({
    impressions: 1000,
    clicks: 40,
    conversions: 2,
    spend: 200,
    ...over,
  });

  it('reads nothing on an ad that has not run', () => {
    expect(readAd(null).verdict).toBe('no_reading');
    expect(readAd(metrics({ impressions: 0, clicks: 0 })).verdict).toBe('no_reading');
  });

  it('will not judge an ad before its sample exists', () => {
    const early = readAd(metrics({ impressions: 80, clicks: 1, conversions: 0, spend: 12 }));
    expect(early.verdict).toBe('no_reading');
    expect(early.act).toMatch(/too early/i);
  });

  it('pauses on CAC over the ceiling', () => {
    const reading = readAd(metrics({ conversions: 1, spend: 400 }));
    expect(reading.verdict).toBe('pause');
    expect(reading.rule).toMatch(/CAC/);
  });

  it('pauses on 100 clicks and no conversions — the page or the targeting, not the ad', () => {
    const reading = readAd(metrics({ clicks: 120, conversions: 0, spend: 240 }));
    expect(reading.verdict).toBe('pause');
    expect(reading.act).toMatch(/landing page or the targeting/i);
  });

  /** "Rewrite the ad, do not raise the bid." */
  it('asks for a rewrite on a low click-through, never a bigger bid', () => {
    const reading = readAd(metrics({ impressions: 5000, clicks: 20, conversions: 1, spend: 90 }));
    expect(reading.verdict).toBe('rewrite');
    expect(reading.act).toMatch(/do not raise the bid/i);
  });

  it('calls a healthy ad working, and says what to do with it', () => {
    const reading = readAd(metrics({ impressions: 2400, clicks: 61, conversions: 2, spend: 214 }));
    expect(reading.verdict).toBe('working');
    expect(reading.act).toMatch(/owned engine/i);
  });

  it('reads CAC before click-through — the rule that fires on an ad that looks healthy', () => {
    // Good CTR, terrible economics. CAC must win.
    expect(readAd(metrics({ impressions: 1000, clicks: 90, conversions: 1, spend: 500 })).rule).toMatch(/CAC/);
  });

  /** ⚑ A killed angle is a finding. It does not come back. */
  it('lets an ad move only the way the lifecycle allows, and never out of killed', () => {
    expect(canMoveAd('draft', 'approved')).toBe(true);
    expect(canMoveAd('draft', 'live')).toBe(false);
    expect(canMoveAd('live', 'paused')).toBe(true);
    expect(canMoveAd('paused', 'killed')).toBe(true);
    expect(canMoveAd('killed', 'live')).toBe(false);
    expect(canMoveAd('killed', 'approved')).toBe(false);
  });

  /**
   * ⚑ Every problem, not just the blocking ones. A quality problem on a shipped ad is copy
   * that gets truncated in front of a buyer with money behind it — the ad set should be
   * clean, and this is what catches it drifting.
   */
  it('holds every reference ad to its placement’s limits and to the brand rules', () => {
    for (const ad of REFERENCE_ADS) {
      expect(checkAdCopy(ad).map((problem) => `${ad.id}: ${problem.field} — ${problem.what}`)).toEqual([]);
    }
  });

  it('catches a headline over the platform ceiling', () => {
    const base = REFERENCE_ADS[0]!;
    const long = { ...base, copy: { ...base.copy, headlines: ['x'.repeat(40)] } };
    expect(checkAdCopy(long).some((problem) => problem.what.includes('over 30'))).toBe(true);
  });

  /** ⛔ Naming them concedes we are in the same category. */
  it('refuses a competitor named in ad copy', () => {
    const base = REFERENCE_ADS[0]!;
    const named = { ...base, copy: { ...base.copy, descriptions: ['A better ChatGPT for research.'] } };
    const problem = checkAdCopy(named).find((row) => row.field === 'Lead copy');
    expect(problem?.weight).toBe('blocking');
  });

  /** ⛔ COPY-11a: the budget is never a subscription price. */
  it('refuses the Research Budget written as a subscription price', () => {
    const base = REFERENCE_ADS[0]!;
    const priced = { ...base, copy: { ...base.copy, descriptions: ['Analyst-grade research from $200/mo.'] } };
    expect(checkAdCopy(priced).some((row) => row.field === 'The figure')).toBe(true);
  });

  it('refuses an exclamation point anywhere', () => {
    const base = REFERENCE_ADS[0]!;
    const shouty = { ...base, copy: { ...base.copy, headlines: ['Arrive certain!'] } };
    expect(checkAdCopy(shouty).some((row) => row.field === 'Tone')).toBe(true);
  });

  it('refuses hashtags on a search ad, where the field does not exist', () => {
    const base = REFERENCE_ADS[0]!;
    const tagged = { ...base, copy: { ...base.copy, hashtags: ['#research'] } };
    const problem = checkAdCopy(tagged).find((row) => row.field === 'Hashtags');
    expect(problem?.weight).toBe('blocking');
  });

  /** §7: never point a use-case ad at the homepage. */
  it('refuses a use-case ad pointed at the homepage, and allows the identity ad there', () => {
    const useCase = REFERENCE_ADS.find((ad) => ad.angle === 'icp_wounds')!;
    const misdirected = { ...useCase, copy: { ...useCase.copy, landingPath: '/' } };
    expect(checkAdCopy(misdirected).some((row) => row.field === 'Landing page')).toBe(true);

    const identity = REFERENCE_ADS.find((ad) => ad.angle === 'identity')!;
    expect(identity.copy.landingPath).toBe('/');
    expect(checkAdCopy(identity).some((row) => row.field === 'Landing page')).toBe(false);
  });

  it('cannot approve an ad with a blocking copy problem', () => {
    const base = REFERENCE_ADS[0]!;
    expect(adApprovable(base)).toBe(true);
    expect(adApprovable({ ...base, copy: { ...base.copy, headlines: ['Arrive certain!'] } })).toBe(false);
    // Only a draft is approvable at all.
    expect(adApprovable({ ...base, state: 'live' })).toBe(false);
  });

  it('draws every social ad from the house card, and no card for a search ad', () => {
    for (const ad of REFERENCE_ADS) {
      const spec = adCreativeSpec(ad);
      if (ad.platform === 'google_search') expect(spec, ad.id).toBeNull();
      else expect(spec?.template, ad.id).toBe('card');
    }
  });

  it('counts angles under test rather than signups', () => {
    const reading = readSpend(REFERENCE_ADS, AD_BUDGET_MONTHLY);
    expect(reading.anglesTotal).toBe(9);
    // Nothing has run, so nothing has been learnt — and the number says so.
    expect(reading.anglesTested).toBe(0);
    expect(reading.spend).toBe(0);
  });

  /**
   * A revision is not a state move. It sends the ad back to be rebuilt from an instruction,
   * from wherever it was — and a live ad being revised is a live ad coming down, because what
   * is running is no longer what anybody approved.
   */
  it('lets any ad but a killed one be sent back to be rebuilt', () => {
    expect(canReviseAd('draft')).toBe(true);
    expect(canReviseAd('approved')).toBe(true);
    expect(canReviseAd('live')).toBe(true);
    expect(canReviseAd('paused')).toBe(true);
    expect(canReviseAd('killed')).toBe(false);
  });

  it('keeps Meta shut, because a custom audience needs 1,000 people first', () => {
    expect(platformRule('meta_feed').open).toBe(false);
    expect(platformRule('google_search').open).toBe(true);
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
