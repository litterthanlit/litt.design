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
// litt.design/systems/ is served by the litt.md gallery, opening on its
// Systems page (Press, Flat, Device). It routes by hash and loads everything
// relative to its page, so it lives at /systems/ with the slash, at the root
// of its own deploy. Override locally with SYSTEMS_URL.
const SYSTEMS_URL = process.env.SYSTEMS_URL ?? "https://littmd.vercel.app";

const nextConfig: NextConfig = {
  // Next strips trailing slashes by default, which would take /systems/ back
  // to /systems and send the gallery's "./assets/" to /assets/. proxy.ts
  // strips them everywhere else, as before.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/art", destination: GALLERY_TARGET },
      { source: "/art/:path+", destination: `${GALLERY_TARGET}/:path+` },
      { source: "/studies", destination: `${STUDIES_URL}/studies` },
      { source: "/studies/:path+", destination: `${STUDIES_URL}/studies/:path+` },
      { source: "/systems/:path*", destination: `${SYSTEMS_URL}/:path*` },
    ];
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
