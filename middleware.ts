import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ──────────────────────────────────────────────────────────────
  // LOCAL DEV BYPASS — skip all auth when DEV_BYPASS_AUTH=true
  // Remove or set to "false" in .env.local before deploying to production.
  // ──────────────────────────────────────────────────────────────
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    // Redirect root / login / signup straight to resident dashboard
    if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/resident/dashboard', request.url));
    }
    // Let all other routes (resident/*, admin/*) pass through freely
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  // 1. Redirect legacy auth routes to resident login
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/resident/login', request.url));
  }

  // Allow Supabase auth callback through (magic link & OTP exchange)
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
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
          supabaseResponse = NextResponse.next({ request });
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

    const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
    let isAdmin = false;

    if (user) {
      const userEmail = user.email?.toLowerCase().trim() || '';
      if (ADMIN_EMAILS.includes(userEmail)) {
        isAdmin = true;
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
    }

    // Root route
    if (pathname === '/') {
      if (user) {
        return NextResponse.redirect(
          new URL(isAdmin ? '/admin/dashboard' : '/resident/dashboard', request.url)
        );
      }
      return NextResponse.redirect(new URL('/resident/login', request.url));
    }

    // /resident/login
    if (pathname === '/resident/login') {
      if (user) {
        return NextResponse.redirect(
          new URL(isAdmin ? '/admin/dashboard' : '/resident/dashboard', request.url)
        );
      }
      return supabaseResponse;
    }

    // /admin/login
    if (pathname === '/admin/login') {
      if (user && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // Resident route protection
    if (pathname.startsWith('/resident/')) {
      if (!user) {
        const loginUrl = new URL('/resident/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // Admin route protection
    if (pathname.startsWith('/admin/')) {
      if (!user) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!isAdmin) {
        const accessDeniedUrl = new URL('/resident/dashboard', request.url);
        accessDeniedUrl.searchParams.set('error', 'unauthorized_admin');
        return NextResponse.redirect(accessDeniedUrl);
      }
      return supabaseResponse;
    }
  } catch {
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
