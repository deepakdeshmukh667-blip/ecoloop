import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/resident/login');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin =
      profile?.role === 'admin' ||
      profile?.role === 'society_admin' ||
      profile?.role === 'municipal_admin';

    if (isAdmin) {
      redirect('/admin/dashboard');
    } else {
      redirect('/resident/dashboard');
    }
  } catch {
    redirect('/resident/login');
  }
}
