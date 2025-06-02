/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Skip static generation for pages that require database access
  output: 'standalone',
  experimental: {
    // This will make the build process skip static generation
    // for pages that require database access
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig 