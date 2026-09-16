/**
 * `p` — the presence metric.
 *
 * `activation-framework.md` §1 makes it one of two top-level KPIs, and
 * [`presence-metric.md`](../../../../docs/gtm/presence-metric.md) defines it:
 *
 * > **One basket per ICP. Each month, ask every question in it. `p` for that ICP is the
 * > share where Caspr appears in the answer.**
 *
 * `x` measures whether the machine pays for itself. `p` measures whether we exist at the
 * moment the buyer looks — *"one is lagging and commercial; the other is leading and cannot
 * be bought."*
 *
 * **The construction rules are in this file because they are what keep the number honest.**
 * §2 is explicit that a metric like this "degrades into a vanity number unless the
 * construction rules are fixed before anyone starts optimising against it", so they are
 * encoded rather than documented: a branded question cannot enter a basket, the basket
 * cannot be edited in-flight, and there is no function that returns a single `p`.
 */

/** The four surfaces, each recorded separately. §3: "No weighting between surfaces." */
export const PRESENCE_SURFACES = ['chatgpt', 'perplexity', 'ai_overview', 'google_page_one'] as const;
export type PresenceSurface = (typeof PRESENCE_SURFACES)[number];

export const SURFACE_LABEL: Readonly<Record<PresenceSurface, string>> = {
  chatgpt: 'ChatGPT',
  perplexity: 'Perplexity',
  ai_overview: 'Google AI Overview',
  google_page_one: 'Google page one',
};

/**
 * How cleanly each surface can be read without a person opening a tab — §6.1.
 *
 * This is why the reading is bought rather than built (§6.2): two of the four have no clean
 * programmatic door, and *"we are not in the AI-visibility-monitoring business."*
 */
export const SURFACE_ACCESS: Readonly<Record<PresenceSurface, { readonly grade: 'good' | 'workable' | 'poor'; readonly why: string }>> = {
  perplexity: { grade: 'good', why: 'A real API that returns citations.' },
  google_page_one: { grade: 'workable', why: 'Fetch and parse, fighting anti-bot.' },
  ai_overview: { grade: 'poor', why: 'Not reliably present in a normal SERP fetch.' },
  chatgpt: { grade: 'poor', why: 'The consumer product’s web-search behaviour is not what the API returns.' },
};

/**
 * The three ways to appear — §3, *"weighted equally, because they mean the same thing to the
 * buyer: Caspr was there when I looked."*
 */
export const APPEARANCE_KINDS = ['cited', 'third_party', 'own_page'] as const;
export type AppearanceKind = (typeof APPEARANCE_KINDS)[number];

export const APPEARANCE_LABEL: Readonly<Record<AppearanceKind, string>> = {
  cited: 'Cited in an AI answer',
  third_party: 'Listed on a third-party page that ranks page one',
  own_page: 'Our own page ranks page one',
};

export const APPEARANCE_NOTE: Readonly<Record<AppearanceKind, string>> = {
  cited: 'Named, with or without a link. A mention without a link still counts — the buyer saw the name.',
  third_party: 'A roundup, a directory, a comparison. This is where 6.5× of citations come from.',
  own_page: 'Page two does not count. Nobody looks.',
};

/** The ICPs with a basket. §4.2 decides which are written now and which wait. */
export const PRESENCE_ICPS = ['investors', 'consultants', 'agencies', 'strategy'] as const;
export type PresenceIcp = (typeof PRESENCE_ICPS)[number];

export interface BasketStatus {
  readonly icp: PresenceIcp;
  readonly label: string;
  /** Written now, or held until that ICP opens. §4.2. */
  readonly writeNow: boolean;
  readonly when: string;
}

/**
 * §4.2, and the reason it is not "write them all now" is rule 2.2: a basket is frozen for a
 * year, so *"writing questions for an ICP we are not serving would freeze them against a
 * strategy that may well change before we get there."*
 */
export const BASKET_STATUS: readonly BasketStatus[] = [
  { icp: 'investors', label: 'Investors', writeNow: true, when: 'Launch ICP — write now' },
  { icp: 'consultants', label: 'Consultants', writeNow: true, when: 'Launch ICP — write now' },
  { icp: 'agencies', label: 'Agencies', writeNow: false, when: 'Write when it opens, week 6. Not before' },
  { icp: 'strategy', label: 'Strategy', writeNow: false, when: 'Write when it opens, week 8' },
];

export interface BasketQuestion {
  readonly id: string;
  readonly text: string;
  /**
   * Where the question came from — a persona line, a live observation, or `null` for one
   * §2.5 marks as constructed. *"This exists because the last keyword list was 45 terms I
   * made up, and measuring an invented list taught us nothing except that I invent badly."*
   */
  readonly source: string | null;
  /** §4's grouping within the basket, for reading rather than for the maths. */
  readonly group: string;
  /** True for the specific data questions §4's cap limits to 5 of any 35. */
  readonly sectorShape?: true;
}

/**
 * CORE · 15 — asked in near-identical words by every ICP.
 *
 * *"These are category questions, not buyer questions. They are what make `p` comparable
 * across ICPs."* Counted once and read into both launch ICPs, which is why 2 × 50 is 340
 * checks a month rather than 400 (§6).
 */
export const CORE_BASKET: readonly BasketQuestion[] = [
  { id: 'C1', text: 'best AI tool for market research', source: null, group: 'Tool and category selection' },
  { id: 'C2', text: 'best AI deep research tool', source: null, group: 'Tool and category selection' },
  { id: 'C3', text: 'which AI actually cites its sources for business research', source: null, group: 'Tool and category selection' },
  { id: 'C4', text: 'is there an AI that does proper market analysis, not just summaries', source: null, group: 'Tool and category selection' },
  { id: 'C5', text: 'AI market research tools compared', source: null, group: 'Tool and category selection' },
  { id: 'C6', text: 'alternatives to IBISWorld', source: null, group: 'Tool and category selection' },
  { id: 'C7', text: 'can I use AI research in work I hand to a client', source: 'icp-personas.md :95', group: 'Permission and compliance' },
  { id: 'C8', text: 'can I cite AI-generated research in a formal memo', source: 'icp-personas.md :276', group: 'Permission and compliance' },
  { id: 'C9', text: 'is AI-generated market research reliable enough for a board', source: null, group: 'Permission and compliance' },
  { id: 'C10', text: 'what does compliance need in order to approve a research tool', source: 'icp-personas.md :276', group: 'Permission and compliance' },
  { id: 'C11', text: 'will my firm allow a third-party AI research tool', source: 'icp-personas.md :94', group: 'Permission and compliance' },
  { id: 'C12', text: 'how much does market research cost', source: null, group: 'Cost and substitution' },
  { id: 'C13', text: 'cost of a single industry report', source: null, group: 'Cost and substitution' },
  { id: 'C14', text: 'is an IBISWorld subscription worth it', source: null, group: 'Cost and substitution' },
  { id: 'C15', text: 'cheaper ways to get industry reports', source: null, group: 'Cost and substitution' },
];

/**
 * INVESTORS · job basket.
 *
 * ⚠ **Fifteen of thirty-five.** `presence-metric.md` §4 writes fifteen and says the
 * remaining twenty "extend these shapes across the sectors the fund actually screens —
 * written once, with the sector list, at basket freeze". The twenty are **not invented
 * here**: a basket frozen for a year must be frozen against questions somebody chose, and
 * `BASKET_TARGET` is what the console reads to say how far from complete it is.
 */
export const INVESTORS_BASKET: readonly BasketQuestion[] = [
  { id: 'I1', text: 'SaaS revenue multiples by sector', source: 'observed live: 8.5x NTM vs 3.3x TTM, unreconciled', group: 'Deal work' },
  { id: 'I2', text: 'where do I get defensible market size data for due diligence', source: null, group: 'Deal work' },
  { id: 'I3', text: 'how do I size a market for an IC memo', source: 'icp-personas.md :255', group: 'Deal work' },
  { id: 'I4', text: 'how to do commercial due diligence on a sector quickly', source: null, group: 'Deal work' },
  { id: 'I5', text: 'comparable company multiples for a private software business', source: null, group: 'Deal work' },
  { id: 'I6', text: 'how do I check whether a market size number is credible', source: 'icp-personas.md :74', group: 'Trust in the number' },
  { id: 'I7', text: 'reliable source for industry growth rates', source: null, group: 'Trust in the number' },
  { id: 'I8', text: 'sector primer for a deal I am screening', source: null, group: 'Deal work' },
  { id: 'I9', text: 'TAM for a B2B software company', source: null, group: 'Deal work' },
  { id: 'I10', text: 'market entry analysis for an investment thesis', source: null, group: 'Deal work' },
  { id: 'I11', text: 'how do smaller funds get the research data the large ones have', source: 'icp-personas.md :261', group: 'Substitution' },
  { id: 'I12', text: 'AI research tool for investment analysis', source: null, group: 'Substitution' },
  { id: 'I13', text: 'EV charging market size', source: 'representative of the long-tail family', group: 'Sector shapes', sectorShape: true },
  { id: 'I14', text: 'industrial valves market Saudi Arabia', source: 'representative of the long-tail family', group: 'Sector shapes', sectorShape: true },
  { id: 'I15', text: 'copper production by country', source: 'representative of the long-tail family', group: 'Sector shapes', sectorShape: true },
];

/** CONSULTANTS · job basket. Fifteen of thirty-five, on the same footing as the investors'. */
export const CONSULTANTS_BASKET: readonly BasketQuestion[] = [
  { id: 'K1', text: 'how to get up to speed on an industry in two days', source: 'icp-personas.md :347', group: 'Speed to competence' },
  { id: 'K2', text: 'competitive landscape analysis for an unfamiliar sector', source: null, group: 'Speed to competence' },
  { id: 'K3', text: 'industry primer for a client pitch', source: null, group: 'Client work' },
  { id: 'K4', text: 'where to find market data I can cite in a client deck', source: 'icp-personas.md :74', group: 'Client work' },
  { id: 'K5', text: 'how to research a sector I have never covered', source: 'icp-personas.md :64', group: 'Speed to competence' },
  { id: 'K6', text: 'credible market data sources for consulting work', source: null, group: 'Client work' },
  { id: 'K7', text: 'what market data can I put in a client deliverable', source: null, group: 'Client work' },
  { id: 'K8', text: 'how to build a competitive landscape quickly', source: null, group: 'Speed to competence' },
  { id: 'K9', text: 'sources for market sizing in a strategy project', source: null, group: 'Client work' },
  { id: 'K10', text: 'how do I avoid spending four hours for three usable numbers', source: 'icp-personas.md :57', group: 'Substitution' },
  { id: 'K11', text: 'industry analysis with citations I can defend', source: null, group: 'Client work' },
  { id: 'K12', text: 'tools for desk research in consulting', source: null, group: 'Substitution' },
  { id: 'K13', text: 'what do consultants use instead of buying industry reports', source: null, group: 'Substitution' },
  { id: 'K14', text: 'UK ready meals market size', source: 'icp-personas.md :536', group: 'Sector shapes', sectorShape: true },
  { id: 'K15', text: 'desk research for a sector with no syndicated coverage', source: 'icp-personas.md :536', group: 'Sector shapes', sectorShape: true },
];

/** §4: a 15-question core plus a 35-question job basket. `p` is read across all 50. */
export const CORE_SIZE = 15;
export const JOB_BASKET_TARGET = 35;
export const BASKET_TARGET = CORE_SIZE + JOB_BASKET_TARGET;
/** §4: no more than 5 of any 35-question job basket may be a specific data question. */
export const SECTOR_SHAPE_CAP = 5;

export function jobBasket(icp: PresenceIcp): readonly BasketQuestion[] {
  if (icp === 'investors') return INVESTORS_BASKET;
  if (icp === 'consultants') return CONSULTANTS_BASKET;
  // Agencies and Strategy are deliberately unwritten until those ICPs open — §4.2.
  return [];
}

/** The full basket a reading asks: the shared core plus that ICP's job questions. */
export function basketFor(icp: PresenceIcp): readonly BasketQuestion[] {
  return [...CORE_BASKET, ...jobBasket(icp)];
}

/**
 * Rule 2.1 — **no question in a basket may contain "Caspr"**, and decision 30 —
 * **"Casper" never counts**, it is logged as a near-miss.
 *
 * Both are the same defence from opposite ends: a branded question measures whether people
 * who already know us can find us, which is not the problem; and a misspelling counted as a
 * hit would inflate the one number nobody is allowed to edit.
 */
const BRAND = /\bcas+p+e?r\b/i;

export function isBranded(question: string): boolean {
  return BRAND.test(question);
}

export function isNearMiss(mentionedName: string): boolean {
  return /\bcasper\b/i.test(mentionedName);
}

/** One surface, one question, one month. */
export interface SurfaceReading {
  readonly questionId: string;
  readonly surface: PresenceSurface;
  /**
   * Whether Caspr appeared, and how. Empty means it did not.
   *
   * **Decision 28: no AI Overview counts as a miss on that surface** — not as "no data". The
   * buyer who saw no Overview saw no Caspr, and a metric that excuses itself when the
   * surface is quiet is measuring its own convenience.
   */
  readonly appeared: readonly AppearanceKind[];
  /** Decision 29: three samples on ChatGPT and Perplexity, a hit on two of three. */
  readonly samples?: readonly boolean[];
  /** Decision 30: "Casper" seen instead. Recorded, never counted. */
  readonly nearMiss?: boolean;
}

/**
 * Decision 29 — **three samples on ChatGPT and Perplexity, a hit on two of three.**
 *
 * Generative surfaces do not return the same answer twice, so a single sample measures the
 * roll of the dice rather than our presence. Google's two surfaces are deterministic enough
 * to read once.
 */
export const SAMPLED_SURFACES: readonly PresenceSurface[] = ['chatgpt', 'perplexity'];
export const SAMPLES_REQUIRED = 3;
export const SAMPLES_TO_COUNT = 2;

export function countsAsHit(reading: SurfaceReading): boolean {
  if (SAMPLED_SURFACES.includes(reading.surface)) {
    const samples = reading.samples ?? [];
    if (samples.length === 0) return false;
    return samples.filter(Boolean).length >= SAMPLES_TO_COUNT;
  }
  return reading.appeared.length > 0;
}

export interface PresenceReading {
  readonly icp: PresenceIcp;
  /** Questions asked, which is the basket as it stands rather than its target size. */
  readonly asked: number;
  readonly hits: number;
  /** `p` for this ICP: the share of its basket where Caspr appeared. */
  readonly p: number;
  readonly bySurface: ReadonlyArray<{ readonly surface: PresenceSurface; readonly hits: number; readonly asked: number }>;
  readonly nearMisses: number;
  /**
   * How much of the frozen basket exists. A reading over 30 of 50 questions is a real
   * reading of an incomplete basket, and saying so is the difference between a baseline and
   * a number somebody later argues with.
   */
  readonly basketComplete: boolean;
}

/**
 * One ICP's reading.
 *
 * ⛔ **There is no `presence()` that returns a single number across ICPs, and there never
 * will be** — §4.1. Averaging would import a weighting we cannot justify, and *"visible to
 * investors and invisible to consultants is not 'half visible' — it is a specific state with
 * a specific fix. An average is the one number that hides which."*
 *
 * Report the vector: `p_investors`, `p_consultants`.
 */
export function readPresence(icp: PresenceIcp, readings: readonly SurfaceReading[]): PresenceReading {
  const basket = basketFor(icp);
  const ids = new Set(basket.map((question) => question.id));
  const mine = readings.filter((reading) => ids.has(reading.questionId));

  // A question counts as a hit if Caspr appeared on any surface — §3's three ways are
  // weighted equally, and so are the four surfaces.
  const hitIds = new Set(mine.filter(countsAsHit).map((reading) => reading.questionId));

  return {
    icp,
    asked: basket.length,
    hits: hitIds.size,
    p: basket.length === 0 ? 0 : hitIds.size / basket.length,
    bySurface: PRESENCE_SURFACES.map((surface) => {
      const onSurface = mine.filter((reading) => reading.surface === surface);
      return { surface, hits: onSurface.filter(countsAsHit).length, asked: onSurface.length };
    }),
    nearMisses: mine.filter((reading) => reading.nearMiss === true).length,
    basketComplete: basket.length >= BASKET_TARGET,
  };
}

/**
 * §5.2 — **no threshold yet, deliberately.** The gate in §1 is "none until three readings
 * exist", so the console must not colour a first reading as good or bad.
 */
export const READINGS_BEFORE_A_THRESHOLD = 3;

export function presenceVerdict(readingsSoFar: number): string {
  if (readingsSoFar === 0) return 'No reading yet. Reading zero is the baseline and comes before Day 1.';
  if (readingsSoFar < READINGS_BEFORE_A_THRESHOLD) {
    return `${readingsSoFar} of ${READINGS_BEFORE_A_THRESHOLD} readings. No threshold until three exist — a trend needs three points, and a target set on one would be a guess defended later.`;
  }
  return 'Three readings exist. Read against x: p rising with x flat is a conversion problem, not a reach problem.';
}

/** §6: two ICPs × 50 questions × 4 surfaces, less the core counted once. */
export function checksPerMonth(icps: readonly PresenceIcp[]): number {
  const job = icps.reduce((sum, icp) => sum + jobBasket(icp).length, 0);
  return (CORE_BASKET.length + job) * PRESENCE_SURFACES.length;
}
