import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Expose edit token to the admin bundle from EDIT_API_TOKEN if NEXT_* is unset.
  env: {
    NEXT_PUBLIC_EDIT_API_TOKEN:
      process.env.NEXT_PUBLIC_EDIT_API_TOKEN ??
      process.env.EDIT_API_TOKEN ??
      '',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
