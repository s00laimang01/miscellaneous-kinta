import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static page generation since we're only using API routes
  output: 'standalone',
  // Disable image optimization since we're not using it for API-only app
  images: {
    unoptimized: true,
  },
  // Ensure we're not generating unnecessary static files
  reactStrictMode: true,
  // Add security headers including Content Security Policy
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
