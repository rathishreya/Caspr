import { adCreativeSpec, creativeOverflow } from '@caspr-portal/domain';

import { renderCreative } from '@/creatives/render';
import { getRepository } from '@/lib/repository';

/**
 * `GET /api/ad-creatives/{adId}` — an ad's image, as PNG.
 *
 * ⚑ **This is the free creative generator, and it was already here.** `creatives/render.tsx`
 * draws the house card with `next/og`, from the brand tokens: no service to keep running, no
 * per-image cost, and **deterministic** — the same ad renders the same picture every time.
 * That last property is why a generative image tool would be the wrong choice even if one
 * were free: an ad creative that drifts between renders is one nobody can approve, because
 * what was approved is not what ships.
 *
 * It refuses rather than degrades. A headline that would overflow the safe width is not
 * drawn, and the 422 names what did not fit.
 *
 * `?download=1` hands the file to whoever is uploading it to the ad account by hand, which
 * is every ad until an API is connected.
 */
export async function GET(request: Request, { params }: { params: Promise<{ adId: string }> }) {
  const { adId } = await params;
  const url = new URL(request.url);

  const ad = (await getRepository().ads()).find((candidate) => candidate.id === adId);
  const spec = ad === undefined ? null : adCreativeSpec(ad);
  if (spec === null) {
    return new Response('This ad has no image. Search ads carry text only.', { status: 404 });
  }

  const overflow = creativeOverflow(spec);
  if (overflow.length > 0) {
    return new Response(`VISUAL_OVERFLOW — ${overflow.join(' · ')}`, { status: 422 });
  }

  return renderCreative(spec, {
    headers: {
      // The ad set is fixture-backed and changes when somebody edits the file, so this is
      // cached for the request and no longer.
      'cache-control': 'no-store',
      ...(url.searchParams.get('download') === '1'
        ? { 'content-disposition': `attachment; filename="${adId}.png"` }
        : {}),
    },
  });
}
