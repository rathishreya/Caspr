'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

/**
 * Workstream tabs — the second and final level. §5 rule 1: "Two levels, never three."
 */
export function Tabs({
  tabs,
  label,
}: {
  readonly tabs: readonly { readonly id: string; readonly label: string; readonly href: Route }[];
  readonly label: string;
}) {
  const pathname = usePathname();

  return (
    <nav className="tabs" aria-label={label}>
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className="tabs__link t-body-m"
          aria-current={pathname === tab.href ? 'page' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
