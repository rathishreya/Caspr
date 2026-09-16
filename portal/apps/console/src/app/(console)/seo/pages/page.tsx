import {
  REFERENCE_WEEK_START,
  SITE_PAGES,
  TECHNICAL,
  pageHealth,
  postPage,
  siteHealth,
  type PageKind,
  type SitePage,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';

import { PageRow } from '@/components/seo/page-row';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'SEO — Pages' };

interface PageProps {
  readonly searchParams: Promise<{ show?: string }>;
}

/**
 * SEO ▸ Pages — the whole site, and every post.
 *
 * ⚑ Added 2026-09-16: *"ye pura website, posts ka seo manage krle."* This is the screen an
 * SEO person opens first, and the workstream did not have it.
 *
 * ⚑ **The AEO standard and the keyword families were removed from this screen 2026-09-16**,
 * at the workstream owner's request. Both were documents on a work surface: five checks a
 * template is held to, and a table of what each family is worth, neither of which changes
 * from one visit to the next. **The rules are unchanged and still enforced** — `aeo.ts` and
 * the families still govern what is built, and the domain tests still hold them. What is
 * gone is the recital.
 *
 * Two things make it readable rather than a wall of 36 rows:
 *
 *  1. **The site-wide fixes sit above the list.** Six of them change every page at once — a
 *     sitemap, the schema, the canonicals — so they are worth more than any row below and
 *     are not buried inside one.
 *  2. **Pages are grouped by what they are for**, and each group says so in a line. A person
 *     looking for the comparison pages should not have to read the role pages first.
 *
 * Posts come from the content queue rather than a list kept here, because a post and its SEO
 * are one artefact. A post rejected in Content & Social disappears from this screen without
 * anybody tidying up.
 */
export default async function SeoPages({ searchParams }: PageProps) {
  const { show } = await searchParams;
  const repository = getRepository();
  const [items, versions] = await Promise.all([
    repository.itemsForWeek(REFERENCE_WEEK_START),
    repository.versionsForWeek(REFERENCE_WEEK_START),
  ]);

  const posts = items
    .filter((item) => item.channel === 'blog')
    .map((item) => postPage(item, versions.get(item.id)));
  const all: readonly SitePage[] = [...SITE_PAGES, ...posts];
  const health = siteHealth(all);

  const needsWork = all.filter((page) => pageHealth(page).failing.length > 0);
  const ready = all.filter((page) => pageHealth(page).failing.length === 0);
  const filter = show === 'ready' ? 'ready' : show === 'all' ? 'all' : 'needs_work';
  const visible = filter === 'ready' ? ready : filter === 'all' ? all : needsWork;

  const openTechnical = TECHNICAL.filter((item) => !item.done);

  return (
    <div className="board">
      <p className="lede t-body-m">
        Every page on caspr.ai and every post in the queue, with what is wrong and what to do about it.
        Nothing is live yet, so most of this is what to get right before it is.
      </p>

      {/* ── FIX ONCE, FIXES EVERYTHING ─────────────────────────────────────── */}
      <section aria-labelledby="site-heading">
        <div className="board-head">
          <h3 id="site-heading" className="t-title-m">
            Fix these once <span className="board-count t-meta">{openTechnical.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            Each one changes every page at once. They are worth more than anything in the list below.
          </span>
        </div>

        <div className="site-fixes">
          {openTechnical.map((item) => (
            <div key={item.id} className="site-fix">
              <div className="site-fix__head">
                <span className="t-body-m">{item.what}</span>
                <span className="t-meta text-tertiary">{item.affects}</span>
              </div>
              <p className="t-body-s text-secondary">{item.standing}</p>
              <p className="t-body-s">{item.fix}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PAGES ──────────────────────────────────────────────────────── */}
      <section className="board-part" aria-labelledby="pages-heading">
        <h2 id="pages-heading" className="board-part__title">
          The site <span className="board-count t-meta">{all.length}</span>
        </h2>
        <p className="board-part__lede t-body-m">
          {health.commonest !== null && (
            <>
              The commonest gap is <strong>{health.commonest.label.toLowerCase()}</strong>, on{' '}
              {health.commonest.count} of {health.pages} pages — which usually means one template fix rather
              than {health.commonest.count} page fixes.{' '}
            </>
          )}
          {posts.length > 0 && `${posts.length} of these are posts, read from the content queue.`}
        </p>

        <nav className="pills" aria-label="Filter pages">
          <Filter id="needs_work" active={filter} label="Needs work" count={needsWork.length} />
          <Filter id="ready" active={filter} label="Ready" count={ready.length} />
          <Filter id="all" active={filter} label="All" count={all.length} />
        </nav>

        {GROUPS.map((group) => {
          const rows = visible.filter((page) => group.kinds.includes(page.kind));
          if (rows.length === 0) return null;
          return (
            <div key={group.id} className="page-group">
              <div className="page-group__head">
                <h4 className="t-body-m">
                  {group.title} <span className="t-meta text-tertiary">{rows.length}</span>
                </h4>
                <p className="t-body-s text-secondary">{group.why}</p>
              </div>
              <div className="pages">
                {rows.map((page) => (
                  <PageRow key={page.path} page={page} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Filter({
  id,
  active,
  label,
  count,
}: {
  readonly id: string;
  readonly active: string;
  readonly label: string;
  readonly count: number;
}) {
  return (
    <Link
      className="pill"
      href={`/seo/pages?show=${id}` as Route}
      aria-current={active === id ? 'true' : undefined}
    >
      {label} <span className="pill__count">{count}</span>
    </Link>
  );
}

/**
 * Pages grouped by the job they do, with the line that says why the group exists.
 *
 * Ordered by how much a person cares: what converts, then what is found, then what is
 * required. Legal pages are last because nobody optimises them and nobody should.
 */
const GROUPS: readonly { readonly id: string; readonly title: string; readonly why: string; readonly kinds: readonly PageKind[] }[] = [
  {
    id: 'core',
    title: 'Core',
    why: 'The homepage, pricing and the conversion assets. Every other page points here.',
    kinds: ['home', 'analysis', 'sample'],
  },
  {
    id: 'roles',
    title: 'Role pages',
    why: 'ICP self-selection from the homepage. Awareness, and the page a buyer recognises themselves on.',
    kinds: ['icp'],
  },
  {
    id: 'jobs',
    title: 'Use cases',
    why: 'The job, never the category — nobody searches “analytical AI”.',
    kinds: ['use_case'],
  },
  {
    id: 'comparison',
    title: 'Comparisons',
    why: 'The highest-intent traffic on the site. Honest, including where Caspr does not win.',
    kinds: ['comparison'],
  },
  {
    id: 'answers',
    title: 'Search answers and data',
    why: 'Two answers a week, and the data pages that are the conversion test. Where every other surface links.',
    kinds: ['answer', 'data'],
  },
  {
    id: 'posts',
    title: 'Blog',
    why: 'Read from the content queue. A post and its SEO are one artefact, so there is no second list.',
    kinds: ['blog'],
  },
  {
    id: 'trust',
    title: 'Trust and legal',
    why: 'Security is a product page, not a legal document — which is why it is linked from every ICP page.',
    kinds: ['trust', 'legal'],
  },
];

