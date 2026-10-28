import { FlatCard } from "@/components/flat-card";
import type { WorkCard } from "@/data/work";
import { Reveal } from "@/components/reveal";

// Today's homepage grid: a wide card spans the column, the rest pair up
export function Pairs({ cards }: { cards: WorkCard[] }) {
  const steps: number[] = [];
  let column = 0;
  for (const card of cards) {
    steps.push(card.wide ? 0 : column);
    column = card.wide ? 0 : 1 - column;
  }

  return (
    <div className="grid max-w-[680px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {cards.map((card, index) => (
        <Reveal key={card.key} delay={steps[index] * 0.06} className={card.wide ? "sm:col-span-2" : undefined}>
          <FlatCard
            card={card}
            shape={card.wide ? "wide" : "landscape"}
            sizes={card.wide ? "(min-width: 640px) 680px, 92vw" : "(min-width: 640px) 340px, 92vw"}
          />
        </Reveal>
      ))}
    </div>
  );
}
