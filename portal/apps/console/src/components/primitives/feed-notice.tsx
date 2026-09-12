import { getRepository } from '@/lib/repository';

/**
 * What is not real yet, said on the screen rather than in a handover document.
 *
 * Build spec §0 lists what feeds the portal and answers "is it built" with no. The console
 * is built against mocks behind a real interface, exactly as §0 directs — so the honest
 * thing is to say which one answered.
 *
 * ⛔ It is deliberately **not** a DEGRADED state, and that was a correction rather than a
 * preference. Degraded is red, red means attention (§1 decision 4), and a red panel that
 * is on every screen of every demo is the chrome people stop seeing — which is how the
 * accent stops working for the one banner that genuinely needs it. Nothing is broken here;
 * the data is the reference week, and that is a footnote.
 */
export function FeedNotice() {
  if (getRepository().kind !== 'reference') return null;

  return (
    <p
      className="t-body-s text-tertiary"
      style={{
        borderTop: '1px solid var(--border-default)',
        paddingTop: 'var(--space-3)',
        maxWidth: '80ch',
      }}
    >
      <span className="t-meta">REFERENCE DATA</span> — no database is configured, so this is the
      23-item reference week from the specification. Every count, hold and percentage on screen is
      computed from it; none is written down.
    </p>
  );
}
