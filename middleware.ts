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

  // Allow Supabase auth callback to pass through freely (handles magic link & OTP exchange)
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase credentials are missing, strictly block protected routes
    if (pathname.startsWith('/resident/') && pathname !== '/resident/login') {
      const loginUrl = new URL('/resident/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/resident/login', request.url));
    }
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

    // Verify authenticated user with Supabase Auth (Secure Server-Side Check)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;

    if (user) {
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

    // 2. Root route (/) handling
    if (pathname === '/') {
      if (user) {
        return NextResponse.redirect(new URL(isAdmin ? '/admin/dashboard' : '/resident/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/resident/login', request.url));
    }

    // 3. /resident/login handling
    if (pathname === '/resident/login') {
      if (user) {
        return NextResponse.redirect(new URL('/resident/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // 4. /admin/login handling
    if (pathname === '/admin/login') {
      if (user && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // 5. Resident Route Protection (/resident/*)
    if (pathname.startsWith('/resident/')) {
      if (!user) {
        const loginUrl = new URL('/resident/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // 6. Admin Route Protection (/admin/*)
    if (pathname.startsWith('/admin/')) {
      if (!user) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!isAdmin) {
        // Authenticated non-admin resident attempting to access admin portal: DENY
        const accessDeniedUrl = new URL('/resident/dashboard', request.url);
        accessDeniedUrl.searchParams.set('error', 'unauthorized_admin');
        return NextResponse.redirect(accessDeniedUrl);
      }

      return supabaseResponse;
    }
  } catch {
    // If Supabase client fails, enforce login on protected routes
    if (pathname.startsWith('/resident/') && pathname !== '/resident/login') {
      const loginUrl = new URL('/resident/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
