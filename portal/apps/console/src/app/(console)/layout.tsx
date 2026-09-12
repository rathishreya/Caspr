import type { ReactNode } from 'react';

import { Shell } from '@/components/shell/shell';

/**
 * The console route group. Every screen inside it wears the rail.
 *
 * Grouped rather than repeated so §7's standing instruction — "instance it on every
 * console screen, never rebuild" — is structural: a new screen cannot forget the rail,
 * because it does not render one.
 *
 * Surfaces that deliberately have no rail (the Login page, the desktop Personal Queue —
 * §14.1) live outside this group.
 */
export default function ConsoleLayout({ children }: { readonly children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
