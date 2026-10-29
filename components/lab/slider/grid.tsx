import { FlatCard } from "@/components/flat-card";
import { Reveal } from "@/components/reveal";
import type { CoverShape, WorkCard } from "@/data/work";

// Three columns of two rows from lg; each card in a row rises a beat after the one to its left
export function Grid3x2({ cards, shape }: { cards: WorkCard[]; shape: CoverShape }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {cards.map((card, i) => (
        <Reveal key={card.key} delay={(i % 3) * 0.06}>
          <FlatCard card={card} shape={shape} className="h-full" sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 92vw" />
        </Reveal>
      ))}
    </div>
  );
}
