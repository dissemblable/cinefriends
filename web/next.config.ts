import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ["image.tmdb.org", "www.themoviedb.org"]
  },
  /* config options here */
};

export default nextConfig;
