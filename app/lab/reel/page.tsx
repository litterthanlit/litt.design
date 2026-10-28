import type { ComponentType } from "react";
import { workCards } from "@/data/work";
import type { ReelProps } from "@/components/lab/reel/carousel";
import { DragReel } from "@/components/lab/reel/drag-reel";
import { FocusReel } from "@/components/lab/reel/focus-reel";
import { MarqueeReel } from "@/components/lab/reel/marquee-reel";

export const metadata = { title: "Lab: reel", robots: { index: false } };

const REELS: { name: string; note: string; Reel: ComponentType<ReelProps> }[] = [
  {
    name: "Drag reel",
    note: "Throw it and it lands on the nearest card. Best for stepping through the work one project at a time.",
    Reel: DragReel,
  },
  {
    name: "Marquee",
    note: "A slow strip that loops on its own. Best for showing everything at a glance, with nothing to press.",
    Reel: MarqueeReel,
  },
  {
    name: "Focus reel",
    note: "Native scroll that snaps one card to the centre. Best on trackpads and phones, where scrolling should feel like the system.",
    Reel: FocusReel,
  },
];

export default function ReelPage() {
  const cards = workCards();

  return (
    <main className="pt-36 pb-24 md:pt-44">
      <div className="section-shell">
        <h1 className="text-body font-medium text-ink">Reel</h1>
        <p className="mt-1 text-body text-muted">Three ways to slide through the six homepage cards.</p>
      </div>

      {REELS.map(({ name, note, Reel }) => (
        <div key={name} className="mt-16 md:mt-20">
          <div className="section-shell mb-5">
            <h2 className="text-body font-medium text-ink">{name}</h2>
            <p className="max-w-[560px] text-body text-ink/60">{note}</p>
          </div>
          <Reel cards={cards} label={name} />
        </div>
      ))}
    </main>
  );
}
