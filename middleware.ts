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

  // 2. Legacy login pages → redirect to root landing page
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

  // 3. Fast-path: dev bypass or demo cookie
  const isDevBypass = process.env.DEV_BYPASS_AUTH === 'true';
  const hasDemoCookie = request.cookies.get('ecoloop_demo')?.value === 'true';
  const hasSessionCookie = !!request.cookies.get('ecoloop_session')?.value;

  if (isDevBypass || hasDemoCookie) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/resident/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 4. Check Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
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

    const isAuthenticated = !!user || hasSessionCookie;

    // Root route: authenticated users go to dashboard, others see landing page
    if (pathname === '/') {
      if (user) {
        // Check if admin
        const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
        const userEmail = user.email?.toLowerCase().trim() || '';
        const isAdminEmail = ADMIN_EMAILS.includes(userEmail);

        if (isAdminEmail) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        // Check profile role
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (
            profile?.role === 'admin' ||
            profile?.role === 'society_admin' ||
            profile?.role === 'municipal_admin'
          ) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
          }
        } catch {
          // ignore profile fetch error
        }

        return NextResponse.redirect(new URL('/resident/dashboard', request.url));
      }

      // Not authenticated — show landing page (no redirect, no loop)
      return supabaseResponse;
    }

    // Protect resident routes
    if (pathname.startsWith('/resident/')) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // Protect admin routes
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
      if (!isAuthenticated) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    return supabaseResponse;
  } catch {
    // On any error, just pass through — don't block the user
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
