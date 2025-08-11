import type { NextConfig } from 'next';
import z from 'zod';
import { EnvSchema } from './src/lib/env.schema';
import logger from './src/lib/logger';

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  const tree = z.treeifyError(parsed.error);
  logger.error({ errors: tree }, '❌ Invalid environment variables');

  process.exit(1);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/webp', 'image/avif'] },
  productionBrowserSourceMaps: false,
  output: 'standalone',
  turbopack: {
    rules: {
      '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
    },
  },
};

export default nextConfig;
