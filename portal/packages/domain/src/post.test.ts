import { describe, expect, it } from 'vitest';

import { channelChecks, isoWeekId, postText, reviewPost, stampLink, wordCount, type PostVersion } from './post';
import {
  REFERENCE_DAILY_HISTORY_POSTS,
  REFERENCE_DAILY_POSTS,
  REFERENCE_POSTS,
  referencePostFor,
} from './reference-posts';
import { REFERENCE_DAILY_HISTORY, REFERENCE_WEEK } from './reference-week';

const CONTENT_SOCIAL = new Set(['linkedin', 'linkedin_page', 'x', 'instagram', 'reddit', 'quora', 'blog', 'community']);
const ALL_ITEMS = [...REFERENCE_WEEK, ...REFERENCE_DAILY_HISTORY];
const itemById = new Map(ALL_ITEMS.map((item) => [item.id, item]));
// A discarded post is held to the same rules as a live one: the history is only worth
// keeping if what it records was fit to publish on the day.
const ALL_POSTS = [...REFERENCE_POSTS, ...REFERENCE_DAILY_POSTS, ...REFERENCE_DAILY_HISTORY_POSTS];

describe('the reference posts', () => {
  const contentSocial = ALL_ITEMS.filter((item) => CONTENT_SOCIAL.has(item.channel));

  it('give every Content & Social item in the week its words', () => {
    for (const item of contentSocial) {
      expect(referencePostFor(item.id), `no post for ${item.id}`).toBeDefined();
    }
    expect(ALL_POSTS).toHaveLength(contentSocial.length);
  });

  it('shape each body for the channel its item goes to', () => {
    const kindFor = {
      linkedin: 'linkedin',
      linkedin_page: 'linkedin',
      x: 'x',
      instagram: 'instagram',
      reddit: 'community',
      quora: 'community',
      blog: 'blog',
      community: 'community',
    } as const;
    for (const version of ALL_POSTS) {
      const item = itemById.get(version.itemId);
      expect(item).toBeDefined();
      expect(version.body.kind).toBe(kindFor[item!.channel as keyof typeof kindFor]);
    }
  });

  /**
   * The copy in this fixture was written, not generated. That makes it exactly as likely to
   * break a house rule as anything the engine produces — so it is held to the same rules,
   * by the same code the review surface shows.
   */
  it.each(ALL_POSTS.map((version) => [version.itemId, version] as const))(
    '%s passes its channel rules and the deterministic linter',
    (_id, version) => {
      const review = reviewPost(itemById.get(version.itemId)!, version);
      const failed = review.checks.filter((check) => !check.pass).map((c) => `${c.label}: ${c.value}`);
      expect(failed).toEqual([]);
      expect(review.lint.findings).toEqual([]);
    },
  );

  it('record where every figure-bearing post gets its figures', () => {
    for (const version of ALL_POSTS) {
      if (/\d/.test(postText(version.body)) && version.researchBasis.length === 0) {
        // Opinion posts from a named person may carry incidental numbers (a date, "10
        // minutes"); they must not carry market figures.
        expect(postText(version.body)).not.toMatch(/\$\d|\d+(?:\.\d+)?%/);
      }
    }
  });

  it('explain every regenerated version with the rejection that caused it', () => {
    for (const version of ALL_POSTS) {
      expect(version.versionN > 1).toBe(version.regeneratedAfter !== null);
    }
  });

  it('give every daily post the conversation it answers, and every weekly post none', () => {
    for (const version of ALL_POSTS) {
      const item = itemById.get(version.itemId)!;
      expect(version.respondsTo !== undefined).toBe(item.track === 'daily');
    }
  });

  it('label a stand-in thread as a stand-in', () => {
    for (const version of REFERENCE_POSTS) {
      if (version.body.kind === 'community') expect(version.body.illustrative).toBe(true);
    }
  });
});

describe('wordCount', () => {
  it('counts words as a reader does', () => {
    expect(wordCount('The slide is a 2x2 with empty boxes.')).toBe(8);
    expect(wordCount('pharma last month — logistics this month')).toBe(6);
    expect(wordCount('$5.86bn, growing 4.95% a year')).toBe(5);
  });
});

describe('channel rules catch what they exist to catch', () => {
  const joy = itemById.get('ci-0418-02')!;
  const base = referencePostFor('ci-0418-02')!;

  function withParagraphs(paragraphs: string[], extra: Partial<Extract<PostVersion['body'], { kind: 'linkedin' }>> = {}): PostVersion {
    if (base.body.kind !== 'linkedin') throw new Error('fixture changed');
    return { ...base, body: { ...base.body, paragraphs, ...extra } };
  }

  const failing = (version: PostVersion) =>
    channelChecks(joy, version)
      .filter((c) => !c.pass)
      .map((c) => c.id);

  it('fails a personal post outside 120–200 words', () => {
    expect(failing(withParagraphs(['Too short to be a post.']))).toContain('words');
  });

  it('fails a post that ends by fishing for comments', () => {
    const paragraphs = [...(base.body.kind === 'linkedin' ? base.body.paragraphs : []), 'What do you think?'];
    expect(failing(withParagraphs(paragraphs))).toContain('ends-conclusion');
  });

  it('fails a hashtag stack', () => {
    const paragraphs = base.body.kind === 'linkedin' ? [...base.body.paragraphs] : [];
    expect(failing(withParagraphs(paragraphs, { hashtags: ['a', 'b', 'c'] }))).toContain('hashtags');
  });

  it('fails a link on an awareness post — ㉗, a CTA there reads as an ad', () => {
    const paragraphs = base.body.kind === 'linkedin' ? [...base.body.paragraphs] : [];
    expect(failing(withParagraphs(paragraphs, { link: { url: 'https://caspr.ai', label: 'Caspr' } }))).toContain(
      'link-stage',
    );
  });

  it('fails a community reply that mentions Caspr in its first half', () => {
    const item = itemById.get('ci-0419-04')!;
    const version = referencePostFor('ci-0419-04')!;
    if (version.body.kind !== 'community') throw new Error('fixture changed');
    const early = { ...version, body: { ...version.body, paragraphs: ['Caspr does this.', ...version.body.paragraphs.slice(0, -1)] } };
    expect(channelChecks(item, early).filter((c) => !c.pass).map((c) => c.id)).toContain('not-first-half');
  });

  it('fails an X post over 260 characters', () => {
    const item = itemById.get('ci-0418-04')!;
    const version = referencePostFor('ci-0418-04')!;
    if (version.body.kind !== 'x') throw new Error('fixture changed');
    const long = { ...version, body: { ...version.body, posts: ['1 '.repeat(140)] } };
    expect(channelChecks(item, long).filter((c) => !c.pass).map((c) => c.id)).toContain('chars');
  });
});

describe('stampLink', () => {
  it('stamps a consideration link with the week, the item and the ICP', () => {
    const item = itemById.get('ci-0418-05')!;
    const url = new URL(stampLink(item, { url: 'https://caspr.ai/samples', label: 'x' }));
    expect(url.searchParams.get('utm_source')).toBe('linkedin');
    expect(url.searchParams.get('utm_campaign')).toBe('2026-w34');
    expect(url.searchParams.get('utm_content')).toBe('ci-0418-05');
    expect(url.searchParams.get('icp_hint')).toBe('strategy');
  });

  it('computes ISO weeks across a year boundary', () => {
    expect(isoWeekId('2026-08-17')).toBe('2026-W34');
    expect(isoWeekId('2027-01-01')).toBe('2026-W53');
    expect(isoWeekId('2024-12-30')).toBe('2025-W01');
  });
});
