import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/resident/dashboard';

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // @ts-expect-error - Next.js cookies options
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  );

  // Handle OTP token hash (magic link / email OTP)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'magiclink' | 'recovery' | 'email_change',
    });

    if (!error) {
      // Successfully verified OTP — check user role and redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
        const userEmail = user.email?.toLowerCase().trim() || '';
        const isSuperAdminEmail = ADMIN_EMAILS.includes(userEmail);

        let isAdmin = isSuperAdminEmail;

        if (isSuperAdminEmail) {
          // Auto-upgrade profile to admin
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: 'Deepak Deshmukh (Admin)',
            role: 'admin',
            is_active: true,
          }, { onConflict: 'id' });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          isAdmin =
            profile?.role === 'admin' ||
            profile?.role === 'society_admin' ||
            profile?.role === 'municipal_admin';
        }

        return NextResponse.redirect(new URL(isAdmin ? '/admin/dashboard' : '/resident/dashboard', origin));
      }
    }
    // If error, redirect to login with error message
    return NextResponse.redirect(new URL('/resident/login?error=link_expired', origin));
  }

  // Handle Auth Code Exchange (OAuth / PKCE)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
        const userEmail = user.email?.toLowerCase().trim() || '';
        const isSuperAdminEmail = ADMIN_EMAILS.includes(userEmail);

        let isAdmin = isSuperAdminEmail;

        if (isSuperAdminEmail) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: 'Deepak Deshmukh (Admin)',
            role: 'admin',
            is_active: true,
          }, { onConflict: 'id' });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          isAdmin =
            profile?.role === 'admin' ||
            profile?.role === 'society_admin' ||
            profile?.role === 'municipal_admin';
        }

        return NextResponse.redirect(new URL(isAdmin ? '/admin/dashboard' : '/resident/dashboard', origin));
      }
    }
    return NextResponse.redirect(new URL('/resident/login?error=link_expired', origin));
  }

  // Fallback — no code or token
  return NextResponse.redirect(new URL('/resident/login?error=invalid_link', origin));
}
