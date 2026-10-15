import Link from "next/link";
import type { WritingEntry } from "@/data/writing";

type WritingSectionProps = {
  entries: WritingEntry[];
};

// Airy list rows: an fg 6% fill on hover (and on press, for a finger), instant tier, color only.
const ROW = "flex items-baseline justify-between gap-4 rounded-litt-control px-3 py-3";
const ROW_LINK =
  ROW +
  " transition-colors duration-(--litt-dur-instant) ease-litt" +
  " hover:bg-[color-mix(in_oklab,var(--litt-fg)_6%,transparent)]" +
  " pointer-coarse:active:bg-[color-mix(in_oklab,var(--litt-fg)_6%,transparent)]";

export function WritingSection({ entries }: WritingSectionProps) {
  return (
    <section id="writing" aria-labelledby="writing-heading" className="section">
      <div className="shell">
        <div className="split">
          <div className="split-label">
            <h2 id="writing-heading" className="text-litt-h4 text-litt-fg">
              Writing
            </h2>
          </div>

          <ul className="split-body border-t border-litt-line">
            {entries.map((entry) => (
              <li key={entry.slug} className="border-b border-litt-line py-1">
                {entry.body ? (
                  <Link
                    href={`/writing/${entry.slug}`}
                    className={ROW_LINK}
                  >
                    <span className="text-litt-body text-litt-fg">{entry.title}</span>
                    <time dateTime={entry.date} className="meta shrink-0">
                      {entry.date}
                    </time>
                  </Link>
                ) : (
                  <div className={ROW}>
                    <span className="text-litt-body text-litt-fg-subtle">
                      {entry.title}
                      <span className="sr-only"> (draft, not yet published)</span>
                    </span>
                    <time dateTime={entry.date} className="meta shrink-0">
                      {entry.date}
                    </time>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
