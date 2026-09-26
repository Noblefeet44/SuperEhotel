import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/gym',
        destination: '/hall',
        permanent: true,
      },
      {
        source: '/gym/:path*',
        destination: '/hall',
        permanent: true,
      },
      {
        source: '/restaurant/admin',
        destination: '/admin/restaurant',
        permanent: true,
      },
      {
        source: '/gym/admin',
        destination: '/admin/hall',
        permanent: true,
      },
      {
        source: '/admin/gym',
        destination: '/admin/hall',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
