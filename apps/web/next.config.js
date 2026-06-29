/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@footballeroo/shared'],
  turbopack: {
    root: '../../',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/fixtures/:path*',
        destination: `${apiUrl}/api/fixtures/:path*`,
      },
      {
        source: '/api/menu/:path*',
        destination: `${apiUrl}/api/menu/:path*`,
      },
      {
        source: '/api/profile/:path*',
        destination: `${apiUrl}/api/profile/:path*`,
      },
      {
        source: '/api/images/:path*',
        destination: `${apiUrl}/api/images/:path*`,
      },
      {
        source: '/api/simulate/:path*',
        destination: `${apiUrl}/api/simulate/:path*`,
      },
      {
        source: '/api/admin/:path*',
        destination: `${apiUrl}/api/admin/:path*`,
      },
      {
        source: '/api/orders/:path*',
        destination: `${apiUrl}/api/orders/:path*`,
      },
      {
        source: '/api/health',
        destination: `${apiUrl}/api/health`,
      },
    ];
  },
};

module.exports = nextConfig;
