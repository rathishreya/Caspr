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
 * Twenty-three weekly items, which is the real weekly volume (design spec §5A.1: "23 items a
 * week at ninety seconds each"), plus two from the daily track, which has no slot and so
 * never reaches the Calendar.
 *
 * **The state is Monday afternoon, before the 18:00 deadline** (runbook §1). Seventeen
 * weekly items are decided; six Content & Social posts still wait for a reviewer, and the
 * two daily posts generated at 08:15 wait beside them. That is the
 * moment a review surface exists for — a fixture where everything is already approved
 * would leave the approval flow with nothing to show and the Calendar's banner with
 * nothing to promise.
 *
 * Approve five of the six and the Calendar reads `22 SCHEDULED · 1 HOLDING`, which is the
 * state the Figma frame was drawn in.
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

/** The weekly queue opens Thursday 06:00 for the following week — runbook §1. */
const QUEUE_OPENED = slot('2026-08-13', '06:00');

/** Hygiene runs after approval (build spec §3.6a), so only a decided item carries this. */
const HYGIENE_DONE = slot('2026-08-17', '20:04');

/**
 * Citations — and only where a post leans on a published figure.
 *
 * Corrected 2026-09-15. An earlier version of this file quoted ESOMAR at **$141.6bn**. The
 * repository's own source gives **$153bn** (`icp-personas.md :511`, ESOMAR 2025), and
 * three further citations carried illustrative Census, BLS and EDGAR claims that no post
 * actually made. A citation attached to a sentence that does not rest on it is the
 * populated-but-dead citation `L22` exists to catch, so they are gone.
 *
 * Posts built on buyer research rather than a published figure carry no citation here;
 * their basis is recorded against the post version as `file :line` — `reference-posts.ts`.
 */
const CITE = {
  readyMeals: {
    url: 'https://caspr.ai/samples',
    publisher: 'Caspr — UK Ready Meals Market: Sizing and Analysis',
    publishedOn: '2026-08-11',
    quotedClaim:
      'On the same definition and base year, published estimates run from $5.86bn at 4.95% CAGR to $6.46bn at 12.4%.',
    resolvedAt: '2026-08-14T04:02:00+05:30',
  },
  esomar: {
    url: 'https://esomar.org',
    publisher: 'ESOMAR',
    publishedOn: '2025',
    quotedClaim: 'The global market research industry is a $153bn sector.',
    resolvedAt: '2026-08-14T04:02:00+05:30',
  },
} as const;

export const REFERENCE_WEEK: readonly ContentItem[] = [
  // ── TUE 18 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0418-01',
    channel: 'email',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0418-02',
    channel: 'linkedin',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    type: 'personal',
    title: 'Joy — four hours of research',
    voiceLane: 'joy',
    narrative: 'N3',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'consulting',
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-18', '09:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'unbillable-desk-research',
  },
  {
    id: 'ci-0418-03',
    channel: 'blog',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0418-04',
    channel: 'x',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [CITE.readyMeals],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'triangulation-method',
  },
  {
    id: 'ci-0418-05',
    channel: 'linkedin_page',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    type: 'derivative',
    title: 'Company — the $600m gap, charted',
    voiceLane: null,
    narrative: 'N6',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'strategy',
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-18', '16:00'),
    citations: [CITE.readyMeals],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'tam-gap-teardown',
  },

  // ── WED 19 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0419-01',
    channel: 'blog',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [CITE.readyMeals],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'tam-gap-teardown',
  },
  {
    id: 'ci-0419-02',
    channel: 'linkedin',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'native-vs-translated-retrieval',
  },
  {
    id: 'ci-0419-03',
    // Was an X post on the copper split. Moved to the Meta shell 2026-09-15 so the surface has
    // its item without changing the 23-item week the Figma frame counts. Framework §9.4: the
    // shell auto-posts the cards and cutdowns already being made, and nothing is written for it.
    channel: 'meta',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'definitional-gaps',
  },
  {
    id: 'ci-0419-04',
    channel: 'reddit',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    type: 'outreach',
    title: 'r/consulting reply',
    voiceLane: 'joy',
    narrative: 'N3',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'consulting',
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-19', '16:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'unbillable-desk-research',
  },
  {
    id: 'ci-0419-05',
    channel: 'linkedin',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'corpus-freshness',
  },

  // ── THU 20 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0420-01',
    channel: 'blog',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    // A search answer, not a published analysis: its basis is buyer research, and the hard
    // gate reserves Type A for "a finding traceable to a real Caspr analysis".
    type: 'search_answer',
    title: 'The unbillable two days',
    voiceLane: null,
    narrative: 'N3',
    pillar: 'fraction_of_cost',
    funnelStage: 'consideration',
    icp: 'market_research',
    status: 'in_review',
    assignedReviewer: REVIEWERS.tl,
    scheduledFor: slot('2026-08-20', '08:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'unbillable-desk-research',
  },
  {
    id: 'ci-0420-02',
    channel: 'linkedin_page',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0420-03',
    channel: 'linkedin',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'retrieval-evaluation',
  },
  {
    id: 'ci-0420-04',
    channel: 'x',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    type: 'derivative',
    title: 'Subcategory gap thread',
    voiceLane: null,
    narrative: 'N6',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: 'category_managers',
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-20', '15:00'),
    citations: [],
    // Thin: subcategory-level figures are exactly what the thread says is missing.
    sourceable: 'thin',
    hygieneAppliedAt: null,
    topicId: 'subcategory-gap',
  },
  {
    id: 'ci-0420-05',
    channel: 'community',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'diligence-desk-work',
  },

  // ── FRI 21 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0421-01',
    channel: 'blog',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'acquirer-lenses',
  },
  {
    id: 'ci-0421-02',
    channel: 'linkedin',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    type: 'personal',
    title: 'Amit — what shipped this week',
    voiceLane: 'amit',
    narrative: 'N8',
    pillar: 'analytical_ai',
    funnelStage: 'awareness',
    icp: null,
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-21', '10:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'ship-notes-w34',
  },
  {
    id: 'ci-0421-03',
    channel: 'outreach',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'earned-media-quirks',
  },
  {
    id: 'ci-0421-04',
    channel: 'x',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'triangulation-method',
  },

  // ── SAT 22 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0422-01',
    // ㉛: "Quora ⭐ — the one that compounds. A good answer earns for years." A short answer
    // that links to the category-review search answer published on Tuesday.
    channel: 'quora',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
    type: 'outreach',
    title: 'Quora — what goes into a category review',
    voiceLane: 'joy',
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'consideration',
    icp: 'category_managers',
    status: 'approved',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: slot('2026-08-22', '11:00'),
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'category-review-2026-08',
  },

  // ── SUN 23 ────────────────────────────────────────────────────────────────
  {
    id: 'ci-0423-01',
    channel: 'email',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'category-review-2026-08',
  },
  {
    id: 'ci-0423-02',
    channel: 'outreach',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'earned-media-greenbook',
  },
  {
    id: 'ci-0423-03',
    channel: 'linkedin',
    track: 'weekly',
    generatedAt: QUEUE_OPENED,
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
    hygieneAppliedAt: HYGIENE_DONE,
    topicId: 'long-document-reading',
  },

  // ── ⏱ THE DAILY TRACK — generated this morning, no slot ──────────────────
  //
  // runtime-spec §5A: Type D only, one X post and one LinkedIn post at most, no calendar
  // slot ("publishes to the next open window"), a badge rather than a notification, and —
  // since 2026-09-15 — a 24-hour window after which an unapproved post is discarded
  // (`daily.ts`). Generated 08:15 Monday; by 14:00 each has 18 hours left.
  {
    id: 'ci-0417-d1',
    channel: 'x',
    track: 'daily',
    generatedAt: slot('2026-08-17', '08:15'),
    type: 'derivative',
    title: 'Today — $153bn, and the work outside it',
    voiceLane: null,
    narrative: 'N3',
    pillar: 'fraction_of_cost',
    funnelStage: 'awareness',
    icp: null,
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: null,
    citations: [CITE.esomar],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'industry-size-unbilled',
  },
  {
    id: 'ci-0417-d2',
    channel: 'linkedin_page',
    track: 'daily',
    generatedAt: slot('2026-08-17', '08:15'),
    type: 'derivative',
    title: 'Today — a citation that does not open',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: null,
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'dead-citations',
  },
];

/**
 * Daily posts from the weekend whose 24-hour window closed without an approval.
 *
 * Not part of the week — they were generated before it began — and not deleted either: the
 * history is what shows whether the window is too short or the reviewers too few, which is
 * the question the 24-hour rule has to answer for itself.
 *
 * The two arrive at `discarded` differently, and both routes are real. Saturday's was
 * written `discarded` by the engine's sweep. Sunday's is still `in_review` in storage, as a
 * post would be if the sweep had not yet run, and every read discards it anyway
 * (`sweepDaily`).
 */
export const REFERENCE_DAILY_HISTORY: readonly ContentItem[] = [
  {
    id: 'ci-0416-d1',
    channel: 'linkedin_page',
    track: 'daily',
    generatedAt: slot('2026-08-16', '08:15'),
    type: 'derivative',
    title: 'Today — copper, counted at two different stages',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'in_review',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: null,
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'definitional-gaps',
  },
  {
    id: 'ci-0415-d1',
    channel: 'x',
    track: 'daily',
    generatedAt: slot('2026-08-15', '08:15'),
    type: 'derivative',
    title: 'Today — 8.5x or 3.3x',
    voiceLane: null,
    narrative: 'N1',
    pillar: 'analyst_not_assistant',
    funnelStage: 'awareness',
    icp: null,
    status: 'discarded',
    assignedReviewer: REVIEWERS.social,
    scheduledFor: null,
    citations: [],
    sourceable: 'found',
    hygieneAppliedAt: null,
    topicId: 'definitional-gaps',
  },
];

/**
 * The decisions already taken this week.
 *
 * Twenty decisions over seventeen decided items: three were rejected with a reason and
 * came back regenerated, which is what §3.4 means by "a rejection with a reason
 * regenerates the item immediately with the correction applied, and the new version
 * returns to the queue". Two of those regenerations were then approved. The third —
 * `ci-0420-01`, rejected as WEAK — is back in the queue as version 2, waiting.
 *
 * `secondsSpent` is real-shaped rather than uniform. Build spec §4: it "is not
 * surveillance — it is how the generator sizes next week's volume to the real review
 * budget", and design spec §5A.3 makes it the only honest input to a minutes estimate.
 */
export const REFERENCE_DECISIONS: readonly ReviewDecisionRecord[] = [
  { itemId: 'ci-0418-01', reviewer: REVIEWERS.tl, action: 'approve', reasonCode: null, secondsSpent: 74 },
  { itemId: 'ci-0418-03', reviewer: REVIEWERS.seo, action: 'reject', reasonCode: 'STALE_NUMBER', secondsSpent: 132 },
  { itemId: 'ci-0418-03', reviewer: REVIEWERS.seo, action: 'approve', reasonCode: null, secondsSpent: 58 },
  { itemId: 'ci-0418-04', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 44 },
  { itemId: 'ci-0419-01', reviewer: REVIEWERS.seo, action: 'approve', reasonCode: null, secondsSpent: 118 },
  { itemId: 'ci-0419-02', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 70 },
  { itemId: 'ci-0419-03', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 39 },
  { itemId: 'ci-0419-05', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 67 },
  { itemId: 'ci-0420-01', reviewer: REVIEWERS.tl, action: 'reject', reasonCode: 'WEAK', secondsSpent: 149 },
  { itemId: 'ci-0420-02', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 52 },
  { itemId: 'ci-0420-03', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 73 },
  { itemId: 'ci-0420-05', reviewer: REVIEWERS.social, action: 'approve', reasonCode: null, secondsSpent: 91 },
  { itemId: 'ci-0421-01', reviewer: REVIEWERS.seo, action: 'approve', reasonCode: null, secondsSpent: 121 },
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
