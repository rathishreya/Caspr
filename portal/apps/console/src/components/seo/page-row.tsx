import { checkPage, pageHealth, type SitePage } from '@caspr-portal/domain';

import { Icon } from '@/components/icons';

/**
 * One page, and everything wrong with it.
 *
 * ⚑ Built to be read fast and without fear. Three rules it follows:
 *
 *  1. **The row says how many, not which.** "3 to fix" is a decision — open it or move on.
 *     Seven check names in a row is a wall, and a wall gets scrolled past.
 *  2. **Open, every line is an instruction.** What is true, then what to do about it. A
 *     panel that only diagnoses makes the reader do the translation, every time.
 *  3. **Blocking and quality are not the same colour.** A page nothing links to cannot be
 *     found; a long title is merely truncated. Marking both red teaches people that red
 *     means nothing.
 */
export function PageRow({ page }: { readonly page: SitePage }) {
  const health = pageHealth(page);
  const checks = checkPage(page);
  const blocking = health.failing.filter((check) => check.weight === 'blocking');
  const quality = health.failing.filter((check) => check.weight === 'quality');

  return (
    <details className="page" id={`page-${page.path.replace(/\//g, '-')}`}>
      <summary className="page__summary">
        <span className="page__path t-data-m">{page.path}</span>

        <span className="page__for t-body-s">
          {page.primaryKeyword === null ? (
            <span className="text-tertiary">No question assigned</span>
          ) : (
            page.primaryKeyword
          )}
        </span>

        <span className="page__score">
          {/* One dot per check. Colour only where it is earned, so red keeps meaning. */}
          {checks.map((check) => (
            <span
              key={check.id}
              className={
                check.pass
                  ? 'dot dot--pass'
                  : check.weight === 'blocking'
                    ? 'dot dot--blocking'
                    : 'dot dot--quality'
              }
              title={`${check.label}: ${check.pass ? 'ok' : check.standing}`}
            />
          ))}
        </span>

        <span className={health.failing.length === 0 ? 'page__count t-meta' : 'page__count t-meta text-attention'}>
          {health.failing.length === 0 ? 'Ready' : `${health.failing.length} to fix`}
        </span>

        <Icon name="chevron-down" size={16} className="row__chevron" />
      </summary>

      <div className="page__detail">
        {blocking.length > 0 && (
          <Group title="Stops it working" checks={blocking} kind="blocking" />
        )}
        {quality.length > 0 && <Group title="Makes it work less well" checks={quality} kind="quality" />}
        {health.failing.length === 0 && (
          <p className="t-body-s text-secondary">Every check passes. Nothing to do here.</p>
        )}

        <dl className="page__facts">
          <div>
            <dt className="t-meta">Also ranks for</dt>
            <dd className="t-body-s">
              {page.secondaryKeywords.length === 0 ? '—' : page.secondaryKeywords.join(' · ')}
            </dd>
          </div>
          <div>
            <dt className="t-meta">Why it exists</dt>
            <dd className="t-body-s">{page.intent ?? '—'}</dd>
          </div>
          <div>
            <dt className="t-meta">Built in</dt>
            <dd className="t-body-s">Phase {page.phase}</dd>
          </div>
        </dl>
      </div>
    </details>
  );
}

function Group({
  title,
  checks,
  kind,
}: {
  readonly title: string;
  readonly checks: readonly ReturnType<typeof checkPage>[number][];
  readonly kind: 'blocking' | 'quality';
}) {
  return (
    <div className="fixes">
      <p className={kind === 'blocking' ? 'fixes__title t-meta text-attention' : 'fixes__title t-meta'}>
        {title} · {checks.length}
      </p>
      {checks.map((check) => (
        <div key={check.id} className="fix">
          <p className="fix__what t-body-m">{check.label}</p>
          <p className="fix__standing t-body-s text-secondary">{check.standing}</p>
          <p className="fix__do t-body-s">{check.fix}</p>
        </div>
      ))}
    </div>
  );
}
