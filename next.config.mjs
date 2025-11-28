/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ignore TS errors
  },
  async rewrites() {
    const backend = process.env.API_BASE_URL || "http://localhost:3001"; // fallback for local dev
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
