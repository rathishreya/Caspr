'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components/icons';
import { NAV, type NavDestination } from '@/lib/nav';
import type { Session } from '@/lib/session';

/**
 * `Console / Nav` — the rail.
 *
 * Design spec §7: "Instance it on every console screen. Never rebuild." One component,
 * rendered by the shell, is the code equivalent of that instruction.
 *
 * It collapses to icons between 900 and 1179 in CSS rather than in JavaScript. Doing it
 * with a measured width would mean a first paint at the wrong size and a hydration
 * mismatch on every load; the labels are visually hidden and the accessible name moves to
 * `aria-label`, so the collapsed rail is unchanged for a screen reader.
 */
export function Rail({ session }: { readonly session: Session }) {
  const pathname = usePathname();

  return (
    <nav className="rail" aria-label="Console">
      <div className="rail__brand">
        {/*
          Collapsed, the rail keeps an identity mark rather than losing one. Hiding
          "Caspr" and leaving a bare red dot reads as a rendering fault, and the mark is
          the one thing §1 says must never change between the two surfaces.
        */}
        <span className="t-wordmark">
          <span className="rail__wordmark-full">Caspr</span>
          <span className="rail__wordmark-mark" aria-hidden="true">
            C
          </span>
          <span className="rail__dot">.</span>
        </span>
        {/* The explicit marker that this is not the product app. §1. */}
        <span className="t-meta rail__team">TEAM</span>
      </div>

      <div className="rail__nav">
        {NAV.map((section) => (
          <div key={section.id}>
            {section.label !== null && (
              <div className="t-meta rail__section" aria-hidden="true">
                {section.label}
              </div>
            )}
            <ul aria-label={section.label ?? undefined}>
              {section.destinations.map((destination) => (
                <li key={destination.id}>
                  <RailLink destination={destination} pathname={pathname} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rail__footer">
        <div className="rail__footer-text">
          <div className="t-body-s">
            {session.name} — {session.roleLabel}
          </div>
          <div className="t-meta rail__footer-owns">{ownsLabel(session)}</div>
        </div>
      </div>
    </nav>
  );
}

function RailLink({
  destination,
  pathname,
}: {
  readonly destination: NavDestination;
  readonly pathname: string;
}) {
  const active = isActive(destination, pathname);
  return (
    <Link
      href={destination.href}
      className="rail__link"
      aria-current={active ? 'page' : undefined}
      aria-label={destination.label}
      title={destination.purpose}
    >
      <span className="rail__icon">
        <Icon name={destination.icon} />
      </span>
      <span className="t-body-m rail__link-label">{destination.label}</span>
    </Link>
  );
}

function isActive(destination: NavDestination, pathname: string): boolean {
  // A workstream stays lit across its tabs — the tab strip shows which one.
  const root = `/${destination.href.split('/')[1] ?? ''}`;
  if (destination.built) return pathname === destination.href || pathname.startsWith(`${root}/`);
  return pathname === destination.href;
}

/**
 * §5 rule 3: the footer names the workstreams the signed-in person owns, "so the tree is
 * never abstract". A person who owns none is a Contributor, and the honest label says so
 * rather than showing an empty line.
 */
function ownsLabel(session: Session): string {
  if (session.ownsWorkstreams.length === 0) return 'OWN QUEUE ONLY';
  return session.ownsWorkstreams.map((id) => id.replace('-', ' ')).join(' · ').toUpperCase();
}
