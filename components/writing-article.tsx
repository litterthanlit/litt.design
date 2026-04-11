import Link from "next/link";
import type { WritingEntry } from "@/data/writing";

export function WritingArticle({ entry }: { entry: WritingEntry }) {
  return (
    <main className="section-shell min-h-screen max-w-2xl pb-20 pt-36 md:pt-44">
      <p className="font-mono text-[11px] tabular-nums text-[#a3a3a3]">
        {entry.date}
      </p>

      <h1 className="mt-4 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[#0a0a0a]">
        {entry.title}
      </h1>

      <div className="mt-12 space-y-6">
        {entry.body?.map((paragraph, i) => (
          <p
            key={i}
            className="text-[15px] leading-[1.8] text-[#525252]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <Link
        href="/#writing"
        {...{ transitionTypes: ["nav-back"] } as any}
        className="mt-16 inline-block text-[13px] text-[#a3a3a3] transition-colors duration-150 hover:text-[#0a0a0a]"
      >
        Back
      </Link>
    </main>
  );
}
