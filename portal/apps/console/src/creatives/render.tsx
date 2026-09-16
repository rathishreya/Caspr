import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { CREATIVE_CANVASES, type CreativeFigure, type CreativeSpec } from '@caspr-portal/domain';
import { card, cardLayout } from '@caspr-portal/tokens';
import { ImageResponse } from 'next/og';
import type { CSSProperties, ReactNode } from 'react';

/**
 * The house card, as code — `content-engine-integrations.md` §6.
 *
 * §6.4 recommends authoring the card as HTML/CSS so that a layout engine, not a hand-set
 * `cx="582.16"`, decides where the red dot goes and where a line wraps. That is what this
 * does. The engine is `next/og` (Satori, then resvg) rather than headless Chromium: it is
 * already inside Next, so the console gains no browser binary and no new dependency, and it
 * lays text out against the embedded fonts exactly as §6.4 wants. ⚠ Open question 19 is
 * still Joy's; this is the fallback route §6.4 names, taken because it needs nothing new.
 *
 * §6.6: "The font files ship with the renderer, from the repo, pinned." They do —
 * `./fonts`, Inter 5.1.1 and Instrument Serif 5.1.1 from Fontsource, each beside its SIL Open
 * Font License 1.1, which permits embedding in images and redistribution with software.
 * That closes open question 20 with the licence text rather than a reading of it.
 *
 * A PNG from resvg carries no EXIF, XMP or C2PA block of its own. That does not satisfy
 * Rule 6 — the hygiene pass is a separate gate (E8) and the review screen says it has not run.
 */

const SERIF = 'Instrument Serif';
const SANS = 'Inter';

type Font = { name: string; data: ArrayBuffer; weight: 400 | 600; style: 'normal' };

let fonts: Promise<Font[]> | undefined;

/**
 * Three literal paths rather than a loop over a directory.
 *
 * The bundler traces what a route reads. A path built from a variable cannot be traced, so it
 * falls back to including the whole project in the deployment — which it warns about, and
 * which is how a `public/` folder ends up inside server code. Written out, the trace is three
 * font files.
 *
 * Read once per process and kept: the files never change, and Satori wants the bytes.
 */
function loadFonts(): Promise<Font[]> {
  fonts ??= Promise.all([
    readFile(join(process.cwd(), 'src', 'creatives', 'fonts', 'Inter-400.woff')),
    readFile(join(process.cwd(), 'src', 'creatives', 'fonts', 'Inter-600.woff')),
    readFile(join(process.cwd(), 'src', 'creatives', 'fonts', 'InstrumentSerif-400.woff')),
  ]).then(([inter400, inter600, serif]) => [
    { name: SANS, data: bytes(inter400), weight: 400 as const, style: 'normal' as const },
    { name: SANS, data: bytes(inter600), weight: 600 as const, style: 'normal' as const },
    { name: SERIF, data: bytes(serif), weight: 400 as const, style: 'normal' as const },
  ]);
  return fonts;
}

function bytes(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

export async function renderCreative(spec: CreativeSpec, init?: ResponseInit): Promise<ImageResponse> {
  const canvas = spec.template === 'hero' ? CREATIVE_CANVASES.hero : CREATIVE_CANVASES.social;
  return new ImageResponse(spec.template === 'hero' ? <Hero spec={spec} /> : <Social spec={spec} />, {
    ...canvas,
    fonts: await loadFonts(),
    ...init,
  });
}

/** 1080 × 1080. §6.1's anatomy, top to bottom. */
function Social({ spec }: { readonly spec: Extract<CreativeSpec, { template: 'card' | 'atom' }> }) {
  const { width, height } = CREATIVE_CANVASES.social;
  const measure = width - cardLayout.gutter * 2;
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: card.ground,
        padding: `168px ${cardLayout.gutter}px 0`,
        position: 'relative',
      }}
    >
      <Eyebrow text={spec.eyebrow} size={cardLayout.eyebrowSize} />

      <Headline text={spec.headline} size={cardLayout.headlineSize} lineHeight={86} marginTop={92} dot={11} />

      {spec.template === 'card' ? (
        <div
          style={{
            marginTop: 36,
            maxWidth: measure,
            fontFamily: SANS,
            fontSize: cardLayout.standfirstSize,
            lineHeight: '40px',
            color: card.muted,
          }}
        >
          {spec.standfirst}
        </div>
      ) : (
        <Bars figures={spec.figures} measure={measure} />
      )}

      {spec.source !== null && (
        <div
          style={{
            position: 'absolute',
            left: cardLayout.gutter,
            right: cardLayout.gutter,
            top: cardLayout.footerRuleY - 64,
            fontFamily: SANS,
            fontSize: 20,
            color: card.muted,
          }}
        >
          {spec.source}
        </div>
      )}

      <Footer top={cardLayout.footerRuleY} width={width} host="caspr.ai" lockup={cardLayout.lockupSize} />
    </div>
  );
}

/** 1200 × 630. The same card, reflowed to the link-preview ratio. */
function Hero({ spec }: { readonly spec: Extract<CreativeSpec, { template: 'hero' }> }) {
  const { width, height } = CREATIVE_CANVASES.hero;
  const gutter = 80;
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: card.ground,
        padding: `72px ${gutter}px 0`,
        position: 'relative',
      }}
    >
      <Eyebrow text={spec.eyebrow} size={20} />
      <Headline text={spec.headline} size={56} lineHeight={62} marginTop={36} dot={8} />
      <div
        style={{
          marginTop: 22,
          maxWidth: width - gutter * 2,
          fontFamily: SANS,
          fontSize: 24,
          lineHeight: '34px',
          color: card.muted,
        }}
      >
        {spec.standfirst}
      </div>
      <Footer top={540} width={width} gutter={gutter} host="caspr.ai/blog" lockup={34} />
    </div>
  );
}

function Eyebrow({ text, size }: { readonly text: string; readonly size: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: size,
          letterSpacing: cardLayout.eyebrowTracking,
          textTransform: 'uppercase',
          color: card.accent,
        }}
      >
        {text}
      </div>
      <div style={{ width: 70, height: 3, marginTop: 14, background: card.accent }} />
    </div>
  );
}

/**
 * The serif headline, ending on the red dot.
 *
 * Words are laid out one by one so the dot can belong to the last of them. It follows that
 * word wherever the line breaks — the thing `cx="582.16"` could not do (§6.1).
 */
function Headline({
  text,
  size,
  lineHeight,
  marginTop,
  dot,
}: {
  readonly text: string;
  readonly size: number;
  readonly lineHeight: number;
  readonly marginTop: number;
  readonly dot: number;
}) {
  const words = text.trim().replace(/[.。]$/u, '').split(/\s+/);
  const gap = Math.round(size * 0.24);
  const word: CSSProperties = {
    marginRight: gap,
    fontFamily: SERIF,
    fontSize: size,
    lineHeight: `${lineHeight}px`,
    height: lineHeight,
    color: card.text,
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', alignItems: 'flex-start', marginTop }}>
      {words.map((w, index): ReactNode =>
        index < words.length - 1 ? (
          <div key={index} style={word}>
            {w}
          </div>
        ) : (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-end', height: lineHeight }}>
            <div style={{ ...word, marginRight: 0 }}>{w}</div>
            <div
              style={{
                width: dot * 2,
                height: dot * 2,
                borderRadius: dot,
                background: card.accent,
                marginLeft: Math.round(dot * 0.5),
                marginBottom: Math.round((lineHeight - size) / 2 + size * 0.2),
              }}
            />
          </div>
        ),
      )}
    </div>
  );
}

/**
 * The atom's chart: one bar per figure, drawn to scale from zero, each labelled with its
 * publisher and period — ⑪, "a chart that drops the publisher is not the atom". No axis and no
 * gridlines: two bars from a shared zero need neither, and every mark that is not a figure is
 * a mark someone pasting the card into a deck has to explain.
 */
function Bars({ figures, measure }: { readonly figures: readonly CreativeFigure[]; readonly measure: number }) {
  const max = Math.max(...figures.map((f) => f.value));
  const barRoom = measure - 280;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 56 }}>
      {figures.map((figure) => (
        <div key={figure.publisher + figure.display} style={{ display: 'flex', flexDirection: 'column', marginBottom: 40 }}>
          <div style={{ fontFamily: SANS, fontSize: 22, color: card.muted, letterSpacing: 1 }}>
            {`${figure.publisher} · ${figure.period}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            <div style={{ width: Math.max(8, Math.round((figure.value / max) * barRoom)), height: 64, background: card.text }} />
            <div style={{ marginLeft: 28, fontFamily: SERIF, fontSize: 64, color: card.text }}>{figure.display}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer({
  top,
  width,
  gutter = cardLayout.gutter,
  host,
  lockup,
}: {
  readonly top: number;
  readonly width: number;
  readonly gutter?: number;
  readonly host: string;
  readonly lockup: number;
}) {
  return (
    <div style={{ position: 'absolute', left: 0, top, width, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginLeft: gutter, width: width - gutter * 2, height: 1, background: card.rule }} />
      <div
        style={{
          marginTop: 12,
          marginLeft: gutter,
          width: width - gutter * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: SERIF, fontSize: lockup, color: card.text, lineHeight: `${lockup + 6}px` }}>Caspr</div>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: card.accent,
              marginLeft: 3,
              marginBottom: Math.round(lockup * 0.22),
            }}
          />
        </div>
        <div style={{ fontFamily: SANS, fontSize: cardLayout.hostSize, color: card.muted }}>{host}</div>
      </div>
    </div>
  );
}
