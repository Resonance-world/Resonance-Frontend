import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Allow guest access to these routes for development/testing
  const guestAllowedRoutes = [
    '/',
    '/onboarding',
    '/onboarding/gift',
    '/onboarding/loading', 
    '/test',
    '/guest',
    '/api/auth',
  ];
  
  // Check if current path is guest-allowed
  const isGuestAllowed = guestAllowedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // If guest-allowed route, continue without auth check
  if (isGuestAllowed) {
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  if (!req.auth) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
