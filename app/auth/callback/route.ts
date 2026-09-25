import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // ─── Handle Auth Code Exchange (OAuth / PKCE — Google Sign-In) ───────────
  if (code) {
    // Build the redirect response FIRST so we can attach cookies to it
    const successRedirect = NextResponse.redirect(new URL('/resident/dashboard', origin));
    const failRedirect = NextResponse.redirect(new URL('/?error=google_signin_failed', origin));

    const cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          // Collect cookies — we'll apply them to the response below
          cookies.forEach((c: { name: string; value: string; options?: Record<string, unknown> }) => cookiesToSet.push(c));
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userEmail = user.email?.toLowerCase().trim() || '';
        const isSuperAdmin = ADMIN_EMAILS.includes(userEmail);
        let isAdmin = isSuperAdmin;

        if (isSuperAdmin) {
          await supabase.from('profiles').upsert(
            {
              id: user.id,
              email: user.email,
              full_name: 'Deepak Deshmukh (Admin)',
              role: 'admin',
              is_active: true,
            },
            { onConflict: 'id' }
          );
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!profile) {
            // New Google user — create a resident profile
            await supabase.from('profiles').upsert(
              {
                id: user.id,
                auth_user_id: user.id,
                email: userEmail,
                full_name:
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  'Eco Resident',
                role: 'resident',
                eco_points: 50,
                current_streak: 0,
                consistency_score: 80,
              },
              { onConflict: 'id' }
            );
          }

          isAdmin =
            profile?.role === 'admin' ||
            profile?.role === 'society_admin' ||
            profile?.role === 'municipal_admin';
        }

        const destination = isAdmin ? '/admin/dashboard' : '/resident/dashboard';
        const response = NextResponse.redirect(new URL(destination, origin));

        // ✅ Apply ALL Supabase session cookies to the redirect response
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options ?? {});
        });

        // ✅ Also set our custom session cookie so middleware fast-path works
        response.cookies.set('ecoloop_session', 'true', {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
          httpOnly: false,
        });

        return response;
      }
    }

    return failRedirect;
  }

  // ─── Handle OTP Token Hash (email link / magic link) ─────────────────────
  if (token_hash && type) {
    const cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookies.forEach((c: { name: string; value: string; options?: Record<string, unknown> }) => cookiesToSet.push(c));
        },
      },
    });

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'magiclink' | 'recovery' | 'email_change',
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userEmail = user.email?.toLowerCase().trim() || '';
        const isSuperAdmin = ADMIN_EMAILS.includes(userEmail);
        let isAdmin = isSuperAdmin;

        if (isSuperAdmin) {
          await supabase.from('profiles').upsert(
            {
              id: user.id,
              email: user.email,
              full_name: 'Deepak Deshmukh (Admin)',
              role: 'admin',
              is_active: true,
            },
            { onConflict: 'id' }
          );
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

        const destination = isAdmin ? '/admin/dashboard' : '/resident/dashboard';
        const response = NextResponse.redirect(new URL(destination, origin));

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options ?? {});
        });

        response.cookies.set('ecoloop_session', 'true', {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          httpOnly: false,
        });

        return response;
      }
    }

    return NextResponse.redirect(new URL('/?error=link_expired_or_invalid', origin));
  }

  // ─── Fallback ─────────────────────────────────────────────────────────────
  return NextResponse.redirect(new URL('/?error=invalid_auth_link', origin));
}
