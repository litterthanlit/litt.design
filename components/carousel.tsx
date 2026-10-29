"use client";

import { useRef, type DragEvent, type FocusEvent, type MouseEvent, type PointerEvent, type ReactNode, type Ref } from "react";
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";

export const SPRING = { type: "spring", stiffness: 260, damping: 25 } as const;

const entrance: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } },
};

type CarouselProps = { label: string } & Pick<HTMLMotionProps<"div">, "children" | "onKeyDown" | "onFocus" | "onBlur">;

// The region starts its slides' entrance when it scrolls into view
export function Carousel({ label, ...rest }: CarouselProps) {
  return (
    <motion.div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
      {...rest}
    />
  );
}

type SlideProps = {
  index: number;
  count: number;
  className?: string;
  children: ReactNode;
  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
  ref?: Ref<HTMLDivElement>;
};

// The server renders the hidden first frame without knowing the motion setting,
// so CSS shows a slide at once under reduced motion, before it scrolls into view
export function Slide({ index, count, className = "", ...rest }: SlideProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      className={`motion-reduce:opacity-100! motion-reduce:transform-none! motion-reduce:filter-none! ${className}`}
      variants={entrance}
      transition={reduce ? { duration: 0 } : { ...SPRING, delay: index * 0.05 }}
      {...rest}
    />
  );
}

const ICONS = {
  previous: "M10 3.5 5.5 8l4.5 4.5",
  next: "M6 3.5 10.5 8 6 12.5",
  pause: "M5.5 3.5v9M10.5 3.5v9",
  play: "M5.5 3.5v9l7-4.5z",
};

type RoundButtonProps = { icon: keyof typeof ICONS; label: string; disabled?: boolean; onClick: () => void };

// aria-disabled rather than disabled, so focus stays on the button at either end
export function RoundButton({ icon, label, disabled = false, onClick }: RoundButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className="grid size-11 place-items-center rounded-full bg-card text-ink transition-[background-color,scale] duration-150 ease-out hover:bg-card-hover active:scale-[0.96] aria-disabled:cursor-default aria-disabled:text-ink/30 aria-disabled:hover:bg-card aria-disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICONS[icon]} />
      </svg>
    </button>
  );
}

export function slidesOf(element: HTMLElement | null): HTMLElement[] {
  return element ? Array.from(element.children as HTMLCollectionOf<HTMLElement>) : [];
}

// A mouse click focuses a link too, and that must not move a reel
export function isKeyboardFocus(event: FocusEvent<Element>) {
  return event.target.matches(":focus-visible");
}

// A press that travels further than this is a drag, not a click on the card under it
const CLICK_SLOP = 6;

// Spread on the element around a draggable track of links
export function useDragGuard() {
  const start = useRef<{ x: number; y: number } | null>(null);
  const travelled = useRef(false);

  return {
    onPointerDownCapture(event: PointerEvent) {
      start.current = { x: event.clientX, y: event.clientY };
      travelled.current = false;
    },
    onPointerMoveCapture(event: PointerEvent) {
      if (start.current && Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > CLICK_SLOP) {
        travelled.current = true;
      }
    },
    // detail is 0 for a click from the keyboard, which is never a drag
    onClickCapture(event: MouseEvent) {
      if (travelled.current && event.detail > 0) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    // Otherwise the browser starts dragging the link itself and cancels the pointer
    onDragStart(event: DragEvent) {
      event.preventDefault();
    },
  };
}
