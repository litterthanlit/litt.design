import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Lab", robots: { index: false } };

const PAGES = [
  { href: "/lab/grids", title: "Grids", note: "Five layouts of the same six cards" },
  { href: "/lab/reel", title: "Reel", note: "Three ways to slide through all of them" },
];

const BRAND_OPTIONS = ["brand", "brand-b", "brand-c"];

export default function LabPage() {
  return (
    <main className="section-shell pt-36 pb-24 md:pt-44">
      <div className="max-w-[680px]">
        <h1 className="text-body font-medium text-ink">Lab</h1>
        <p className="mt-1 text-body text-muted">Card prototypes. Not linked from the site.</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="block rounded-[12px] bg-card px-4 py-3 transition-colors duration-150 hover:bg-card-hover"
              >
                <span className="block text-body font-medium text-ink">{page.title}</span>
                <span className="block text-body text-ink/60">{page.note}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="eyebrow mt-16 mb-4">Brand cover options</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {BRAND_OPTIONS.map((slug) => (
            <figure key={slug} className="rounded-[12px] bg-card p-1">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-card-hover">
                <Image src={`/previews/covers/${slug}-landscape.jpg`} alt={`Brand cover, option ${slug}`} fill sizes="(min-width: 640px) 220px, 92vw" className="object-cover" />
              </div>
              <figcaption className="px-2 pt-2 pb-1 meta">{slug}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
