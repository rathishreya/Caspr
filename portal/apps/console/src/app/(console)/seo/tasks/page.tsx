import {
  APPROACH_SAMPLE,
  CONVERSION_TEST,
  DATA_PAGE_SEED,
  DISAGREEMENT_HYPOTHESIS,
  INCLUSION_BAR,
  SEO_CADENCE,
  SEO_TASKS_PER_WEEK,
  approachProgress,
  nextApproaches,
  openTasks,
  readConversionTest,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';
import { TaskRow } from '@/components/seo/task-row';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'SEO — Tasks' };

/**
 * SEO ▸ Tasks — what to do today.
 *
 * ⚑ **Slimmed 2026-09-16.** The target list moved to Links, where the routes that explain it
 * are. What is left is the week: three tasks, the cadence they sit inside, and the one test
 * that decides whether the data pages become a channel.
 *
 * Every task says **which clock it moves**. With three clocks on three horizons, a week of
 * three tasks all on one component is a week that moved one and let two stand still, and that
 * is the easiest mistake here to make without noticing.
 */
export default async function SeoTasks() {
  const repository = getRepository();
  const [tasks, approaches] = await Promise.all([repository.seoTasks(), repository.approaches()]);

  const open = openTasks(tasks);
  const done = tasks.filter((task) => task.done);
  const progress = approachProgress(approaches);
  const toSend = nextApproaches(approaches).length;
  const conversion = readConversionTest(0, 0);

  const debt = open.filter((task) => task.debt === true);
  const rest = open.filter((task) => task.debt !== true);

  return (
    <div className="board">
      <p className="board-status t-meta">
        <span>{open.length} open</span>
        <span>{SEO_TASKS_PER_WEEK} a week is the budget</span>
        <span>{done.length} closed</span>
      </p>

      {toSend > 0 && (
        <Link className="banner banner--link" href="/seo/links#targets">
          <span className="t-meta-bold banner__headline">
            {toSend} APPROACHES READY TO SEND
          </span>
          <span className="t-body-s banner__detail">
            {progress.approached} of {APPROACH_SAMPLE} sent, {progress.included} of {INCLUSION_BAR} included.
            Sending one is the fastest thing anyone in this workstream can do, and it needs nothing
            published. Open Links →
          </span>
        </Link>
      )}

      {/* ── THE DEBT ───────────────────────────────────────────────────────── */}
      {debt.length > 0 && (
        <section aria-labelledby="debt-heading">
          <div className="board-head">
            <h3 id="debt-heading" className="t-title-m">
              Site debt <span className="board-count t-meta">{debt.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              Gaps that already exist. Cheap now, expensive later, and none of them produces a number this
              month — which is why they never get picked up on their own.
            </span>
          </div>
          <div className="tasks">
            {debt.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* ── THE REST ───────────────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section aria-labelledby="week-heading">
          <div className="board-head">
            <h3 id="week-heading" className="t-title-m">
              This week <span className="board-count t-meta">{rest.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              Schema, internal links, metadata. Derivative work — one to two minutes each, not eight to
              fifteen.
            </span>
          </div>
          <div className="tasks">
            {rest.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {open.length === 0 && (
        <State
          kind="empty"
          headline="Nothing open."
          consequence="Finished, not unassigned. The next three arrive with Thursday's generation."
        />
      )}

      {done.length > 0 && (
        <details className="register">
          <summary className="register__summary t-body-s">{done.length} closed</summary>
          <div className="tasks">
            {done.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </details>
      )}

      {/* ── THE WEEK, AND THE MONTH ────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">What the week looks like</h2>
          <span className="t-meta text-tertiary">~2.5 HOURS</span>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="t-meta keep">What</th>
                <th className="t-meta nowrap">How often</th>
                <th className="t-meta nowrap">Moves</th>
                <th className="t-meta fill">Note</th>
              </tr>
            </thead>
            <tbody>
              {SEO_CADENCE.map((row) => (
                <tr key={row.what}>
                  <td className="t-body-s keep">{row.what}</td>
                  <td className={row.lapsed === true ? 't-meta text-attention nowrap' : 't-meta nowrap'}>
                    {row.rate}
                  </td>
                  <td className="t-meta nowrap">{row.serves}</td>
                  <td className="t-body-s text-secondary">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── THE TEST ───────────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">The test that decides the data pages</h2>
          <span className="t-meta text-tertiary">T4</span>
        </div>

        <p className="t-body-m text-secondary" style={{ maxWidth: '72ch' }}>
          Three pages on commercial shapes, each showing the figure, every source, and the disagreement
          stated plainly. <strong>Under 1% reaching a prompt after 1,000 sessions and we do not scale</strong>{' '}
          — from {DATA_PAGE_SEED} pages to thousands. It does not mean the {DATA_PAGE_SEED} should not exist:
          the gate is on scale, not on existence.
        </p>

        <div className="reading" style={{ marginTop: 'var(--space-4)' }}>
          <p className="reading__label t-meta">What is actually being tested</p>
          <p className="t-body-s">{DISAGREEMENT_HYPOTHESIS}</p>
        </div>

        <p className="t-body-s text-tertiary" style={{ marginTop: 'var(--space-3)' }}>
          {conversion.says} Bar: {CONVERSION_TEST.bar * 100}% of{' '}
          {CONVERSION_TEST.sessions.toLocaleString('en-US')} sessions.
        </p>
      </section>
    </div>
  );
}
