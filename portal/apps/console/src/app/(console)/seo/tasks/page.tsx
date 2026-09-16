import {
  APPROACH_SAMPLE,
  INCLUSION_BAR,
  SEO_TASKS_PER_WEEK,
  approachProgress,
  nextApproaches,
  openTasks,
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
 * ⚑ **Slimmed twice on 2026-09-16.** The target list moved to Links; then the cadence table
 * and the T4 panel came out at the owner's request. Both were reference on a queue — the
 * week's shape does not change from one visit to the next, and the test does not read until
 * there are a thousand sessions. **Neither moved as a rule**: the cadence is still on the
 * Dashboard, where a person reads it once, and `readConversionTest` still holds the bar.
 *
 * What is left is a queue: what is open, what is debt, what is closed.
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
    </div>
  );
}
