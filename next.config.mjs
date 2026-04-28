/** @type {import('next').NextConfig} */
const nextConfig = {
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