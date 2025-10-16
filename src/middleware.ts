import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Block [slug] route for system paths - rewrite to 404
  const systemPaths = [
    '/login', '/signup', '/admin', '/api', '/search', '/agents',
    '/about', '/contact', '/blog', '/careers', '/advice', '/developments',
    '/privacy', '/terms', '/forgot-password', '/reset-password', '/property',
    '/bedsitter-for-rent-in-kasarani', '/house-rent-in-kenya',
    '/houses-for-rent-in-kenya', '/house-rent-in-nairobi',
    '/2-bedroom-rent-in-kenya', '/3-bedroom-rent-in-kenya',
    '/1-bedroom-house-for-rent-in-kisumu', '/2-bedroom-house-for-rent-in-mombasa',
    '/3-bedroom-house-for-rent-in-meru', '/real-estate-for-sale',
    '/homes-for-sale', '/houses-for-sale', '/property-for-sale',
    '/real-estate-agents-near-me'
  ];
  
  if (systemPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // For single-segment paths, validate property URL format
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    const slug = segments[0];
    const parts = slug.split('-');
    
    // Must have 5+ parts and valid UUID at end
    if (parts.length >= 5) {
      const uuid = parts.slice(-5).join('-');
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (uuidPattern.test(uuid)) {
        return NextResponse.next();
      }
    }
    
    // Not a valid property URL - let Next.js handle normally
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
