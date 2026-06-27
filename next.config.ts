import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ["*.lhr.life", "*.loca.lt", "*.ngrok-free.app", "192.168.1.113", "10.134.140.198"]
  }
};

export default nextConfig;
