import {
  APPROACH_SAMPLE,
  INCLUSION_BAR,
  SHAPE_LABEL,
  approachProgress,
  lapsedApproaches,
  nextApproaches,
} from '@caspr-portal/domain';
import type { Metadata } from 'next';

import { Icon } from '@/components/icons';
import { State } from '@/components/primitives/state';
import { Tile } from '@/components/primitives/tile';
import { ApproachRow } from '@/components/seo/approach-row';
import { getRepository } from '@/lib/repository';

export const metadata: Metadata = { title: 'SEO — Links' };

/**
 * SEO ▸ Links — the target list, and who can actually send each one.
 *
 * Every row came from running the basket questions and writing down who was there
 * (`presence-baseline-2026-08.md` §4), not from a keyword pull. Each one sent moves the
 * presence clock, which is the fastest of the three and needs nothing published.
 *
 * ⚑ **Two panels were removed 2026-09-16**, at the workstream owner's request — the four
 * link routes and the entity-signal list. Both were reference: true, unchanging, and read
 * once. **Neither rule moved.** `LINK_ROUTES` still marks paid link-building as never used,
 * `ENTITY_SIGNALS` still marks a self-authored Wikipedia page as forbidden, and the domain
 * tests still hold both. What is gone is a person having to scroll past them to reach the
 * work.
 */
export default async function SeoLinks() {
  const repository = getRepository();
  const approaches = await repository.approaches();
  const progress = approachProgress(approaches);
  const next = nextApproaches(approaches);
  const lapsed = lapsedApproaches(approaches);
  const inFlight = approaches.filter((row) => row.state === 'approached');
  const landed = approaches.filter((row) => ['included', 'declined', 'no_reply'].includes(row.state));
  const notARoute = approaches.filter(
    (row) => row.state === 'identified' && (row.shape === 'competitor' || row.shape === 'skip'),
  );

  return (
    <div className="board">
      <p className="lede t-body-m">
        Authority is the multiplier on every other search play, and it is the one thing that cannot be built
        in a hurry. Everything here is a conversation or a form — never a purchase.
      </p>

      <div className="tiles">
        <Tile
          label="APPROACHES SENT"
          value={`${progress.approached} / ${APPROACH_SAMPLE}`}
          attention={progress.approached === 0}
          note="The presence kill condition does not read until 25 have gone out. Each one sent starts the fastest clock we have."
        />
        <Tile
          label="INCLUSIONS"
          value={`${progress.included} / ${INCLUSION_BAR}`}
          attention={progress.included < INCLUSION_BAR}
          note="Under 3 after 25 approaches and presence is killed. Inclusion is the outcome — there is nothing to wait for after it."
        />
        <Tile
          label="READY TO SEND"
          value={String(next.length)}
          note="Forms and threads SEO can action today, without waiting for anyone."
        />
        <Tile
          label="WAITING ON A HIRE"
          value={String(lapsed.length)}
          attention={lapsed.length > 0}
          note="Editorial pitches. A form is a form; converting an editor is a relationship, and that seat is empty."
        />
      </div>

      {/* ── THE TARGETS ────────────────────────────────────────────────────── */}
      <section id="targets" className="board-part" aria-labelledby="targets-heading">
        <h2 id="targets-heading" className="board-part__title">
          The target list <span className="board-count t-meta">{approaches.length}</span>
        </h2>
        <p className="board-part__lede t-body-m">
          Not a keyword pull. Running the basket questions produced this list directly — these are the
          domains that actually own the answers today.
        </p>

        <div className="board-head">
          <h3 className="t-title-m">
            Send today <span className="board-count t-meta">{next.length}</span>
          </h3>
          <span className="board-hint t-body-s">Forms and threads. Nothing has to be published first.</span>
        </div>

        {next.length === 0 ? (
          <State
            kind="empty"
            headline="Everything actionable has been sent."
            consequence={`${progress.approached} of ${APPROACH_SAMPLE}. The list refills from the next basket questions run.`}
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
              &ldquo;No reply&rdquo; counts toward the sample exactly as a decline does — the denominator is
              approaches made, not answers received.
            </span>
          </div>
          <div className="targets">
            {inFlight.map((approach) => (
              <ApproachRow key={approach.id} approach={approach} />
            ))}
          </div>
        </section>
      )}

      {lapsed.length > 0 && (
        <section aria-labelledby="lapsed-heading">
          <div className="board-head">
            <h3 id="lapsed-heading" className="t-title-m">
              Nobody can send these <span className="board-count t-meta">{lapsed.length}</span>
            </h3>
            <span className="board-hint t-body-s">
              {lapsed.some((row) => row.priority === true)
                ? 'Editorial pitches — and the best target on the whole list is one of them.'
                : 'Editorial pitches, waiting on the earned-media hire.'}
            </span>
          </div>
          <div className="targets">
            {lapsed.map((approach) => (
              <ApproachRow key={approach.id} approach={approach} />
            ))}
          </div>
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

      {notARoute.length > 0 && (
        <details className="register">
          <summary className="register__summary t-body-s">
            {notARoute.length} found and deliberately not pursued
            <Icon name="chevron-down" size={14} className="register__chevron" />
          </summary>
          <div className="stack">
            {notARoute.map((row) => (
              <div key={row.id} className="stack-row">
                <p className="t-body-s">
                  {row.domain} <span className="t-meta text-tertiary">{SHAPE_LABEL[row.shape]}</span>
                </p>
                <p className="t-body-s text-secondary">{row.why}</p>
              </div>
            ))}
          </div>
        </details>
      )}

    </div>
  );
}
