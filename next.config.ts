import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
