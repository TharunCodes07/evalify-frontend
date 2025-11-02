import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.17.9.74",
        port: "9002",
        pathname: "/devlabs/**",
      },
      {
        protocol: "https",
        hostname: "172.17.9.74",
        port: "9002",
        pathname: "/devlabs/**",
      },
    ],
  },
};

export default nextConfig;
