/**
 * The SEO workstream's data, as it actually stands.
 *
 * ⚑ **Rewritten 2026-09-16.** The first version of this file invented rank positions for
 * questions nobody had run. That was the failure Rule 5.5 exists to catch, and it was
 * unnecessary: **a real reading exists.**
 * [`docs/gtm/presence-baseline-2026-08.md`](../../../../docs/gtm/presence-baseline-2026-08.md)
 * was taken on 2026-08-25, and [`docs/seo/findings.md`](../../../../docs/seo/findings.md)
 * carries 830 competitor keyword rows and volume and CPC on 59 candidates from the Ahrefs
 * pull the same day.
 *
 * So everything here is measured, and what was **not** measured says so:
 *
 *   MEASURED      the ranking leg and the citation leg of three CORE questions · the domains
 *                 that own them · volume, difficulty and CPC on the keyword families
 *   NOT MEASURED  the AI-surface leg — ChatGPT, Perplexity, Gemini were not reachable from
 *                 that session. **It is roughly an hour and it cannot be reconstructed
 *                 afterwards**, which is why it is the first row of the task list
 *
 * > *"A zero that was measured is a different object from a zero that was assumed."*
 */

import type { Approach, SeoTask } from './approach';
import type { AeoPage } from './aeo';

/** The baseline reading. `p = 0`: Caspr appears in nothing, on any question tested. */
export const BASELINE_TAKEN_ON = '2026-08-25';

export interface BaselineRow {
  readonly questionId: string;
  readonly question: string;
  readonly present: boolean;
  readonly note: string;
}

export const BASELINE: readonly BaselineRow[] = [
  {
    questionId: 'C1',
    question: 'best AI tool for market research',
    present: false,
    note: 'Not in a result, not in a roundup, not in an answer.',
  },
  {
    questionId: 'C2',
    question: 'best AI deep research tool',
    present: false,
    note: 'Recorded earlier, in the SEO pass. The answer names Perplexity, ChatGPT DR, Kimi, Consensus and Scite.',
  },
  {
    questionId: 'C6',
    question: 'alternatives to IBISWorld',
    present: false,
    note: 'Owned end to end by G2, Slashdot, SourceForge, Craft and Datarade. No vendor page ranks.',
  },
];

/**
 * ⚠ **The finding that was not the point of the exercise** — baseline §5.
 *
 * The tools named in the answer to *"best AI tool for market research"* are GWI Spark,
 * nexos.ai, Yabble, DoReveal, Notably, Manus, Optimo and Glimpse — and **almost none of them
 * do what Caspr does.** Two readings, pointing in opposite directions, and the console
 * carries both because picking one would be picking the answer.
 */
export const CATEGORY_READING = {
  opportunity:
    'The category as currently answered contains no analyst-grade report generator. The question is being answered by tools that solve a different problem, which means the position is genuinely open.',
  problem:
    'A buyer searching this phrase is shown survey and qual tools. If that is the phrase our ICP uses, we are competing for a term whose answer set has already been shaped around something else — and reshaping an established answer set is far harder than entering an empty one.',
  unresolved:
    'Which reading is right depends on a question we have not answered: is "AI tool for market research" even the phrase our buyer uses? The persona research says investors and consultants describe the job, not the tool category.',
} as const;

/**
 * The target list — baseline §4, verbatim in who and in shape.
 *
 * `cybernews.com` carries `priority` because it is the one target **confirmed across two
 * independent query families**, which is the only ordering signal in the list that came from
 * measurement rather than from judgement.
 */
export const REFERENCE_APPROACHES: readonly Approach[] = [
  {
    id: 'ap-cybernews',
    domain: 'cybernews.com',
    shape: 'roundup',
    questionId: 'C1',
    position: 1,
    state: 'identified',
    why: 'Editorial roundup. Ranked for the AI-deep-research family in the earlier pass too — confirmed across two query families.',
    priority: true,
  },
  {
    id: 'ap-g2',
    domain: 'g2.com',
    shape: 'directory',
    questionId: 'C6',
    position: 1,
    state: 'identified',
    why: 'Owns the alternatives SERPs end to end. Inclusion is a form submission, not outreach.',
  },
  {
    id: 'ap-datarade',
    domain: 'datarade.ai',
    shape: 'directory',
    questionId: 'C6',
    position: null,
    state: 'identified',
    why: 'Data-provider directory. Directly relevant — IBISWorld is listed there.',
  },
  {
    id: 'ap-sourceforge',
    domain: 'sourceforge.net',
    shape: 'directory',
    questionId: 'C6',
    position: null,
    state: 'identified',
    why: 'Directory listing on the alternatives family. A form and a login.',
  },
  {
    id: 'ap-slashdot',
    domain: 'slashdot.org',
    shape: 'directory',
    questionId: 'C6',
    position: null,
    state: 'identified',
    why: 'Directory listing on the same family, same shape.',
  },
  {
    id: 'ap-gwi',
    domain: 'gwi.com',
    shape: 'roundup',
    questionId: 'C1',
    position: null,
    state: 'identified',
    why: 'Vendor blog roundup — and GWI Spark is named first in the answer. Their own content ranks for the category they compete in.',
  },
  {
    id: 'ap-pollfish',
    domain: 'pollfish.com',
    shape: 'roundup',
    questionId: 'C1',
    position: null,
    state: 'identified',
    why: 'Vendor blog roundup on the highest-intent question in the core basket.',
  },
  {
    id: 'ap-sembly',
    domain: 'sembly.ai',
    shape: 'roundup',
    questionId: 'C1',
    position: null,
    state: 'identified',
    why: 'Vendor blog roundup.',
  },
  {
    id: 'ap-standard-insights',
    domain: 'standard-insights.com',
    shape: 'roundup',
    questionId: 'C1',
    position: null,
    state: 'identified',
    why: 'Vendor blog roundup.',
  },
  {
    id: 'ap-searchfunder',
    domain: 'searchfunder.com',
    shape: 'forum',
    questionId: 'C6',
    position: null,
    state: 'identified',
    why: 'A community forum thread, not a roundup — a real acquirer asking real peers. Investor-ICP adjacent. Never automate a post here.',
  },
  {
    id: 'ap-cbinsights',
    domain: 'cbinsights.com',
    shape: 'competitor',
    questionId: 'C6',
    position: null,
    state: 'identified',
    why: 'A competitor-intelligence page. Not a page we can be listed on.',
  },
  {
    id: 'ap-similarsite',
    domain: 'similarsitesearch.com',
    shape: 'skip',
    questionId: 'C6',
    position: null,
    state: 'identified',
    why: 'Low-value aggregator. Skip — it stops us spending outreach hours on a listicle nobody reads.',
  },
];

/**
 * The keyword families, from the Ahrefs pull — `docs/seo/findings.md`.
 *
 * **CPC is the column that decides, not volume.** Every row here is measured; the `verdict`
 * is Joy's own from the findings document, not a re-derivation.
 */
export interface KeywordShape {
  readonly id: string;
  readonly family: string;
  readonly example: string;
  /** US searches a month, across the family. */
  readonly volume: number;
  readonly difficulty: number | null;
  /** US CPC in dollars, where the pull returned one. */
  readonly cpc: number | null;
  readonly verdict: string;
  readonly build: 'yes' | 'one_page' | 'dropped' | 'conversion_only';
}

export const KEYWORD_SHAPES: readonly KeywordShape[] = [
  {
    id: 'cost',
    family: 'Cost of market research',
    example: 'how much does market research cost',
    volume: 440,
    difficulty: 4,
    cpc: 300,
    verdict:
      'Tiny, extremely commercially valuable, and KD 2–10 means it is winnable immediately. driveresearch.com ranks and is a small agency — this is takeable. Worth one strong page that owns the cluster outright, not two weeks of an editorial calendar.',
    build: 'one_page',
  },
  {
    id: 'deep-research',
    family: 'AI deep research',
    example: 'best AI deep research tool',
    volume: 0,
    difficulty: null,
    cpc: null,
    verdict:
      'The highest-value family, and it was missed entirely. Buyers are choosing an AI research tool right now, explicitly on citation reliability, and Caspr is absent from every list and every AI answer. The play is inclusion, not ranking.',
    build: 'yes',
  },
  {
    id: 'alternatives',
    family: 'Competitor alternatives',
    example: 'pitchbook alternatives · statista alternatives',
    volume: 490,
    difficulty: null,
    cpc: null,
    verdict:
      'Eight pages were specced for ~490 US searches a month across the whole family, and G2 owns those SERPs end to end — no vendor page ranks. At most one page, combining pitchbook and statista. Getting listed on G2 and Datarade almost certainly beats building it.',
    build: 'one_page',
  },
  {
    id: 'methodology',
    family: 'Methodology',
    example: 'secondary research',
    volume: 3400,
    difficulty: 3,
    cpc: 9,
    verdict:
      'Looked like the prize until the SERP showed Scribbr first and a university library second. $9 a click is a student. Scribbr and university libraries own it, and advertisers will not pay $300 to reach an undergraduate.',
    build: 'dropped',
  },
  {
    id: 'permission',
    family: 'The permission layer',
    example: 'can I use AI research in work I hand to a client',
    volume: 100,
    difficulty: null,
    cpc: null,
    verdict:
      'Asserted as "acquisition content with live search volume that almost nobody credible is answering". That was wrong — the volume is near zero. Still worth building: it answers the most universal objection in the persona research and it never regenerates. Reclassified conversion-only; it will never bring traffic.',
    build: 'conversion_only',
  },
  {
    id: 'data-pages',
    family: 'Data pages — commercial shapes',
    example: 'SaaS revenue multiples · industrial valves Saudi Arabia',
    volume: 0,
    difficulty: null,
    cpc: null,
    verdict:
      '7 of 7 shapes tested carry unreconciled contradictions, and the worst are in the thinnest coverage. Skew to commercial CPC rather than treating "specific data question" as one category — the commodity shape is searched by students, journalists and traders too.',
    build: 'yes',
  },
];

/**
 * This week's SEO tasks. Three a week — `operations-runbook.md` §4.
 *
 * ⚑ The first is not a task somebody chose; it is the one the baseline itself demands.
 * Baseline §6 item 1: *"Run the missing AI-surface leg before Day 1. CORE 15 × ChatGPT,
 * Perplexity, Gemini. An hour, unrecoverable afterwards."*
 */
export const REFERENCE_SEO_TASKS: readonly SeoTask[] = [
  {
    id: 'st-ai-leg',
    kind: 'technical',
    title: 'Run the missing AI-surface leg of the baseline',
    what: 'CORE 15 × ChatGPT, Perplexity, Gemini. Roughly an hour, and it cannot be reconstructed once publishing starts — every later reading of p is measured against this one.',
    serves: 'citation',
    done: false,
    debt: true,
  },
  {
    id: 'st-org-schema',
    kind: 'schema',
    title: 'Organization schema on every template',
    what: 'The site carries zero JSON-LD on any page. This is both the AEO standard’s schema check and the first entity signal — the same work counted twice.',
    serves: 'citation',
    done: false,
    debt: true,
  },
  {
    id: 'st-sitemap',
    kind: 'technical',
    title: 'Declare a sitemap',
    what: 'None exists. The six-month ranking clock cannot start until pages are indexed, and nothing is indexed without this.',
    serves: 'ranking',
    done: false,
    debt: true,
  },
  {
    id: 'st-orphans',
    kind: 'internal_links',
    title: 'Link the 12 orphan pages into nav and footer',
    what: 'Twelve pages exist and nothing links to them. They cannot rank and they pass no authority.',
    serves: 'ranking',
    done: false,
    debt: true,
  },
  {
    id: 'st-wikidata',
    kind: 'entity',
    title: 'Create the Wikidata entry',
    what: 'Permitted and straightforward, unlike Wikipedia. Wikipedia alone is ~7.8% of ChatGPT citations, and a recognised entity is what makes a citation possible.',
    serves: 'citation',
    done: false,
  },
  {
    id: 'st-freshness',
    kind: 'metadata',
    title: 'Visible freshness stamp on the answer template',
    what: 'On the page, not in a meta tag. A reader deciding whether to trust a figure asks how old it is first.',
    serves: 'citation',
    done: false,
  },
  {
    id: 'st-utm',
    kind: 'technical',
    title: 'utm_* on every outbound link',
    what: 'Not instrumented. A channel producing sessions we cannot attribute reads as a channel producing nothing.',
    serves: 'presence',
    done: false,
    debt: true,
  },
];

/**
 * The pages, against the AEO standard.
 *
 * Nothing is published yet, so every row is what the template will be held to rather than a
 * measurement of a live page. The `meets` lists are empty for that reason, not because the
 * pages failed a check.
 */
export const REFERENCE_PAGES: readonly AeoPage[] = [
  {
    id: 'pg-cost',
    path: '/answers/how-much-does-market-research-cost',
    title: 'How much does market research cost',
    meets: [],
    published: false,
    note: '$300 CPC, KD 4, 440 searches a month across the family. The one page that should own this cluster outright.',
  },
  {
    id: 'pg-permission',
    path: '/answers/can-i-use-ai-research-for-a-client',
    title: 'Can I use AI research in work I hand to a client',
    meets: [],
    published: false,
    note: 'Conversion-only. Near-zero volume — it does its work at the point of doubt, linked from the ICP pages and the objection folds.',
  },
  {
    id: 'pg-alternatives',
    path: '/alternatives/pitchbook-statista',
    title: 'PitchBook and Statista alternatives',
    meets: [],
    published: false,
    note: 'One page, not eight. ~300 combined, and G2 owns the SERP — this exists because a page is cheap, not because it will win.',
  },
  {
    id: 'pg-data-multiples',
    path: '/data/saas-revenue-multiples',
    title: 'SaaS revenue multiples by sector',
    meets: [],
    published: false,
    note: 'Test page 1 of 3 for T4. Observed live at 8.5× NTM against 3.3× TTM, unreconciled — the disagreement is the page.',
  },
  {
    id: 'pg-data-valves',
    path: '/data/industrial-valves-saudi-arabia',
    title: 'Industrial valves market, Saudi Arabia',
    meets: [],
    published: false,
    note: 'Test page 2 of 3. A B2B niche in an emerging geography — far more buyer-specific than the commodity shape.',
  },
  {
    id: 'pg-data-copper',
    path: '/data/copper-production-by-country',
    title: 'Copper production by country',
    meets: [],
    published: false,
    note: 'Test page 3 of 3, and the hardest case deliberately — searched by analysts, students, journalists, traders and the merely curious alike.',
  },
];
