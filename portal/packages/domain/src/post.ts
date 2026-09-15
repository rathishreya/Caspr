/**
 * The post itself — what a reviewer reads before deciding.
 *
 * Build spec §4 puts the body on `ContentVersion`, not on `ContentItem`: an item is the
 * slot and the brief; a version is one generation of the words. A rejection produces a new
 * version against the same item, and the ledger needs both (§3.5). The shapes below follow
 * that split.
 *
 * Every channel rule in this file is quoted from `docs/gtm/content-engine-prompts.md` §4,
 * the generation prompts. The linter enforces those same limits (`L08`, content-engine.md
 * §4.1), so a reviewer is shown the rule the post was written against rather than a second
 * rule invented for the screen.
 */

import {
  STAGES_CARRYING_ICP_HINT,
  type Channel,
  type ContentItem,
  type RejectCode,
} from './content-item';
import { lintDeterministic, type LintReport } from './lint';

export interface PostLink {
  /** Unstamped. The stamp is computed at pack time — see `stampLink`. */
  readonly url: string;
  /** What the link opens, as the reader sees it. */
  readonly label: string;
}

export interface PostAttachment {
  readonly kind: 'document' | 'visual';
  readonly label: string;
}

/** The shape of a post differs by channel, and the preview renders each one as it reads. */
export type PostBody =
  | {
      readonly kind: 'linkedin';
      readonly paragraphs: readonly string[];
      readonly hashtags: readonly string[];
      readonly link: PostLink | null;
      readonly attachment: PostAttachment | null;
    }
  | {
      readonly kind: 'x';
      /** One entry is a single post. More than one is a thread, in order. */
      readonly posts: readonly string[];
      readonly link: PostLink | null;
      readonly attachment: PostAttachment | null;
    }
  | {
      readonly kind: 'blog';
      readonly slug: string;
      readonly headline: string;
      readonly standfirst: string;
      readonly paragraphs: readonly string[];
      /** §2: "One CTA at the end. Never mid-body. It invites a question, never an account." */
      readonly cta: string;
      readonly targetQuery: string;
    }
  | {
      readonly kind: 'community';
      readonly venue: string;
      readonly threadQuestion: string;
      /**
       * True when the thread is a stand-in. There is no live listener yet (build spec §0),
       * so no real thread exists to quote — and a reviewer must not mistake an invented
       * question for one a buyer actually asked.
       */
      readonly illustrative: boolean;
      readonly paragraphs: readonly string[];
    };

export interface PostVersion {
  readonly itemId: string;
  readonly versionN: number;
  /**
   * Build spec §3.2: origination on the frontier model, transformation on Haiku. Recorded
   * because the split is what keeps the bill at $40–100 a month, and it has to be auditable.
   */
  readonly modelTier: 'frontier' | 'haiku';
  readonly body: PostBody;
  /**
   * Where the claims in this version come from, as `file :line`.
   *
   * Design spec §9: the Review Item card carries "`SOURCE · icp-personas.md :57`, which is
   * how rule 5 gets enforced in the interface rather than in a document nobody reads."
   */
  readonly researchBasis: readonly string[];
  /** Set on a regenerated version: what the reviewer objected to last time. */
  readonly regeneratedAfter: { readonly code: RejectCode; readonly note: string } | null;
  /**
   * Daily track only: the conversation this post answers. A daily item is trend-anchored
   * (runtime spec §5A), and a reviewer judging a reply without the thing it replies to is
   * judging half of it.
   */
  readonly respondsTo?: { readonly summary: string; readonly illustrative: boolean };
}

/** Every word a reader will see, joined — what the linter and the word count read. */
export function postText(body: PostBody): string {
  switch (body.kind) {
    case 'linkedin':
      return [...body.paragraphs, body.hashtags.map((tag) => `#${tag}`).join(' ')].join('\n\n');
    case 'x':
      return body.posts.join('\n\n');
    case 'blog':
      return [body.headline, body.standfirst, ...body.paragraphs, body.cta].join('\n\n');
    case 'community':
      return body.paragraphs.join('\n\n');
  }
}

/** Words as a reader counts them: runs of letters or digits. Dashes and `2x2` are not two words. */
export function wordCount(text: string): number {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.$%×-]*/gu)?.length ?? 0;
}

export interface ChannelCheck {
  readonly id: string;
  readonly label: string;
  /** What was measured, as the reviewer reads it — `164 words`. */
  readonly value: string;
  readonly pass: boolean;
  /** Where the rule is written. Shown beside the check so nobody has to ask. */
  readonly source: string;
}

const PROMPTS = 'content-engine-prompts.md';

/**
 * ㉗: an awareness post carries no link — "a CTA on an awareness post is what makes it read
 * as an ad" — and consideration or intent posts carry one, stamped with `icp_hint`.
 */
function linkMatchesStage(item: ContentItem, link: PostLink | null): ChannelCheck {
  const wantsLink = STAGES_CARRYING_ICP_HINT.has(item.funnelStage);
  return {
    id: 'link-stage',
    label: wantsLink ? 'Stamped link, for a consideration post' : 'No link on an awareness post',
    value: link === null ? 'no link' : 'link attached',
    pass: wantsLink === (link !== null),
    source: 'operating model ㉗',
  };
}

function endsOnConclusion(paragraphs: readonly string[]): ChannelCheck {
  const last = paragraphs.at(-1)?.trim() ?? '';
  return {
    id: 'ends-conclusion',
    label: 'Ends on the conclusion, not a question',
    value: last.endsWith('?') ? 'ends on a question' : 'ends on a statement',
    pass: !last.endsWith('?'),
    source: `${PROMPTS} §4.1`,
  };
}

/**
 * The checks a post can be held to from its text alone, per channel.
 *
 * Judgement calls in the same prompts — "opens with the finding", "useful if Caspr did not
 * exist" — are not here. They are the reviewer's job, and dressing them as a green tick
 * would take the job away without doing it.
 */
export function channelChecks(item: ContentItem, version: PostVersion): readonly ChannelCheck[] {
  const { body } = version;

  switch (body.kind) {
    case 'linkedin': {
      const words = wordCount(body.paragraphs.join(' '));
      const personal = item.channel === 'linkedin';
      return [
        ...(personal
          ? [
              {
                id: 'words',
                label: '120–200 words',
                value: `${words} words`,
                pass: words >= 120 && words <= 200,
                source: `${PROMPTS} §4.1`,
              },
            ]
          : []),
        {
          id: 'hashtags',
          label: 'Two hashtags at most',
          value: `${body.hashtags.length} hashtag${body.hashtags.length === 1 ? '' : 's'}`,
          pass: body.hashtags.length <= 2,
          source: `${PROMPTS} §4.1`,
        },
        endsOnConclusion(body.paragraphs),
        linkMatchesStage(item, body.link),
      ];
    }

    case 'x': {
      const longest = Math.max(...body.posts.map((post) => [...post].length));
      const first = body.posts[0] ?? '';
      const bait = body.posts.some((post) => /🧵|^\s*\d+\s*\/\s*\d*/u.test(post));
      return [
        {
          id: 'chars',
          label: 'Under 260 characters, leaving room for the link',
          value: body.posts.length === 1 ? `${longest} characters` : `longest post ${longest}`,
          pass: longest < 260,
          source: `${PROMPTS} §4.2`,
        },
        {
          id: 'number-leads',
          label: 'The number leads',
          value: /\d/.test(first.slice(0, 24)) ? 'opens on a figure' : 'no figure up front',
          pass: /\d/.test(first.slice(0, 24)),
          source: `${PROMPTS} §4.2`,
        },
        {
          id: 'no-bait',
          label: 'No thread-bait, no numbered hooks',
          value: bait ? 'found' : 'none',
          pass: !bait,
          source: `${PROMPTS} §4.2`,
        },
        linkMatchesStage(item, body.link),
      ];
    }

    case 'blog': {
      const headlineWords = wordCount(body.headline);
      return [
        ...(item.type === 'analysis'
          ? [
              {
                id: 'headline',
                label: 'Headline is a conclusion, under 12 words',
                value: `${headlineWords} words`,
                pass: headlineWords < 12,
                source: `${PROMPTS} §1`,
              },
            ]
          : []),
        {
          id: 'cta',
          label: 'One CTA, at the end',
          value: body.cta.trim().endsWith('?') ? 'a question' : 'an invitation',
          pass: body.cta.trim().length > 0,
          source: `${PROMPTS} §2`,
        },
      ];
    }

    case 'community': {
      const text = body.paragraphs.join('\n\n');
      const mentions = [...text.matchAll(/\bCaspr\b/g)];
      const firstAt = mentions[0]?.index ?? null;
      return [
        {
          id: 'mentions',
          label: 'Caspr mentioned at most once',
          value: `${mentions.length} mention${mentions.length === 1 ? '' : 's'}`,
          pass: mentions.length <= 1,
          source: `${PROMPTS} §4.3`,
        },
        {
          id: 'not-first-half',
          label: 'Never in the first half',
          value:
            firstAt === null
              ? 'not mentioned'
              : `first at ${Math.round((firstAt / text.length) * 100)}% of the reply`,
          pass: firstAt === null || firstAt >= text.length / 2,
          source: `${PROMPTS} §4.3`,
        },
      ];
    }
  }
}

export interface PostReview {
  readonly checks: readonly ChannelCheck[];
  readonly lint: LintReport;
  /** Every channel check passed and nothing blocking or regenerating was found. */
  readonly clean: boolean;
}

export function reviewPost(item: ContentItem, version: PostVersion): PostReview {
  const checks = channelChecks(item, version);
  const lint = lintDeterministic(postText(version.body));
  return {
    checks,
    lint,
    clean: checks.every((check) => check.pass) && lint.findings.length === 0,
  };
}

/** The ISO week of a date, as `2026-W34`. Used as the campaign so a week's links group. */
export function isoWeekId(date: string): string {
  // ISO 8601: a week belongs to the year its Thursday falls in, and week 1 holds 4 January.
  const thursday = new Date(`${date}T00:00:00Z`);
  thursday.setUTCDate(thursday.getUTCDate() - ((thursday.getUTCDay() + 6) % 7) + 3);
  const year = thursday.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const firstThursday = Date.UTC(year, 0, 4 - ((jan4.getUTCDay() + 6) % 7) + 3);
  const week = 1 + Math.round((thursday.getTime() - firstThursday) / (7 * 86_400_000));
  return `${year}-W${String(week).padStart(2, '0')}`;
}

const UTM_SOURCE: Readonly<Record<Channel, string>> = {
  linkedin: 'linkedin',
  linkedin_page: 'linkedin',
  x: 'x',
  blog: 'caspr_blog',
  email: 'email',
  community: 'community',
  outreach: 'outreach',
};

/**
 * The attribution stamp.
 *
 * The worked example spells out why it is not a nit — `tracking-spec.md` Part 4 item 5:
 * "Without this the portal cannot attribute revenue to a channel and the RoI target is
 * unprovable." `utm_content` carries the item id so a click resolves to one post, not one
 * campaign.
 */
export function stampLink(item: ContentItem, link: PostLink): string {
  const url = new URL(link.url);
  const slot = item.scheduledFor?.slice(0, 10) ?? '1970-01-01';
  url.searchParams.set('utm_source', UTM_SOURCE[item.channel]);
  url.searchParams.set('utm_medium', 'organic');
  url.searchParams.set('utm_campaign', isoWeekId(slot).toLowerCase());
  url.searchParams.set('utm_content', item.id);
  if (item.icp !== null && STAGES_CARRYING_ICP_HINT.has(item.funnelStage)) {
    url.searchParams.set('icp_hint', item.icp);
  }
  return url.toString();
}
