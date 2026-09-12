/**
 * Icons.
 *
 * Construction convention lifted from the product app and recorded in design spec §4:
 *
 *   24 × 24 · VECTOR children only · stroke 1.6 · align CENTER · cap ROUND · join ROUND
 *   · no fill.
 *
 * Strokes take `currentColor` so they inherit from context — §4: "never a hardcoded hex".
 * They were drawn rather than imported because the app and website Figma files are not
 * reachable as published libraries (§4); if that changes, re-check before adding more.
 */

import type { SVGProps } from 'react';

export type IconName =
  | 'week'
  | 'content'
  | 'search'
  | 'paid'
  | 'email'
  | 'calendar'
  | 'dashboard'
  | 'truth'
  | 'ledger'
  | 'settings'
  | 'chevron-left'
  | 'chevron-right';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { readonly size?: number };

function Svg({ size = 20, ...props }: IconProps & { readonly children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const PATHS: Record<IconName, React.ReactNode> = {
  // A week, not a month: five columns and a bar for the days already spent.
  week: (
    <>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M7 14h4" />
    </>
  ),
  // A document with two lines of body — content, before it becomes anything else.
  content: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 20 20" />
    </>
  ),
  // Performance: a line that turns, because a flat arrow is a claim rather than a measure.
  paid: (
    <>
      <path d="M3 17l5-6 4 3 5-7" />
      <path d="M14 7h4v4" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="6" width="18" height="12" />
      <path d="m3 8 9 6 9-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  dashboard: (
    <>
      <path d="M5 20V11M12 20V5M19 20v-6" />
      <path d="M3 20h18" />
    </>
  ),
  // Truth: a shield with a check. Stale flags cut across everything, and so does this.
  truth: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // Ledger: a tray that things go into and stay in. Rejections are kept, forever.
  ledger: (
    <>
      <path d="M3 13h5l1 3h6l1-3h5" />
      <path d="M4 6h16l1 7v6H3v-6z" />
    </>
  ),
  /**
   * Sliders, not a gear. §4: "a gear with radiating lines reads as a sun at 18px."
   */
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  'chevron-left': <path d="m14 6-6 6 6 6" />,
  'chevron-right': <path d="m10 6 6 6-6 6" />,
};

export function Icon({ name, ...props }: IconProps & { readonly name: IconName }) {
  return <Svg {...props}>{PATHS[name]}</Svg>;
}
