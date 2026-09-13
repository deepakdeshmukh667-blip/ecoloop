import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const cookieStore = cookies();
  const hasResident = cookieStore.get('ecoloop_resident_session')?.value === 'true';
  const hasAdmin = cookieStore.get('ecoloop_admin_session')?.value === 'true';

  if (hasAdmin) {
    redirect('/admin/dashboard');
  } else if (hasResident) {
    redirect('/resident/dashboard');
  } else {
    redirect('/resident/login');
  }
}
