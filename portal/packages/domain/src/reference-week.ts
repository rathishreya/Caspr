/**
 * The reference week — 17–23 August 2026.
 *
 * One copy, used by the database seed script and by the in-memory adapter the console
 * falls back to while the upstream feeds are unbuilt (build spec §0). Two copies of a
 * fixture drift exactly like two copies of a document, so there is one.
 *
 * Design spec §9 is the rule this satisfies: "Every screen is populated with real content
 * — never lorem, never placeholder. […] a screen filled with plausible-looking nonsense
 * cannot be judged for density, line length, or whether the voice survives the interface."
 *
 * Twenty-three items, which is the real weekly volume (design spec §5A.1: "23 items a week
 * at ninety seconds each"). Twenty-two will publish; one is awaiting a decision.
 *
 * Every slot is stored with its offset. Times are the console's zone — see `week.ts`.
 *
 * ⚠ **Corrected against a real calendar.** The Figma frame is captioned `18 – 24 AUG` with
 * Monday on the 18th. **18 August 2026 is a Tuesday**; the Monday of that week is the
 * 17th. The frame's caption is a mock, and a mock is allowed to be wrong about a date — a
 * calendar is not. The week runs 17–23 and every weekday holds the content the frame put
 * on it.
 */

import type { ContentItem } from './content-item';
import type { ReviewDecisionRecord } from './review';

/** The three reviewers, as the runbook names them. Roles, not invented headcount. */
export const REVIEWERS = {
  tl: 'Priya — Marketing TL',
  social: 'Social specialist',
  seo: 'SEO practitioner',
} as const;

export const REFERENCE_WEEK_START = '2026-08-17';

/**
 * A slot within the reference week, as `DAY HH:MM` in the console's zone.
 * The offset is applied once, here, rather than repeated on twenty-three literals.
 */
function slot(date: `2026-08-${string}`, time: string): string {
  return `${date}T${time}:00+05:30`;
}

const CITE = {
  esomar: {
    url: 'https://esomar.org/global-market-research-report',
    publisher: 'ESOMAR',
    publishedOn: '2026-06-11',
    quotedClaim: 'Global market research turnover reached $141.6bn in 2025.',
    resolvedAt: '2026-08-14T04:02:00+05:30',
  },
  census: {
    url: 'https://www.census.gov/programs-surveys/susb.html',
    publisher: 'US Census Bureau — SUSB',
    publishedOn: '2026-04-30',
    quotedClaim: 'Establishment counts by NAICS 5416, management and technical consulting.',
    resolvedAt: '2026-08-15T09:41:00+05:30',
  },
  bls: {
    url: 'https://www.bls.gov/oes/current/oes131161.htm',
    publisher: 'US Bureau of Labor Statistics',
    publishedOn: '2026-05-06',
    quotedClaim: 'Market research analysts: mean hourly wage, May 2025.',
    resolvedAt: '2026-08-13T18:20:00+05:30',
  },
  edgar: {
    url: 'https://www.sec.gov/edgar/search/#/q=%22total+addressable+market%22',
    publisher: 'SEC EDGAR',
    publishedOn: '2026-07-22',
    quotedClaim: 'Segment revenue disclosed in the most recent 10-Q.',
    resolvedAt: '2026-08-16T11:05:00+05:30',
  },
} as const;

/**
 * ⚠ The one item on this week's grid with no decision.
 *
 * It is here on purpose. The Calendar's banner is the strongest promise the product makes
 * — "nothing publishes unreviewed" — and a fixture where everything is already approved
 * would leave that promise untested at every width and in every screenshot.
 */
export const REFERENCE_WEEK: readonly ContentItem[] = [
  // ── TUE 18 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0418-01',
    channel: 'email',
    type: 'derivative',
    title: 'The Record — issue 04',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.tl,
    scheduledFor: slot('2026-08-18', '07:30'),
    citations: [CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0418-02',
    channel: 'linkedin',
    type: 'personal',
    title: 'Joy — four hours of research',
    voiceLane: 'joy',
    narrative: 'N3',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'consulting',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-18', '09:00'),
    citations: [CITE.bls],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'unbillable-desk-research',
  },
  {
    id: 'ci-0418-03',
    channel: 'blog',
    type: 'search_answer',
    title: 'What a category review asks for',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'category_managers',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.seo,
    scheduledFor: slot('2026-08-18', '11:00'),
    citations: [CITE.census, CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0418-04',
    channel: 'x',
    type: 'derivative',
    title: 'Three sources, one decision',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-18', '14:00'),
    citations: [CITE.edgar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'triangulation-method',
  },
  {
    id: 'ci-0418-05',
    channel: 'linkedin_page',
    type: 'derivative',
    title: 'Company — the $600m gap, charted',
    voiceLane: null,
    narrative: 'N6',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'strategy',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-18', '16:00'),
    citations: [CITE.edgar, CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'tam-gap-teardown',
  },

  // ── WED 19 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0419-01',
    channel: 'blog',
    type: 'search_answer',
    title: 'Market sizing: where the two numbers come from',
    voiceLane: null,
    narrative: 'N6',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.seo,
    scheduledFor: slot('2026-08-19', '08:00'),
    citations: [CITE.census, CITE.edgar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'tam-gap-teardown',
  },
  {
    id: 'ci-0419-02',
    channel: 'linkedin',
    type: 'personal',
    title: 'Jayant — native vs translated',
    voiceLane: 'jayant',
    narrative: 'N2',
    pillar: 'analytical_ai',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-19', '09:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'native-vs-translated-retrieval',
  },
  {
    id: 'ci-0419-03',
    channel: 'x',
    type: 'derivative',
    title: 'The atom — one chart, source-stamped',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-19', '11:00'),
    citations: [CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0419-04',
    channel: 'community',
    type: 'outreach',
    title: 'r/consulting reply',
    voiceLane: 'joy',
    narrative: 'N3',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'consulting',
    status: 'approved',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-19', '16:00'),
    citations: [CITE.bls],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'unbillable-desk-research',
  },
  {
    id: 'ci-0419-05',
    channel: 'linkedin',
    type: 'personal',
    title: 'Keshav — what a freshness job actually does',
    voiceLane: 'keshav',
    narrative: 'N8',
    pillar: 'analytical_ai',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-19', '18:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'corpus-freshness',
  },

  // ── THU 20 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0420-01',
    channel: 'blog',
    type: 'analysis',
    title: 'The unbillable two days',
    voiceLane: null,
    narrative: 'N3',
    pillar: 'fraction_of_cost',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.tl,
    scheduledFor: slot('2026-08-20', '08:00'),
    citations: [CITE.bls, CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'unbillable-desk-research',
  },
  {
    id: 'ci-0420-02',
    channel: 'linkedin_page',
    type: 'derivative',
    title: 'Company — what a category review asks for',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'category_managers',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-20', '10:00'),
    citations: [CITE.census],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0420-03',
    channel: 'linkedin',
    type: 'personal',
    title: 'Dixit — evaluating retrieval',
    voiceLane: 'dixit',
    narrative: 'N2',
    pillar: 'analytical_ai',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-20', '12:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'retrieval-evaluation',
  },
  {
    id: 'ci-0420-04',
    channel: 'x',
    type: 'derivative',
    title: 'Subcategory gap thread',
    voiceLane: null,
    narrative: 'N6',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'category_managers',
    // ⚠ The one undecided item. See the note above the array.
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-20', '15:00'),
    citations: [CITE.census],
    sourceable: 'thin',
    hygieneAppliedAt: null,
    topicId: 'subcategory-gap',
  },
  {
    id: 'ci-0420-05',
    channel: 'community',
    type: 'outreach',
    title: 'WallStreetOasis — diligence thread',
    voiceLane: 'joy',
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'investors',
    status: 'approved',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-20', '17:00'),
    citations: [CITE.edgar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'diligence-desk-work',
  },

  // ── FRI 21 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0421-01',
    channel: 'blog',
    type: 'search_answer',
    title: 'What a strategic acquirer reads that a financial one does not',
    voiceLane: null,
    narrative: 'N6',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'strategy',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.seo,
    scheduledFor: slot('2026-08-21', '08:30'),
    citations: [CITE.edgar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'acquirer-lenses',
  },
  {
    id: 'ci-0421-02',
    channel: 'linkedin',
    type: 'personal',
    title: 'Amit — what shipped this week',
    voiceLane: 'amit',
    narrative: 'N8',
    pillar: 'analytical_ai',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-21', '10:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'ship-notes-w34',
  },
  {
    id: 'ci-0421-03',
    channel: 'outreach',
    type: 'outreach',
    title: 'Quirks.com pitch',
    voiceLane: 'joy',
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'approved',
    assignedReviewer: REVIEWERS.tl,
    scheduledFor: slot('2026-08-21', '13:00'),
    citations: [CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'earned-media-quirks',
  },
  {
    id: 'ci-0421-04',
    channel: 'x',
    type: 'derivative',
    title: 'Three sources, one decision — the thread',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-21', '15:00'),
    citations: [CITE.edgar, CITE.census],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'triangulation-method',
  },

  // ── SAT 22 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0422-01',
    channel: 'x',
    type: 'derivative',
    title: 'Weekend read — category study',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'category_managers',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-22', '11:00'),
    citations: [CITE.census],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'category-review-2026-08',
  },

  // ── SUN 23 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0423-01',
    channel: 'email',
    type: 'derivative',
    title: 'Weekly digest — the category study',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'scheduled',
    assignedReviewer: REVIEWERS.tl,
    scheduledFor: slot('2026-08-23', '09:00'),
    citations: [CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0423-02',
    channel: 'outreach',
    type: 'outreach',
    title: 'GreenBook — contributor pitch',
    voiceLane: 'joy',
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'approved',
    assignedReviewer: REVIEWERS.tl,
    scheduledFor: slot('2026-08-23', '12:00'),
    citations: [CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'earned-media-greenbook',
  },
  {
    id: 'ci-0423-03',
    channel: 'linkedin',
    type: 'personal',
    title: 'Kartikey — reading long documents',
    voiceLane: 'kartikey',
    narrative: 'N5',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'scheduled',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-23', '18:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: slot('2026-08-17', '20:04'),
    topicId: 'long-document-reading',
  },
];

/**
 * The week's review decisions.
 *
 * Twenty-five decisions over twenty-three items: three were rejected with a reason and
 * came back regenerated, which is what §3.4 means by "a rejection with a reason
 * regenerates the item immediately with the correction applied, and the new version
 * returns to the queue". Two of those regenerations were then approved; one item is still
 * awaiting its first decision.
 *
 * `secondsSpent` is real-shaped rather than uniform. Build spec §4: it "is not
 * surveillance — it is how the generator sizes next week's volume to the real review
 * budget", and design spec §5A.3 makes it the only honest input to a minutes estimate.
 */
export const REFERENCE_DECISIONS: readonly ReviewDecisionRecord[] = [
  { itemId: 'ci-0418-01', reviewer: REVIEWERS.tl, action: 'approve', reasonCode: null, secondsSpent: 74 },
  { itemId: 'ci-0418-02', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 61 },
  { itemId: 'ci-0418-03', reviewer: REVIEWERS.seo, action: 'reject', reasonCode: 'STALE_NUMBER', secondsSpent: 132 },
  { itemId: 'ci-0418-03', reviewer: REVIEWERS.seo, action: 'approve', reasonCode: null, secondsSpent: 58 },
  { itemId: 'ci-0418-04', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 44 },
  { itemId: 'ci-0418-05', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 96 },
  { itemId: 'ci-0419-01', reviewer: REVIEWERS.seo, action: 'approve', reasonCode: null, secondsSpent: 118 },
  { itemId: 'ci-0419-02', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 70 },
  { itemId: 'ci-0419-03', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 39 },
  { itemId: 'ci-0419-04', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 105 },
  { itemId: 'ci-0419-05', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 67 },
  { itemId: 'ci-0420-01', reviewer: REVIEWERS.tl, action: 'reject', reasonCode: 'WEAK', secondsSpent: 149 },
  { itemId: 'ci-0420-01', reviewer: REVIEWERS.tl, action: 'approve', reasonCode: null, secondsSpent: 88 },
  { itemId: 'ci-0420-02', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 52 },
  { itemId: 'ci-0420-03', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 73 },
  { itemId: 'ci-0420-05', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 91 },
  { itemId: 'ci-0421-01', reviewer: REVIEWERS.seo, action: 'approve', reasonCode: null, secondsSpent: 121 },
  { itemId: 'ci-0421-02', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 46 },
  { itemId: 'ci-0421-03', reviewer: REVIEWERS.tl, action: 'approve', reasonCode: null, secondsSpent: 83 },
  { itemId: 'ci-0421-04', reviewer: REVIEWERS.social, action: 'reject', reasonCode: 'DUPLICATE', secondsSpent: 64 },
  { itemId: 'ci-0421-04', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 37 },
  { itemId: 'ci-0422-01', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 55 },
  { itemId: 'ci-0423-01', reviewer: REVIEWERS.tl, action: 'approve', reasonCode: null, secondsSpent: 69 },
  { itemId: 'ci-0423-02', reviewer: REVIEWERS.tl, action: 'approve', reasonCode: null, secondsSpent: 77 },
  { itemId: 'ci-0423-03', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 60 },
];

/**
 * N4 spent in the three weeks before the reference week.
 *
 * The journey narrative is capped at one per four weeks, which cannot be judged from a
 * single week — `narrativeMix` takes this so the cap is evaluated over its real window
 * rather than silently under-reported.
 */
export const PRIOR_WINDOW_COUNTS: ReadonlyMap<string, number> = new Map([['N4', 1]]);
