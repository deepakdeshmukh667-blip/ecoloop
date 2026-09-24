import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static assets & API routes pass through immediately
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Login pages: redirect /login, /signup, /resident/login to root landing page /
  if (
    pathname === '/resident/login' ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    const rootUrl = new URL('/', request.url);
    if (request.nextUrl.search) {
      rootUrl.search = request.nextUrl.search;
    }
    return NextResponse.redirect(rootUrl);
  }

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 3. Check for local dev bypass OR demo session cookie
  const isDevBypass = process.env.DEV_BYPASS_AUTH === 'true';
  const hasDemoCookie = request.cookies.get('ecoloop_demo')?.value === 'true';
  const hasSessionCookie = !!request.cookies.get('ecoloop_session')?.value;

  if (isDevBypass || hasDemoCookie || hasSessionCookie) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/resident/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 4. Check Supabase session if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If no Supabase configured, allow open access without getting stuck
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

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

    // Root route: if authenticated redirect to dashboard, else show landing page
    if (pathname === '/') {
      if (user) {
        return NextResponse.redirect(new URL('/resident/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // Protect resident routes
    if (pathname.startsWith('/resident/')) {
      if (!user && !hasDemoCookie && !hasSessionCookie) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // Protect admin routes
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
      if (!user && !hasDemoCookie && !hasSessionCookie) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    return supabaseResponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
