/**
 * The ad set — one ad per angle, per placement that is open.
 *
 * ⚑ **Every line is drawn from copy that already exists**, not written for this file. The
 * approved lines are in `CLAUDE.md`'s tone calibration and `library.ts`'s copy tiers; the
 * angles are the stance library's nine; the callout and structured-snippet assets are quoted
 * exactly from `operations-runbook.md` §7, because they were written once and are not a
 * per-campaign decision.
 *
 * ⚠ **Nothing here has run.** Paid is gated on four conditions and none holds, so `metrics`
 * is null on every draft and the two with figures are marked as what they are: the shape of a
 * reading, so the kill rules can be seen working before there is money behind them. They are
 * the only invented numbers in this workstream and they exist to make a rule visible, not to
 * describe performance.
 *
 * **Three deliberate omissions**, each with a reason:
 *   · no LinkedIn ads — §3.6 puts it later, at $8–18 to interrupt someone who was not looking
 *   · no reel ads — the engine writes scripts and captions, it does not make video, and no
 *     cutdowns exist yet
 *   · no ad on the `multilingual` angle — there is no landing page in another language, and
 *     an ad whose promise the site cannot keep is the worst thing paid can buy
 */

import type { Ad } from './ad';

export const AD_BUDGET_MONTHLY = 850;

export const REFERENCE_ADS: readonly Ad[] = [
  // ── Google Search · the only placement open, and the one with intent ───────
  {
    id: 'ad-gs-cost',
    platform: 'google_search',
    angle: 'what_research_costs',
    icp: 'Consultants',
    copy: {
      headlines: ['The $200,000 question', 'Answered for $80', 'Cited to source'],
      descriptions: [
        'A Study costs $80 and cites every figure to a credible source. See one before you decide.',
        'Boardroom-ready in 15 minutes. $100 free, no card.',
      ],
      primary: null,
      hashtags: [],
      landingPath: '/answers/how-much-does-market-research-cost',
    },
    creative: null,
    state: 'draft',
    metrics: null,
    note: 'The highest-CPC cluster we found — $300 a click, KD 4, and driveresearch.com currently owns it. Paid buys the position while the page earns it.',
  },
  {
    id: 'ad-gs-consultant',
    platform: 'google_search',
    angle: 'icp_wounds',
    icp: 'Consultants',
    copy: {
      headlines: ['Four hours. Three numbers.', 'An industry in two days', 'Every figure sourced'],
      descriptions: [
        'Get up to speed on an unfamiliar sector without spending the week on desk research.',
        'Analyst-grade, cited, and defensible in front of a client.',
      ],
      primary: null,
      hashtags: [],
      landingPath: '/consulting',
    },
    creative: null,
    state: 'draft',
    metrics: null,
    note: 'Sourced to icp-personas.md :57 — “four hours for three usable numbers” is the wound in the buyer’s own words.',
  },
  {
    id: 'ad-gs-investor',
    platform: 'google_search',
    angle: 'sourcing',
    icp: 'Investors',
    copy: {
      headlines: ['Defensible market size', 'For an IC memo', 'Every source named'],
      descriptions: [
        'Where two credible sources disagree, we show the range and say why. Not one bare number.',
        'Due diligence research in 15 minutes. $100 free.',
      ],
      primary: null,
      hashtags: [],
      landingPath: '/investors',
    },
    creative: null,
    state: 'draft',
    metrics: null,
    note: 'The disagreement is the product. This is the same mechanic the data pages test, bought rather than earned.',
  },
  {
    id: 'ad-gs-identity',
    platform: 'google_search',
    angle: 'identity',
    icp: 'All professional ICPs',
    copy: {
      headlines: ['Not an assistant.', 'An analyst.', 'Arrive certain.'],
      descriptions: [
        'Purpose-built for business analysis. Every source credible, every claim triangulated.',
        '$100 free. No credit card. Cited to source.',
      ],
      primary: null,
      hashtags: [],
      landingPath: '/',
    },
    creative: null,
    state: 'draft',
    metrics: null,
    note: 'The homepage H1, bought. The only ad that may point at the homepage — it is the identity ad, and the homepage is the identity.',
  },
  {
    id: 'ad-gs-permission',
    platform: 'google_search',
    angle: 'your_data',
    icp: 'Strategy teams',
    copy: {
      headlines: ['Will compliance approve it?', 'ISO 27001:2022', 'Your data is yours'],
      descriptions: [
        'Uploaded data never trains a model. GDPR, ISO 27001:2022, and an answer for the review.',
        'What compliance asks for, answered before they ask.',
      ],
      primary: null,
      hashtags: [],
      landingPath: '/security',
    },
    creative: null,
    state: 'draft',
    metrics: null,
    note: 'The most universal objection in the persona research, and almost no search volume — which is why it is an ad rather than a page.',
  },

  // ── Meta · retargeting only, and only once an audience exists ─────────────
  {
    id: 'ad-meta-record',
    platform: 'meta_feed',
    angle: 'the_record',
    icp: 'Anyone who visited the site',
    copy: {
      headlines: ['The Record'],
      descriptions: ['Free, every issue'],
      primary:
        'Two published estimates of one market, 36% apart, same base year. We reconcile them and show the working.',
      hashtags: ['#marketresearch', '#duediligence'],
      landingPath: '/blog',
    },
    creative: {
      headline: '36% apart. Same market.',
      support: 'Two published estimates, the same base year, and neither source says which basis it used.',
      source: 'The Record, issue 1',
    },
    state: 'draft',
    metrics: null,
    note: '§9.3: the ask matches the mood. Subscribe to The Record is the first ask on Meta; running an analysis is the second, and signing up is never the first.',
  },
  {
    id: 'ad-meta-finding',
    platform: 'meta_feed',
    angle: 'what_research_costs',
    icp: 'Anyone who visited /pricing',
    copy: {
      headlines: ['$153bn a year'],
      descriptions: ['And the gap'],
      primary:
        'The research industry is $153bn a year, per ESOMAR. The desk work before every study sits outside that figure.',
      hashtags: ['#marketresearch'],
      landingPath: '/answers/how-much-does-market-research-cost',
    },
    creative: {
      headline: '$153bn',
      support: 'The desk research before every study sits outside that figure, because nobody bills for it.',
      source: 'ESOMAR, 2025',
    },
    state: 'draft',
    metrics: null,
    note: 'The finding in 10 seconds — one number, the source line on screen. The atom from the daily post, reused rather than rewritten.',
  },
];

/**
 * Two ads with figures attached, so the kill rules can be seen deciding.
 *
 * ⚠ **The numbers are illustrative and are the only invented figures in this workstream.**
 * They exist because a rule nobody has watched fire is a rule people assume they understand:
 * one ad here is inside every threshold, one is under the CTR floor and gets a rewrite rather
 * than a bigger bid. Neither describes anything that happened.
 */
export const ILLUSTRATIVE_READINGS: Readonly<Record<string, { readonly impressions: number; readonly clicks: number; readonly conversions: number; readonly spend: number }>> = {
  'ad-gs-cost': { impressions: 2_400, clicks: 61, conversions: 2, spend: 214 },
  'ad-gs-identity': { impressions: 3_100, clicks: 22, conversions: 0, spend: 96 },
};
