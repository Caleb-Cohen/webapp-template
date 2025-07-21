import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  reactStrictMode: true,

  images: {
    formats: ['image/webp', 'image/avif'],
  },

  productionBrowserSourceMaps: false,

  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
