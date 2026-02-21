import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["snowflake-sdk"],
  images: {
    // Allow data URLs (base64) from Gemini image generation
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
