import { creativeFor, creativeOverflow } from '@caspr-portal/domain';

import { renderCreative } from '@/creatives/render';
import { getRepository } from '@/lib/repository';

/**
 * `GET /api/creatives/{itemId}?v={versionN}` — the post's image, as PNG.
 *
 * Addressed by item and version, as integrations §6.7 keys storage
 * (`visuals/{content_item_id}/{visual_type}-{version}.png`), so a regenerated card is a new
 * address and a card someone already downloaded never changes under them. A request for the
 * current version is cached for good; any other is not cached at all.
 *
 * ⚠ This serves the console, not the platforms. LinkedIn and X fetch images from a stable
 * public URL (§6.7), and that bucket does not exist — so this route renders on request and
 * sits behind the same sign-in redirect at the edge as every screen (`session.ts`).
 *
 * `?download=1` is runtime spec §5's "Download image — one button", for the posts a person
 * places by hand.
 */
export async function GET(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const url = new URL(request.url);

  const post = await getRepository().post(itemId);
  const spec = post === null ? null : creativeFor(post.version);
  if (post === null || spec === null) {
    return new Response('This post has no image.', { status: 404 });
  }

  // §6.3: "The renderer asserts and refuses." A card that would overflow is not drawn, and
  // the refusal names what did not fit rather than handing back a broken picture.
  const overflow = creativeOverflow(spec);
  if (overflow.length > 0) {
    return new Response(`VISUAL_OVERFLOW — ${overflow.join(' · ')}`, { status: 422 });
  }

  const current = url.searchParams.get('v') === String(post.version.versionN);
  const filename = `${itemId}-${spec.template}-v${post.version.versionN}.png`;
  return renderCreative(spec, {
    headers: {
      'Cache-Control': current ? 'private, max-age=31536000, immutable' : 'no-store',
      ...(url.searchParams.has('download') ? { 'Content-Disposition': `attachment; filename="${filename}"` } : {}),
    },
  });
}
