import { FlatCard } from "@/components/flat-card";
import { Reveal } from "@/components/reveal";
import type { WorkCard } from "@/data/work";

export function WorkSection({ cards }: { cards: WorkCard[] }) {
  // The right card of a pair rises a beat after the left; a wide card starts a new row
  const delays: number[] = [];
  let column = 0;
  for (const card of cards) {
    delays.push(card.wide ? 0 : column * 0.06);
    column = card.wide ? 0 : 1 - column;
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="section-shell py-16 md:py-24">
      <div className="max-w-[680px]">
        <h2 id="work-heading" className="eyebrow mb-6">
          Selected work
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {cards.map((card, index) => (
            <Reveal key={card.key} delay={delays[index]} className={card.wide ? "sm:col-span-2" : undefined}>
              <FlatCard
                card={card}
                shape={card.wide ? "wide" : "landscape"}
                sizes={card.wide ? "(min-width: 640px) 680px, 92vw" : "(min-width: 640px) 340px, 92vw"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
