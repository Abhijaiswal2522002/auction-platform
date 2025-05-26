/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'api.dicebear.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'placeholder.svg'
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
}

export default nextConfig
