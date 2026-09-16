/**
 * Content SEO — what is inside the page, not what is around it.
 *
 * ⚑ Added 2026-09-16: *"seo ke andr content seo bhi daalde."* `page-seo.ts` checks the
 * envelope — a title, a description, schema, links in. This checks the writing, and the two
 * fail in completely different ways: a page can have a perfect title tag and still bury its
 * answer in the fourth paragraph.
 *
 * **Every rule here is Joy's, from `content-engine-runtime-spec.md` §6.1** — the Type B
 * blog and search-answer contract — plus the AEO standard the same section makes a build
 * requirement. Nothing is a generic SEO heuristic; there is no keyword-density check, because
 * nobody here ever asked for one.
 *
 * ⚠ **These do not gate publication.** The review gate is `reviewPost`, and it is about
 * claims and voice. This is a second, softer reading for the SEO seat: a post can be
 * perfectly true, perfectly on-voice and still answer its question too late to rank.
 */

import type { PostBody } from './post';
import type { CheckResult } from './page-seo';

/** §6.1's AEO block: the answer arrives in 40–60 words. */
export const ANSWER_BLOCK = { min: 40, max: 60 } as const;
/** Below this a search answer is thin; above it, nobody has to scroll for the answer. */
export const ANSWER_DEPTH_MIN = 600;

/**
 * ⛔ The category words, which are exactly what a search answer must not open on.
 *
 * §6.1: *"Meet the reader **at the job, never at the category** — nobody searches 'analytical
 * AI'."* And `CLAUDE.md`'s pillar 2 puts category education on `/vs/*`, social and founder
 * content, never in a hero — a search answer opening on it is the same mistake in a different
 * room.
 */
const CATEGORY_TERMS = /\b(analytical ai|generative ai|the ai category|our platform|source, assess, conclude)\b/i;

/**
 * A figure, and something that could be its source.
 *
 * §6.1: *"every factual claim carries its source **inline**"* — inline, not a footnote,
 * because a search reader and an AI answer both take the sentence and leave the page.
 */
const FIGURE = /(?:\$|£|€)?\d[\d,.]*\s*(?:bn|billion|m\b|million|k\b|%|percent)/gi;
const SOURCE_MARKER = /\b(?:source|per|according to|reported by|from)\b|\(\s*[A-Z][\w&. ]+,?\s*20\d\d\s*\)/i;

/** A CTA is a CTA wherever it sits. §6.1: one, at the end, never mid-body. */
const CTA_PHRASES = /\b(sign up|start free|try caspr|book a (?:call|demo)|get started|run your own|create an account)\b/i;

function words(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentences(text: string): readonly string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/** The words a query is actually made of, minus the ones every query has. */
const STOP = new Set(['a', 'an', 'the', 'of', 'for', 'in', 'to', 'and', 'or', 'is', 'do', 'i', 'my', 'how', 'what', 'can', 'does']);

function terms(query: string): readonly string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word));
}

function covers(text: string, query: string): number {
  const haystack = text.toLowerCase();
  const wanted = terms(query);
  if (wanted.length === 0) return 1;
  return wanted.filter((word) => haystack.includes(word)).length / wanted.length;
}

/**
 * Read one post's writing.
 *
 * Returns the same `CheckResult` shape as the page checks, so a row can show both without
 * the reader having to learn two vocabularies — and so "3 to fix" means the same thing in
 * both halves of the same card.
 */
export function checkContent(body: PostBody): readonly CheckResult[] {
  if (body.kind !== 'blog') return [];

  const opening = [body.standfirst, body.paragraphs[0] ?? ''].join(' ').trim();
  const openingSentences = sentences(opening).slice(0, 2).join(' ');
  const full = [body.headline, body.standfirst, ...body.paragraphs].join('\n\n');
  const midBody = body.paragraphs.slice(0, -1).join('\n\n');

  const answered = covers(openingSentences, body.targetQuery);
  const standfirstWords = words(body.standfirst);
  const total = words(full);

  const figures = [...full.matchAll(FIGURE)];
  const unsourced = figures.filter((match) => {
    const paragraph = paragraphAround(full, match.index ?? 0);
    return !SOURCE_MARKER.test(paragraph);
  });

  const midCta = CTA_PHRASES.test(midBody);
  const categoryOpening = CATEGORY_TERMS.test(openingSentences);
  const inHeadline = covers(body.headline, body.targetQuery);

  return [
    {
      id: 'keyword',
      label: 'Answers the question in the first two sentences',
      pass: answered >= 0.6,
      standing:
        answered >= 0.6
          ? 'The opening is on the question.'
          : `The opening covers ${Math.round(answered * 100)}% of what was asked.`,
      fix: 'Answer it first, then explain. Search readers do not scroll to find out whether you know.',
      weight: 'blocking',
    },
    {
      id: 'title',
      label: 'The question is in the headline',
      pass: inHeadline >= 0.5,
      standing:
        inHeadline >= 0.5 ? `“${body.headline}”` : `The headline misses most of “${body.targetQuery}”.`,
      fix: 'A headline that does not contain the question is a headline for a different page.',
      weight: 'quality',
    },
    {
      id: 'schema',
      label: `A ${ANSWER_BLOCK.min}–${ANSWER_BLOCK.max} word answer block`,
      pass: standfirstWords >= ANSWER_BLOCK.min && standfirstWords <= ANSWER_BLOCK.max,
      standing: `The standfirst is ${standfirstWords} words.`,
      fix: `${ANSWER_BLOCK.min}–${ANSWER_BLOCK.max} is the length an AI answer lifts whole. Shorter says nothing; longer gets cut.`,
      weight: 'quality',
    },
    {
      id: 'meta',
      label: 'Every figure carries its source',
      pass: unsourced.length === 0,
      standing:
        figures.length === 0
          ? 'No figures in this one.'
          : unsourced.length === 0
            ? `${figures.length} figures, all sourced in the same paragraph.`
            : `${unsourced.length} of ${figures.length} figures have no source near them — ${unsourced
                .slice(0, 3)
                .map((match) => match[0])
                .join(', ')}.`,
      fix: 'Inline, never a footnote. A search reader and an AI answer both take the sentence and leave the page — a figure whose source is elsewhere travels without it.',
      weight: 'blocking',
    },
    {
      id: 'inbound_links',
      label: 'One CTA, at the end',
      pass: !midCta && body.cta.trim().length > 0,
      standing: midCta
        ? 'There is a call to action mid-body.'
        : body.cta.trim().length === 0
          ? 'No CTA at all.'
          : body.cta.trim().endsWith('?')
            ? 'One, at the end, and it invites a question.'
            : 'One, at the end.',
      fix: 'Never mid-body, and it invites a question rather than an account. A reader interrupted mid-answer has been sold to before they were answered.',
      weight: 'quality',
    },
    {
      id: 'indexed',
      label: 'Meets the reader at the job',
      pass: !categoryOpening,
      standing: categoryOpening
        ? 'The opening leads on the category.'
        : 'The opening is on the job, not the category.',
      fix: 'Nobody searches “analytical AI”. Category education belongs on /vs/, in social and in founder content — never in the first line of a search answer.',
      weight: 'blocking',
    },
    {
      id: 'url',
      label: 'Enough of an answer to rank',
      pass: total >= ANSWER_DEPTH_MIN,
      standing: `${total} words.`,
      fix: `Under ${ANSWER_DEPTH_MIN} and it reads as thin to a crawler and to a buyer. Depth is not padding — it is the questions the first answer raises.`,
      weight: 'quality',
    },
  ];
}

/** The paragraph a match falls in — so "sourced nearby" means the same paragraph, not the page. */
function paragraphAround(text: string, index: number): string {
  const before = text.lastIndexOf('\n\n', index);
  const after = text.indexOf('\n\n', index);
  return text.slice(before === -1 ? 0 : before, after === -1 ? text.length : after);
}

export interface ContentHealth {
  readonly checked: boolean;
  readonly passed: number;
  readonly total: number;
  readonly failing: readonly CheckResult[];
}

export function contentHealth(body: PostBody | undefined): ContentHealth {
  if (body === undefined || body.kind !== 'blog') {
    return { checked: false, passed: 0, total: 0, failing: [] };
  }
  const checks = checkContent(body);
  const failing = checks.filter((check) => !check.pass);
  return { checked: true, passed: checks.length - failing.length, total: checks.length, failing };
}
