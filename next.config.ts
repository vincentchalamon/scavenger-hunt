import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  distDir: 'docs',
};

export default nextConfig;
