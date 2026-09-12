import { COPY_TIER_REGISTER, copyLinesByTier, type CopyTierDefinition } from '@caspr-portal/domain';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Content & Social — Library' };

/**
 * Content & Social ▸ Library. Figma `54:793`.
 *
 * The tier sits next to the line, and that is the entire design. Design spec §5A.7:
 *
 *   "This exists because the same list, untiered, was a live hazard. The content library's
 *    Voice Cheat Sheet carried retired lines under a heading reading 'APPROVED LINES
 *    (reuse verbatim where they fit)' until it was reconciled on 2026-08-24. A flat list of
 *    good lines is how a retired line gets reused — nobody re-reads the governance doc,
 *    they copy from the nearest list."
 *
 * Retired lines are listed rather than deleted, so nobody re-proposes them in good faith.
 */
export default function ContentSocialLibrary() {
  return (
    <>
      <p className="t-body-m text-secondary" style={{ maxWidth: '68ch' }}>
        A line&rsquo;s tier is where it may appear, not how good it is. The linter blocks a retired
        line upstream regardless; this is where you find out why it was retired.
      </p>

      {COPY_TIER_REGISTER.map((tier) => (
        <Tier key={tier.id} tier={tier} />
      ))}
    </>
  );
}

function Tier({ tier }: { readonly tier: CopyTierDefinition }) {
  const lines = copyLinesByTier(tier.id);

  return (
    <section className="tier">
      <div className="tier__head">
        <h2 className={tier.blocked ? 't-meta-bold text-attention' : 't-meta-bold'}>{tier.label}</h2>
        {tier.blocked && <span className="tag tag--attention t-meta">BLOCKED</span>}
        <span className="t-body-s tier__permits">{tier.permits}</span>
      </div>

      {lines.map((line) => (
        <div
          key={line.id}
          className={tier.blocked ? 'copy-line copy-line--blocked' : 'copy-line'}
        >
          <div>
            <p className="t-title-m copy-line__text">{line.line}</p>
            {line.placement !== null && (
              <p className="t-meta copy-line__placement">{line.placement}</p>
            )}
          </div>
          <p className="t-body-s copy-line__note">
            {/* For a retired line this is why it lost, which is the only thing worth reading. */}
            {line.note}
          </p>
        </div>
      ))}
    </section>
  );
}
