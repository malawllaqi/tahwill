import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable server components for better performance
    serverComponentsExternalPackages: ["sharp"],
  },
  // Configure for Vercel deployment
  images: {
    unoptimized: true,
  },
  // Ensure API routes work properly on Vercel
  async rewrites() {
    return [];
  },
};

export default nextConfig;
