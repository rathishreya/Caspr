import { reviewPost, zonedDate, zonedTime, zonedWeekday, type ContentItem, type PostVersion } from '@caspr-portal/domain';

import { Icon } from '@/components/icons';

/**
 * What the machine found wrong — and nothing else.
 *
 * ⚑ **The checks panel was removed 2026-09-16**, at the Content & Social owner's request:
 * the channel-rule roll-call, the linter list, the source block and "about this post" were
 * noise on a screen whose job is a decision. Design spec §5A.6's argument for showing them —
 * *"telling someone what they do not have to check is what makes ninety seconds an
 * instruction rather than an aspiration"* — is answered by the half that is kept: **when the
 * machine found something, it says so, in one line.** When it found nothing, it says nothing,
 * which is the same promise made quietly.
 *
 * Nothing about the gate changed. Every check still runs, a post that fails one still carries
 * that failure into the record, and `reviewPost` is still what the tests hold the fixtures to.
 */
export function PostFailures({ item, version }: { readonly item: ContentItem; readonly version: PostVersion }) {
  const review = reviewPost(item, version);
  const failed = review.checks.filter((check) => !check.pass);
  const total = failed.length + review.lint.findings.length;
  if (total === 0) return null;

  return (
    <div className="failures" role="note">
      <p className="failures__head t-meta-bold">
        <Icon name="alert" size={14} />
        {total} to look at before this goes out
      </p>
      <ul className="failures__list">
        {failed.map((check) => (
          <li key={check.id} className="t-body-s">
            {check.label} — <span className="text-secondary">{check.value}</span>
          </li>
        ))}
        {review.lint.findings.map((finding) => (
          <li key={`${finding.rule}-${finding.index}`} className="t-body-s">
            {finding.rule} <q>{finding.match}</q>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `TUE 18 · 09:00`, in the console's zone. */
export function slotLabel(item: ContentItem): string {
  return item.scheduledFor === null ? 'no slot yet' : instantLabel(item.scheduledFor);
}

/** Any instant as `TUE 18 · 09:00`, in the console's zone. */
export function instantLabel(instant: string): string {
  const day = Number(zonedDate(instant).slice(8, 10));
  return `${zonedWeekday(instant)} ${day} · ${zonedTime(instant)}`;
}
