import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: resolve(__dirname, '../../'),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
