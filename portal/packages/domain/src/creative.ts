/**
 * Creatives — the image a post carries, as data.
 *
 * Asked for 2026-09-15: "creatives for all the platforms wherever needed." Which platforms
 * need one, and what it looks like, were already written down; this file is those rules as
 * code. Opened, by section:
 *
 *  · `flowcharts/I-platforms.mmd` — which platform takes which image (A1 LinkedIn "1 atom or
 *    a document", B1 X "card on the FIRST post", B2 caspr.ai "1 hero", C1 Instagram "the atom
 *    card. NOTHING is written for it", D1 Reddit "no template shape", D2 Quora "a link to our
 *    own page")
 *  · `content-engine-integrations.md` §6.1 the house card (`a09_no_card.svg`), §6.2 the
 *    canvases, §6.3 "the renderer asserts and refuses", §6.5 the dark ground as compliance
 *  · `content-engine-runtime-spec.md` ⑪ — "the atom carries the number, its unit, its
 *    period, and its publisher. A chart that drops the publisher is not the atom."
 *
 * A spec is data, never a picture: ⑪ route (b), template + data, because "a generated chart
 * cannot be source-stamped truthfully". The console renders it (`/api/creatives`).
 */

import type { Channel, ContentItem } from './content-item';
import type { ChannelCheck, PostVersion } from './post';

export const CREATIVE_CANVASES = {
  /** §6.2 `social/`: 1080 × 1080 on the dark ground. The atom and every social card. */
  social: { width: 1080, height: 1080 },
  /**
   * The blog hero, which doubles as the page's `og:image` (§6.7). ⚠ 1200 × 630 is the Open
   * Graph ratio, not a size any document here specifies — flagged under Rule 5.5.
   */
  hero: { width: 1200, height: 630 },
} as const;
export type CreativeCanvas = keyof typeof CREATIVE_CANVASES;

/** One figure on the atom. Every field is required because ⑪ requires every one of them. */
export interface CreativeFigure {
  /** The number as printed — `$725.0M`. */
  readonly display: string;
  /** The same number, in the unit the bars share, so the bars are drawn to scale. */
  readonly value: number;
  readonly publisher: string;
  /** The base period — `2025`. Index engine G4: compared figures must share one. */
  readonly period: string;
}

export type CreativeSpec =
  /** §6.1 anatomy: eyebrow and rule, serif headline with the red dot, standfirst, lockup. */
  | {
      readonly template: 'card';
      readonly eyebrow: string;
      readonly headline: string;
      readonly standfirst: string;
      /** Required once the card carries a figure. A card that states a position has none. */
      readonly source: string | null;
    }
  /** The atom — ⑪: "one chart, source-stamped". The same card, with the figures drawn. */
  | {
      readonly template: 'atom';
      readonly eyebrow: string;
      readonly headline: string;
      readonly figures: readonly CreativeFigure[];
      readonly source: string;
    }
  /** The blog hero. Built from the article, never written separately. */
  | {
      readonly template: 'hero';
      readonly eyebrow: string;
      readonly headline: string;
      readonly standfirst: string;
    };

export type CreativeNeed = 'required' | 'optional' | 'never';

export interface CreativeRule {
  readonly need: CreativeNeed;
  readonly canvas: CreativeCanvas | null;
  readonly rule: string;
  readonly source: string;
}

const PLATFORMS = 'I-platforms.mmd';

export const CHANNEL_CREATIVE: Readonly<Record<Channel, CreativeRule>> = {
  linkedin: { need: 'optional', canvas: 'social', rule: 'One atom or a document', source: `${PLATFORMS} A1` },
  linkedin_page: { need: 'optional', canvas: 'social', rule: 'One atom or a document', source: `${PLATFORMS} A1` },
  x: { need: 'optional', canvas: 'social', rule: 'A card, on the first post', source: `${PLATFORMS} B1` },
  meta: {
    need: 'required',
    canvas: 'social',
    rule: 'The card is the post — nothing is written for it',
    source: `${PLATFORMS} C1 · framework §9.3`,
  },
  blog: { need: 'required', canvas: 'hero', rule: 'One hero image, which is also the link preview', source: `${PLATFORMS} B2` },
  reddit: { need: 'never', canvas: null, rule: 'Native to the thread — no template shape', source: `${PLATFORMS} D1` },
  quora: { need: 'never', canvas: null, rule: 'A short answer and a link to our own page', source: `${PLATFORMS} D2` },
  // Forums are not in the flowchart. Held to Reddit's rule, because the reason is the same:
  // a branded card in a practitioners' thread reads as an advert. My extension, flagged.
  community: { need: 'never', canvas: null, rule: 'Native to the thread, as on Reddit', source: `${PLATFORMS} D1, extended` },
  email: { need: 'never', canvas: null, rule: 'Not a social surface', source: `${PLATFORMS} E1` },
  outreach: { need: 'never', canvas: null, rule: 'A pitch to an editor, not a post', source: 'operating model ㉛' },
};

/** The creative a post goes out with: the one written on the version, or the blog's own hero. */
export function creativeFor(version: PostVersion): CreativeSpec | null {
  if (version.creative != null) return version.creative;
  if (version.body.kind === 'blog') {
    return {
      template: 'hero',
      eyebrow: 'The Caspr blog',
      headline: version.body.headline,
      standfirst: version.body.standfirst,
    };
  }
  return null;
}

/**
 * Where a creative's text must fit, in characters per line at the house sizes.
 *
 * §6.3: "The renderer asserts and refuses. Headline over the safe width, or over two lines →
 * the item is not produced." The renderer itself only draws; it cannot report an overflow.
 * So the refusal happens here, before anything is drawn, against a deliberately
 * conservative estimate: Instrument Serif at 76px averages about 34px a character across
 * the 880px measure, Inter at 26px about 14px. ⚠ Estimated from the type sizes, not measured
 * glyph by glyph — an estimate that errs short refuses a card that would have fitted, which
 * is the safe direction.
 */
export const CREATIVE_FIT = {
  card: { eyebrow: { perLine: 44, lines: 1 }, headline: { perLine: 24, lines: 3 }, standfirst: { perLine: 60, lines: 4 } },
  atom: { eyebrow: { perLine: 44, lines: 1 }, headline: { perLine: 24, lines: 2 }, standfirst: { perLine: 60, lines: 0 } },
  hero: { eyebrow: { perLine: 50, lines: 1 }, headline: { perLine: 38, lines: 3 }, standfirst: { perLine: 76, lines: 3 } },
} as const;

/** Lines a string takes when wrapped at word boundaries. A word longer than a line is one line. */
export function wrappedLines(text: string, perLine: number): number {
  let lines = 0;
  let current = 0;
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const needed = current === 0 ? word.length : current + 1 + word.length;
    if (current > 0 && needed > perLine) {
      lines += 1;
      current = word.length;
    } else {
      current = needed;
    }
  }
  return current > 0 ? lines + 1 : lines;
}

/** What doesn't fit, by field. Empty means the card can be drawn. */
export function creativeOverflow(spec: CreativeSpec): readonly string[] {
  const fit = CREATIVE_FIT[spec.template];
  const over: string[] = [];
  const check = (field: 'eyebrow' | 'headline' | 'standfirst', text: string) => {
    const lines = wrappedLines(text, fit[field].perLine);
    if (lines > fit[field].lines) over.push(`${field} ${lines} lines, ${fit[field].lines} fit`);
  };
  check('eyebrow', spec.eyebrow);
  check('headline', spec.headline);
  if (spec.template !== 'atom') check('standfirst', spec.standfirst);
  return over;
}

const INTEGRATIONS = 'content-engine-integrations.md';

/** The creative checks for one post, beside its channel rules. */
export function creativeChecks(item: Pick<ContentItem, 'channel'>, version: PostVersion): readonly ChannelCheck[] {
  const rule = CHANNEL_CREATIVE[item.channel];
  const spec = creativeFor(version);
  const checks: ChannelCheck[] = [];

  if (rule.need === 'required' || (rule.need === 'never' && spec !== null)) {
    checks.push({
      id: 'creative',
      label: rule.need === 'required' ? `Image required — ${rule.rule.toLowerCase()}` : `No image — ${rule.rule.toLowerCase()}`,
      value: spec === null ? 'none attached' : `${spec.template} attached`,
      pass: rule.need === 'required' ? spec !== null : false,
      source: rule.source,
    });
  }
  if (spec === null) return checks;

  const over = creativeOverflow(spec);
  checks.push({
    id: 'creative-fits',
    label: 'The image text fits its card',
    value: over.length === 0 ? 'fits' : over.join(' · '),
    pass: over.length === 0,
    source: `${INTEGRATIONS} §6.3`,
  });

  const carriesFigure = spec.template === 'atom' || (spec.template === 'card' && /\d/.test(spec.headline + spec.standfirst));
  if (spec.template !== 'hero' && (carriesFigure || spec.source !== null)) {
    const stamped = spec.source !== null && /^source/i.test(spec.source.trim());
    checks.push({
      id: 'creative-source',
      label: 'A figure on an image carries its source line',
      value: stamped ? 'printed' : 'missing',
      pass: stamped,
      source: 'runtime spec ⑪',
    });
  }

  if (spec.template === 'atom') {
    const unstamped = spec.figures.filter((f) => f.publisher.trim() === '' || f.period.trim() === '');
    const periods = new Set(spec.figures.map((f) => f.period));
    checks.push({
      id: 'creative-atom',
      label: 'Every figure names its publisher and period, and they share one period',
      value:
        spec.figures.length < 2
          ? `${spec.figures.length} figure`
          : unstamped.length > 0
            ? `${unstamped.length} unstamped`
            : periods.size > 1
              ? `${periods.size} periods`
              : `${spec.figures.length} figures · ${[...periods][0]}`,
      pass: spec.figures.length >= 2 && unstamped.length === 0 && periods.size === 1,
      source: 'runtime spec ⑪ · index-engine.md G4',
    });
  }

  return checks;
}
