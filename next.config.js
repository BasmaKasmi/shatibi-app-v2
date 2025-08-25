/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // COMMENTEZ CETTE LIGNE
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    instrumentationHook: true,
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
