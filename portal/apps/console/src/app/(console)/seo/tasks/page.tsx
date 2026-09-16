import {
  APPROACH_SAMPLE,
  DIRECTORIES_PER_MONTH,
  INCLUSION_BAR,
  SEO_TASKS_PER_WEEK,
  approachProgress,
  lapsedApproaches,
  nextApproaches,
  openTasks,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';
import Link from 'next/link';

import { State } from '@/components/primitives/state';
import { ApproachRow } from '@/components/seo/approach-row';
import { TaskRow } from '@/components/seo/task-row';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'SEO — Tasks' };

/**
 * SEO ▸ Tasks — the week, and it is the only screen here that writes.
 *
 * ⚑ **Rebuilt 2026-09-16**, on the workstream owner's objection: *"yaha pe sb read only hai"*
 * — everything was read-only, and a workstream you cannot act on is a report.
 *
 * Two kinds of work, and they are separated because they move different clocks on different
 * horizons:
 *
 *   APPROACHES  the target list. Each one sent moves the presence clock, which reads in weeks
 *               and needs nothing published. **This is the fastest thing anybody in this
 *               workstream can do**, and until today the console had no way to record it
 *   TASKS       three a week — schema, internal links, metadata. Derivative work at 1–2
 *               minutes each. Most of the open list is site debt, which is cheap now and
 *               expensive later
 *
 * Both write through `advanceApproach` and `completeSeoTask`, and both are gated on the
 * Reviewer role. Neither is a review decision: the person has already done the work, and the
 * console records the outcome so a clock can be read.
 */
export default async function SeoTasks() {
  const repository = getRepository();
  const [approaches, tasks] = await Promise.all([repository.approaches(), repository.seoTasks()]);

  const progress = approachProgress(approaches);
  const next = nextApproaches(approaches);
  const inFlight = approaches.filter((row) => row.state === 'approached');
  const landed = approaches.filter((row) => ['included', 'declined', 'no_reply'].includes(row.state));
  const lapsed = lapsedApproaches(approaches);
  const priorityLapsed = lapsed.some((row) => row.priority === true);
  const open = openTasks(tasks);
  const done = tasks.filter((task) => task.done);

  return (
    <div className="board">
      <p className="board-status t-meta">
        <span>{progress.approached} of {APPROACH_SAMPLE} approaches</span>
        <span className={progress.included < INCLUSION_BAR ? 'text-attention' : undefined}>
          {progress.included} of {INCLUSION_BAR} inclusions
        </span>
        <span>{open.length} open tasks</span>
        {progress.lapsed > 0 && <span className="text-tertiary">{progress.lapsed} lapsed — no owner</span>}
      </p>

      {/* ── APPROACHES ─────────────────────────────────────────────────────── */}
      <section id="approaches" aria-labelledby="approach-heading">
        <div className="board-head">
          <h3 id="approach-heading" className="t-title-m">
            Send an approach <span className="board-count t-meta">{next.length}</span>
          </h3>
          <span className="board-hint t-body-s">
            The fastest thing this workstream can do, and it needs nothing published. {DIRECTORIES_PER_MONTH}{' '}
            directory submissions a month is already the runbook target.
          </span>
        </div>

        {next.length === 0 ? (
          <State
            kind="empty"
            headline="Every actionable target has been approached."
            consequence={`${progress.approached} of ${APPROACH_SAMPLE}. The presence kill condition does not read until 25 have gone out, so the list refills from the next basket questions run.`}
          />
        ) : (
          <div className="targets">
            {next.map((approach) => (
              <ApproachRow key={approach.id} approach={approach} />
            ))}
          </div>
        )}
      </section>

      {inFlight.length > 0 && (
        <section aria-labelledby="flight-heading">
          <div className="board-head">
            <h3 id="flight-heading" className="t-title-m">
              Sent, waiting <span className="board-count t-meta">{inFlight.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              Log how each one landed. &ldquo;No reply&rdquo; counts toward the sample exactly as a decline
              does — the denominator is approaches made, not answers received.
            </span>
          </div>
          <div className="targets">
            {inFlight.map((approach) => (
              <ApproachRow key={approach.id} approach={approach} />
            ))}
          </div>
        </section>
      )}

      {/* ── TASKS ──────────────────────────────────────────────────────────── */}
      <section id="tasks" className="board-part" aria-labelledby="task-heading">
        <h2 id="task-heading" className="board-part__title">
          This week&rsquo;s tasks
        </h2>
        <p className="board-part__lede t-body-m">
          {SEO_TASKS_PER_WEEK} a week — schema, internal links, metadata. Most of what is open is site debt:
          cheap now, expensive later, and none of it produces a number this month. Each says which clock it
          moves, because three tasks on one component is a week that let two clocks stand still.
        </p>

        {open.length === 0 ? (
          <State
            kind="empty"
            headline="Nothing open."
            consequence="Finished, not unassigned. The next three arrive with Thursday's generation."
          />
        ) : (
          <div className="tasks">
            {open.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}

        {done.length > 0 && (
          <details className="register">
            <summary className="register__summary t-body-s">{done.length} closed this week</summary>
            <div className="tasks">
              {done.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </details>
        )}
      </section>

      {/* ── LAPSED ─────────────────────────────────────────────────────────── */}
      {lapsed.length > 0 && (
        <section aria-labelledby="lapsed-heading">
          <div className="board-head">
            <h3 id="lapsed-heading" className="t-title-m">
              Lapsed — nobody can do these <span className="board-count t-meta">{lapsed.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              {priorityLapsed
                ? 'Editorial pitches, waiting on the earned-media hire — and the best target on the whole list is one of them.'
                : 'Editorial pitches, waiting on the earned-media hire. A decision, not a discovery.'}
            </span>
          </div>
          <div className="targets">
            {lapsed.map((approach) => (
              <ApproachRow key={approach.id} approach={approach} />
            ))}
          </div>
          <p className="t-body-s text-secondary" style={{ maxWidth: '72ch', marginTop: 'var(--space-3)' }}>
            <strong>Why these are not SEO&rsquo;s.</strong> A directory submission is a
            form; converting an editor at The Drum is a relationship, and the current practitioner is
            tactical. The hire lands in 8–12 weeks and these accumulate for them. A weak candidate calls all
            four shapes &ldquo;outreach&rdquo;; a good one separates them — G2 and Datarade are a form and a
            login, cybernews is a pitch to a named editor, and searchfunder is a forum thread where the only
            honest move is to become a real participant first.
          </p>
        </section>
      )}

      {landed.length > 0 && (
        <section aria-labelledby="landed-heading">
          <div className="board-head">
            <h3 id="landed-heading" className="t-title-m">
              Landed <span className="board-count t-meta">{landed.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              {progress.included} included · {progress.declined} declined · {progress.noReply} no reply.
            </span>
          </div>
          <div className="targets">
            {landed.map((approach) => (
              <ApproachRow key={approach.id} approach={approach} />
            ))}
          </div>
        </section>
      )}

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        Every approach here came out of running the basket questions and writing down who was actually
        there — not out of a keyword pull.{' '}
        <Link className="t-label" href="/seo/backlog">
          What is owed, and what each family is worth →
        </Link>
      </p>
    </div>
  );
}
