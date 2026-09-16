import {
  CORE_BASKET,
  CONSULTANTS_BASKET,
  INVESTORS_BASKET,
  OVERVIEW_LABEL,
  PLAYS,
  REFERENCE_RANKS,
  rankOrder,
  rankPlay,
  rankSummary,
  type BasketQuestion,
  type Play,
  type RankRow,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { State } from '@/components/primitives/state';
import { Tile } from '@/components/primitives/tile';

export const metadata: Metadata = { title: 'SEO — Tasks' };

/**
 * SEO ▸ Tasks — the rank read-out, and the play each row implies.
 *
 * `activation-framework.md` §15 item 14 asks for exactly this: *"top-100 positions per
 * question, who ranks above, the Overview flag, and the play it implies."* §4 puts it a
 * second way, describing the presence engine: **misses become tasks.**
 *
 * ⚑ **The play column is derived, never typed in** (`seo.ts` → `rankPlay`). A read-out whose
 * recommendation is free text becomes a column of opinions, and then the question is whose.
 * Four inputs decide it, in a fixed order — do we have a page, does it rank, is there a
 * third-party page above us we could be listed on, did an Overview fire — and the order is
 * the argument: a missing page beats everything, and a listable roundup beats our own
 * ranking work, because that is where 6.5× of citations come from.
 */
export default function SeoTasks() {
  const rows = rankOrder(REFERENCE_RANKS);
  const summary = rankSummary(REFERENCE_RANKS);
  const questions = new Map<string, BasketQuestion>(
    [...CORE_BASKET, ...INVESTORS_BASKET, ...CONSULTANTS_BASKET].map((question) => [question.id, question]),
  );

  const groups = PLAYS.map((play) => ({
    play,
    rows: rows.filter((row) => rankPlay(row).play === play),
  })).filter((group) => group.rows.length > 0);

  return (
    <div className="board">
      <div className="banner">
        <span className="t-meta-bold banner__headline">ILLUSTRATIVE — NO RANK READING HAS RUN</span>
        <span className="t-body-s banner__detail">
          The DataForSEO credential is still to be rotated into AWS Secrets Manager. The questions are the
          frozen basket&rsquo;s own and the shape is real; the positions are not measured, and every row says so.
        </span>
      </div>

      <div className="tiles">
        <Tile label="QUESTIONS READ" value={String(summary.read)} note="Against the frozen basket, so the read-out and p agree about what is being asked." />
        <Tile
          label="NO PAGE AT ALL"
          value={String(summary.noPage)}
          attention={summary.noPage > 0}
          note="Nothing to optimise. Each becomes a search answer — two go out a week."
        />
        <Tile
          label="PAGE ONE"
          value={String(summary.pageOne)}
          note={`${summary.topThree} of them in the top three. Page two does not count for p — nobody looks.`}
        />
        <Tile
          label="AI OVERVIEWS"
          value={`${summary.overviewsOurs} / ${summary.overviewsSeen}`}
          note="Overviews that cite us, of those that fired at all. A question with no Overview is one where the ranking page still gets the click."
        />
      </div>

      {groups.length === 0 ? (
        <State
          kind="empty"
          headline="No read-out yet."
          consequence="Correctly empty. The first reading is the baseline, and it comes before Day 1 — a manual month one and an automated month two would bake a methodology change into the first delta."
        />
      ) : (
        groups.map((group) => (
          <PlaySection key={group.play} play={group.play} rows={group.rows} questions={questions} />
        ))
      )}

      <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
        <span className="t-meta-bold">Rank is outside p, deliberately.</span> Position 34 is not presence —
        nobody looks at page four. But it is the difference between &ldquo;we have no page for this&rdquo;
        and &ldquo;we have a page and it does not rank&rdquo;, which are opposite jobs. Folding rank into p
        would let a page climbing from 60 to 30 flatter a metric that should not have moved at all.
      </p>
    </div>
  );
}

const PLAY_HEADING: Readonly<Record<Play, { readonly title: string; readonly hint: string }>> = {
  the_page_does_not_rank: {
    title: 'The page exists and does not rank',
    hint: 'The closest thing to a free win in this table — the writing is done.',
  },
  get_listed: {
    title: 'Get listed on the page that outranks us',
    hint: 'A conversation, not six months of domain authority. 6.5× of citations come from third-party pages.',
  },
  write_the_page: {
    title: 'No page for this question',
    hint: 'Nothing to optimise. Each of these becomes a search answer in the backlog.',
  },
  defend: { title: 'Holding', hint: 'Nothing to do but keep the page true as the numbers behind it move.' },
  hold: { title: 'Held', hint: 'Waiting on something else.' },
};

function PlaySection({
  play,
  rows,
  questions,
}: {
  readonly play: Play;
  readonly rows: readonly RankRow[];
  readonly questions: ReadonlyMap<string, BasketQuestion>;
}) {
  const heading = PLAY_HEADING[play];

  return (
    <section aria-labelledby={`play-${play}`}>
      <div className="board-head">
        <h3 id={`play-${play}`} className="t-title-m">
          {heading.title} <span className="board-count t-meta">{rows.length}</span>
        </h3>
        <span className="board-hint t-body-s">{heading.hint}</span>
      </div>

      {/*
        The play's own sentence is the section hint above, said once. Repeating it down a
        column made eight identical cells and buried the two things that actually differ per
        row — where we sit, and who is above us. "Who ranks above" is §15 item 14's own
        wording, and it is the column somebody acts on.
      */}
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="t-meta keep">Question</th>
              <th className="t-meta num">Us</th>
              <th className="t-meta fill">Who ranks above</th>
              <th className="t-meta nowrap">Overview</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const question = questions.get(row.questionId);
              const reading = rankPlay(row);
              return (
                <tr key={row.questionId}>
                  <td className="t-body-s keep">
                    <span className="t-meta text-tertiary">{row.questionId}</span>{' '}
                    {question?.text ?? row.questionId}
                    {question?.source != null && (
                      <>
                        <br />
                        <span className="t-body-s text-tertiary">{question.source}</span>
                      </>
                    )}
                  </td>
                  <td className={row.position === null ? 't-body-s num text-tertiary' : 't-body-s num'}>
                    {row.position ?? '—'}
                  </td>
                  <td className="t-body-s text-secondary">
                    {row.above.length === 0 ? (
                      row.position === null ? (
                        'Nobody we recognise — the page one for this question is open.'
                      ) : (
                        '—'
                      )
                    ) : (
                      row.above.map((entry) => (
                        <span key={entry.domain} className="above">
                          <span className="t-meta">{entry.position}</span> {entry.domain}
                          <span className="text-tertiary"> {entry.kind}</span>
                        </span>
                      ))
                    )}
                    {reading.play === 'get_listed' && (
                      <span className="t-meta-bold above__note"> ← a page we could be on</span>
                    )}
                  </td>
                  <td className={row.overview === 'others' ? 't-meta text-attention nowrap' : 't-meta nowrap'}>
                    {OVERVIEW_LABEL[row.overview]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
