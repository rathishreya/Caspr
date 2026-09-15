'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

/**
 * Workstream tabs — the second and final level. §5 rule 1: "Two levels, never three."
 *
 * A tab can carry a count of things waiting on a person. It is the only number a tab
 * shows, and it wears the attention colour because that is exactly what it is (§1
 * decision 4). A count of things that need nobody would be decoration.
 */
export function Tabs({
  tabs,
  label,
  badges = {},
}: {
  readonly tabs: readonly { readonly id: string; readonly label: string; readonly href: Route }[];
  readonly label: string;
  readonly badges?: Readonly<Record<string, number>>;
}) {
  const pathname = usePathname();

  return (
    <nav className="tabs" aria-label={label}>
      {tabs.map((tab) => {
        const count = badges[tab.id] ?? 0;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className="tabs__link t-body-m"
            aria-current={pathname === tab.href ? 'page' : undefined}
          >
            {tab.label}
            {count > 0 && (
              <span className="tabs__badge t-meta" aria-label={`${count} waiting on a decision`}>
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
