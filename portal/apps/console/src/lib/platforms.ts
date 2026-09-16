import { CHANNEL_PUBLISH_MODE, personName, voiceLane, type Channel, type ContentItem } from '@caspr-portal/domain';

import { CHANNEL_WORKSTREAM } from '@/lib/workstream';

/**
 * The platforms Content & Social publishes to, in the order the board shows them.
 *
 * Derived from `CHANNEL_WORKSTREAM` so a channel moved between workstreams moves here too,
 * and ordered by operating model ㉛: LinkedIn is "the spine", so it leads; the platforms a
 * person posts to by hand follow the automated ones; our own site and the forums close.
 */
const ORDER: readonly Channel[] = [
  'linkedin',
  'linkedin_page',
  'x',
  'meta',
  'reddit',
  'quora',
  'blog',
  'community',
];

export const CONTENT_SOCIAL_CHANNELS: readonly Channel[] = ORDER.filter(
  (channel) => CHANNEL_WORKSTREAM[channel] === 'content-social',
);

/** Names as a person says them. The uppercase mono channel codes stay for labels. */
export const PLATFORM_NAME: Readonly<Record<Channel, string>> = {
  linkedin: 'LinkedIn',
  linkedin_page: 'LinkedIn Page',
  x: 'X',
  /*
   * ⚑ The channel is `meta` and the label is Instagram, and the difference is deliberate.
   *
   * `activation-framework.md` §11 names the surface `meta` because the platform is not the
   * channel — the shell is, and §9.4 has it auto-posting to Instagram and Facebook both. That
   * is the right model and it stays in the data. But this map's own job is *"names as a person
   * says them"*, and nobody says "I'll put the atom on Meta". Labelled `Meta`, the filter read
   * as a surface nobody recognised and the workstream owner asked where Instagram had gone —
   * it was there, filtering the one post on it, under a name that did not name it.
   *
   * ⚠ Instagram is the only Meta surface with anything planned or measured on it (㉛: Facebook
   * is "not a channel"). **If the Facebook mirror ever carries its own item, this label stops
   * being true** and the pill has to say Meta again.
   */
  meta: 'Instagram',
  reddit: 'Reddit',
  quora: 'Quora',
  blog: 'Blog',
  community: 'Forums',
  email: 'Email',
  outreach: 'Outreach',
};

export function isContentSocialChannel(value: string | undefined): value is Channel {
  return CONTENT_SOCIAL_CHANNELS.some((channel) => channel === value);
}

/**
 * Where a copied post is pasted — the composer, not the platform's front door.
 *
 * ⚑ Added 2026-09-16 on request: *"give me a copy paste option, also a redirection link —
 * like jaha exactly mujhe isko paste krna ho."* Four channels publish by hand
 * (`CHANNEL_PUBLISH_MODE === 'manual'`) and one releases by hand, so for five of our eight a
 * person is the transport. Copy-then-hunt-for-the-box is where that person loses the minute
 * the whole console is built to save them.
 *
 * **`url` is each platform's own generic composer, and nothing else.** Where a post needs a
 * destination this build does not hold — the Caspr Page's own slug, the subreddit chosen that
 * day, the Quora question being answered, the forum thread — the link is `null` and `where`
 * says what is missing. Guessing a URL would send someone to the wrong place with the right
 * words in their clipboard, which is worse than no link (Rule 5.5: traceable, or absent).
 */
export interface PasteTarget {
  /** The composer to open, or null when the destination is not knowable from here. */
  readonly url: string | null;
  /** Where the words go, in a person's terms. Shown whether or not there is a link. */
  readonly where: string;
}

export const PASTE_TARGET: Readonly<Record<Channel, PasteTarget>> = {
  linkedin: {
    url: 'https://www.linkedin.com/feed/?shareActive=true',
    where: 'the share box on your own LinkedIn feed',
  },
  linkedin_page: {
    url: null,
    where: 'the Caspr Page composer — no link yet, because the Page is not connected to this console',
  },
  x: { url: 'https://x.com/compose/post', where: 'the post composer on X' },
  meta: {
    url: null,
    where: 'Meta Business Suite — no link yet, because no Business Suite account is connected',
  },
  reddit: {
    url: 'https://www.reddit.com/submit',
    where: 'Reddit’s submit page — pick the subreddit on the day, from your own account',
  },
  quora: {
    url: null,
    where: 'the Quora question being answered — the link is the question’s, and no listener supplies it yet',
  },
  blog: { url: null, where: 'the CMS — ⑨ not built, so a blog post has nowhere to go by hand' },
  community: {
    url: null,
    where: 'the thread itself — a forum post only exists as a reply to one, and no listener supplies it yet',
  },
  email: { url: null, where: 'the sequence tool — Email is not built' },
  outreach: { url: null, where: 'the pitch itself — Earned Media is not built' },
};

/**
 * Which platforms, and why — operating model ㉛, "who posts what, where, when".
 *
 * Every platform someone might expect is listed, including the ones deliberately left out,
 * because "why is Facebook not here" deserves the same one-line answer as "why is Reddit".
 */
export interface PlatformRole {
  readonly name: string;
  readonly role: string;
  readonly cadence: string;
  readonly on: 'posts' | 'posts_by_hand' | 'engagement' | 'not_a_channel';
}

export const PLATFORM_REGISTER: readonly PlatformRole[] = [
  {
    name: 'LinkedIn',
    role: 'The spine. Our buyer’s working feed — founders and team, each in their own lane.',
    cadence: 'Founder posts Tue and Thu · team 3 a week',
    on: 'posts',
  },
  {
    name: 'LinkedIn Page',
    role: 'The company’s voice. Findings, charts and carousels.',
    cadence: '1 a day',
    on: 'posts',
  },
  {
    name: 'X',
    role: 'Secondary. Investors and technical readers. We publish; we do not read.',
    cadence: '2 a day',
    on: 'posts',
  },
  {
    name: 'Meta — Instagram · Facebook',
    role: 'The recall layer, not discovery. A thin shell that auto-posts the cutdowns and cards already made, so an ad leads somewhere credible. No community management.',
    cadence: '~2 cutdowns a week, once cuts exist',
    on: 'posts',
  },
  {
    name: 'Reddit',
    role: 'Highest trust, lowest tolerance. A person posts, never a brand account, never link-first.',
    cadence: '1 a day at most, rotating person and subreddit',
    on: 'posts_by_hand',
  },
  {
    name: 'Quora',
    role: 'The one that compounds — an answer ranks in search and feeds answer engines for years. ⚠ Not in the activation framework’s surface list, which calls it a demand signal rather than a channel; kept at the workstream owner’s request, 2026-09-15.',
    cadence: '5 short answers a week, each linking to our own page',
    on: 'posts_by_hand',
  },
  {
    name: 'Blog',
    role: 'Our own page. Search answers and analyses — where every other platform links.',
    cadence: '2 search answers a week',
    on: 'posts',
  },
  {
    name: 'Forums',
    role: 'Wall Street Oasis, PrepLounge, ESOMAR — where the ICP already talks shop.',
    cadence: 'Only when a real thread exists',
    on: 'posts_by_hand',
  },
  {
    name: 'Hacker News',
    role: 'Jayant, Dixit and Keshav, as themselves, on technical threads. Never the brand.',
    cadence: '2–3 a week, when relevant',
    on: 'engagement',
  },
  {
    name: 'YouTube',
    role: 'An issue’s walkthrough and its shorts — searchable for years, and cited by Google’s AI answers, which is why it feeds p. The engine writes the script and the caption; it does not make video.',
    cadence: '3–4 per issue, released by a person',
    on: 'engagement',
  },
  {
    name: 'Product Hunt · Show HN',
    role: 'One-shots, held for the peak. "We are live today, here is the link" — never "please upvote".',
    cadence: 'Once, at the peak',
    on: 'not_a_channel',
  },
  {
    name: 'TikTok',
    role: 'Out of scope. Video belongs to the DM team’s editor, not the engine.',
    cadence: '—',
    on: 'not_a_channel',
  },
];

export interface Author {
  readonly name: string;
  readonly detail: string;
  /** Initials for a square avatar — the console has no circles, only the two radii. */
  readonly mark: string;
  /** True for the company's own accounts, which wear the wordmark rather than initials. */
  readonly company: boolean;
}

/** Who the reader will see this post come from. */
export function authorOf(item: ContentItem): Author {
  if (item.voiceLane === null) {
    return {
      name: 'Caspr',
      detail: item.channel === 'blog' ? 'caspr.ai' : 'Company account',
      mark: 'C',
      company: true,
    };
  }
  const lane = voiceLane(item.voiceLane);
  const name = personName(item.voiceLane);
  return {
    name,
    detail:
      CHANNEL_PUBLISH_MODE[item.channel] === 'manual'
        ? `Posts by hand, from ${name}'s own account`
        : `${lane?.role ?? 'Team'} · Caspr`,
    mark: name.slice(0, 1).toUpperCase(),
    company: false,
  };
}
