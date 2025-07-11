import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  { path: '/products', whenAuthenticated: 'next' },
  { path: '/about-us', whenAuthenticated: 'next' },
  { path: '/politics', whenAuthenticated: 'next' },
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/sign-up', whenAuthenticated: 'redirect' },
] as const;
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = 'sign-in';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.filter(
    (item) => pathname.startsWith(item.path) || pathname === '/',
  );
  const token = request.cookies.get('token')?.value;
  const redirectUrl = request.nextUrl.clone();

  if (!token && isPublic.length === 1) {
    return NextResponse.next();
  }

  if (token && isPublic.length === 1) {
    if (isPublic[0].whenAuthenticated === 'redirect') {
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.next();
    }
  }

  if (!token && isPublic.length === 0) {
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
