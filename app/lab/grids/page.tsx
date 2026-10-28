import type { ComponentType } from "react";
import { Bento } from "@/components/lab/grids/bento";
import { Editorial } from "@/components/lab/grids/editorial";
import { IndexList } from "@/components/lab/grids/index-list";
import { Pairs } from "@/components/lab/grids/pairs";
import { ThreeUp } from "@/components/lab/grids/three-up";
import { workCards, type WorkCard } from "@/data/work";

export const metadata = { title: "Lab: grids", robots: { index: false } };

const VARIANTS: { name: string; note: string; Layout: ComponentType<{ cards: WorkCard[] }> }[] = [
  { name: "Pairs", note: "Today's homepage. Calm and compact, with every project at the same weight.", Layout: Pairs },
  { name: "Bento", note: "Hypher leads at four times the size, and the rest still tile without a gap.", Layout: Bento },
  { name: "Three-up", note: "Equal portrait covers. Fair to every project and quick to scan.", Layout: ThreeUp },
  { name: "Editorial", note: "A magazine spread. The offset column and mixed shapes feel curated.", Layout: Editorial },
  { name: "Index", note: "The densest view. All six fit on one screen, with a cover on hover.", Layout: IndexList },
];

export default function GridsPage() {
  const cards = workCards();

  return (
    <main className="pt-36 pb-32 md:pt-44 md:pb-48">
      <header className="section-shell">
        <h1 className="text-body font-medium text-ink">Grids</h1>
        <p className="mt-1 text-body text-muted">Five layouts of the same six cards, flat and grey.</p>
      </header>

      {VARIANTS.map(({ name, note, Layout }, index) => (
        <section key={name} aria-labelledby={`grid-${index}`} className="section-shell mt-28 md:mt-44">
          <div className="mb-6 max-w-[520px]">
            <p className="meta">{String(index + 1).padStart(2, "0")}</p>
            <h2 id={`grid-${index}`} className="mt-1 text-body font-medium text-ink">
              {name}
            </h2>
            <p className="text-body text-muted">{note}</p>
          </div>
          <Layout cards={cards} />
        </section>
      ))}
    </main>
  );
}
