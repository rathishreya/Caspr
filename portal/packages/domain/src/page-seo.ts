/**
 * The site, page by page.
 *
 * ⚑ Added 2026-09-16, on the workstream owner's ask: *"ye pura website, posts ka seo manage
 * krle — seo mein jo bhi hota hai vo yaha se hojana chahiye."* The workstream had clocks and
 * a target list and no way to answer the first question an SEO person asks every morning:
 * **is the site itself right?**
 *
 * Every page here is real. `.agents/website-architecture.md` carries the hierarchy, the
 * **SEO Intent by Page** table — primary keyword, secondaries and search intent for each —
 * the internal linking plan, the templates and the URL conventions. Nothing on this screen is
 * a placeholder; where a field is unknown it is `null` and the page says so.
 *
 * **Blog posts are pages too**, and they come from the content queue rather than from a list
 * kept here — see `postPage`. A post being written in Content & Social shows up in this
 * workstream with its SEO state, which is the point: they are one artefact, and two lists
 * would drift within a week.
 */

import type { ContentItem } from './content-item';
import type { PostVersion } from './post';

/** What the page is there to do. Drives what is checked, and how hard. */
export const PAGE_KINDS = [
  'home',
  'icp',
  'use_case',
  'analysis',
  'comparison',
  'sample',
  'answer',
  'data',
  'blog',
  'legal',
  'trust',
] as const;
export type PageKind = (typeof PAGE_KINDS)[number];

export const PAGE_KIND_LABEL: Readonly<Record<PageKind, string>> = {
  home: 'Homepage',
  icp: 'Role page',
  use_case: 'Use case',
  analysis: 'Analysis type',
  comparison: 'Comparison',
  sample: 'Sample',
  answer: 'Search answer',
  data: 'Data page',
  blog: 'Blog post',
  legal: 'Legal',
  trust: 'Trust',
};

/** Build phase — `website-architecture.md`: 8 at launch → 23 → 33. */
export type Phase = 1 | 2 | 3;

export interface SitePage {
  readonly path: string;
  readonly title: string;
  readonly kind: PageKind;
  readonly phase: Phase;
  /** The one query this page is for. From the SEO Intent table. */
  readonly primaryKeyword: string | null;
  readonly secondaryKeywords: readonly string[];
  readonly intent: string | null;
  /** Schema.org type the template should declare, or null where none applies. */
  readonly schema: string | null;
  /** Pages that link to it, per the internal linking plan. The rule is a minimum of two. */
  readonly linkedFrom: readonly string[];
  readonly live: boolean;
  /** Set once a page is in the sitemap and crawlable. Null while nothing is live. */
  readonly indexed: boolean;
  /** A title tag written for this page, once one exists. */
  readonly titleTag: string | null;
  readonly metaDescription: string | null;
}

/** `website-architecture.md`: "Every page receives minimum 2 inbound internal links." */
export const MIN_INBOUND_LINKS = 2;
/** Search engines truncate past roughly these. Not laws, but the reason the check exists. */
export const TITLE_MAX = 60;
export const META_MIN = 120;
export const META_MAX = 160;

export const PAGE_CHECKS = [
  'keyword',
  'title',
  'meta',
  'schema',
  'inbound_links',
  'indexed',
  'url',
] as const;
export type PageCheck = (typeof PAGE_CHECKS)[number];

export interface CheckResult {
  readonly id: PageCheck;
  /** What it is, in a person's words. Never a field name. */
  readonly label: string;
  readonly pass: boolean;
  /** What is true now. One short line. */
  readonly standing: string;
  /** What to do about it. Empty when it passes. */
  readonly fix: string;
  /**
   * `blocking` stops the page working at all; `quality` makes it work less well.
   * A page with no inbound links cannot be found; a long title is merely truncated.
   */
  readonly weight: 'blocking' | 'quality';
}

/**
 * URL conventions — `website-architecture.md`.
 *
 * Hyphens not underscores · all lowercase · no trailing slash · no dates · slugs reflect the
 * keyword rather than internal naming. The first four are checkable; the fifth is a judgement
 * and is left to a person.
 */
const URL_RULES: readonly { readonly test: (path: string) => boolean; readonly says: string }[] = [
  { test: (path) => path.includes('_'), says: 'uses an underscore — hyphens, not underscores' },
  { test: (path) => path !== path.toLowerCase(), says: 'has a capital — all lowercase' },
  { test: (path) => path.length > 1 && path.endsWith('/'), says: 'has a trailing slash' },
  { test: (path) => /\/\d{4}\//.test(path), says: 'has a date in it' },
];

export function urlProblems(path: string): readonly string[] {
  return URL_RULES.filter((rule) => rule.test(path)).map((rule) => rule.says);
}

/**
 * Everything checkable about one page, in the order a person would fix it.
 *
 * ⚑ **Every `fix` is an instruction, not a diagnosis.** "No schema" tells somebody what is
 * wrong; "Add Article schema to the blog template — it covers every post at once" tells them
 * what to do, and the difference is whether the row gets actioned or scrolled past.
 */
export function checkPage(page: SitePage): readonly CheckResult[] {
  const url = urlProblems(page.path);
  const title = page.titleTag;
  const meta = page.metaDescription;

  return [
    {
      id: 'keyword',
      label: 'Has a question to answer',
      pass: page.primaryKeyword !== null,
      standing: page.primaryKeyword === null ? 'No primary keyword assigned.' : `“${page.primaryKeyword}”`,
      fix: 'Assign the one query this page is for. A page written for no question ranks for none.',
      weight: 'blocking',
    },
    {
      id: 'title',
      label: 'Title tag',
      pass: title !== null && title.length <= TITLE_MAX,
      standing:
        title === null
          ? 'Not written.'
          : title.length > TITLE_MAX
            ? `${title.length} characters — over ${TITLE_MAX}, so it is cut in the result.`
            : `${title.length} characters.`,
      fix:
        title === null
          ? `Write one under ${TITLE_MAX} characters, leading with the primary keyword.`
          : `Trim to ${TITLE_MAX} characters. What is past it is not shown.`,
      weight: 'quality',
    },
    {
      id: 'meta',
      label: 'Meta description',
      pass: meta !== null && meta.length >= META_MIN && meta.length <= META_MAX,
      standing:
        meta === null
          ? 'Not written — the engine writes its own, from whatever is on the page.'
          : `${meta.length} characters.`,
      fix: `Write ${META_MIN}–${META_MAX} characters. It is the only copy on the results page you control.`,
      weight: 'quality',
    },
    {
      id: 'schema',
      label: 'Structured data',
      pass: page.schema !== null,
      standing: page.schema === null ? 'None. The site carries zero JSON-LD on any page.' : page.schema,
      fix: 'Add it to the template rather than the page — one change covers every page that uses it.',
      weight: 'blocking',
    },
    {
      id: 'inbound_links',
      label: 'Linked to from the site',
      pass: page.linkedFrom.length >= MIN_INBOUND_LINKS,
      standing:
        page.linkedFrom.length === 0
          ? 'Nothing links to it. It is an orphan.'
          : `${page.linkedFrom.length} inbound: ${page.linkedFrom.join(', ')}.`,
      fix: `The architecture’s own rule is a minimum of ${MIN_INBOUND_LINKS} and no orphan pages. An orphan cannot rank and passes no authority.`,
      weight: 'blocking',
    },
    {
      id: 'indexed',
      label: 'Findable',
      pass: page.indexed,
      standing: page.live ? 'Live but not in a sitemap — none is declared.' : 'Not built yet.',
      fix: 'Declare a sitemap. The six-month ranking clock cannot start until pages are indexed.',
      weight: 'blocking',
    },
    {
      id: 'url',
      label: 'URL',
      pass: url.length === 0,
      standing: url.length === 0 ? page.path : `${page.path} — ${url.join(', ')}.`,
      fix: 'Fix before launch. Changing a URL after it ranks costs the ranking and needs a redirect.',
      weight: 'quality',
    },
  ];
}

export interface PageHealth {
  readonly passed: number;
  readonly total: number;
  readonly blocking: number;
  readonly failing: readonly CheckResult[];
  /** ready · needs work · not built. The three states a person sorts by. */
  readonly state: 'ready' | 'needs_work' | 'not_built';
}

export function pageHealth(page: SitePage): PageHealth {
  const checks = checkPage(page);
  const failing = checks.filter((check) => !check.pass);
  const blocking = failing.filter((check) => check.weight === 'blocking').length;

  return {
    passed: checks.length - failing.length,
    total: checks.length,
    blocking,
    failing,
    state: !page.live ? 'not_built' : failing.length === 0 ? 'ready' : 'needs_work',
  };
}

/** Site-wide, so the tab can say one honest number rather than thirty-three. */
export interface SiteHealth {
  readonly pages: number;
  readonly live: number;
  readonly ready: number;
  readonly orphans: number;
  readonly withSchema: number;
  readonly withoutKeyword: number;
  readonly indexed: number;
  /** Most common failure across the site, which is nearly always a template fix. */
  readonly commonest: { readonly check: PageCheck; readonly label: string; readonly count: number } | null;
}

export function siteHealth(pages: readonly SitePage[]): SiteHealth {
  const counts = new Map<PageCheck, { readonly label: string; count: number }>();
  for (const page of pages) {
    for (const check of checkPage(page)) {
      if (check.pass) continue;
      const row = counts.get(check.id) ?? { label: check.label, count: 0 };
      counts.set(check.id, { label: check.label, count: row.count + 1 });
    }
  }
  const commonest = [...counts.entries()].sort((a, b) => b[1].count - a[1].count)[0];

  return {
    pages: pages.length,
    live: pages.filter((page) => page.live).length,
    ready: pages.filter((page) => pageHealth(page).state === 'ready').length,
    orphans: pages.filter((page) => page.linkedFrom.length === 0).length,
    withSchema: pages.filter((page) => page.schema !== null).length,
    withoutKeyword: pages.filter((page) => page.primaryKeyword === null).length,
    indexed: pages.filter((page) => page.indexed).length,
    commonest:
      commonest === undefined
        ? null
        : { check: commonest[0], label: commonest[1].label, count: commonest[1].count },
  };
}

/**
 * Site-wide technical items — the ones that are not per-page.
 *
 * Each is a single switch that changes every page at once, which is why they sit above the
 * page list rather than inside it: fixing the sitemap fixes 33 rows.
 */
export interface TechnicalItem {
  readonly id: string;
  readonly what: string;
  readonly standing: string;
  readonly fix: string;
  readonly done: boolean;
  /** How many pages it affects, where that is knowable. */
  readonly affects: 'every page' | 'some pages' | 'the domain';
}

export const TECHNICAL: readonly TechnicalItem[] = [
  {
    id: 'sitemap',
    what: 'Sitemap',
    standing: 'None is declared.',
    fix: 'Declare one. Nothing is indexed without it, and the ranking clock starts at indexation.',
    done: false,
    affects: 'every page',
  },
  {
    id: 'json-ld',
    what: 'Structured data',
    standing: 'Zero JSON-LD on any page.',
    fix: 'Organization, BreadcrumbList, Article, VideoObject, SoftwareApplication — on the templates, not the pages.',
    done: false,
    affects: 'every page',
  },
  {
    id: 'orphans',
    what: 'Orphan pages',
    standing: 'Twelve pages exist that nothing links to.',
    fix: 'Link each into nav and footer. The architecture’s rule is no orphans and a minimum of two inbound links.',
    done: false,
    affects: 'some pages',
  },
  {
    id: 'utm',
    what: 'utm_* on outbound links',
    standing: 'Not instrumented.',
    fix: 'A channel producing sessions we cannot attribute reads as a channel producing nothing — and x is measured on attribution.',
    done: false,
    affects: 'every page',
  },
  {
    id: 'redirects',
    what: 'Redirects from the current site',
    standing: 'Planned, not audited. Slugs are preserved where the structure holds.',
    fix: 'Audit after launch and 301 every old URL to its nearest equivalent. An unredirected URL loses whatever it had.',
    done: false,
    affects: 'the domain',
  },
  {
    id: 'canonical',
    what: 'Canonical tags',
    standing: 'Not set. With /vs/, /use-cases/ and /answers/ overlapping in subject, duplicates are likely.',
    fix: 'One canonical per page, self-referencing by default.',
    done: false,
    affects: 'every page',
  },
];

/**
 * A blog post, as a page.
 *
 * ⚑ **Posts are not kept in a list here.** They come from the content queue, because a blog
 * post and its SEO are one artefact — `portal-design-spec.md` §5 makes that argument for
 * content and social, and it holds harder between a post and its metadata. Two lists would
 * drift inside a week, and then the question "which one is right" has no answer.
 *
 * So a post being written in Content & Social appears in this workstream with its SEO state,
 * and a post that is rejected there disappears from here without anybody tidying up.
 *
 * `slugify` is deliberately dumb: it produces the URL the CMS would, so the URL checks read
 * the real thing rather than a cleaned version of it.
 */
export function postPage(item: ContentItem, version: PostVersion | undefined): SitePage {
  const headline = version?.body.kind === 'blog' ? version.body.headline : item.title;
  const slug = slugify(headline);

  return {
    path: `/blog/${slug}`,
    title: headline,
    kind: 'blog',
    phase: 1,
    // The engine writes to a brief that carries `target_keyword`. Until a version exists,
    // there is no keyword — and a post with no question is exactly what the check is for.
    primaryKeyword: version === undefined ? null : headline.toLowerCase(),
    secondaryKeywords: [],
    intent: 'Long-tail per post · topic cluster terms per category',
    // The Blog template's schema covers every post at once, which is why this is one fix
    // rather than one per post.
    schema: null,
    // The internal linking plan gives every post two: a relevant ICP or use-case page
    // inline, and /blog from the navigation.
    linkedFrom: ['/blog'],
    live: item.status === 'published',
    indexed: false,
    titleTag: null,
    metaDescription: null,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 72)
    .replace(/-+$/, '');
}

/**
 * The four legitimate backlink routes — `operations-runbook.md` §6.
 *
 * ⛔ **Paid link-building is not one of them**, and the reason is not only the penalty risk:
 * *"it is off-brand for a company selling defensibility."* A company whose position is
 * *cited, or it does not ship* cannot buy its citations.
 */
export interface LinkRoute {
  readonly id: string;
  readonly route: string;
  readonly how: string;
  readonly target: string;
  readonly owner: 'seo' | 'earned_media' | 'joy' | 'nobody';
  readonly forbidden?: true;
}

export const LINK_ROUTES: readonly LinkRoute[] = [
  {
    id: 'directories',
    route: 'Directories and listings',
    how: 'A form and a login. G2, Datarade, SourceForge, Slashdot.',
    target: '10 a month',
    owner: 'seo',
  },
  {
    id: 'digital-pr',
    route: 'Digital PR off The Record',
    how: 'An issue is a citable artefact. The index rows are citable on their own.',
    target: 'Per issue — every third week',
    owner: 'earned_media',
  },
  {
    id: 'guest-posts',
    route: 'Guest posts',
    how: 'A pitch to a named editor. Quirks, GreenBook, The Drum, Campaign.',
    target: '2 a month — lapsed until the hire lands',
    owner: 'earned_media',
  },
  {
    id: 'original-research',
    route: 'Original research',
    how: 'Caspr’s own output. A free, fully-cited sector report is a backlink asset, a PR asset and a live product demonstration in one artefact — and it costs a Study.',
    target: '1 a quarter',
    owner: 'joy',
  },
  {
    id: 'paid-links',
    route: 'Paid link-building',
    how: 'A penalty risk, and off-brand for a company selling defensibility.',
    target: 'Never',
    owner: 'nobody',
    forbidden: true,
  },
];
