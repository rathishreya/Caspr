import { redirect } from 'next/navigation';

/** The workstream's landing tab is its Dashboard — universal across all five (§5). */
export default function SeoIndex(): never {
  redirect('/seo/dashboard');
}
