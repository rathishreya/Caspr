import { colour } from '@caspr-portal/tokens';
import type { Metadata, Viewport } from 'next';
import { DM_Mono, Instrument_Serif, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

/**
 * Three families, and the split between them carries meaning. Design spec §3:
 *
 *   Inter              everything a person reads as language
 *   DM Mono            numbers, codes, timestamps, short uppercase labels — never prose
 *   Instrument Serif   the wordmark. Exactly once, nowhere else.
 *
 * §1 decision 2 is the reason the serif is confined: it "changes the register from
 * editorial to operational while every glyph still comes from the same family". The
 * product app is editorial. This is an operations console.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'Caspr Team',
    template: '%s · Caspr Team',
  },
  description: 'The GTM operations console.',
  // The console holds the customer list and seven social tokens. It is not for indexing.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  // The browser chrome takes the console's ground, from the token rather than a literal.
  themeColor: colour.surfaceBase,
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${dmMono.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
