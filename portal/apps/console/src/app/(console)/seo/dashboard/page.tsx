import {
  BASELINE,
  BASELINE_TAKEN_ON,
  BASKET_STATUS,
  BASKET_TARGET,
  CATEGORY_READING,
  JOB_BASKET_TARGET,
  LEVERS,
  READINGS_BEFORE_A_THRESHOLD,
  SEO_CADENCE,
  approachProgress,
  basketFor,
  firstApproachOn,
  jobBasket,
  readClock,
  type ClockInput,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Clocks } from '@/components/seo/clocks';
import { Bar } from '@/components/primitives/tile';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'SEO — Dashboard' };

/**
 * SEO ▸ Dashboard — three kill conditions on three clocks.
 *
 * ⚑ **Rebuilt 2026-09-16.** The first version showed a basket-completeness table and called
 * it a dashboard. It was not wrong, it was the wrong screen: it answered *"how ready is the
 * instrument"* when the question this workstream is judged on is *"is the channel working,
 * and by when do we find out."*
 *
 * `portal-design-spec.md` §10 records the Figma frame being corrected to exactly this on
 * 2026-08-25, and `docs/seo/decision.md` §1 is why. **Three clocks, never a summary** — a
 * summary is the thing being corrected.
 *
 * The one fact this screen exists to make unavoidable: **the fastest clock has not started.**
 * Presence needs nothing published and reads in weeks, and zero approaches have gone out.
 */
export default async function SeoDashboard() {
  const repository = getRepository();
  const now = repository.clock();
  const approaches = await repository.approaches();
  const progress = approachProgress(approaches);

  /*
   * Two of the three clocks are stopped, and it is not an oversight.
   *
   * Citation starts when the first page publishes to the AEO standard, and ranking when the
   * first seeded page is indexed. Nothing is published, so neither has a start date — and
   * §3A.2's argument is exactly this: a DR-40 domain in month 12 is only available if the
   * work started in month 1. A clock nobody started is not "on track".
   *
   * Presence starts on the first approach sent, so it starts the moment somebody uses Tasks.
   */
  const inputs: readonly ClockInput[] = [
    {
      component: 'presence',
      startedOn: firstApproachOn(approaches),
      have: progress.included,
      of: progress.sample,
      sent: progress.approached,
    },
    { component: 'citation', startedOn: null, have: 0, of: 10 },
    { component: 'ranking', startedOn: null, have: 0, of: BASELINE.length },
  ];
  const readings = inputs.map((input) => readClock(input, now));
  const stopped = readings.filter((reading) => reading.state === 'not_started').length;

  const live = BASKET_STATUS.filter((status) => status.writeNow);
  const written = live.reduce((sum, status) => sum + jobBasket(status.icp).length, 0);

  return (
    <>
      {stopped > 0 && (
        <Link className="banner banner--link" href="/seo/tasks">
          <span className="t-meta-bold banner__headline">
            {stopped} OF 3 CLOCKS HAVE NOT STARTED
          </span>
          <span className="t-body-s banner__detail">
            Every day before a clock starts is a day that does not come back — the six-month one most of all.
            The first approach starts the fastest of them, and it needs nothing published. Open Tasks →
          </span>
        </Link>
      )}

      <Clocks readings={readings} />

      <div className="grid-2">
        <BaselinePanel />
        <CategoryPanel />
      </div>

      <LeverPanel />

      <div className="grid-2">
        <BasketPanel written={written} target={live.length * JOB_BASKET_TARGET} />
        <CadencePanel />
      </div>
    </>
  );
}

/**
 * The reading itself. `p = 0`, and it was measured rather than assumed.
 *
 * *"A pre-launch baseline is perishable. Once The Record publishes, the guerrilla campaign
 * runs and the rebuilt site goes live, there is no way back to a clean 'before.'"*
 */
function BaselinePanel() {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">The baseline</h2>
        <span className="t-meta text-tertiary">MEASURED {BASELINE_TAKEN_ON}</span>
      </div>

      <p className="baseline__figure">
        <span className="t-data-l">p = 0</span>
      </p>
      <p className="t-body-s text-secondary">
        Caspr appears in nothing. Not in a result, not in a roundup, not in an answer, on any question tested.
      </p>

      <div className="stack" style={{ marginTop: 'var(--space-4)' }}>
        {BASELINE.map((row) => (
          <div key={row.questionId} className="stack-row">
            <p className="t-body-s">
              <span className="t-meta text-tertiary">{row.questionId}</span> {row.question}
            </p>
            <p className="t-body-s text-secondary">{row.note}</p>
          </div>
        ))}
      </div>

      <p className="t-body-s text-tertiary" style={{ marginTop: 'var(--space-4)' }}>
        ⚠ A partial baseline, and labelled as one. The ranking and citation legs were measured; the
        AI-surface leg — ChatGPT, Perplexity, Gemini — was not reachable from that session. It is roughly an
        hour and it cannot be reconstructed afterwards, which is why it is the first row on Tasks.
      </p>
      <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-3)' }}>
        <strong>A zero that was measured is a different object from a zero that was
        assumed.</strong> Do not re-baseline after publishing starts — append, never overwrite.
      </p>
    </section>
  );
}

/**
 * ⚠ The finding that was not the point of the exercise.
 *
 * Both readings are carried because picking one would be picking the answer, and the question
 * that decides it is genuinely open.
 */
function CategoryPanel() {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">Who is answering the category</h2>
        <span className="t-meta text-tertiary">THE FINDING THAT WAS NOT THE POINT</span>
      </div>

      <p className="t-body-s text-secondary">
        The tools named in the answer to <em>&ldquo;best AI tool for market research&rdquo;</em> are GWI
        Spark, nexos.ai, Yabble, DoReveal, Notably, Manus, Optimo and Glimpse.{' '}
        <strong>Almost none of them do what Caspr does</strong> — they are qualitative
        synthesis, trend detection and consumer-data platforms. Manus, and essentially only Manus, generates
        a market research report.
      </p>

      <div className="reading">
        <p className="reading__label t-meta">Opportunity</p>
        <p className="t-body-s">{CATEGORY_READING.opportunity}</p>
      </div>
      <div className="reading reading--problem">
        <p className="reading__label t-meta">Problem</p>
        <p className="t-body-s">{CATEGORY_READING.problem}</p>
      </div>

      <p className="t-body-s text-tertiary" style={{ marginTop: 'var(--space-3)' }}>
        {CATEGORY_READING.unresolved}
      </p>
    </section>
  );
}

/**
 * The six levers — §3B. **Everything starts in the first fortnight.**
 *
 * The `scalesOn` column is the correction §3A made: gating the *start* of a six-month lever
 * on an eight-week test pushes results to month ten for no reason. Only the data pages have a
 * gate, and it is on scale rather than existence.
 */
function LeverPanel() {
  return (
    <section className="panel panel--wide">
      <div className="panel__title">
        <h2 className="t-title-m">The six levers</h2>
        <span className="t-meta text-tertiary">STARTING IS NOT SCALING</span>
      </div>

      <div className="levers">
        {LEVERS.map((lever) => (
          <div key={lever.id} className={lever.started ? 'lever lever--on' : 'lever'}>
            <div className="lever__head">
              <span className="t-body-m">{lever.name}</span>
              <span className={lever.started ? 'tag tag--included t-meta' : 'tag tag--identified t-meta'}>
                {lever.started ? 'Running' : 'Not started'}
              </span>
            </div>
            <p className="t-body-s text-secondary">{lever.note}</p>
            <p className="lever__gates t-meta">
              <span className="text-tertiary">STARTS</span> {lever.starts}
              {' · '}
              <span className="text-tertiary">SCALES ON</span> {lever.scalesOn}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BasketPanel({ written, target }: { readonly written: number; readonly target: number }) {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">The baskets</h2>
        <span className="t-meta text-tertiary">FROZEN FOR A YEAR · NEVER AVERAGED</span>
      </div>

      <p className="t-body-s text-secondary">
        {written} of {target} job questions written, over a shared core of 15. The remaining{' '}
        {target - written} extend these shapes across the sectors each buyer actually screens — written once,
        at basket freeze. No threshold until {READINGS_BEFORE_A_THRESHOLD} readings exist.
      </p>

      <div className="stack" style={{ marginTop: 'var(--space-4)' }}>
        {BASKET_STATUS.map((status) => (
          <div key={status.icp} className="mix-row mix-row--reason">
            <span className="mix-row__id">
              <span className="t-body-s">p_{status.icp}</span>
            </span>
            <Bar
              fraction={status.writeNow ? jobBasket(status.icp).length / JOB_BASKET_TARGET : 0}
              label={`${status.label} basket`}
            />
            <span className="t-meta mix-row__value">
              {status.writeNow ? `${basketFor(status.icp).length} / ${BASKET_TARGET}` : '—'}
            </span>
          </div>
        ))}
      </div>

      <p className="t-body-s text-tertiary" style={{ marginTop: 'var(--space-3)' }}>
        ⛔ Never averaged into one p. Visible to investors and invisible to consultants is not
        &ldquo;half visible&rdquo; — it is a specific state with a specific fix, and an average is the one
        number that hides which.
      </p>
    </section>
  );
}

function CadencePanel() {
  return (
    <section className="panel">
      <div className="panel__title">
        <h2 className="t-title-m">The week</h2>
        <span className="t-meta text-tertiary">~2.5 HOURS</span>
      </div>

      <div className="stack">
        {SEO_CADENCE.map((row) => (
          <div key={row.what} className="stack-row">
            <p className="t-body-s">
              {row.what}{' '}
              <span className={row.lapsed === true ? 't-meta text-attention' : 't-meta text-tertiary'}>
                {row.rate}
              </span>
            </p>
            <p className="t-body-s text-secondary">{row.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
