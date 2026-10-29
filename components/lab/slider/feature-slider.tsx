"use client";

import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, animate, clamp, motion, useMotionValue, useReducedMotion, type PanInfo } from "framer-motion";
import { CardLink } from "@/components/flat-card";
import type { WorkCard } from "@/data/work";
import { Carousel, RoundButton, SPRING, Slide, isKeyboardFocus, slidesOf, useDragGuard } from "@/components/lab/reel/carousel";
import { Heading } from "./slider";

// A throw aims where its release velocity would carry the track in this many seconds
const THROW = 0.2;
const ARROW_STEP: Partial<Record<string, -1 | 1>> = { ArrowLeft: -1, ArrowRight: 1 };

// Every card but the current one rests out of focus
const CURRENT = { filter: "blur(0px)", opacity: 1 };
const RESTING = { filter: "blur(6px)", opacity: 0.55 };

const FRAME =
  "group block h-full rounded-[12px] bg-card p-1 transition-colors duration-150 ease-out hover:bg-card-hover active:bg-card-hover focus-visible:outline-offset-4";

type Layout = "side" | "split";

// A phone and a tablet show the next card inside the column; from lg it sits past it, on the empty right
const SLIDE_WIDTH: Record<Layout, string> = {
  side: "w-[78%] sm:w-[85%] lg:w-full",
  split: "w-[78%] sm:w-[85%] lg:w-full",
};

type FeatureSliderProps = {
  cards: WorkCard[];
  title: string;
  note: string;
  // The description in a panel beside the card, or inside each card
  layout: Layout;
};

export function FeatureSlider({ cards, title, note, layout }: FeatureSliderProps) {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [lastStop, setLastStop] = useState(0);
  const guard = useDragGuard();
  const last = cards.length - 1;

  // Card i is current when its left edge sits at the start of the track
  function stops() {
    return slidesOf(trackRef.current).map((slide) => slide.offsetLeft);
  }

  function settle(next: number, velocity = 0) {
    const target = clamp(0, last, next);
    setIndex(target);
    animate(x, -stops()[target], reduce ? { duration: 0 } : { ...SPRING, velocity });
  }

  const remeasure = useEffectEvent(() => {
    const all = stops();
    setLastStop(all[last] ?? 0);
    x.jump(-(all[index] ?? 0));
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => remeasure());
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function onDragEnd(_: unknown, { velocity }: PanInfo) {
    const aim = -(x.get() + velocity.x * THROW);
    const all = stops();
    const nearest = all.reduce((best, stop, i) => (Math.abs(stop - aim) < Math.abs(all[best] - aim) ? i : best), 0);
    settle(nearest, velocity.x);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = ARROW_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    settle(index + step);
  }

  // A click on a card that isn't current brings it forward instead of opening it
  function onCardClick(event: MouseEvent, i: number) {
    if (i === index) return;
    event.preventDefault();
    settle(i);
  }

  const controls = (
    <div className="flex items-center justify-between gap-4">
      <p className="meta tabular-nums" aria-live="polite" aria-atomic="true">
        {index + 1} / {cards.length}
      </p>
      <div className="flex gap-2">
        <RoundButton icon="previous" label="Previous project" disabled={index === 0} onClick={() => settle(index - 1)} />
        <RoundButton icon="next" label="Next project" disabled={index === last} onClick={() => settle(index + 1)} />
      </div>
    </div>
  );

  return (
    <Carousel label={title} onKeyDown={onKeyDown}>
      <div className="section-shell mb-5">
        <div className="max-w-[680px]">
          <Heading title={title} note={note} />
        </div>
      </div>

      {/* clip, not hidden: a hidden box scrolls itself to show a focused card, under the transform */}
      <div className="overflow-x-clip" {...guard}>
        <div className="section-shell">
          <div className={`max-w-[680px] ${layout === "side" ? "sm:grid sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6" : ""}`}>
            {layout === "side" && <Panel card={cards[index]} reduce={reduce} controls={controls} />}

            {/* Cut at the start of the track, in line with the column, and half a card past its end */}
            <div className="[clip-path:inset(-24px_calc(-50%_-_1.25rem)_-24px_0)]">
              <motion.div
                ref={trackRef}
                className="relative flex cursor-grab gap-4 active:cursor-grabbing sm:gap-5"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -lastStop, right: 0 }}
                dragElastic={0.15}
                dragMomentum={false}
                onDragEnd={onDragEnd}
              >
                {cards.map((card, i) => (
                  <Slide
                    key={card.key}
                    index={i}
                    count={cards.length}
                    className={`shrink-0 ${SLIDE_WIDTH[layout]}`}
                    onFocus={(event) => {
                      if (isKeyboardFocus(event)) settle(i);
                    }}
                  >
                    <motion.div
                      className="h-full"
                      initial={false}
                      animate={i === index ? CURRENT : RESTING}
                      transition={reduce ? { duration: 0 } : SPRING}
                      onClickCapture={(event) => onCardClick(event, i)}
                    >
                      {layout === "side" ? <CoverCard card={card} /> : <SplitCard card={card} />}
                    </motion.div>
                  </Slide>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {layout === "split" && (
        <div className="section-shell mt-5">
          <div className="max-w-[680px]">{controls}</div>
        </div>
      )}
    </Carousel>
  );
}

// The current project's name, line and details, which swap as the track moves
function Panel({ card, reduce, controls }: { card: WorkCard; reduce: boolean; controls: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-6 sm:mb-0">
      {/* Room for the longest line, so the controls never jump as the words change */}
      <div className="min-h-[6rem] sm:min-h-[7.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)", transition: { duration: reduce ? 0 : 0.12 } }}
            transition={reduce ? { duration: 0 } : SPRING}
          >
            <h3 className="text-body font-medium text-ink">{card.title}</h3>
            <p className="mt-1 text-body text-ink/60">{card.summary}</p>
            <p className="meta mt-3">
              {card.category} · {card.year}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {controls}
    </div>
  );
}

// The picture alone: the panel beside it carries the words
function CoverCard({ card }: { card: WorkCard }) {
  return (
    <CardLink card={card} className={FRAME}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-card-hover">
        <Image src={card.covers.landscape} alt={card.alt} fill sizes="(min-width: 1024px) 460px, 80vw" draggable={false} className="object-cover" />
      </div>
    </CardLink>
  );
}

// The words on the left, the picture on the right; stacked on a phone
function SplitCard({ card }: { card: WorkCard }) {
  return (
    <CardLink card={card} className={`${FRAME} grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`}>
      <div className="order-2 flex flex-col justify-between gap-6 px-3 pt-3 pb-2.5 sm:order-1 sm:p-4">
        <div>
          <h3 className="text-body font-medium text-ink">{card.title}</h3>
          <p className="mt-1 text-body text-ink/60">{card.summary}</p>
        </div>
        <p className="meta">
          {card.category} · {card.year}
        </p>
      </div>
      <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-[8px] bg-card-hover sm:order-2">
        <Image src={card.covers.square} alt={card.alt} fill sizes="(min-width: 1024px) 400px, 80vw" draggable={false} className="object-cover" />
      </div>
    </CardLink>
  );
}
