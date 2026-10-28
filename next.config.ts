import type { NextConfig } from "next";

// litt.design/art is served by the gallery app (a separate Next.js "zone"
// built with basePath "/art"). Override locally with GALLERY_URL.
const GALLERY_URL = process.env.GALLERY_URL ?? "https://gallery-inky-xi.vercel.app";
// litt.design/studies is served by the components app (basePath "/studies").
// Override locally with STUDIES_URL.
const STUDIES_URL = process.env.STUDIES_URL ?? "https://components-sandy-nine.vercel.app";
// Previews can point GALLERY_URL at a gallery preview, which needs Vercel's
// protection bypass; with GALLERY_BYPASS set, /art goes through
// app/gallery-preview to add it. Production keeps the plain rewrite.
const GALLERY_TARGET = process.env.GALLERY_BYPASS ? "/gallery-preview" : `${GALLERY_URL}/art`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/art", destination: GALLERY_TARGET },
      { source: "/art/:path+", destination: `${GALLERY_TARGET}/:path+` },
      { source: "/studies", destination: `${STUDIES_URL}/studies` },
      { source: "/studies/:path+", destination: `${STUDIES_URL}/studies/:path+` },
    ];
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
