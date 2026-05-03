/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. New: Cloudinary image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  
  // 2. Existing: Your server actions and body size limits
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'obscure-couscous-xrwp9xwv464v3p59j-3000.app.github.dev'
      ],
      bodySizeLimit: '50mb' 
    },
    proxyClientMaxBodySize: '50mb'
  }
};

export default nextConfig;