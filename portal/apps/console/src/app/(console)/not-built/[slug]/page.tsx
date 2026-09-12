import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { State } from '@/components/primitives/state';
import { ScreenHeader } from '@/components/shell/screen-header';
import { UNBUILT_SLUGS, destinationBySlug } from '@/lib/nav';

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return UNBUILT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: destinationBySlug(slug)?.label ?? 'Not in this build' };
}

/**
 * The destinations in the tree that this build does not implement.
 *
 * They stay in the rail because the tree is the team's mental model, and a rail showing
 * only finished screens teaches the wrong shape of the product. What they must not do is
 * dead-end: design spec §11A requires every state to name its kind on the first line and
 * its consequence on the second, and "an empty state that does not say what to do is a
 * dead end".
 *
 * So each one says what it will be, and points at where the work that would live here is
 * happening instead.
 */
export default async function NotBuiltPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = destinationBySlug(slug);
  if (!destination || destination.built) notFound();

  return (
    <>
      <ScreenHeader
        title={destination.label}
        meta={<span className="t-meta text-tertiary">NOT IN THIS BUILD</span>}
      />
      <div className="stack" style={{ maxWidth: '68ch' }}>
        <State
          kind="empty"
          headline={`${destination.label} is specified and drawn, and it is not in this build.`}
          consequence="Content & Social and the Calendar were built first. Nothing here is blocked — it is sequenced."
        />
        <p className="t-body-m text-secondary">{destination.purpose}</p>
      </div>
    </>
  );
}
