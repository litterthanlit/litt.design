import Image from "next/image";
import { Card, CardBody, CardCover, CardLink, CardTitle } from "@/components/litt/card";
import { ArrowUpRightIcon } from "@/components/litt/icons";

/**
 * Art: Nick's digital art, in litt's frame.
 *
 * The artworks are content and stay exactly as they are, animated GIF included. Everything around
 * them is litt: flat raised frames with a 1px line, one square plate size so the grid stays calm, the
 * title in body and the year in Geist Mono. Nothing here moves. The only response is the instant
 * fill step on a linked card, and the page's one light comes from the layout.
 */

type Piece = {
  title: string;
  src: string;
  /** The file's own size, so the plate can reserve its space before the image loads. */
  width: number;
  height: number;
  year: string;
  medium: string;
  /** Animated files skip the optimizer, which would flatten them. */
  animated?: boolean;
};

type Group = {
  id: string;
  title: string;
  years: string;
  description: string;
  url?: string;
  pieces: Piece[];
};

const groups: Group[] = [
  {
    id: "litt-works",
    title: "litt.works",
    years: "2024-2026",
    description:
      "Abstract digital art exploring emotional turbulence and psychological landscapes. Seven pieces: fire, emptiness, chaos, stillness.",
    url: "https://litt.works/",
    pieces: [
      { title: "Chaos", src: "/art/pieces/chaos.jpg", width: 1853, height: 1355, year: "2024", medium: "litt.works" },
      { title: "Emptiness Surrounding Me", src: "/art/pieces/emptiness.jpg", width: 1183, height: 1574, year: "2024", medium: "litt.works" },
      { title: "In the Fire", src: "/art/pieces/in-the-fire.jpg", width: 1183, height: 1574, year: "2024", medium: "litt.works" },
      { title: "Shattered", src: "/art/pieces/shattered.jpg", width: 1204, height: 1574, year: "2024", medium: "litt.works" },
      { title: "Unfiltered Projections", src: "/art/pieces/unfiltered-projections.jpg", width: 1740, height: 1355, year: "2024", medium: "litt.works" },
      { title: "Untitled I", src: "/art/pieces/untld1.jpg", width: 1301, height: 1892, year: "2024", medium: "litt.works" },
      { title: "Untitled II", src: "/art/pieces/untld2.jpg", width: 1301, height: 1892, year: "2024", medium: "litt.works" },
    ],
  },
  {
    id: "litopia",
    title: "LITOPIA",
    years: "2024-2026",
    description:
      "A scrolling visual magazine. Three chapters of art direction, motion, and curated imagery, built on Readymag.",
    url: "https://readymag.website/u286719728/4633791/",
    pieces: [
      { title: "Above the Distance", src: "/art/pieces/above-the-distance.jpeg", width: 1280, height: 934, year: "2024", medium: "LITOPIA" },
      { title: "Cacophony of the Unsound", src: "/art/pieces/cacophony-of-the-unsound.jpeg", width: 1280, height: 865, year: "2024", medium: "LITOPIA" },
      { title: "Gust Came Through Like Spring", src: "/art/pieces/gust-came-through.jpeg", width: 1280, height: 987, year: "2024", medium: "LITOPIA" },
      { title: "LITOPIA Stop Motion", src: "/art/pieces/litopia-stopmotion.gif", width: 480, height: 334, year: "2024", medium: "LITOPIA", animated: true },
    ],
  },
  {
    id: "digital",
    title: "Digital",
    years: "2025",
    description: "Standalone pieces from 2025.",
    pieces: [
      { title: "Blur", src: "/art/pieces/blur.jpg", width: 1068, height: 1280, year: "2025", medium: "Digital" },
      { title: "Buzz", src: "/art/pieces/buzz-scanned.jpeg", width: 640, height: 452, year: "2025", medium: "Mixed / Scanned" },
      { title: "Unsound Coercion", src: "/art/pieces/unsound-coercion.jpeg", width: 640, height: 512, year: "2025", medium: "Digital" },
      { title: "Quiet Collision", src: "/art/pieces/quiet-collision.jpeg", width: 640, height: 480, year: "2025", medium: "Digital" },
    ],
  },
];

const feature = {
  title: "Reaching My Self Destruction",
  src: "/art/pieces/immutart-feature/piece.jpeg",
  width: 1280,
  height: 960,
};

const featureShots = [
  { alt: "Poster", src: "/art/pieces/immutart-feature/poster.jpeg", width: 905, height: 1280 },
  { alt: "ImmutArt feature page", src: "/art/pieces/immutart-feature/feature.jpeg", width: 3917, height: 1923 },
  { alt: "ImmutArt spotlight tweet", src: "/art/pieces/immutart-feature/spotlight.png", width: 1468, height: 1728 },
  { alt: "Sold: 3,700 HBAR", src: "/art/pieces/immutart-feature/sold-tweet.png", width: 1464, height: 1532 },
];

const featureLinks = [
  { label: "ImmutArt", href: "https://immuta.art/" },
  { label: "Spotlight post", href: "https://x.com/immuta_art/status/1844058791031238957" },
  { label: "Sold", href: "https://x.com/SentXSales/status/1844720406554349835" },
];

/** An external link: the arrow says it leaves the site. */
function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 text-litt-small">
      {children}
      <ArrowUpRightIcon />
    </a>
  );
}

/** The art on its plate. `mat` leaves air around it; the work is contained, never cropped. */
function Art({ src, alt, width, height, sizes, mat = true, animated, priority }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  mat?: boolean;
  animated?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={mat ? "absolute inset-6" : "absolute inset-0"}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} unoptimized={animated} className="size-full object-contain" />
    </div>
  );
}

export function ArtPage() {
  return (
    <main>
      <section className="section" aria-labelledby="art-title">
        <div className="shell">
          <h1 id="art-title" className="text-litt-h1 text-litt-fg">
            Art
          </h1>
          <p className="mt-4 max-w-litt-reading text-litt-reading text-litt-fg-muted">
            Digital abstract art: prints, visual experiments and long-form pieces.
          </p>
        </div>
      </section>

      {groups.map((group, g) => (
        <section key={group.id} className="section" aria-labelledby={`art-${group.id}`}>
          <div className="shell">
            <div className="split">
              <div className="split-label">
                <h2 id={`art-${group.id}`} className="text-litt-h4 text-litt-fg">
                  {group.title}
                </h2>
                <p className="meta mt-1">{group.years}</p>
                <p className="mt-4 max-w-xs text-litt-small text-litt-fg-subtle">{group.description}</p>
                {group.url && (
                  <p className="mt-4">
                    <ExternalLink href={group.url}>Visit {group.title}</ExternalLink>
                  </p>
                )}
              </div>
              <ul className="split-body grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {group.pieces.map((piece, i) => (
                  <Card key={piece.src} as="li" cover="inset">
                    <CardCover ratio="1/1">
                      <Art
                        src={piece.src}
                        alt={piece.title}
                        width={piece.width}
                        height={piece.height}
                        animated={piece.animated}
                        priority={g === 0 && i < 2}
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw"
                      />
                    </CardCover>
                    <CardBody>
                      <CardTitle as="h3">
                        <CardLink href={piece.src} target="_blank" rel="noopener noreferrer">
                          {piece.title}
                          <span className="sr-only"> (full size, opens in a new tab)</span>
                        </CardLink>
                      </CardTitle>
                      <p className="meta">{piece.medium === group.title ? piece.year : `${piece.year} · ${piece.medium}`}</p>
                    </CardBody>
                  </Card>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="section section-end" aria-labelledby="art-featured">
        <div className="shell">
          <div className="split">
            <div className="split-label">
              <h2 id="art-featured" className="text-litt-h4 text-litt-fg">
                ImmutArt spotlight
              </h2>
              <p className="meta mt-1">Oct 2024</p>
              <p className="mt-4 max-w-xs text-litt-small text-litt-fg-subtle">
                Featured as New Artist Spotlight on ImmutArt, an online gallery on the Hedera network.
              </p>
              <ul className="mt-4 flex flex-col items-start gap-2">
                {featureLinks.map((link) => (
                  <li key={link.href}>
                    <ExternalLink href={link.href}>{link.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="split-body">
              <Card as="div" cover="inset">
                <CardCover ratio="4/3">
                  <Art
                    src={feature.src}
                    alt={feature.title}
                    width={feature.width}
                    height={feature.height}
                    mat={false}
                    sizes="(min-width: 1024px) 904px, 100vw"
                  />
                </CardCover>
                <CardBody>
                  <CardTitle as="h3">
                    <CardLink href={feature.src} target="_blank" rel="noopener noreferrer">
                      {feature.title}
                      <span className="sr-only"> (full size, opens in a new tab)</span>
                    </CardLink>
                  </CardTitle>
                  <p className="meta">2024 · Digital · 1/1, sold at auction for 3,700 HBAR</p>
                </CardBody>
              </Card>

              <p className="mt-8 max-w-litt-reading text-litt-reading text-litt-fg-muted">
                The piece explores emotional turbulence through layered collage, typography, and color.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {featureShots.map((shot) => (
                  <li key={shot.src} className="litt-raised rounded-litt-surface p-1">
                    <CardCover ratio="1/1">
                      <Art src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw" />
                    </CardCover>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
