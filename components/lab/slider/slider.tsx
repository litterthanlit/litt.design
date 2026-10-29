"use client";

import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { animate, clamp, motion, useMotionValue, useReducedMotion, useSpring, type PanInfo } from "framer-motion";
import { FlatCard } from "@/components/flat-card";
import type { CoverShape, WorkCard } from "@/data/work";
import { Carousel, RoundButton, SPRING, Slide, isKeyboardFocus, slidesOf, useDragGuard } from "@/components/lab/reel/carousel";

// A phone always shows one card and a peek of the next; gap-5 is 1.25rem
const WIDTH = {
  2: "w-[85%] sm:w-[calc((100%-1.25rem)/2)]",
  3: "w-[85%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]",
};
const SIZES = {
  2: "(min-width: 640px) 50vw, 85vw",
  3: "(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 85vw",
};

// A throw aims where its release velocity would carry the track in this many seconds
const THROW = 0.2;
const ARROW_STEP: Partial<Record<string, -1 | 1>> = { ArrowLeft: -1, ArrowRight: 1 };

export function Heading({ title, note, children }: { title: string; note: string; children?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-body font-medium text-ink">{title}</h2>
        <p className="max-w-[560px] text-body text-ink/60">{note}</p>
      </div>
      {children}
    </div>
  );
}

type SliderProps = {
  cards: WorkCard[];
  title: string;
  note: string;
  perView: 2 | 3;
  shape: CoverShape;
  // Arrows beside the heading with a progress bar, or a counter and arrows below
  controls: "header" | "footer";
  // The homepage's 680px column, with the track running on past it to the page edge
  column?: boolean;
};

type Layout = { stops: number[]; inView: number };

export function Slider({ cards, title, note, perView, shape, controls, column = false }: SliderProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState<Layout>({ stops: [0], inView: perView });
  const guard = useDragGuard();
  const last = layout.stops.length - 1;
  const shown = Math.min(cards.length, index + layout.inView);
  const progress = useSpring(shown / cards.length, { stiffness: SPRING.stiffness, damping: SPRING.damping });

  // A card's stop is its left edge, until the last card reaches the right edge:
  // past that the track would show empty space, so the later stops fold into one
  function measure(): Layout {
    const track = trackRef.current;
    const slides = slidesOf(track);
    if (!track || slides.length === 0) return { stops: [0], inView: perView };
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const stops: number[] = [];
    for (const slide of slides) {
      stops.push(Math.min(slide.offsetLeft, max));
      if (slide.offsetLeft >= max) break;
    }
    const width = track.clientWidth + 1;
    const inView = slides.filter((s) => s.offsetLeft + s.offsetWidth <= width).length;
    return { stops, inView: Math.max(1, inView) };
  }

  function settle(next: number, velocity = 0) {
    const target = clamp(0, last, next);
    setIndex(target);
    animate(x, -layout.stops[target], reduce ? { duration: 0 } : { ...SPRING, velocity });
  }

  const remeasure = useEffectEvent(() => {
    const next = measure();
    setLayout(next);
    const target = Math.min(index, next.stops.length - 1);
    setIndex(target);
    x.jump(-next.stops[target]);
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => remeasure());
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) progress.jump(shown / cards.length);
    else progress.set(shown / cards.length);
  }, [progress, reduce, shown, cards.length]);

  function onDragEnd(_: unknown, { velocity }: PanInfo) {
    const aim = -(x.get() + velocity.x * THROW);
    const { stops } = layout;
    const nearest = stops.reduce((best, stop, i) => (Math.abs(stop - aim) < Math.abs(stops[best] - aim) ? i : best), 0);
    settle(nearest, velocity.x);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = ARROW_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    settle(index + step);
  }

  // Tabbing to a card that is out of view brings it in at the nearer edge
  function onCardFocus(i: number) {
    if (i < index) settle(i);
    else if (i >= index + layout.inView) settle(i - layout.inView + 1);
  }

  const arrows = (
    <div className="flex shrink-0 gap-2">
      <RoundButton icon="previous" label="Previous card" disabled={index === 0} onClick={() => settle(index - 1)} />
      <RoundButton icon="next" label="Next card" disabled={index >= last} onClick={() => settle(index + 1)} />
    </div>
  );
  const readout = (
    <p className="meta tabular-nums" aria-live="polite" aria-atomic="true">
      {layout.inView > 1 ? `${index + 1}–${shown}` : index + 1} / {cards.length}
    </p>
  );
  const narrow = column ? "max-w-[680px]" : "";

  return (
    <Carousel label={title} onKeyDown={onKeyDown}>
      <div className="section-shell mb-5">
        <div className={narrow}>
          <Heading title={title} note={note}>
            {controls === "header" && arrows}
          </Heading>
        </div>
      </div>

      {/* clip, not hidden: a hidden box scrolls itself to show a focused card, under the transform */}
      <div className="overflow-x-clip" {...guard}>
        <div className="section-shell">
          {/* Cards that slide out on the left are cut at the column's edge, in line with
              the heading; on the right they run on to the page edge, as a peek */}
          <div className={`${narrow} [clip-path:inset(-24px_-100vw_-24px_0)]`}>
            <motion.div
              ref={trackRef}
              className="relative flex cursor-grab gap-4 active:cursor-grabbing sm:gap-5"
              style={{ x }}
              drag="x"
              dragConstraints={{ left: -(layout.stops[last] ?? 0), right: 0 }}
              dragElastic={0.15}
              dragMomentum={false}
              onDragEnd={onDragEnd}
            >
              {cards.map((card, i) => (
                <Slide
                  key={card.key}
                  index={i}
                  count={cards.length}
                  className={`shrink-0 ${WIDTH[perView]}`}
                  onFocus={(event) => {
                    if (isKeyboardFocus(event)) onCardFocus(i);
                  }}
                >
                  <FlatCard card={card} shape={shape} className="h-full" sizes={SIZES[perView]} />
                </Slide>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="section-shell mt-5">
        <div className={`${narrow} flex items-center justify-between gap-6`}>
          {controls === "header" ? (
            <>
              <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-card-hover" aria-hidden="true">
                <motion.div className="h-full origin-left bg-ink" style={{ scaleX: progress }} />
              </div>
              {readout}
            </>
          ) : (
            <>
              {readout}
              {arrows}
            </>
          )}
        </div>
      </div>
    </Carousel>
  );
}
