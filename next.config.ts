import type { NextConfig } from "next";

// litt.design/art is served by the gallery app (a separate Next.js "zone"
// built with basePath "/art"). Override locally with GALLERY_URL.
const GALLERY_URL = process.env.GALLERY_URL ?? "https://gallery-inky-xi.vercel.app";
// litt.design/studies is served by the components app (basePath "/studies").
// Override locally with STUDIES_URL.
const STUDIES_URL = process.env.STUDIES_URL ?? "https://components-sandy-nine.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/art", destination: `${GALLERY_URL}/art` },
      { source: "/art/:path+", destination: `${GALLERY_URL}/art/:path+` },
      { source: "/studies", destination: `${STUDIES_URL}/studies` },
      { source: "/studies/:path+", destination: `${STUDIES_URL}/studies/:path+` },
    ];
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
