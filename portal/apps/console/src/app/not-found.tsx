import Link from 'next/link';

/**
 * Not a bare "404". §11A: every state names its kind and its consequence.
 */
export default function NotFound() {
  return (
    <div className="work" style={{ maxWidth: '68ch' }}>
      <div className="stack">
        <span className="t-meta text-tertiary">EMPTY</span>
        <h1 className="t-title-l">There is no screen at this address.</h1>
        <p className="t-body-m text-secondary">
          Either the link is stale or the screen is one of the destinations this build has not
          reached. The Calendar is the all-up view of the week.
        </p>
        <Link className="t-label" href="/calendar" style={{ color: 'var(--accent-attention)' }}>
          Go to the Calendar →
        </Link>
      </div>
    </div>
  );
}
