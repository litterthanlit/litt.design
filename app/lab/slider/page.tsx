import { workCards } from "@/data/work";
import { Grid3x2 } from "@/components/lab/slider/grid";
import { FeatureSlider } from "@/components/lab/slider/feature-slider";
import { Heading, Slider } from "@/components/lab/slider/slider";

export const metadata = { title: "Lab: slider", robots: { index: false } };

// One project at a time, in the homepage column, with the next half shown and out of focus
const FEATURES = [
  {
    title: "Description on the left",
    note: "Your pick: a caption on the left names the current project and swaps as you slide.",
    layout: "left",
  },
  {
    title: "Description on the right, fixed",
    note: "The same caption on the right. It stays put and swaps; the next picture waits past it and slides in behind the words.",
    layout: "right",
  },
  {
    title: "Description on the right, travelling",
    note: "Each picture carries its words on its right, and they slide together.",
    layout: "spread",
  },
] as const;

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
        <p className="mt-1 text-body text-muted">One project at a time with the next half in view, then two or three in view, then the six cards as a 3×2 grid.</p>
      </div>

      {FEATURES.map((feature) => (
        <div key={feature.title} className="mt-16 md:mt-24">
          <FeatureSlider cards={cards} {...feature} />
        </div>
      ))}

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
