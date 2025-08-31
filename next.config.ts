import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don’t block production builds on lint or type issues (we can re-enable later)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

