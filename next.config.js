const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["files.edgestore.dev"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@clerk/clerk-react": path.resolve(__dirname, "lib/mock-clerk.tsx"),
      "convex/react": path.resolve(__dirname, "lib/mock-convex.tsx"),
      "convex/react-clerk": path.resolve(__dirname, "lib/mock-convex-clerk.tsx"),
    };
    return config;
  },
};

module.exports = nextConfig;
