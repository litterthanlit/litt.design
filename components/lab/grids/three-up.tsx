import { FlatCard } from "@/components/flat-card";
import type { WorkCard } from "@/data/work";
import { Reveal } from "@/components/reveal";

export function ThreeUp({ cards }: { cards: WorkCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Reveal key={card.key} delay={(index % 3) * 0.06}>
          <FlatCard card={card} shape="portrait" sizes="(min-width: 1024px) 368px, (min-width: 640px) 46vw, 92vw" />
        </Reveal>
      ))}
    </div>
  );
}
