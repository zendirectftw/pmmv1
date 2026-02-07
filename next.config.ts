import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack is now a top-level key in Next.js 16
  turbopack: {
    // This tells Next.js exactly where your project is
    root: path.join(__dirname),
  },
  
  // Any other config options go here, e.g.:
  // reactStrictMode: true,
};

export default nextConfig;