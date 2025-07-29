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
};

export default nextConfig;
