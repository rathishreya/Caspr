import {
  AEO_STANDARD,
  KEYWORD_SHAPES,
  REFERENCE_WEEK_START,
  SITE_PAGES,
  TECHNICAL,
  AUDIENCE_LABEL,
  audienceFromCpc,
  pageHealth,
  postPage,
  siteHealth,
  type PageKind,
  type SitePage,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/icons';
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

      {/* ── THE STANDARD ───────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">What a good page looks like</h2>
          <span className="t-meta text-tertiary">THE AEO STANDARD · EVERY TEMPLATE</span>
        </div>
        <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
          Five things, on every template rather than chosen per post. Cheap at build time and expensive to
          retrofit, which is the whole argument — there is no case for leaving them out.
        </p>

        <div className="standard">
          {AEO_STANDARD.map((check) => (
            <div key={check.id} className="standard__row">
              <span className="standard__mark">
                <Icon name="close" size={14} />
              </span>
              <div>
                <p className="t-body-m">
                  {check.label}
                  {check.worth !== null && <span className="standard__worth t-meta">{check.worth}</span>}
                </p>
                <p className="t-body-s text-secondary">{check.what}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT TO WRITE NEXT ─────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">What to write next</h2>
          <span className="t-meta text-tertiary">CPC, NOT VOLUME</span>
        </div>
        <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
          <strong>$9 a click is a student. $300 is a buyer.</strong> Advertisers will not pay $300 to reach an
          undergraduate, and no volume figure tells you that — which is why the largest family in this table
          is the one that was dropped.
        </p>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta keep">Family</th>
                <th className="t-meta num">Searches</th>
                <th className="t-meta num">CPC</th>
                <th className="t-meta nowrap">Who is asking</th>
                <th className="t-meta fill">What we do about it</th>
              </tr>
            </thead>
            <tbody>
              {KEYWORD_SHAPES.map((shape) => {
                const audience = audienceFromCpc(shape.cpc);
                return (
                  <tr key={shape.id}>
                    <td className="t-body-s keep">
                      {shape.family}
                      <br />
                      <span className="t-body-s text-tertiary">{shape.example}</span>
                    </td>
                    <td className="t-body-s num">{shape.volume === 0 ? '—' : shape.volume}</td>
                    <td className={audience === 'buyer' ? 't-body-s num text-attention' : 't-body-s num'}>
                      {shape.cpc === null ? '—' : `$${shape.cpc}`}
                    </td>
                    <td className="t-meta nowrap">{shape.cpc === null ? '—' : AUDIENCE_LABEL[audience]}</td>
                    <td className="t-body-s text-secondary">
                      <span className={`tag tag--${shape.build} t-meta`}>{BUILD_LABEL[shape.build]}</span>{' '}
                      {shape.verdict}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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

const BUILD_LABEL: Readonly<Record<string, string>> = {
  yes: 'BUILD',
  one_page: 'ONE PAGE',
  dropped: 'DROPPED',
  conversion_only: 'CONVERSION ONLY',
};
