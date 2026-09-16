import {
  BACKLOG_KINDS,
  BACKLOG_KIND_LABEL,
  BACKLOG_STATE_LABEL,
  CORE_BASKET,
  CONSULTANTS_BASKET,
  INVESTORS_BASKET,
  REFERENCE_BACKLOG,
  SEO_CADENCE,
  openBacklog,
  type BacklogItem,
  type BacklogKind,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { State } from '@/components/primitives/state';
import { Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'SEO — Backlog' };

/**
 * SEO ▸ Backlog — the workstream's own object.
 *
 * Three routes, and the split between them and Earned Media is one sentence from
 * `activation-framework.md` §12: **a directory submission is a form; converting an editor is
 * a relationship.** That is why a guest post is not here and a G2 listing is.
 *
 * The weekly shape is §13.2's: two search answers, ~2.5 directories, ~3.5 backlink
 * conversations. Two of the three are **manual, always** — a form is filled by a person, and
 * a conversation is had by one.
 */
export default function SeoBacklog() {
  const open = openBacklog(REFERENCE_BACKLOG);
  const done = REFERENCE_BACKLOG.filter((item) => item.state === 'live' || item.state === 'declined');
  const questions = new Map(
    [...CORE_BASKET, ...INVESTORS_BASKET, ...CONSULTANTS_BASKET].map((question) => [question.id, question.text]),
  );

  return (
    <div className="board">
      <p className="board-status t-meta">
        <span>{open.length} open</span>
        <span>{open.filter((item) => item.state === 'in_progress').length} in progress</span>
        <span>{REFERENCE_BACKLOG.filter((item) => item.state === 'live').length} live</span>
        <span className="text-tertiary">Illustrative — no backlog has been worked yet</span>
      </p>

      <div className="tiles">
        {BACKLOG_KINDS.map((kind) => {
          const cadence = SEO_CADENCE.find((row) => row.what.toLowerCase().startsWith(kind.split('_')[0] ?? ''));
          return (
            <Tile
              key={kind}
              label={BACKLOG_KIND_LABEL[kind].toUpperCase()}
              value={String(open.filter((item) => item.kind === kind).length)}
              note={
                cadence === undefined
                  ? 'Open items on this route.'
                  : `${cadence.perWeek} a week · ${cadence.mode === 'auto' ? 'publishes once approved' : 'a person does it, always'}.`
              }
            />
          );
        })}
      </div>

      {BACKLOG_KINDS.map((kind) => (
        <KindSection key={kind} kind={kind} items={open.filter((item) => item.kind === kind)} questions={questions} />
      ))}

      {done.length > 0 && (
        <section aria-labelledby="closed-heading">
          <div className="board-head">
            <h3 id="closed-heading" className="t-title-m">
              Closed <span className="board-count t-meta">{done.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              Live, or declined on purpose. A declined row keeps its reason so nobody re-proposes it in good faith.
            </span>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th className="t-meta nowrap">Route</th>
                  <th className="t-meta">What</th>
                  <th className="t-meta nowrap">State</th>
                  <th className="t-meta fill">Why</th>
                </tr>
              </thead>
              <tbody>
                {done.map((item) => (
                  <tr key={item.id}>
                    <td className="t-meta nowrap">{BACKLOG_KIND_LABEL[item.kind]}</td>
                    <td className="t-body-s">{item.title}</td>
                    <td className={item.state === 'declined' ? 't-meta text-tertiary nowrap' : 't-meta nowrap'}>
                      {BACKLOG_STATE_LABEL[item.state]}
                    </td>
                    <td className="t-body-s text-secondary">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <span className="t-meta-bold">Why a guest post is not in this backlog.</span> A directory submission
        is a form; converting an editor is a relationship. Pitches, podcasts and expert practitioners moved
        to Earned Media on 2026-09-14, and they lapse until that hire lands — which is a known cost, not an
        oversight.
      </p>
    </div>
  );
}

function KindSection({
  kind,
  items,
  questions,
}: {
  readonly kind: BacklogKind;
  readonly items: readonly BacklogItem[];
  readonly questions: ReadonlyMap<string, string>;
}) {
  return (
    <section aria-labelledby={`backlog-${kind}`}>
      <div className="board-head">
        <h3 id={`backlog-${kind}`} className="t-title-m">
          {BACKLOG_KIND_LABEL[kind]} <span className="board-count t-meta">{items.length}</span>
        </h3>
      </div>

      {items.length === 0 ? (
        <State
          kind="empty"
          headline={`Nothing open on ${BACKLOG_KIND_LABEL[kind].toLowerCase()}.`}
          consequence="Correctly empty — this route fills from the read-out's misses, and no reading has run."
        />
      ) : (
        <div className="rows">
          {items.map((item) => (
            <div key={item.id} className="row row--flat">
              <div className="row__summary row__summary--static">
                <span className="row__when t-meta">{BACKLOG_STATE_LABEL[item.state]}</span>
                <span className="row__title t-body-s">{item.title}</span>
                <span className="row__lead t-body-s text-secondary">
                  {item.questionId === null ? '—' : (questions.get(item.questionId) ?? item.questionId)}
                </span>
              </div>
              <p className="row__note t-body-s text-secondary">{item.note}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
