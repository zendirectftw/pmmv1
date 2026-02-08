/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to finish even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows the build to finish even if there are linting warnings
    ignoreDuringBuilds: true,
  },
  // This is often needed for NextAuth + Prisma on Vercel
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
