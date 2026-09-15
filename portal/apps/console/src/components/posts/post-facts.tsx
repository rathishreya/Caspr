import {
  CHANNEL_PUBLISH_MODE,
  personName,
  reviewPost,
  stampLink,
  zonedDate,
  zonedTime,
  zonedWeekday,
  type ContentItem,
  type PostVersion,
} from '@caspr-portal/domain';

import { Icon } from '@/components/icons';
import { PLATFORM_NAME } from '@/lib/platforms';

/**
 * What the reviewer does not have to check — and what they do.
 *
 * Design spec §5A.6 added the linter-cleared strip for one reason: "a human should never be
 * the first line of defence on whether we wrote 'leverages' — and the reviewer has no way
 * of knowing that unless the screen says so. Telling someone what they do not have to
 * check is what makes ninety seconds an instruction rather than an aspiration."
 *
 * The inverse is shown with the same weight. A check that never ran is listed as not run —
 * because a reviewer who believes the citation was fetched will not look at the citation.
 *
 * §1: this panel lives *inside* the review card on a tinted sub-surface, "so it reads as one
 * object. The shell stays nav + work area."
 */
export function PostFacts({ item, version }: { readonly item: ContentItem; readonly version: PostVersion }) {
  const review = reviewPost(item, version);
  const link = linkOf(version);
  const handPosted = CHANNEL_PUBLISH_MODE[item.channel] === 'human_only';

  return (
    <aside className="facts" aria-label="Checks and sources">
      <section className="facts__group">
        <h4 className="facts__label t-meta">Channel rules</h4>
        <ul className="facts__list">
          {review.checks.map((check) => (
            <li key={check.id} className={check.pass ? 'fact' : 'fact fact--fail'}>
              <Icon name={check.pass ? 'check' : 'close'} size={14} className="fact__glyph" />
              <span className="fact__text">
                {check.label}
                <span className="fact__value"> — {check.value}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="facts__source t-meta">{[...new Set(review.checks.map((check) => check.source))].join(' · ')}</p>
      </section>

      <section className="facts__group">
        <h4 className="facts__label t-meta">Linter</h4>
        {review.lint.findings.length === 0 ? (
          <p className="fact">
            <Icon name="check" size={14} className="fact__glyph" />
            <span className="fact__text">
              {review.lint.ran.length} deterministic rules ran, nothing found
              <span className="fact__value"> — {review.lint.ran.map((rule) => rule.id).join(' ')}</span>
            </span>
          </p>
        ) : (
          <ul className="facts__list">
            {review.lint.findings.map((finding) => (
              <li key={`${finding.rule}-${finding.index}`} className="fact fact--fail">
                <Icon name="close" size={14} className="fact__glyph" />
                <span className="fact__text">
                  {finding.rule} <q>{finding.match}</q>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="fact fact--unrun">
          <Icon name="alert" size={14} className="fact__glyph" />
          <span className="fact__text">
            Not run — {review.lint.notRun.map((rule) => rule.id).join(' ')}
            <span className="fact__value"> — citation fetch, duplication and the semantic pass need the engine</span>
          </span>
        </p>
      </section>

      <section className="facts__group">
        <h4 className="facts__label t-meta">Source</h4>
        {item.citations.map((citation) => (
          <div key={citation.url + citation.quotedClaim} className="citation">
            <p className="citation__claim">{citation.quotedClaim}</p>
            <p className="citation__meta t-meta">
              {citation.publisher} · {citation.publishedOn}
            </p>
          </div>
        ))}
        {version.researchBasis.length > 0 ? (
          <p className="facts__basis t-meta">{version.researchBasis.join(' · ')}</p>
        ) : (
          item.voiceLane !== null && (
            <p className="fact">
              {/* A satisfied gate, so it wears the same glyph as every other passed check. */}
              <Icon name="check" size={14} className="fact__glyph" />
              <span className="fact__text">
                Attributed opinion — {personName(item.voiceLane)}
                <span className="fact__value"> — the other half of the hard gate</span>
              </span>
            </p>
          )
        )}
        {item.sourceable !== 'found' && (
          <p className="fact fact--fail">
            <Icon name="alert" size={14} className="fact__glyph" />
            <span className="fact__text">
              {item.sourceable === 'thin' ? 'Sourceable, thinly' : 'No credible published source'}
              <span className="fact__value"> — fact_lookup probe</span>
            </span>
          </p>
        )}
      </section>

      {link !== null && (
        <section className="facts__group">
          <h4 className="facts__label t-meta">Link, as stamped</h4>
          <p className="facts__stamp">{stampLink(item, link)}</p>
        </section>
      )}

      <section className="facts__group">
        <h4 className="facts__label t-meta">After approval</h4>
        <p className="facts__next">
          {handPosted
            ? `Surfaced to ${personName(item.voiceLane)} on ${slotLabel(item)} to post by hand. It is never posted automatically.`
            : `Hygiene pass, then ${PLATFORM_NAME[item.channel]} at ${slotLabel(item)}.`}
        </p>
      </section>
    </aside>
  );
}

function linkOf(version: PostVersion) {
  const { body } = version;
  return body.kind === 'linkedin' || body.kind === 'x' ? body.link : null;
}

/** `TUE 18 · 09:00`, in the console's zone. */
export function slotLabel(item: ContentItem): string {
  if (item.scheduledFor === null) return 'no slot yet';
  const day = Number(zonedDate(item.scheduledFor).slice(8, 10));
  return `${zonedWeekday(item.scheduledFor)} ${day} · ${zonedTime(item.scheduledFor)}`;
}
