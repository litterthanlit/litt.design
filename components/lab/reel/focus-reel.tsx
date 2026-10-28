"use client";

import { useRef, useState, type RefObject } from "react";
import { clamp, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { FlatCard } from "@/components/flat-card";
import type { WorkCard } from "@/data/work";
import { Carousel, ReelControls, SPRING, Slide, isKeyboardFocus, slidesOf, type ReelProps } from "./carousel";

// Progress runs from the card sitting one card width right of centre (0) to one
// card width left of it (1), so 0.5 is centred
const ONE_CARD_EITHER_SIDE: [number, number][] = [
  [-0.5, 0.5],
  [1.5, 0.5],
];

export function FocusReel({ cards, label }: ReelProps) {
  const reduce = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: rowRef });
  const [index, setIndex] = useState(0);
  const last = cards.length - 1;

  // The row's padding centres card 0 at scrollLeft 0, so card i is centred i steps along
  function step() {
    const [first, second] = slidesOf(rowRef.current);
    return second.offsetLeft - first.offsetLeft;
  }

  useMotionValueEvent(scrollX, "change", (left) => setIndex(clamp(0, last, Math.round(left / step()))));

  function centre(i: number) {
    rowRef.current?.scrollTo({ left: i * step(), behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <Carousel label={label}>
      <div
        ref={rowRef}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-var(--slide)/2)] py-3 [--slide:70vw] [scrollbar-width:none] sm:gap-5 sm:[--slide:360px] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <FocusSlide key={card.key} card={card} index={i} count={cards.length} rowRef={rowRef} onKeyboardFocus={() => centre(i)} />
        ))}
      </div>
      <ReelControls index={index} count={cards.length} onStep={(step) => centre(clamp(0, last, index + step))} />
    </Carousel>
  );
}

type FocusSlideProps = {
  card: WorkCard;
  index: number;
  count: number;
  rowRef: RefObject<HTMLDivElement | null>;
  onKeyboardFocus: () => void;
};

function FocusSlide({ card, index, count, rowRef, onKeyboardFocus }: FocusSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: rowRef, target: ref, axis: "x", offset: ONE_CARD_EITHER_SIDE });
  const scale = useSpring(useTransform(scrollXProgress, [0, 0.5, 1], [0.88, 1, 0.88]), SPRING);
  const opacity = useSpring(useTransform(scrollXProgress, [0, 0.5, 1], [0.6, 1, 0.6]), SPRING);

  return (
    <Slide
      ref={ref}
      index={index}
      count={count}
      className="w-(--slide) shrink-0 snap-center"
      onFocus={(event) => {
        if (isKeyboardFocus(event)) onKeyboardFocus();
      }}
    >
      {/* Under reduced motion every card stays full size and full strength */}
      <motion.div style={{ scale, opacity }} className="h-full motion-reduce:transform-none! motion-reduce:opacity-100!">
        <FlatCard card={card} shape="portrait" className="h-full" sizes="(min-width: 640px) 360px, 70vw" />
      </motion.div>
    </Slide>
  );
}
