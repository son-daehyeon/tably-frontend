import { redirect } from 'next/navigation';

export default function Page() {
  redirect(process.env.NEXT_PUBLIC_API_URL + '/oauth2/authorization/google');
}
