import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { rateLimit } from '@/lib/redis';

// Rate limiting middleware
export async function middleware(request: NextRequest) {
  // Skip rate limiting for static files and API routes that don't need it
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Temporarily disable rate limiting
  return NextResponse.next();

  // Get client IP
  // const ip = request.ip ?? '127.0.0.1';
  // const key = `ip:${ip}`;

  // Check rate limit
  // const isAllowed = await rateLimit.check(key);

  // if (!isAllowed) {
  //   return new NextResponse(
  //     JSON.stringify({
  //       error: 'Too many requests',
  //       message: 'Please try again later',
  //     }),
  //     {
  //       status: 429,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Retry-After': '60',
  //       },
  //     }
  //   );
  // }

  // return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 