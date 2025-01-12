import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:[
      {hostname: 'utfs.io'},
      {hostname: "img.clerk.com"}
    ]
  }
};

export default nextConfig;
