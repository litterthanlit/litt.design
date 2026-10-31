"use client";

import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, clamp, motion, useMotionValue, useReducedMotion, type PanInfo } from "framer-motion";
import { Carousel, RoundButton, SPRING, Slide, isKeyboardFocus, slidesOf, useDragGuard } from "@/components/carousel";
import { HomeRow } from "@/components/home-row";
import type { WorkCard } from "@/data/work";

// A throw aims where its release velocity would carry the track in this many seconds
const THROW = 0.2;
const ARROW_STEP: Partial<Record<string, -1 | 1>> = { ArrowLeft: -1, ArrowRight: 1 };

// Every picture but the current one rests out of focus, and fades out from its
// left edge across --fade-length of its width, so the next one dissolves into
// the page instead of ending in a hard cut. Coming forward, the fade sweeps off.
const CURRENT = { filter: "blur(0px)", opacity: 1, "--fade": "100%" };
const RESTING = { filter: "blur(6px)", opacity: 0.55, "--fade": "0%" };
const FADE = "linear-gradient(to right, #000 var(--fade), transparent calc(var(--fade) + var(--fade-length)))";

// From lg the row's 680px content column holds a 456px picture, 24px of air and
// the 200px caption; the next picture waits 20px past the column, at 700px. This
// mask starts 8px left of the column so the current picture's focus ring shows,
// and ends with the next picture. It hides the caption's strip, so a picture on
// its way in passes behind the words, not over them.
const MASK = "linear-gradient(to right, #000 0, #000 464px, transparent 488px, transparent 688px, #000 708px)";

export function WorkSection({ cards }: { cards: WorkCard[] }) {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [lastStop, setLastStop] = useState(0);
  const guard = useDragGuard();
  const last = cards.length - 1;

  // Picture i is current when its left edge sits at the start of the track
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

  // A click on a picture that isn't current brings it forward instead of opening it
  function onPictureClick(event: MouseEvent, i: number) {
    if (i === index) return;
    event.preventDefault();
    settle(i);
  }

  return (
    // clip, not hidden: a hidden box scrolls itself to show a focused card, under the transform
    <HomeRow id="work" label="Work" className="overflow-x-clip">
      <Carousel label="Selected work" onKeyDown={onKeyDown}>
        {/* flow-root keeps the mask box's negative margins inside, so the caption spans the picture */}
        <div className="relative flow-root max-w-[680px]">
          {/* Below lg the next picture peeks inside the column, cut at its start; from lg the mask
              box runs 8px left of the column and 476px past it, to the next picture's end */}
          <div
            {...guard}
            className="-my-6 py-6 max-lg:[clip-path:inset(0_calc(-50%_-_1.25rem)_0_0)] lg:-mr-[476px] lg:-ml-2 lg:pl-2 lg:[mask-image:var(--work-mask)] lg:[-webkit-mask-image:var(--work-mask)]"
            style={{ "--work-mask": MASK } as CSSProperties}
          >
            <div className="lg:mr-[476px]">
              <motion.div
                ref={trackRef}
                className="relative flex cursor-grab gap-4 active:cursor-grabbing sm:gap-5 lg:gap-[calc(224px+1.25rem)]"
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
                    className="w-[78%] shrink-0 [--fade-length:30%] sm:w-[85%] sm:[--fade-length:20%] lg:w-[calc(100%-224px)] lg:[--fade-length:70%]"
                    onFocus={(event) => {
                      if (isKeyboardFocus(event)) settle(i);
                    }}
                  >
                    {/* 8px of room around the picture keeps its focus ring inside the mask */}
                    <motion.div
                      className="-m-2 h-[calc(100%+1rem)] p-2"
                      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
                      initial={false}
                      animate={i === index ? CURRENT : RESTING}
                      transition={reduce ? { duration: 0 } : SPRING}
                      onClickCapture={(event) => onPictureClick(event, i)}
                    >
                      <Picture card={card} />
                    </motion.div>
                  </Slide>
                ))}
              </motion.div>
            </div>
          </div>

          <Caption card={cards[index]} reduce={reduce}>
            <p className="meta tabular-nums" aria-live="polite" aria-atomic="true">
              {index + 1} / {cards.length}
            </p>
            <div className="flex gap-2">
              <RoundButton icon="previous" label="Previous project" disabled={index === 0} onClick={() => settle(index - 1)} />
              <RoundButton icon="next" label="Next project" disabled={index === last} onClick={() => settle(index + 1)} />
            </div>
          </Caption>
        </div>
      </Carousel>
    </HomeRow>
  );
}

// The current project's name, line and details, which swap as the track moves.
// Below lg it sits under the pictures; from lg it holds still on the right.
function Caption({ card, reduce, children }: { card: WorkCard; reduce: boolean; children: ReactNode }) {
  return (
    <div className="mt-5 flex flex-col justify-between gap-6 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[200px]">
      {/* Room for the longest line, so the controls never jump as the words change */}
      <div className="min-h-[6.25rem] lg:min-h-[7.5rem]">
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
      <div className="flex items-center justify-between gap-4">{children}</div>
    </div>
  );
}

// The picture in its grey frame, linking to the project: <Link> inside this app,
// a plain <a> to /art
function Picture({ card }: { card: WorkCard }) {
  const frame =
    "group block h-full rounded-[12px] bg-card p-1 transition-colors duration-150 ease-out hover:bg-card-hover active:bg-card-hover focus-visible:outline-offset-4";
  const image = (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-card-hover">
      <Image src={card.cover} alt={card.alt} fill sizes="(min-width: 1024px) 460px, 80vw" draggable={false} className="object-cover" />
    </div>
  );
  return card.sameApp ? (
    <Link href={card.href} transitionTypes={["nav-forward"]} className={frame}>
      {image}
    </Link>
  ) : (
    <a href={card.href} className={frame}>
      {image}
    </a>
  );
}
