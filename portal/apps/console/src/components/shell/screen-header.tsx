import type { ReactNode } from 'react';

/**
 * The screen header: title left, mono meta right.
 *
 * The meta side is DM Mono because it carries counts, dates and codes — never prose (§3).
 * Anything that would read as a sentence belongs in the body, not here.
 */
export function ScreenHeader({
  title,
  meta,
}: {
  readonly title: string;
  readonly meta?: ReactNode;
}) {
  return (
    <header className="screen-header">
      <h1 className="t-title-l">{title}</h1>
      {meta !== undefined && <div className="screen-header__meta">{meta}</div>}
    </header>
  );
}
