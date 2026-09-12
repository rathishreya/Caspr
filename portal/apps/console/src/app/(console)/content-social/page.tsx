import { redirect } from 'next/navigation';

/**
 * The workstream's landing tab is its Dashboard — universal across all four workstreams
 * (§5). Redirecting rather than duplicating keeps one canonical URL per screen, which is
 * what makes the rail's active state and a pasted link agree.
 */
export default function ContentSocialIndex(): never {
  redirect('/content-social/dashboard');
}
