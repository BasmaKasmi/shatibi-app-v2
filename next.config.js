/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    instrumentationHook: true,
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: true,
  // Ignorer les routes API pour l'export
  async generateBuildId() {
    return 'static-export'
  },
  // Ou essayer cette config alternative
  distDir: 'out'
};
module.exports = nextConfig;
