import type { ReactNode } from "react";

type HomeRowProps = {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
};

// One row of the homepage grid: a muted label in a 120px column, and a 680px
// content column beside it. Below md the label sits on top.
export function HomeRow({ id, label, className, children }: HomeRowProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={className}>
      <div className="section-shell">
        <div className="grid max-w-[800px] gap-2 py-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-0 md:py-10">
          <h2 id={`${id}-heading`} className="eyebrow">
            {label}
          </h2>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
