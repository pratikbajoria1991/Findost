/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  // Bundle markdown content into the serverless functions on Vercel.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/training/**/*"],
    "/blog": ["./content/**/*"],
    "/blog/[slug]": ["./content/**/*"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.googleusercontent.com" }],
  },
};

export default nextConfig;