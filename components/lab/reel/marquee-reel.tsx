"use client";

import { useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { animate, clamp, motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, wrap, type PanInfo } from "framer-motion";
import { FlatCard } from "@/components/flat-card";
import { Carousel, RoundButton, SPRING, Slide, isKeyboardFocus, useDragGuard, type ReelProps } from "./carousel";

// Cruising speed, px per second
const SPEED = 36;
// Critically damped, so the strip slows to a stop without rolling back
const CRUISE = { stiffness: 100, damping: 20 };
// The closest a focused card may sit to the viewport edge
const EDGE = 24;
// Focus pulls the middle copy anywhere on screen, and a copy either side keeps both ends filled
const COPIES = ["before", "real", "after"] as const;

// Hover and the pause button ease the strip to a stop. Focus and drag move x
// themselves, so the loop leaves it alone while either holds.
type Hold = "hover" | "paused" | "focus" | "drag";

export function MarqueeReel({ cards, label }: ReelProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const speed = useSpring(SPEED, CRUISE);
  const copyRef = useRef<HTMLDivElement>(null);
  const holds = useRef(new Set<Hold>());
  const [paused, setPaused] = useState(false);
  const guard = useDragGuard();

  function hold(reason: Hold, on: boolean) {
    if (on) holds.current.add(reason);
    else holds.current.delete(reason);
    speed.set(holds.current.size > 0 ? 0 : SPEED);
  }

  function moveBy(distance: number) {
    const loop = copyRef.current?.offsetWidth;
    if (loop) x.set(wrap(-loop, 0, x.get() + distance));
  }

  useAnimationFrame((_, delta) => {
    if (reduce || holds.current.has("focus") || holds.current.has("drag")) return;
    moveBy((-speed.get() * delta) / 1000);
  });

  function onPan(_: unknown, { delta }: PanInfo) {
    if (!reduce) moveBy(delta.x);
  }

  function onPanEnd(_: unknown, { velocity }: PanInfo) {
    // The throw carries on as speed, then eases back to cruising
    speed.jump(-velocity.x);
    hold("drag", false);
  }

  function onHover(event: PointerEvent, on: boolean) {
    if (event.pointerType === "mouse") hold("hover", on);
  }

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    if (isKeyboardFocus(event)) hold("focus", true);
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) hold("focus", false);
  }

  function reveal(slide: HTMLElement) {
    if (reduce) return;
    const { left, right } = slide.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    // The smallest shift that shows the whole card
    const shift = clamp(EDGE - left, width - EDGE - right, 0);
    animate(x, x.get() + shift, SPRING);
  }

  return (
    <Carousel label={label} onFocus={onFocus} onBlur={onBlur}>
      <div
        className="overflow-x-clip motion-reduce:overflow-x-auto motion-reduce:py-2"
        {...guard}
        onPointerEnter={(event) => onHover(event, true)}
        onPointerLeave={(event) => onHover(event, false)}
      >
        <motion.div
          className="flex w-max cursor-grab active:cursor-grabbing motion-safe:touch-pan-y"
          style={{ x }}
          onPanStart={() => hold("drag", true)}
          onPan={onPan}
          onPanEnd={onPanEnd}
        >
          {COPIES.map((copy) => (
            <div
              key={copy}
              ref={copy === "real" ? copyRef : undefined}
              inert={copy !== "real"}
              className={`flex gap-4 pr-4 sm:gap-5 sm:pr-5 ${copy === "real" ? "" : "motion-reduce:hidden"}`}
            >
              {cards.map((card, i) => (
                <Slide
                  key={card.key}
                  index={i}
                  count={cards.length}
                  className="w-[200px] shrink-0 sm:w-[260px]"
                  onFocus={(event) => {
                    if (isKeyboardFocus(event)) reveal(event.currentTarget);
                  }}
                >
                  <FlatCard card={card} shape="square" className="h-full" sizes="(min-width: 640px) 260px, 200px" />
                </Slide>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      <div className="section-shell mt-5 flex justify-end motion-reduce:hidden">
        <RoundButton
          icon={paused ? "play" : "pause"}
          label={paused ? "Play reel" : "Pause reel"}
          onClick={() => {
            hold("paused", !paused);
            setPaused(!paused);
          }}
        />
      </div>
    </Carousel>
  );
}
