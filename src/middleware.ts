import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only process root-level single-segment paths
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 1) {
    return NextResponse.next();
  }
  
  const slug = segments[0];
  
  // Check if it's a property URL (5+ parts with UUID at end)
  const parts = slug.split('-');
  if (parts.length >= 5) {
    const possibleUuid = parts.slice(-5).join('-');
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidPattern.test(possibleUuid)) {
      // Valid property URL - let [slug] route handle it
      return NextResponse.next();
    }
  }
  
  // Not a property URL - continue to other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|admin|property|login|signup|search|agents|about|contact|blog|careers|advice|developments|privacy|terms|forgot-password|reset-password|bedsitter-for-rent-in-kasarani|house-rent-in-kenya|houses-for-rent-in-kenya|house-rent-in-nairobi|2-bedroom-rent-in-kenya|3-bedroom-rent-in-kenya|1-bedroom-house-for-rent-in-kisumu|2-bedroom-house-for-rent-in-mombasa|3-bedroom-house-for-rent-in-meru|real-estate-for-sale|homes-for-sale|houses-for-sale|property-for-sale|real-estate-agents-near-me|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
