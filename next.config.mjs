/** @type {import('next').NextConfig} */
import { createRequire } from 'module'; // Import createRequire to enable require in ESM
const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  env: {
    DB_ADDRESS: process.env.DB_ADDRESS,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config) => {
    // Fix for validator or other Webpack compatibility
    config.resolve.alias['validator'] = require.resolve('validator');
    return config;
  },
};

export default nextConfig;