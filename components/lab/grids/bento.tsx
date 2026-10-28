import { FlatCard } from "@/components/flat-card";
import type { CoverShape, WorkCard } from "@/data/work";
import { Reveal } from "@/components/reveal";

type Cell = { shape: CoverShape; span: string; sizes: string; step: number };

const HALF = "(min-width: 1024px) 552px, 92vw";
const HALF_FROM_SM = "(min-width: 1024px) 552px, (min-width: 640px) 46vw, 92vw";
const QUARTER = "(min-width: 1024px) 276px, (min-width: 640px) 46vw, 92vw";

// The lead card is H; these cells are the rest, in workCards() order.
// From lg the four columns read
//   H H B B
//   H H S V
//   M M W W
// and below lg, two columns: H, B, S+V, M+W.
const CELLS: Cell[] = [
  { shape: "wide", span: "sm:col-span-2", sizes: HALF, step: 1 },
  { shape: "square", span: "", sizes: QUARTER, step: 2 },
  { shape: "square", span: "", sizes: QUARTER, step: 3 },
  { shape: "wide", span: "lg:col-span-2", sizes: HALF_FROM_SM, step: 0 },
  { shape: "wide", span: "lg:col-span-2", sizes: HALF_FROM_SM, step: 1 },
];

// Two stacked cards carry two captions and a gap, so no cover shape matches
// their height: the cover grows to fill both rows instead
const FILL_TWO_ROWS = "flex h-full flex-col [&>div:first-child]:aspect-auto [&>div:first-child]:flex-1";

export function Bento({ cards }: { cards: WorkCard[] }) {
  const [lead, ...rest] = cards;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      <Reveal className="sm:col-span-2 lg:row-span-2">
        {/* FlatCard draws one cover shape, so the lead swaps cards at lg:
            a wide cover while it spans a row, a square one across two rows */}
        <div className="lg:hidden">
          <FlatCard card={lead} shape="wide" sizes="92vw" />
        </div>
        <div className="hidden h-full lg:block">
          <FlatCard card={lead} shape="square" sizes="552px" className={FILL_TWO_ROWS} />
        </div>
      </Reveal>

      {rest.map((card, index) => {
        const cell = CELLS[index];
        return (
          <Reveal key={card.key} delay={cell.step * 0.06} className={cell.span}>
            <FlatCard card={card} shape={cell.shape} sizes={cell.sizes} />
          </Reveal>
        );
      })}
    </div>
  );
}
