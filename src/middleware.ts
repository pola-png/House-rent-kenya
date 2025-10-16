import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // System routes that should never be handled by [slug]
  const systemRoutes = [
    '/login', '/signup', '/admin', '/api', '/search', '/agents',
    '/about', '/contact', '/blog', '/careers', '/advice', '/developments',
    '/privacy', '/terms', '/forgot-password', '/reset-password', '/property'
  ];
  
  // Check if path starts with any system route
  const isSystemRoute = systemRoutes.some(route => pathname.startsWith(route));
  
  if (isSystemRoute) {
    return NextResponse.next();
  }
  
  // For root-level paths, check if they look like property URLs
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length === 1) {
    const slug = pathParts[0];
    const parts = slug.split('-');
    
    // If less than 5 parts, it's not a property URL
    if (parts.length < 5) {
      return NextResponse.next();
    }
    
    // Check if last 5 parts form a valid UUID pattern
    const possibleUuid = parts.slice(-5).join('-');
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidPattern.test(possibleUuid)) {
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
