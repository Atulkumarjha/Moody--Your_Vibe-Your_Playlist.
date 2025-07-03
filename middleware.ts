import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Check if the user is trying to access the dashboard
  if (pathname.startsWith('/dashboard')) {
    // Check if there's an access token cookie
    const token = request.cookies.get('access_token');
    
    if (!token) {
      // Redirect to home page if no token
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Check if the user is trying to access the playlist page
  if (pathname.startsWith('/playlist/')) {
    // Check if there's an access token cookie
    const token = request.cookies.get('access_token');
    
    if (!token) {
      // Redirect to home page if no token
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/playlist/:path*'],
};
