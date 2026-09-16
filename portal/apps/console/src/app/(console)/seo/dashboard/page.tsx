import {
  APPEARANCE_KINDS,
  APPEARANCE_LABEL,
  APPEARANCE_NOTE,
  BASKET_STATUS,
  BASKET_TARGET,
  CORE_BASKET,
  JOB_BASKET_TARGET,
  PRESENCE_SURFACES,
  READINGS_BEFORE_A_THRESHOLD,
  REFERENCE_RANKS,
  SEO_CADENCE,
  SURFACE_ACCESS,
  SURFACE_LABEL,
  basketFor,
  checksPerMonth,
  jobBasket,
  presenceVerdict,
  rankSummary,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';
import { Bar, Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'SEO — Dashboard' };

/**
 * SEO ▸ Dashboard.
 *
 * The one thing this screen must not do is show a number called `p`. There is no reading
 * yet — `presence-metric.md` §1: *"baseline today is honestly zero. Every test run on
 * 2026-08-25 found Caspr absent."* — and §5.2 sets **no threshold until three readings
 * exist**. A dashboard that filled the gap with a plausible percentage would be the exact
 * failure the metric's construction rules exist to prevent.
 *
 * So it shows what actually exists: **how ready the metric is to be read**. The basket's
 * completeness, the surfaces and how cleanly each can be read, and what stands between here
 * and reading zero.
 */
export default function SeoDashboard() {
  const readingsSoFar = 0;
  const summary = rankSummary(REFERENCE_RANKS);
  const live = BASKET_STATUS.filter((status) => status.writeNow);
  const written = live.reduce((sum, status) => sum + jobBasket(status.icp).length, 0);
  const target = live.length * JOB_BASKET_TARGET;

  return (
    <>
      <div className="banner">
        <span className="t-meta-bold banner__headline">NO READING YET — READING ZERO COMES BEFORE DAY 1</span>
        <span className="t-body-s banner__detail">
          The DataForSEO credential has to be rotated into AWS Secrets Manager before discovery or{' '}
          <em>p</em> can run at all. Every figure on this screen describes the instrument, not a measurement.
        </span>
      </div>

      <div className="tiles">
        <Tile
          label="READINGS TAKEN"
          value={`${readingsSoFar} / ${READINGS_BEFORE_A_THRESHOLD}`}
          attention
          note={presenceVerdict(readingsSoFar)}
        />
        <Tile
          label="BASKET WRITTEN"
          value={`${written} / ${target}`}
          attention={written < target}
          note={`${live.length} launch ICPs × ${JOB_BASKET_TARGET} job questions. The remaining ${target - written} extend these shapes across the sectors each buyer actually screens — written once, at basket freeze.`}
        />
        <Tile
          label="SHARED CORE"
          value={String(CORE_BASKET.length)}
          note="Asked once and counted for both launch ICPs. The core is what makes the ICPs comparable; the job basket is what makes each one actionable."
        />
        <Tile
          label="CHECKS A MONTH"
          value={String(checksPerMonth(['investors', 'consultants']))}
          note={`At today's basket. It doubles when Agencies opens in week 6, which is the point any manual fallback stops being viable.`}
        />
        <Tile
          label="READ-OUT COVERAGE"
          value={`${summary.read} / ${BASKET_TARGET}`}
          note="Rank positions read, against one ICP's full basket. Outside p, deliberately — decision 28."
        />
      </div>

      <div className="grid-2">
        <BasketPanel />
        <SurfacePanel />
        <AppearancePanel />
        <CadencePanel />
      </div>

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch', marginTop: 'var(--space-6)' }}>
        <span className="t-meta-bold">Read p against x.</span> p rising with x flat is a conversion problem,
        not a reach problem. x rising with p flat means discoverability is not earning its keep. Neither
        number answers a question on its own, which is why there are two.
      </p>
    </>
  );
}

/**
 * ⛔ **There is no aggregate row, and there is no total.** `presence-metric.md` §4.1: *"do
 * not average across ICPs […] visible to investors and invisible to consultants is not 'half
 * visible' — it is a specific state with a specific fix. An average is the one number that
 * hides which."* The table is the vector.
 */
function BasketPanel() {
  return (
    <section className="panel panel--wide">
      <div className="panel__title">
        <h2 className="t-title-m">The baskets</h2>
        <span className="t-meta text-tertiary">ONE PER ICP · FROZEN FOR A YEAR · NEVER AVERAGED</span>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="t-meta nowrap">ICP</th>
              <th className="t-meta num">Written</th>
              <th className="t-meta num">Of</th>
              <th className="t-meta">Complete</th>
              <th className="t-meta fill">Standing</th>
            </tr>
          </thead>
          <tbody>
            {BASKET_STATUS.map((status) => {
              const job = jobBasket(status.icp);
              const share = job.length / JOB_BASKET_TARGET;
              return (
                <tr key={status.icp}>
                  <td className="t-body-s nowrap">
                    p_{status.icp}
                    {status.writeNow && <span className="t-meta text-tertiary"> LAUNCH</span>}
                  </td>
                  <td className="t-body-s num">{status.writeNow ? basketFor(status.icp).length : 0}</td>
                  <td className="t-body-s num">{status.writeNow ? BASKET_TARGET : '—'}</td>
                  <td>
                    <Bar fraction={status.writeNow ? share : 0} label={`${status.label} basket`} />
                  </td>
                  <td className="t-body-s text-secondary">{status.when}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)' }}>
        Adding an ICP is 35 questions, not 50 — which is what makes widening a configuration change rather
        than a project. Agencies and Strategy stay unwritten on purpose: a basket is frozen for a year, so
        writing questions for an ICP we are not serving would freeze them against a strategy that may well
        change before we get there.
      </p>
    </section>
  );
}

function SurfacePanel() {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">The four surfaces</h2>
        <span className="t-meta text-tertiary">RECORDED SEPARATELY · NO WEIGHTING</span>
      </div>

      {PRESENCE_SURFACES.map((surface) => {
        const access = SURFACE_ACCESS[surface];
        return (
          <div key={surface} className="mix-row mix-row--reason">
            <span className="mix-row__id">
              <span className="t-body-s">{SURFACE_LABEL[surface]}</span>
            </span>
            <span className={access.grade === 'poor' ? 't-body-s text-attention' : 't-body-s text-secondary'}>
              {access.why}
            </span>
            <span className={access.grade === 'poor' ? 't-meta mix-row__value mix-row__value--over' : 't-meta mix-row__value'}>
              {access.grade.toUpperCase()}
            </span>
          </div>
        );
      })}

      <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)' }}>
        No weighting between surfaces — we have no basis for one, and an invented weight would be the first
        thing to argue about when the number is inconvenient. Two of the four have no clean programmatic
        door, which is why the observation is bought and only the definition is built.
      </p>
    </section>
  );
}

function AppearancePanel() {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">What counts as appearing</h2>
        <span className="t-meta text-tertiary">THREE WAYS · WEIGHTED EQUALLY</span>
      </div>

      {APPEARANCE_KINDS.map((kind) => (
        <div key={kind} className="stack-row">
          <p className="t-body-s">{APPEARANCE_LABEL[kind]}</p>
          <p className="t-body-s text-secondary">{APPEARANCE_NOTE[kind]}</p>
        </div>
      ))}

      <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)' }}>
        They mean the same thing to the buyer: <em>Caspr was there when I looked.</em> A mention with no
        link still counts. &ldquo;Casper&rdquo; never does — it is logged as a near-miss.
      </p>
    </section>
  );
}

function CadencePanel() {
  return (
    <section className="panel panel--wide">
      <div className="panel__title">
        <h2 className="t-title-m">What SEO puts out in a week</h2>
        <span className="t-meta text-tertiary">ACTIVATION FRAMEWORK §13.2</span>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="t-meta nowrap">What</th>
              <th className="t-meta num">Per week</th>
              <th className="t-meta">How</th>
              <th className="t-meta fill">Note</th>
            </tr>
          </thead>
          <tbody>
            {SEO_CADENCE.map((row) => (
              <tr key={row.what}>
                <td className="t-body-s nowrap">{row.what}</td>
                <td className="t-body-s num">{row.perWeek}</td>
                <td className="t-meta">{row.mode === 'auto' ? 'Auto' : 'Manual'}</td>
                <td className="t-body-s text-secondary">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <State
        kind="empty"
        headline="No search answer has published yet."
        consequence="Nothing is blocked — it is sequenced. The pages come from the misses, which is what Tasks reads."
      />
      <Link className="t-label" href="/seo/tasks">
        See what the read-out implies →
      </Link>
    </section>
  );
}
