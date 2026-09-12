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

  // If Supabase environment variables are missing, allow request through to prevent crash
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

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

    // Verify authenticated user with Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. If authenticated user visits /resident/login, send them to resident dashboard
    if (pathname === '/resident/login') {
      if (user) {
        return NextResponse.redirect(new URL('/resident/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // 3. If user visits /admin/login
    if (pathname === '/admin/login') {
      if (user) {
        // Fetch role from profile table
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
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
      return supabaseResponse;
    }

    // 4. Resident Route Protection (/resident/*)
    if (pathname.startsWith('/resident/')) {
      if (!user) {
        const loginUrl = new URL('/resident/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // 5. Admin Route Protection (/admin/*)
    if (pathname.startsWith('/admin/')) {
      if (!user) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check role server-side
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isAdmin =
        profile?.role === 'admin' ||
        profile?.role === 'society_admin' ||
        profile?.role === 'municipal_admin';

      if (!isAdmin) {
        // Non-admin resident attempting to access admin portal: DENY and redirect to resident dashboard
        const accessDeniedUrl = new URL('/resident/dashboard', request.url);
        accessDeniedUrl.searchParams.set('error', 'unauthorized_admin');
        return NextResponse.redirect(accessDeniedUrl);
      }

      return supabaseResponse;
    }
  } catch {
    // If auth resolution throws in mock environment, pass through
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
