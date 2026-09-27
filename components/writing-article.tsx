import Link from "next/link";
import type { WritingEntry } from "@/data/writing";

export function WritingArticle({ entry }: { entry: WritingEntry }) {
  return (
    <main className="section-shell min-h-screen max-w-2xl pb-20 pt-36 md:pt-44">
      <p className="meta">
        {entry.date}
      </p>

      <h1 className="mt-2 text-intro font-medium text-ink">
        {entry.title}
      </h1>

      <div className="mt-12 space-y-6">
        {entry.body?.map((paragraph, i) => (
          <p
            key={i}
            // Long-form prose is the one exception to the 14px body size
            className="text-[15px] leading-[1.8] text-[#404040]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <Link
        href="/#writing"
        {...{ transitionTypes: ["nav-back"] } as any}
        className="mt-16 inline-block text-body text-muted transition-colors duration-150 hover:text-ink"
      >
        Back
      </Link>
    </main>
  );
}
