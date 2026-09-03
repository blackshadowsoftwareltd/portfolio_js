/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  eslint: {
    // Do not block the build on eslint errors
    ignoreDuringBuilds: true,
  },
  // Try to disable development indicators completely
  devIndicators: false,
};

module.exports = nextConfig;
