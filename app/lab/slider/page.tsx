import { workCards } from "@/data/work";
import { Grid3x2 } from "@/components/lab/slider/grid";
import { Heading, Slider } from "@/components/lab/slider/slider";

export const metadata = { title: "Lab: slider", robots: { index: false } };

const SLIDERS = [
  {
    title: "Three in view",
    note: "Three landscape cards at a time, arrows by the heading, a bar for how far along you are.",
    perView: 3,
    shape: "landscape",
    controls: "header",
  },
  {
    title: "Three in view, tall",
    note: "Portrait covers give each project more picture. The counter and arrows sit underneath.",
    perView: 3,
    shape: "portrait",
    controls: "footer",
  },
  {
    title: "Two in view",
    note: "Bigger cards, two at a time. Each cover reads at nearly half the page.",
    perView: 2,
    shape: "landscape",
    controls: "header",
  },
  {
    title: "Two in view, in the homepage column",
    note: "Starts in today's 680px column; the next card runs on into the empty right side.",
    perView: 2,
    shape: "landscape",
    controls: "footer",
    column: true,
  },
] as const;

const GRIDS = [
  { title: "Grid 3×2", note: "Every project at once, three across and two down.", shape: "landscape" },
  { title: "Grid 3×2, square", note: "The same grid with square covers, so the pictures carry more weight.", shape: "square" },
] as const;

export default function SliderPage() {
  const cards = workCards();

  return (
    <main className="pt-36 pb-24 md:pt-44">
      <div className="section-shell">
        <h1 className="text-body font-medium text-ink">Slider</h1>
        <p className="mt-1 text-body text-muted">Sliders with two or three cards in view, then the same six cards as a 3×2 grid.</p>
      </div>

      {SLIDERS.map((slider) => (
        <div key={slider.title} className="mt-16 md:mt-24">
          <Slider cards={cards} {...slider} />
        </div>
      ))}

      {GRIDS.map((grid) => (
        <section key={grid.title} className="section-shell mt-16 md:mt-24">
          <div className="mb-5">
            <Heading title={grid.title} note={grid.note} />
          </div>
          <Grid3x2 cards={cards} shape={grid.shape} />
        </section>
      ))}
    </main>
  );
}
