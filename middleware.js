import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup'];

export function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/blogs', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
