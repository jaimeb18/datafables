import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow data URLs (base64) from Gemini image generation
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
