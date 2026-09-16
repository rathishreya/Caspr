import {
  AEO_STANDARD,
  AI_OVERVIEW_CLICK_LOSS,
  AI_OVERVIEW_SHARE,
  AUDIENCE_LABEL,
  CONVERSION_TEST,
  DATA_PAGE_SEED,
  DISAGREEMENT_HYPOTHESIS,
  ENTITY_SIGNALS,
  KEYWORD_SHAPES,
  REFERENCE_PAGES,
  SITE_DEBT,
  WIKIPEDIA_SHARE_OF_CHATGPT_CITATIONS,
  aeoMissing,
  audienceFromCpc,
  readConversionTest,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { Icon } from '@/components/icons';
import { Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'SEO — Backlog' };

/**
 * SEO ▸ Backlog — what is owed, and what each family is worth.
 *
 * ⚑ **Rebuilt 2026-09-16.** The first version was a to-do list with invented rows. This one
 * is four things that are all measured, and that together answer *"what should I build next,
 * and why that."*
 *
 *   THE STANDARD   five AEO checks, the thing every template is held to. Cheap at build time,
 *                  expensive to retrofit, and no downside case exists
 *   THE DEBT       five named gaps in the site. Zero JSON-LD, no sitemap, 12 orphan pages
 *   THE ENTITY     the cheapest long lever there is, and it was not previously proposed
 *   THE FAMILIES   what each keyword shape is actually worth — **by CPC, not volume**
 *
 * The last is the one that overturned the most work: eight `/alternatives/*` pages were
 * specced for ~490 US searches a month on SERPs G2 owns end to end, and the methodology
 * family — the biggest volume in the set — turned out to be students.
 */
export default function SeoBacklog() {
  const conversion = readConversionTest(0, 0);
  const debtOpen = SITE_DEBT.filter((row) => !row.done).length;
  const pagesComplete = REFERENCE_PAGES.filter((page) => aeoMissing(page).length === 0).length;

  return (
    <div className="board">
      <div className="tiles">
        <Tile
          label="SITE DEBT"
          value={`${debtOpen} / ${SITE_DEBT.length}`}
          attention={debtOpen > 0}
          note="Named, measured gaps. Each is cheap now and expensive later, and none produces a number this month."
        />
        <Tile
          label="PAGES TO THE STANDARD"
          value={`${pagesComplete} / ${REFERENCE_PAGES.length}`}
          attention={pagesComplete < REFERENCE_PAGES.length}
          note="AEO is a build standard, not a content family — every template, every time."
        />
        <Tile
          label="DATA PAGES SEEDED"
          value={`0 / ${DATA_PAGE_SEED}`}
          attention
          note="The first 40 are the test. The gate is on scale, not on existence."
        />
        <Tile
          label="THE CONVERSION TEST"
          value={`0 / ${CONVERSION_TEST.sessions.toLocaleString('en-US')}`}
          note={conversion.says}
        />
      </div>

      {/* ── THE STANDARD ───────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The AEO standard</h2>
          <span className="t-meta text-tertiary">EVERY TEMPLATE · NOT A CONTENT FAMILY</span>
        </div>

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

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)', maxWidth: '72ch' }}>
          A low-authority domain gains <strong>up to 115%</strong> from citing its
          sources — the single most relevant finding for a site with no authority. Which is also the
          uncomfortable one: {Math.round(AI_OVERVIEW_SHARE * 100)}% of searches now show an AI Overview and
          clicks fall by up to {Math.round(AI_OVERVIEW_CLICK_LOSS * 100)}%.{' '}
          <strong>We may be cited without being visited</strong> — citation is brand at
          the decision moment, and it is not traffic.
        </p>
      </section>

      {/* ── THE PAGES ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="pages-heading">
        <div className="board-head">
          <h3 id="pages-heading" className="t-title-m">
            The pages <span className="board-count t-meta">{REFERENCE_PAGES.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            Nothing is published, so every row is what the template will be held to rather than a check that
            failed.
          </span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta keep">Page</th>
                <th className="t-meta num">Meets</th>
                <th className="t-meta fill">Why it exists</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_PAGES.map((page) => (
                <tr key={page.id}>
                  <td className="t-body-s keep">
                    {page.title}
                    <br />
                    <span className="t-meta text-tertiary">{page.path}</span>
                  </td>
                  <td className="t-body-s num">
                    {page.meets.length} / {AEO_STANDARD.length}
                  </td>
                  <td className="t-body-s text-secondary">{page.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── THE FAMILIES ───────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">What each family is worth</h2>
          <span className="t-meta text-tertiary">CPC, NOT VOLUME</span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta keep">Family</th>
                <th className="t-meta num">Vol</th>
                <th className="t-meta num">KD</th>
                <th className="t-meta num">CPC</th>
                <th className="t-meta nowrap">Reads as</th>
                <th className="t-meta fill">Verdict</th>
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
                    <td className="t-body-s num">{shape.difficulty ?? '—'}</td>
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

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)', maxWidth: '72ch' }}>
          <strong>
            secondary research at $9 is a student. competitive landscape analysis at $300 is a buyer.
          </strong>{' '}
          Advertisers will not pay $300 to reach an undergraduate, and no volume figure tells you that. It is
          the cleanest available filter, and it is why the largest-volume family in the set was dropped.
        </p>
      </section>

      {/* ── THE DEBT ───────────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The site&rsquo;s debt</h2>
          <span className="t-meta text-tertiary">CHEAP NOW · EXPENSIVE LATER</span>
        </div>

        <div className="gates">
          {SITE_DEBT.map((row) => (
            <div key={row.id} className={row.done ? 'gate gate--met' : 'gate'}>
              <span className="gate__mark">
                <Icon name={row.done ? 'check' : 'close'} size={16} />
              </span>
              <div className="gate__body">
                <p className="t-title-m">{row.what}</p>
                <p className="t-body-s text-secondary">{row.standing}</p>
                <p className="t-meta text-tertiary">BLOCKS · {row.blocks}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE ENTITY ─────────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Entity establishment</h2>
          <span className="t-meta text-tertiary">THE CHEAPEST LONG LEVER THERE IS</span>
        </div>

        <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
          AI systems cite entities they recognise, and Wikipedia alone is{' '}
          <strong>~{(WIKIPEDIA_SHARE_OF_CHATGPT_CITATIONS * 100).toFixed(1)}% of
          ChatGPT citations</strong>. Caspr today has no Wikidata entry, no consistent entity signals, and
          Organization schema nowhere on the site. This takes months to establish and costs almost nothing to
          begin — which is exactly the profile of a lever that never gets started.
        </p>

        <div className="stack" style={{ marginTop: 'var(--space-4)' }}>
          {ENTITY_SIGNALS.map((signal) => (
            <div key={signal.id} className="stack-row">
              <p className={signal.forbidden === true ? 't-body-s text-attention' : 't-body-s'}>
                {signal.forbidden === true && '⛔ '}
                {signal.what}
              </p>
              <p className="t-body-s text-secondary">{signal.standing}</p>
            </div>
          ))}
        </div>

        <p className="t-body-s text-tertiary" style={{ marginTop: 'var(--space-3)', maxWidth: '72ch' }}>
          Earn the citations first; the page follows or it does not.
        </p>
      </section>

      {/* ── THE TEST ───────────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">T4 — does the disagreement convert?</h2>
          <span className="t-meta text-tertiary">THE ONE TEST THAT DECIDES THE DATA PAGES</span>
        </div>

        <p className="t-body-m text-secondary" style={{ maxWidth: '72ch' }}>
          Three pages to the AEO standard on commercial-CPC shapes — one valuation comparable, one B2B niche
          in an emerging geography, one commodity. Each shows the figure, every source, and the disagreement
          stated plainly. <strong>Kill: under 1% reaching a prompt after 1,000
          sessions</strong>, the same bar the free tool was held to.
        </p>

        <div className="reading" style={{ marginTop: 'var(--space-4)' }}>
          <p className="reading__label t-meta">The hypothesis being tested</p>
          <p className="t-body-s">{DISAGREEMENT_HYPOTHESIS}</p>
        </div>

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: '72ch' }}>
          <strong>Either answer is worth having before we build thousands of
          them.</strong> If it converts, the programmatic bet is on. If it does not, these pages are a citation
          and brand asset — worth keeping, not worth scaling — and the {DATA_PAGE_SEED} still exist, because
          the gate is on scale rather than existence.
        </p>
      </section>
    </div>
  );
}

const BUILD_LABEL: Readonly<Record<string, string>> = {
  yes: 'BUILD',
  one_page: 'ONE PAGE',
  dropped: 'DROPPED',
  conversion_only: 'CONVERSION ONLY',
};
