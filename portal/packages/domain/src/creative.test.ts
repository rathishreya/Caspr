import { describe, expect, it } from 'vitest';

import {
  CHANNEL_CREATIVE,
  creativeChecks,
  creativeFor,
  creativeOverflow,
  wrappedLines,
  type CreativeFigure,
  type CreativeSpec,
} from './creative';
import type { PostVersion } from './post';
import { REFERENCE_DAILY_POSTS, REFERENCE_POSTS } from './reference-posts';
import { REFERENCE_WEEK } from './reference-week';

const version = (overrides: Partial<PostVersion>): PostVersion => ({
  itemId: 'ci-test',
  versionN: 1,
  modelTier: 'haiku',
  researchBasis: [],
  regeneratedAfter: null,
  body: { kind: 'meta', caption: 'Source: somewhere.' },
  ...overrides,
});

const atom = (figures: readonly CreativeFigure[]): CreativeSpec => ({
  template: 'atom',
  eyebrow: 'Valves',
  headline: '36% apart',
  figures,
  source: 'Source: two publishers.',
});

const failed = (checks: ReturnType<typeof creativeChecks>) => checks.filter((c) => !c.pass).map((c) => c.id);

describe('which platforms take an image — flowcharts/I-platforms.mmd', () => {
  it('requires one where the image is the post, and refuses one where a card reads as an advert', () => {
    expect(CHANNEL_CREATIVE.meta.need).toBe('required');
    expect(CHANNEL_CREATIVE.blog.need).toBe('required');
    expect(CHANNEL_CREATIVE.reddit.need).toBe('never');
    expect(CHANNEL_CREATIVE.quora.need).toBe('never');
    expect(CHANNEL_CREATIVE.linkedin.need).toBe('optional');
  });

  it('fails a Meta post with nothing to show', () => {
    expect(failed(creativeChecks({ channel: 'meta' }, version({})))).toEqual(['creative']);
  });

  it('fails a Reddit reply that arrives with a branded card', () => {
    const card = { template: 'card', eyebrow: 'E', headline: 'H', standfirst: 'S', source: null } as const;
    expect(failed(creativeChecks({ channel: 'reddit' }, version({ creative: card })))).toEqual(['creative']);
  });

  it('builds every blog post its hero from the article, so none is ever missing', () => {
    for (const post of REFERENCE_POSTS.filter((p) => p.body.kind === 'blog')) {
      expect(creativeFor(post)?.template).toBe('hero');
    }
  });
});

describe('the atom — runtime spec ⑪', () => {
  it('refuses a figure without its publisher', () => {
    const spec = atom([
      { display: '$725.0M', value: 725, publisher: 'IMARC Group', period: '2025' },
      { display: '$990M', value: 990, publisher: '', period: '2025' },
    ]);
    expect(failed(creativeChecks({ channel: 'x' }, version({ creative: spec })))).toEqual(['creative-atom']);
  });

  it('refuses two figures from different periods — index engine G4', () => {
    const spec = atom([
      { display: '$725.0M', value: 725, publisher: 'IMARC Group', period: '2025' },
      { display: '$990M', value: 990, publisher: 'MarkNtel Advisors', period: '2024' },
    ]);
    expect(failed(creativeChecks({ channel: 'x' }, version({ creative: spec })))).toEqual(['creative-atom']);
  });

  it('refuses a card that prints a figure with no source line', () => {
    const card = { template: 'card', eyebrow: 'E', headline: '$153bn', standfirst: 'S', source: null } as const;
    expect(failed(creativeChecks({ channel: 'x' }, version({ creative: card })))).toEqual(['creative-source']);
  });
});

describe('the renderer asserts and refuses — integrations §6.3', () => {
  it('wraps at word boundaries', () => {
    expect(wrappedLines('Six weeks. The research can take four', 24)).toBe(2);
    expect(wrappedLines('', 24)).toBe(0);
  });

  it('refuses a headline that runs past its lines, rather than drawing it', () => {
    const card = {
      template: 'card',
      eyebrow: 'Eyebrow',
      headline: 'A headline long enough that at seventy-six points it cannot fit on three lines of the card',
      standfirst: 'Short.',
      source: null,
    } as const;
    expect(creativeOverflow(card)).toEqual(['headline 4 lines, 3 fit']);
  });

  it('draws every card in the reference week', () => {
    const items = new Map(REFERENCE_WEEK.map((item) => [item.id, item]));
    for (const post of [...REFERENCE_POSTS, ...REFERENCE_DAILY_POSTS]) {
      expect(failed(creativeChecks(items.get(post.itemId)!, post)), post.itemId).toEqual([]);
    }
  });
});
