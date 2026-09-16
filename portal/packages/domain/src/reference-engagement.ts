/**
 * The reference week's engagement — what the Listener and the Page notifications would have
 * surfaced by Monday afternoon.
 *
 * ⚠ **Every post quoted here is illustrative**, and each one says so. No listener runs yet
 * (build spec §0), so there is no real thread, comment or tag to show.
 *
 * **No real organisation is made to say anything.** The Amplify Register names Quirks,
 * GreenBook, AlphaSense and others (㉕); a stand-in post attributed to one of them would put
 * invented words in a real company's mouth. So authors are described by what they are —
 * "a research trade publication" — and carry the tier a real member of that group would.
 *
 * **The facts to bring are not illustrative.** Each is a figure or rule with a repository
 * source, because ⑰'s guard rail is the point being demonstrated: no fact, no target.
 *
 * Team-post targets are deliberately absent. ⑰ rule 3 surfaces them "at publish time", and
 * on Monday afternoon no teammate's post for this week is live yet — the first is Joy's, on
 * Tuesday at 09:00.
 */

import type { EngagementTarget } from './engagement';

const IST = '+05:30';
const at = (date: string, time: string) => `${date}T${time}:00${IST}`;

export const REFERENCE_NOW = at('2026-08-17', '14:00');

export const REFERENCE_ENGAGEMENT: readonly EngagementTarget[] = [
  // ── INBOUND — someone acted on us ─────────────────────────────────────────
  {
    id: 'en-m1',
    kind: 'mention',
    surfacedAt: at('2026-08-17', '11:20'),
    post: {
      id: 'ext-m1',
      platform: 'linkedin',
      author: 'Research trade publication',
      authorDetail: 'Market research news and analysis',
      authorIsCompany: true,
      text: 'Five tools research teams are testing this quarter for the desk research that comes before fieldwork. @Caspr is the one our contributors kept raising when the question was where a figure came from.',
      postedAt: at('2026-08-17', '11:05'),
    },
    accountTier: 2,
    teamPost: false,
    whyRelevant: 'Tags the Caspr Page in a round-up read by market research teams — ICP 7.',
    factToBring:
      'Where two published sources disagree on the same basis and the same year, the range is the finding. Showing both beats choosing one.',
    ourSource: 'index-engine.md §2',
    assignedTo: 'social',
    about: 'caspr',
    illustrative: true,
    drafts: [
      {
        id: 'dr-m1-a',
        lane: 'social',
        stance: 'the_record',
        text: 'Thank you for including us. The case we keep meeting is two credible sources, 36% apart, on the same market. Where they disagree on the same basis and the same year, the range is the finding — showing both beats choosing one.',
        basis: 'index-engine.md §2',
      },
      {
        id: 'dr-m1-b',
        lane: 'social',
        stance: 'sourcing',
        text: 'The question your contributors kept raising is the one we built around: when the room asks where the number came from, the answer is already on the page. Where two sources disagree on the same basis, we show the range rather than pick an end of it.',
        basis: 'index-engine.md §2',
      },
    ],
    status: 'open',
  },
  {
    id: 'en-m2',
    kind: 'mention',
    surfacedAt: at('2026-08-17', '09:40'),
    post: {
      id: 'ext-m2',
      platform: 'linkedin',
      author: 'Market data provider',
      authorDetail: 'Financial data and research platform',
      authorIsCompany: true,
      text: 'How analyst teams are combining terminal data with newer research tools — a comparison, with @Caspr among the entrants we looked at.',
      postedAt: at('2026-08-17', '09:10'),
    },
    accountTier: 3,
    teamPost: false,
    whyRelevant: 'An incumbent our ICP already pays for, tagging the Page in a comparison.',
    factToBring: null,
    ourSource: null,
    assignedTo: 'social',
    about: 'caspr',
    illustrative: true,
    drafts: [],
    status: 'open',
  },
  {
    id: 'en-r1',
    kind: 'reshare',
    surfacedAt: at('2026-08-17', '12:05'),
    post: {
      id: 'ext-r1',
      platform: 'linkedin',
      author: 'Strategy director',
      authorDetail: 'Corporate strategy, consumer goods',
      authorIsCompany: false,
      text: 'This is the problem with every market size I pulled last quarter. Three numbers, no basis on any of them.',
      postedAt: at('2026-08-17', '11:50'),
    },
    accountTier: null,
    teamPost: false,
    whyRelevant: 'Reshared a Caspr Page post with a line of their own — ICP 2.',
    factToBring:
      'Most gaps between published figures close the moment each one states what it counts and for which year. The ones that do not close are the finding.',
    ourSource: 'index-engine.md §2',
    assignedTo: 'social',
    about: 'caspr',
    illustrative: true,
    drafts: [
      {
        id: 'dr-r1-a',
        lane: 'social',
        stance: 'the_record',
        text: 'Three numbers and no basis on any of them is the common case. Most gaps close the moment each figure states what it counts and for which year. The ones that do not close are the finding.',
        basis: 'index-engine.md §2',
      },
      {
        id: 'dr-r1-b',
        lane: 'social',
        stance: 'icp_wounds',
        text: 'Same pattern here: the figures disagree less often than the definitions do. Two or three days at the start of every project go into sorting that out. Nobody bills them.',
        basis: 'index-engine.md §2 · icp-personas.md :527',
      },
    ],
    status: 'open',
  },
  {
    id: 'en-r2',
    kind: 'reshare',
    surfacedAt: at('2026-08-17', '10:30'),
    post: {
      id: 'ext-r2',
      platform: 'linkedin',
      author: 'Associate',
      authorDetail: 'Management consulting',
      authorIsCompany: false,
      text: '',
      postedAt: at('2026-08-17', '10:15'),
    },
    accountTier: null,
    teamPost: false,
    whyRelevant: 'Reshared a Caspr Page post without adding anything.',
    factToBring: null,
    ourSource: null,
    assignedTo: 'social',
    about: 'caspr',
    illustrative: true,
    drafts: [],
    status: 'open',
  },

  // ── OUTBOUND — we act on someone else's post ──────────────────────────────
  {
    id: 'en-c1',
    kind: 'comment',
    surfacedAt: at('2026-08-17', '08:05'),
    post: {
      id: 'ext-c1',
      platform: 'linkedin',
      author: 'Category manager',
      authorDetail: 'Chilled and ready meals, UK grocery',
      authorIsCompany: false,
      text: 'Prepping for our autumn range review. UK ready meals is about a £5bn market and the premium end is carrying the growth. Curious what others are seeing on shelf.',
      postedAt: at('2026-08-17', '07:40'),
    },
    accountTier: null,
    teamPost: false,
    // The worked example's own ⑰ target — content-engine-example.md, the Comment Desk.
    whyRelevant: 'States a UK ready meals market size with no basis — the exact disagreement Caspr reconciled. ICP 4.',
    factToBring:
      'Published estimates on the same definition and base year run from $5.86bn to $6.46bn. The figure needs its scope attached before it goes into a range review.',
    ourSource: 'index-engine.md §1',
    assignedTo: 'joy',
    about: null,
    illustrative: true,
    drafts: [
      {
        id: 'dr-c1-a',
        lane: 'joy',
        stance: 'the_record',
        text: 'Worth pinning the basis before it goes into the review: published estimates on the same definition and base year run from $5.86bn to $6.46bn. The spread is the number, not either end of it.',
        basis: 'index-engine.md §1',
      },
      {
        id: 'dr-c1-b',
        lane: 'joy',
        stance: 'icp_wounds',
        text: 'The page-one figures are further apart than they look — about $600m, once the definitions and the base year line up. Two or three days at the start of every review go into reconciling that, and nobody bills them.',
        basis: 'index-engine.md §1 · icp-personas.md :527',
      },
    ],
    status: 'open',
  },
  {
    id: 'en-c2',
    kind: 'comment',
    surfacedAt: at('2026-08-17', '10:50'),
    post: {
      id: 'ext-c2',
      platform: 'linkedin',
      author: 'Research trade publication',
      authorDetail: 'Market research news and analysis',
      authorIsCompany: true,
      text: 'Where does AI actually save time in a research project? We asked contributors for our next issue. The answers kept landing on one phase: the desk research before fieldwork.',
      postedAt: at('2026-08-17', '10:30'),
    },
    accountTier: 2,
    teamPost: false,
    whyRelevant: 'A question our buyer research answers in the buyer’s own words. ICP 7.',
    factToBring:
      'Every new project starts with two or three days of desk research nobody bills for, and at the proposal stage those hours are gone if the pitch does not convert.',
    ourSource: 'icp-personas.md :527 · :534',
    assignedTo: 'joy',
    about: null,
    illustrative: true,
    drafts: [
      {
        id: 'dr-c2-a',
        lane: 'joy',
        stance: 'icp_wounds',
        text: 'That matches what we heard. Every new project starts with two or three days of desk research nobody bills for, and at the proposal stage those hours are gone if the pitch does not convert.',
        basis: 'icp-personas.md :527 · :534',
      },
      {
        id: 'dr-c2-b',
        lane: 'joy',
        stance: 'what_research_costs',
        text: 'The phase your contributors named is the unbillable one. Buy the report. Commission the study. Or ask the question. The first two answer what their publisher chose to ask, and the third is where those days go.',
        basis: 'icp-personas.md :527',
      },
    ],
    status: 'open',
  },

  // ── FILTERED OUT — surfaced by the Listener, stopped by a rule ───────────
  {
    id: 'en-f1',
    kind: 'comment',
    surfacedAt: at('2026-08-17', '09:00'),
    post: {
      id: 'ext-f1',
      platform: 'linkedin',
      author: 'Market intelligence platform',
      authorDetail: 'AI search for analysts',
      authorIsCompany: true,
      text: 'Analysts spend a third of their week searching. Here is what changes when search understands the question.',
      postedAt: at('2026-08-17', '08:30'),
    },
    accountTier: 3,
    teamPost: false,
    whyRelevant: 'On-topic, and an incumbent in the budget line our ICP already pays for.',
    factToBring: 'Every figure should carry its publisher and year.',
    ourSource: 'CLAUDE.md · message stack',
    assignedTo: 'joy',
    about: null,
    illustrative: true,
    drafts: [],
    status: 'open',
  },
  {
    id: 'en-f2',
    kind: 'comment',
    surfacedAt: at('2026-08-17', '07:15'),
    post: {
      id: 'ext-f2',
      platform: 'linkedin',
      author: 'Growth advisor',
      authorDetail: 'Startups and AI',
      authorIsCompany: false,
      text: 'AI will replace junior analysts within two years. Agree or disagree?',
      postedAt: at('2026-08-16', '19:00'),
    },
    accountTier: null,
    teamPost: false,
    whyRelevant: 'High velocity, and about analysts.',
    factToBring: null,
    ourSource: null,
    assignedTo: 'jayant',
    about: null,
    illustrative: true,
    drafts: [],
    status: 'open',
  },
  {
    id: 'en-f3',
    kind: 'repost',
    surfacedAt: at('2026-08-17', '12:40'),
    post: {
      id: 'ext-f3',
      platform: 'linkedin',
      author: 'Research trade publication',
      authorDetail: 'Market research news and analysis',
      authorIsCompany: true,
      text: 'Our annual state-of-the-industry report is out: budgets, headcount and where research teams are spending on tools.',
      postedAt: at('2026-08-17', '12:00'),
    },
    accountTier: 2,
    teamPost: false,
    whyRelevant: 'Useful to our ICP, and the kind of post a feed repost would suit.',
    factToBring: 'The global market research industry is a $153bn sector.',
    ourSource: 'icp-personas.md :511',
    assignedTo: 'social',
    about: null,
    illustrative: true,
    drafts: [],
    status: 'open',
  },
];
