import {
  APPROACH_SAMPLE,
  ENTITY_SIGNALS,
  INCLUSION_BAR,
  LINK_ROUTES,
  SHAPE_LABEL,
  WIKIPEDIA_SHARE_OF_CHATGPT_CITATIONS,
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
 * SEO ▸ Links — where authority comes from, and who is allowed to go and get it.
 *
 * Three things, and the order is the argument.
 *
 *   THE ROUTES   four legitimate ones, and one that is never used. Paid link-building is not
 *                only a penalty risk — it is *"off-brand for a company selling
 *                defensibility"*, and a company whose position is **cited, or it does not
 *                ship** cannot buy its citations
 *   THE TARGETS  the real list, from running the basket questions. Each row moves the
 *                presence clock, and each says who can actually send it
 *   THE ENTITY   the cheapest long lever there is, and the one nobody starts because it
 *                produces no number this month
 *
 * `operations-runbook.md` §6 is the source for the routes and the monthly targets;
 * `presence-baseline-2026-08.md` §4 for the list.
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

      {/* ── THE ROUTES ─────────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Where a link can come from</h2>
          <span className="t-meta text-tertiary">FOUR ROUTES · AND ONE THAT IS NEVER USED</span>
        </div>

        <div className="routes">
          {LINK_ROUTES.map((route) => (
            <div key={route.id} className={route.forbidden === true ? 'route route--never' : 'route'}>
              <div className="route__head">
                <span className="t-body-m">
                  {route.forbidden === true && '⛔ '}
                  {route.route}
                </span>
                <span className={route.forbidden === true ? 'tag tag--declined t-meta' : 'tag t-meta'}>
                  {route.target}
                </span>
              </div>
              <p className="t-body-s text-secondary">{route.how}</p>
              <p className="t-meta text-tertiary">
                {route.owner === 'nobody'
                  ? 'Nobody — and that is the decision'
                  : route.owner === 'earned_media'
                    ? 'Earned Media — lapsed until the hire lands'
                    : route.owner === 'joy'
                      ? 'Joy'
                      : 'SEO'}
              </p>
            </div>
          ))}
        </div>

        <p className="t-body-s text-secondary" style={{ marginTop: 'var(--space-4)', maxWidth: '72ch' }}>
          <strong>Caspr&rsquo;s own output is the strongest link magnet available</strong> — a free,
          fully-cited sector report is a backlink asset, a PR asset and a live product demonstration in one
          artefact, and it costs a Study.
        </p>
      </section>

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

      {/* ── THE ENTITY ─────────────────────────────────────────────────────── */}
      <section className="panel panel--wide">
        <div className="panel__title">
          <h2 className="t-title-m">Being a thing the machines recognise</h2>
          <span className="t-meta text-tertiary">THE CHEAPEST LONG LEVER THERE IS</span>
        </div>

        <p className="t-body-s text-secondary" style={{ maxWidth: '72ch' }}>
          AI systems cite entities they recognise, and Wikipedia alone is{' '}
          <strong>~{(WIKIPEDIA_SHARE_OF_CHATGPT_CITATIONS * 100).toFixed(1)}% of ChatGPT citations</strong>.
          Caspr has no Wikidata entry, no consistent entity signals, and Organization schema nowhere. It takes
          months to establish and almost nothing to begin — which is the exact profile of a lever that never
          gets started.
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

        <p className="t-body-s text-tertiary" style={{ marginTop: 'var(--space-3)' }}>
          Earn the citations first; the page follows or it does not.
        </p>
      </section>
    </div>
  );
}
