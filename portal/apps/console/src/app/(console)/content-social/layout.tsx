import type { ReactNode } from 'react';

import { Tabs } from '@/components/primitives/tabs';
import { ScreenHeader } from '@/components/shell/screen-header';
import { CONTENT_SOCIAL_TABS } from '@/lib/nav';

/**
 * Content & Social.
 *
 * One workstream, not two. §5, decision taken by Joy 2026-08-20: "A blog post and its
 * seven voiced variants are one artefact; splitting them would break the repurposing flow
 * the CMS is built around."
 *
 * The title and tab strip live in the layout so the three tabs cannot drift apart — a tab
 * that renders its own header is a tab that will eventually render a different one.
 */
export default function ContentSocialLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <ScreenHeader title="Content & Social" />
      <Tabs tabs={CONTENT_SOCIAL_TABS} label="Content & Social" />
      {children}
    </>
  );
}
