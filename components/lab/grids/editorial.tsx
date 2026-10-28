import { FlatCard } from "@/components/flat-card";
import type { CoverShape, WorkCard } from "@/data/work";
import { Reveal } from "@/components/reveal";

// Shapes alternate down each column and across the spread, so a portrait
// always sits beside a landscape
const COLUMNS = [
  { shapes: ["landscape", "portrait", "landscape"], sizes: "(min-width: 1200px) 640px, (min-width: 768px) 56vw, 92vw", offset: "", step: 0 },
  { shapes: ["portrait", "landscape", "portrait"], sizes: "(min-width: 1200px) 460px, (min-width: 768px) 40vw, 92vw", offset: "md:pt-32 lg:pt-48", step: 1 },
] satisfies { shapes: CoverShape[]; sizes: string; offset: string; step: number }[];

// Each column reads top to bottom, so the first half of the cards fills the
// left and the phone keeps the homepage order
export function Editorial({ cards }: { cards: WorkCard[] }) {
  const half = Math.ceil(cards.length / 2);
  const columnCards = [cards.slice(0, half), cards.slice(half)];

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-[7fr_5fr] md:items-start md:gap-x-8">
      {COLUMNS.map((column, c) => (
        <div key={c} className={`grid gap-4 sm:gap-5 md:gap-8 ${column.offset}`}>
          {columnCards[c].map((card, index) => (
            <Reveal key={card.key} delay={column.step * 0.06}>
              <FlatCard card={card} shape={column.shapes[index]} sizes={column.sizes} />
            </Reveal>
          ))}
        </div>
      ))}
    </div>
  );
}
