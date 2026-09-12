import { redirect } from 'next/navigation';

/**
 * My Week is every person's landing (§5), and it is not in this build — so the root goes
 * to the Calendar, which is the all-up view and the closest honest substitute.
 *
 * When My Week lands, this redirect changes and nothing else does.
 */
export default function RootPage(): never {
  redirect('/calendar');
}
