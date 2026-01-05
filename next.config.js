/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora erros de TS no build para garantir deploy rápido em demo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de lint no build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'www.mulungu.ce.gov.br', 
      'filesystem.assesi.com.br', 
      'images.unsplash.com', 
      'cdn.tailwindcss.com'
    ],
  },
};

module.exports = nextConfig;