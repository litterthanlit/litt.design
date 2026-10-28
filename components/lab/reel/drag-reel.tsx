"use client";

import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent } from "react";
import { animate, clamp, motion, useMotionValue, useReducedMotion, type PanInfo } from "framer-motion";
import { FlatCard } from "@/components/flat-card";
import { Carousel, ReelControls, SPRING, Slide, isKeyboardFocus, slidesOf, useDragGuard, type ReelProps } from "./carousel";

// A throw aims where its release velocity would carry the track in this many seconds
const THROW = 0.2;
const ARROW_STEP: Partial<Record<string, -1 | 1>> = { ArrowLeft: -1, ArrowRight: 1 };

export function DragReel({ cards, label }: ReelProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [lastStop, setLastStop] = useState(0);
  const guard = useDragGuard();
  const last = cards.length - 1;

  // Card i rests where card 0 starts, so its stop is its own left edge
  function stops() {
    return slidesOf(trackRef.current).map((slide) => slide.offsetLeft);
  }

  function settle(next: number, velocity = 0) {
    setIndex(next);
    animate(x, -stops()[next], reduce ? { duration: 0 } : { ...SPRING, velocity });
  }

  const remeasure = useEffectEvent(() => {
    const all = stops();
    setLastStop(all[last]);
    x.jump(-all[index]);
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
    const next = clamp(0, last, index + step);
    const link = slidesOf(trackRef.current)[next].querySelector("a");
    // On a card, focus moves with the reel, and focusing the card settles it
    if (link && trackRef.current?.contains(event.target as Node)) link.focus();
    else settle(next);
  }

  return (
    <Carousel label={label} onKeyDown={onKeyDown}>
      {/* clip, not hidden: a hidden box scrolls itself to show a focused card, under the transform */}
      <div className="overflow-x-clip" {...guard}>
        <div className="section-shell">
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
                className="w-[78vw] shrink-0 sm:w-[400px] lg:w-[440px]"
                onFocus={(event) => {
                  if (isKeyboardFocus(event)) settle(i);
                }}
              >
                <FlatCard card={card} className="h-full" sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 78vw" />
              </Slide>
            ))}
          </motion.div>
        </div>
      </div>
      <ReelControls index={index} count={cards.length} onStep={(step) => settle(clamp(0, last, index + step))} />
    </Carousel>
  );
}
