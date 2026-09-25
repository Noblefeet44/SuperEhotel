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
        source: '/restaurant/admin',
        destination: '/admin/restaurant',
        permanent: true,
      },
      {
        source: '/gym/admin',
        destination: '/admin/gym',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
