import Link from "next/link";
import type { WritingEntry } from "@/data/writing";

export function WritingArticle({ entry }: { entry: WritingEntry }) {
  return (
    <main className="shell section section-end">
      {/* The default composition: the way back in the left column (it stays in view
          on desktop), the article in the right. The text sits at litt's reading measure. */}
      <div className="split">
        <div className="split-label">
          <Link
            href="/#writing"
            className="link inline-flex min-h-litt-control-sm items-center text-litt-small pointer-coarse:min-h-litt-control-md"
          >
            All writing
          </Link>
        </div>

        <article className="split-body">
          <header>
            <h1 className="max-w-litt-reading text-litt-h1 text-litt-fg text-balance">{entry.title}</h1>
            <p className="meta mt-4">
              <time dateTime={entry.date}>{entry.date}</time>
            </p>
          </header>

          <div className="mt-12 flex flex-col gap-6">
            {entry.body?.map((paragraph, i) => (
              <p key={i} className="max-w-(--litt-measure) text-litt-reading text-litt-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
