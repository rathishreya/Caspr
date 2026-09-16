/**
 * The SEO read-out, as it stands before reading zero.
 *
 * ⚠ **Every row here is marked `illustrative` and the console says so on the screen.** There
 * is no real reading yet and there cannot be one: `activation-framework.md` §14 dependency 3
 * requires the DataForSEO credential to be rotated into AWS Secrets Manager before discovery
 * or `p` can run at all.
 *
 * What is **not** invented is the shape: the questions are the frozen basket's own
 * (`presence.ts`), the positions are drawn from what `presence-metric.md` §1 already records
 * as measured — *"every test run on 2026-08-25 found Caspr absent — from the AI-tools
 * answers, from the roundups, from all seven SERPs"* — and the domains above us are the ones
 * that document and `CLAUDE.md` name. So the table shows a true picture of absence with
 * plausible detail, rather than a flattering picture of presence with invented detail
 * (Rule 5.5).
 */

import type { BacklogItem, RankRow } from './seo';

export const REFERENCE_RANKS: readonly RankRow[] = [
  {
    questionId: 'C1',
    position: null,
    url: null,
    above: [
      { domain: 'g2.com', kind: 'roundup', position: 1 },
      { domain: 'zapier.com', kind: 'roundup', position: 3 },
    ],
    overview: 'others',
    illustrative: true,
  },
  {
    questionId: 'C3',
    position: null,
    url: null,
    above: [{ domain: 'perplexity.ai', kind: 'competitor', position: 2 }],
    overview: 'others',
    illustrative: true,
  },
  {
    questionId: 'C6',
    position: 62,
    url: 'https://caspr.ai/alternatives/ibisworld',
    above: [
      { domain: 'g2.com', kind: 'roundup', position: 1 },
      { domain: 'ibisworld.com', kind: 'competitor', position: 2 },
    ],
    overview: 'others',
    illustrative: true,
  },
  {
    questionId: 'C7',
    position: null,
    url: null,
    above: [],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'C10',
    position: null,
    url: null,
    above: [],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'C12',
    position: 11,
    url: 'https://caspr.ai/answers/how-much-does-market-research-cost',
    above: [{ domain: 'statista.com', kind: 'publisher', position: 4 }],
    overview: 'others',
    illustrative: true,
  },
  {
    questionId: 'C13',
    position: 8,
    url: 'https://caspr.ai/answers/cost-of-a-single-industry-report',
    above: [{ domain: 'ibisworld.com', kind: 'competitor', position: 3 }],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'C14',
    position: 2,
    url: 'https://caspr.ai/answers/is-an-ibisworld-subscription-worth-it',
    above: [{ domain: 'ibisworld.com', kind: 'competitor', position: 1 }],
    overview: 'others',
    illustrative: true,
  },
  {
    questionId: 'I2',
    position: null,
    url: null,
    above: [{ domain: 'capitaliq.com', kind: 'competitor', position: 5 }],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'I6',
    position: 34,
    url: 'https://caspr.ai/answers/is-a-market-size-number-credible',
    above: [],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'I13',
    position: null,
    url: null,
    above: [{ domain: 'grandviewresearch.com', kind: 'publisher', position: 1 }],
    overview: 'others',
    illustrative: true,
  },
  {
    questionId: 'K1',
    position: null,
    url: null,
    above: [{ domain: 'managementconsulted.com', kind: 'roundup', position: 6 }],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'K4',
    position: 47,
    url: 'https://caspr.ai/answers/market-data-for-a-client-deck',
    above: [],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'K10',
    position: null,
    url: null,
    above: [],
    overview: 'none',
    illustrative: true,
  },
  {
    questionId: 'K14',
    position: 5,
    url: 'https://caspr.ai/data/uk-ready-meals-market-size',
    above: [{ domain: 'mintel.com', kind: 'publisher', position: 2 }],
    overview: 'ours',
    illustrative: true,
  },
];

/**
 * The backlog, at the same standing.
 *
 * The cadence it is sized against is real — §13.2: two search answers, ~2.5 directories and
 * ~3.5 backlink conversations a week. The individual rows are illustrative.
 */
export const REFERENCE_BACKLOG: readonly BacklogItem[] = [
  {
    id: 'sb-01',
    kind: 'search_answer',
    title: 'Can I use AI research in work I hand to a client',
    questionId: 'C7',
    state: 'in_progress',
    note: 'The most universal objection in the persona research, and nobody has written for it. No Overview fires, so the ranking page takes the click.',
    illustrative: true,
  },
  {
    id: 'sb-02',
    kind: 'search_answer',
    title: 'What does compliance need in order to approve a research tool',
    questionId: 'C10',
    state: 'queued',
    note: 'Same family as C7 and the same gap. Permission is asked in near-identical words by every buyer, which is why it sits in the core basket.',
    illustrative: true,
  },
  {
    id: 'sb-03',
    kind: 'search_answer',
    title: 'Where do I get defensible market size data for due diligence',
    questionId: 'I2',
    state: 'queued',
    note: 'Investors’ highest-intent job question with no page behind it.',
    illustrative: true,
  },
  {
    id: 'sb-04',
    kind: 'search_answer',
    title: 'How do I avoid spending four hours for three usable numbers',
    questionId: 'K10',
    state: 'queued',
    note: 'The line the homepage was nearly built on, sourced to icp-personas.md :57.',
    illustrative: true,
  },
  {
    id: 'sb-05',
    kind: 'directory',
    title: 'G2 — Market Research category',
    questionId: 'C1',
    state: 'submitted',
    note: 'G2 ranks 1 for the highest-intent question in the core basket. Being on that page is a form; out-ranking it is six months.',
    illustrative: true,
  },
  {
    id: 'sb-06',
    kind: 'directory',
    title: 'Zapier’s AI research tools roundup',
    questionId: 'C1',
    state: 'queued',
    note: 'Ranks 3 on C1. A roundup, so it is a listing rather than a relationship.',
    illustrative: true,
  },
  {
    id: 'sb-07',
    kind: 'directory',
    title: 'Management Consulted — tools',
    questionId: 'K1',
    state: 'queued',
    note: 'Ranks 6 on the consultants’ first job question, and it is one of the watering holes in the distribution plan.',
    illustrative: true,
  },
  {
    id: 'sb-08',
    kind: 'backlink',
    title: 'ESOMAR — the industry-size figure in issue 1',
    questionId: null,
    state: 'in_progress',
    note: 'They publish the $153bn figure our first daily post cites. A citation conversation, not a pitch.',
    illustrative: true,
  },
  {
    id: 'sb-09',
    kind: 'backlink',
    title: 'Wall Street Oasis — the due-diligence thread',
    questionId: 'I4',
    state: 'queued',
    note: 'A live thread where the ICP already talks shop. ⚠ Community surfaces are always manual — never a brand account, never link-first.',
    illustrative: true,
  },
  {
    id: 'sb-10',
    kind: 'backlink',
    title: 'The disagreement index — sector rows as a citable source',
    questionId: null,
    state: 'queued',
    note: 'The index is the one asset nobody else has. Rows are citable on their own, which is what makes this a conversation rather than a favour.',
    illustrative: true,
  },
  {
    id: 'sb-11',
    kind: 'search_answer',
    title: 'Is an IBISWorld subscription worth it',
    questionId: 'C14',
    state: 'live',
    note: 'Ranking 2, behind IBISWorld itself — which is the correct shape for this question.',
    illustrative: true,
  },
  {
    id: 'sb-12',
    kind: 'directory',
    title: 'Product Hunt listing',
    questionId: null,
    state: 'declined',
    note: 'Held for the peak, deliberately. A one-shot spent early is spent.',
    illustrative: true,
  },
];
