/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      DB_ADDRESS: process.env.DB_ADDRESS,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
  };
  
  export default nextConfig;  