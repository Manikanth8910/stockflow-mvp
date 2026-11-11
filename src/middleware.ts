import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/api/auth/login', '/api/auth/signup'];
const TOKEN_COOKIE_NAME = 'stockflow_token';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Let public auth routes through
  const isPublicAuthPage = pathname === '/login' || pathname === '/signup';
  const isPublicAuthApi = pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/signup');

  if (isPublicAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (isPublicAuthApi) {
    return NextResponse.next();
  }

  // Public root landing page
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Protected pages & APIs
  const isProtectedPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/organizations');

  const isProtectedApi =
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/dashboard') ||
    pathname.startsWith('/api/settings') ||
    pathname.startsWith('/api/seed') ||
    pathname.startsWith('/api/auth/me') ||
    pathname.startsWith('/api/organizations');

  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isProtectedPage) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/products/:path*',
    '/settings/:path*',
    '/api/products/:path*',
    '/api/dashboard/:path*',
    '/api/settings/:path*',
    '/api/seed/:path*',
    '/api/auth/me',
  ],
};
