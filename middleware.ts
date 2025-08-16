import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get("origin");

  // Define allowed origins
  const allowedOrigins = [
    "https://www.kinta-sme.com",
    "www.kinta-sme.com",
    "http://www.kinta-sme.com",
    "https://www.kinta-sme-server.vercel.app",
    "www.kinta-sme-server.vercel.app",
    "http://www.kinta-sme-server.vercel.app",
    "https://miscellaneous-kinta.vercel.app",
    "miscellaneous-kinta.vercel.app",
    "http://miscellaneous-kinta.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin || "");

  // Get response
  const response = NextResponse.next();

  // Set CORS headers if origin is allowed
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin || "");
  } else if (process.env.NODE_ENV === "development") {
    // For development, be more permissive
    response.headers.set("Access-Control-Allow-Origin", "*");
  } else {
    // For production, only allow specified origins
    // Default to the first allowed origin if none match
    response.headers.set("Access-Control-Allow-Origin", allowedOrigins[0]);
  }

  // Set other CORS headers
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: "/api/:path*",
};
