import { redirect } from 'next/navigation';

export default function EmailIndex(): never {
  redirect('/email/dashboard');
}
