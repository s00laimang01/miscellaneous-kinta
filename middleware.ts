import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin');
  
  // Define allowed origins
  const allowedOrigins = [
    'https://www.kinta-sme.com',
    'https://www.kinta-sme-server.vercel.app'
  ];

  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin || '');

  // Get response
  const response = NextResponse.next();

  // Set CORS headers if origin is allowed
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin || '');
  } else {
    // For development or unknown origins, you might want to be more permissive
    // Remove this in production if you want strict CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  // Set other CORS headers
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: '/api/:path*',
};