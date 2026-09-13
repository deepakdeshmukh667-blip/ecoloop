import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { pathname } = request.nextUrl;

  // 1. Redirect legacy auth routes directly to dedicated resident login
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/resident/login', request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasMockOrInvalidUrl = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('mock') || supabaseAnonKey.includes('dummy');

  // Check local/session cookies
  const hasResidentCookie = request.cookies.get('ecoloop_resident_session')?.value === 'true';
  const hasAdminCookie = request.cookies.get('ecoloop_admin_session')?.value === 'true';

  let hasSupabaseUser = false;
  let isSupabaseAdmin = false;

  if (!hasMockOrInvalidUrl) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              // @ts-expect-error - Next.js cookies options
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        hasSupabaseUser = true;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        isSupabaseAdmin =
          profile?.role === 'admin' ||
          profile?.role === 'society_admin' ||
          profile?.role === 'municipal_admin';
      }
    } catch {
      // Supabase unavailable, rely on session cookies
    }
  }

  const isResidentLoggedIn = hasResidentCookie || hasSupabaseUser;
  const isAdminLoggedIn = hasAdminCookie || isSupabaseAdmin;

  // 2. Root Route (/) Handling
  if (pathname === '/') {
    if (isAdminLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (isResidentLoggedIn) {
      return NextResponse.redirect(new URL('/resident/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/resident/login', request.url));
  }

  // 3. If authenticated user visits /resident/login, send them to resident dashboard
  if (pathname === '/resident/login') {
    if (isResidentLoggedIn) {
      return NextResponse.redirect(new URL('/resident/dashboard', request.url));
    }
    return supabaseResponse;
  }

  // 4. If user visits /admin/login
  if (pathname === '/admin/login') {
    if (isAdminLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return supabaseResponse;
  }

  // 5. Resident Route Protection (/resident/*)
  if (pathname.startsWith('/resident/')) {
    if (!isResidentLoggedIn) {
      const loginUrl = new URL('/resident/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // 6. Admin Route Protection (/admin/*)
  if (pathname.startsWith('/admin/')) {
    if (!isAdminLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
