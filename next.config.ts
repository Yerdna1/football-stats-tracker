import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in development to reduce file operations
  productionBrowserSourceMaps: false,
  
  // Temporarily disable linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure for static export (Firebase Hosting)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Configure webpack to avoid permission issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable filesystem cache in development
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
