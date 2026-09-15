import {
  CHANNEL_PUBLISH_MODE,
  narrative,
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
 * The checks, folded into one line beside the decision.
 *
 * Asked for directly, 2026-09-15: "ek post mein mujhe ye sb ni dekhna" — the checks are not
 * part of the post, and a reviewer reading the post should read only the post. They are not
 * removed, because design spec §5A.6 is right about why they exist: "Telling someone what
 * they do not have to check is what makes ninety seconds an instruction rather than an
 * aspiration." So they collapse to a single line that says whether anything needs a look,
 * and open by themselves when something does.
 */
export function PostChecks({ item, version }: { readonly item: ContentItem; readonly version: PostVersion }) {
  const review = reviewPost(item, version);
  const failed = review.checks.filter((check) => !check.pass).length + review.lint.findings.length;
  const link = linkOf(version);
  const handPosted = CHANNEL_PUBLISH_MODE[item.channel] === 'human_only';
  const told = narrative(item.narrative);

  return (
    <details className={failed > 0 ? 'checks checks--fail' : 'checks'} open={failed > 0}>
      <summary className="checks__summary t-body-s">
        <Icon name={failed > 0 ? 'close' : 'check'} size={14} className="checks__glyph" />
        {failed > 0
          ? `${failed} check${failed === 1 ? '' : 's'} failed`
          : `All checks passed — ${plural(review.checks.length, 'channel rule')}, ${plural(review.lint.ran.length, 'linter rule')}`}
        <Icon name="chevron-down" size={14} className="checks__chevron" />
      </summary>

      <div className="checks__body">
        <section className="checks__group">
          <h4 className="checks__label t-meta">Channel rules</h4>
          <ul className="checks__list">
            {review.checks.map((check) => (
              <li key={check.id} className={check.pass ? 'check' : 'check check--fail'}>
                <Icon name={check.pass ? 'check' : 'close'} size={14} className="check__glyph" />
                <span>
                  {check.label}
                  <span className="check__value"> — {check.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="checks__source t-meta">{[...new Set(review.checks.map((c) => c.source))].join(' · ')}</p>
        </section>

        <section className="checks__group">
          <h4 className="checks__label t-meta">Linter</h4>
          {review.lint.findings.length === 0 ? (
            <p className="check">
              <Icon name="check" size={14} className="check__glyph" />
              <span>
                {review.lint.ran.length} deterministic rules, nothing found
                <span className="check__value"> — {review.lint.ran.map((r) => r.id).join(' ')}</span>
              </span>
            </p>
          ) : (
            <ul className="checks__list">
              {review.lint.findings.map((finding) => (
                <li key={`${finding.rule}-${finding.index}`} className="check check--fail">
                  <Icon name="close" size={14} className="check__glyph" />
                  <span>
                    {finding.rule} <q>{finding.match}</q>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="check check--unrun">
            <Icon name="alert" size={14} className="check__glyph" />
            <span>
              Not run — {review.lint.notRun.map((r) => r.id).join(' ')}
              <span className="check__value"> — citation fetch, duplication and the semantic pass need the engine</span>
            </span>
          </p>
        </section>

        <section className="checks__group">
          <h4 className="checks__label t-meta">Source</h4>
          {item.citations.map((citation) => (
            <p key={citation.url + citation.quotedClaim} className="checks__citation">
              {citation.quotedClaim}
              <span className="check__value t-meta"> {citation.publisher} · {citation.publishedOn}</span>
            </p>
          ))}
          {version.researchBasis.length > 0 ? (
            <p className="checks__source t-meta">{version.researchBasis.join(' · ')}</p>
          ) : (
            item.voiceLane !== null && (
              <p className="check">
                <Icon name="check" size={14} className="check__glyph" />
                <span>
                  Attributed opinion — {personName(item.voiceLane)}
                  <span className="check__value"> — the other half of the hard gate</span>
                </span>
              </p>
            )
          )}
          {item.sourceable !== 'found' && (
            <p className="check check--fail">
              <Icon name="alert" size={14} className="check__glyph" />
              <span>
                {item.sourceable === 'thin' ? 'Sourceable, thinly' : 'No credible published source'}
                <span className="check__value"> — fact_lookup probe</span>
              </span>
            </p>
          )}
        </section>

        <section className="checks__group">
          <h4 className="checks__label t-meta">About this post</h4>
          <p className="checks__meta t-body-s">
            {told !== undefined && `${told.id} ${told.name} · `}
            {item.funnelStage} · reviewer {item.assignedReviewer ?? 'unassigned'} ·{' '}
            {version.modelTier === 'frontier' ? 'frontier model' : 'Haiku'}
          </p>
          {link !== null && <p className="checks__stamp">{stampLink(item, link)}</p>}
          <p className="checks__meta t-body-s">
            After approval:{' '}
            {handPosted
              ? `surfaced to ${personName(item.voiceLane)} on ${slotLabel(item)} to post by hand — never automatically.`
              : item.scheduledFor === null
                ? `hygiene pass, then ${PLATFORM_NAME[item.channel]} at the next open window.`
                : `hygiene pass, then ${PLATFORM_NAME[item.channel]} at ${slotLabel(item)}.`}
          </p>
        </section>
      </div>
    </details>
  );
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
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
