"use client";

import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
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

// left: a caption on the left that swaps as the track moves.
// right: the same caption, fixed on the right; the pictures pass behind it.
// spread: each picture carries its words on its right, and they move together.
type Layout = "left" | "right" | "spread";

// From lg the words take a 200px column 24px from the picture, so a picture is
// the column less 224px. Below lg the words sit above or below the track, and a
// card is most of the width, so the next one peeks inside the column.
const SLIDE: Record<Layout, string> = {
  left: "w-[78%] sm:w-[85%] lg:w-full",
  right: "w-[78%] sm:w-[85%] lg:w-[calc(100%-224px)]",
  spread: "w-[78%] sm:w-[85%] lg:w-full",
};

// The fixed caption needs the next picture to wait past it, not under it
const GAP: Record<Layout, string> = {
  left: "gap-4 sm:gap-5",
  right: "gap-4 sm:gap-5 lg:gap-[calc(224px+1.25rem)]",
  spread: "gap-4 sm:gap-5",
};

// What the track shows from lg: from the column's start to half the next picture.
// The fixed caption also cuts a window out of it, between the current picture and
// the next, so a picture on its way in passes behind the words.
const CLIP: Record<Layout, string> = {
  left: "inset(-24px calc(-50% - 1.25rem) -24px 0)",
  right:
    "polygon(evenodd, 0 -24px, calc(150% - 112px + 1.25rem) -24px, calc(150% - 112px + 1.25rem) calc(100% + 24px), 0 calc(100% + 24px), 0 -24px," +
    " calc(100% - 212px) -24px, calc(100% - 212px) calc(100% + 24px), calc(100% + 10px) calc(100% + 24px), calc(100% + 10px) -24px, calc(100% - 212px) -24px)",
  spread: "inset(-24px calc(112px - 50% - 1.25rem) -24px 0)",
};

type FeatureSliderProps = {
  cards: WorkCard[];
  title: string;
  note: string;
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

  const track = (
    <div
      className="[clip-path:inset(-24px_calc(-50%_-_1.25rem)_-24px_0)] lg:[clip-path:var(--track-clip)]"
      style={{ "--track-clip": CLIP[layout] } as CSSProperties}
    >
      <motion.div
        ref={trackRef}
        className={`relative flex cursor-grab active:cursor-grabbing ${GAP[layout]}`}
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
            className={`shrink-0 ${SLIDE[layout]}`}
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
              {layout === "spread" ? <Spread card={card} /> : <CoverCard card={card} />}
            </motion.div>
          </Slide>
        ))}
      </motion.div>
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
          {layout === "left" && (
            <div className="max-w-[680px] lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-6">
              <Panel card={cards[index]} reduce={reduce} controls={controls} className="mb-5 lg:mb-0" />
              {track}
            </div>
          )}
          {layout === "right" && (
            <div className="relative max-w-[680px]">
              {track}
              <Panel
                card={cards[index]}
                reduce={reduce}
                controls={controls}
                className="mt-5 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[200px]"
              />
            </div>
          )}
          {layout === "spread" && (
            <div className="max-w-[680px]">
              {track}
              <div className="mt-5 lg:ml-auto lg:w-[200px]">{controls}</div>
            </div>
          )}
        </div>
      </div>
    </Carousel>
  );
}

function Details({ card }: { card: WorkCard }) {
  return (
    <>
      <h3 className="text-body font-medium text-ink">{card.title}</h3>
      <p className="mt-1 text-body text-ink/60">{card.summary}</p>
      <p className="meta mt-3">
        {card.category} · {card.year}
      </p>
    </>
  );
}

// The current project's name, line and details, which swap as the track moves
function Panel({ card, reduce, controls, className }: { card: WorkCard; reduce: boolean; controls: ReactNode; className: string }) {
  return (
    <div className={`flex flex-col justify-between gap-6 ${className}`}>
      {/* Room for the longest line, so the controls never jump as the words change */}
      <div className="min-h-[6rem] lg:min-h-[7.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)", transition: { duration: reduce ? 0 : 0.12 } }}
            transition={reduce ? { duration: 0 } : SPRING}
          >
            <Details card={card} />
          </motion.div>
        </AnimatePresence>
      </div>
      {controls}
    </div>
  );
}

// The picture alone: the caption beside it carries the words
function CoverCard({ card }: { card: WorkCard }) {
  return (
    <CardLink card={card} className={FRAME}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-card-hover">
        <Image src={card.covers.landscape} alt={card.alt} fill sizes="(min-width: 1024px) 460px, 80vw" draggable={false} className="object-cover" />
      </div>
    </CardLink>
  );
}

// A picture with its words on the right, below it on a phone
function Spread({ card }: { card: WorkCard }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-6">
      <CoverCard card={card} />
      <div>
        <Details card={card} />
      </div>
    </div>
  );
}
