"use client";

/**
 * Craft: twelve small interaction studies, tuned to litt.md's three motion tiers.
 *
 * - Hover and press are the instant tier (CSS, color and scale only).
 * - Anything that toggles, morphs or settles is the responsive spring (bounce 0).
 * - One study, Cascade, is the page's expressive moment (bounce 0.12). Nothing else bounces.
 * - Exits are quicker than entrances and never bounce. Only transform and opacity animate.
 * - Dragging follows the pointer one to one. On release the object springs back on the
 *   responsive tier with the speed it was let go at.
 * - Every timing comes from the hooks in lib/litt/motion, so reduced motion works everywhere.
 *
 * The page itself has no entrance, no scroll reveal and no loop. Each study moves only when
 * you act on it.
 */
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
  type Transition,
  type ValueAnimationTransition,
  type Variants,
} from "motion/react";
import { Button } from "@/components/litt/button";
import { Card, CardBody, CardCover, CardDescription, CardLink, CardTitle } from "@/components/litt/card";
import { CheckIcon, PlusIcon } from "@/components/litt/icons";
import { Segmented } from "@/components/litt/segmented";
import { Tag } from "@/components/litt/tag";
import { useExit, useStagger, useTransition, useTravel } from "@/lib/litt/motion";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

type Tier = "instant" | "responsive" | "expressive";

/** A raised object on the stage: the line-strong hairline and the top highlight, and no shadow. Add a fill. */
const OBJECT = "rounded-litt-surface shadow-[inset_0_0_0_1px_var(--litt-line-strong),var(--litt-highlight)]";

/** A fill that fades at the instant tier. The OS tap flash is off, so it does not double the press. */
const FADE = "transition-colors duration-(--litt-dur-instant) ease-litt [-webkit-tap-highlight-color:transparent]";

const clamp = (n: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, n));

/** Spring a value to a target on a tier, starting from the speed it already has. */
function go(value: MotionValue<number>, to: number, how: Transition, velocity = value.getVelocity()) {
  return animate(value, to, { ...how, velocity } as ValueAnimationTransition<number>);
}

/**
 * Springs values back to rest on the responsive tier. It never bounces, and it starts from the
 * speed the object was released at. `stop` hands the values back to a new grab.
 */
function useSpringBack(...values: MotionValue<number>[]) {
  const enter = useTransition("responsive");
  const running = useRef<AnimationPlaybackControls[]>([]);

  const stop = () => {
    running.current.forEach((c) => c.stop());
    running.current = [];
  };
  const to = (targets: number[], velocities: number[] = []) => {
    stop();
    running.current = values.map((v, i) => go(v, targets[i], enter, velocities[i]));
  };
  return { stop, to, release: (velocities?: number[]) => to(values.map(() => 0), velocities) };
}

const ARROWS = new Map<string, [number, number]>([
  ["ArrowLeft", [-1, 0]],
  ["ArrowRight", [1, 0]],
  ["ArrowUp", [0, -1]],
  ["ArrowDown", [0, 1]],
]);

/**
 * The keyboard way to do a pull: holding an arrow key holds the pull, letting go releases it.
 * A drag is never the only way.
 */
function usePullKeys(pull: (x: number, y: number) => void, release: () => void) {
  const held = useRef(new Set<string>());
  const vector = (): [number, number] => {
    let x = 0;
    let y = 0;
    held.current.forEach((k) => {
      const d = ARROWS.get(k);
      if (d) {
        x += d[0];
        y += d[1];
      }
    });
    return [Math.sign(x), Math.sign(y)];
  };
  return {
    onKeyDown(e: KeyboardEvent) {
      if (!ARROWS.has(e.key)) return;
      e.preventDefault();
      if (e.repeat) return;
      held.current.add(e.key);
      pull(...vector());
    },
    onKeyUp(e: KeyboardEvent) {
      if (!ARROWS.has(e.key)) return;
      held.current.delete(e.key);
      if (held.current.size) pull(...vector());
      else release();
    },
    onBlur() {
      if (!held.current.size) return;
      held.current.clear();
      release();
    },
  };
}

/** 16px minus, drawn like litt's own icons. The registry has a plus and no minus. */
function MinusIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M3 8h10" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export function CraftGallery() {
  return (
    <main>
      <section className="section section-end" aria-labelledby="craft-title">
        <div className="shell">
          <h1 id="craft-title" className="text-litt-h1 text-litt-fg">
            Craft
          </h1>
          <p className="mt-4 max-w-litt-reading text-litt-reading text-litt-fg-muted">
            Small interaction studies. Press, drag, flip and toggle them.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:mt-16 lg:grid-cols-3">
            <Study name="Press" tier="instant" note="Hover fades the fill and press scales to 0.98. The box never moves.">
              <PressStudy />
            </Study>
            <Study name="Ripple" tier="responsive" note="The response starts where you press. It spreads once, then fades.">
              <RippleStudy />
            </Study>
            <Study name="Surface" tier="instant" note="Hover steps the fill one surface. No lift, no shadow, no scale." bare>
              <SurfaceStudy />
            </Study>
            <Study name="Morph" tier="responsive" note="Two shapes crossfade. Nothing grows, shrinks or blurs.">
              <MorphStudy />
            </Study>
            <Study name="Switch" tier="responsive" note="The knob glides by transform. The track fades at the instant tier.">
              <SwitchStudy />
            </Study>
            <Study name="Flip" tier="responsive" note="A half turn on the responsive spring. No overshoot, no pulse.">
              <FlipStudy />
            </Study>
            <Study name="Counter" tier="responsive" note="The number slides half a travel and fades. Exits are quicker.">
              <CounterStudy />
            </Study>
            <Study name="Arrange" tier="responsive" note="Dots glide to their places 40ms apart. Position only, no filter.">
              <ArrangeStudy />
            </Study>
            <Study name="Insert" tier="responsive" note="The row makes room by transform. A removed item only fades.">
              <InsertStudy />
            </Study>
            <Study name="Cascade" tier="expressive" note="Letters arrive 40ms apart on the expressive spring, once per press.">
              <CascadeStudy />
            </Study>
            <Study name="Tilt" tier="responsive" note="Hold and move. It follows the pointer one to one, then springs flat.">
              <TiltStudy />
            </Study>
            <Study name="Drag" tier="responsive" note="One to one while held. Let go and it springs back at your speed.">
              <DragStudy />
            </Study>
          </ul>
        </div>
      </section>
    </main>
  );
}

/**
 * One study: its name and note, then the stage. The name comes first in the document so a screen
 * reader hears what it is before it meets the control, and the stage is placed above it by order.
 * The stage is a flat raised surface (no shadow, no glass). `bare` lets the study be the surface.
 */
function Study({ name, note, tier, bare = false, children }: { name: string; note: string; tier: Tier; bare?: boolean; children: ReactNode }) {
  return (
    <li className="flex min-w-0 flex-col">
      <div className="order-2 mt-4 flex items-baseline justify-between gap-4">
        <h2 className="text-litt-body text-litt-fg">{name}</h2>
        <span className="meta">{tier}</span>
      </div>
      <p className="order-3 mt-1 text-litt-small text-litt-fg-subtle">{note}</p>
      {bare ? (
        <div className="order-1 h-64">{children}</div>
      ) : (
        <div className="litt-raised order-1 relative flex h-64 items-center justify-center overflow-hidden rounded-litt-surface">{children}</div>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Press: the instant tier, in litt's own button                              */
/* -------------------------------------------------------------------------- */

function PressStudy() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-6">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ripple: a response that starts where you press                             */
/* -------------------------------------------------------------------------- */

type Spot = { id: number; x: number; y: number };

function RippleStudy() {
  const enter = useTransition("responsive");
  const [spots, setSpots] = useState<Spot[]>([]);
  const next = useRef(0);

  function press(e: React.MouseEvent<HTMLButtonElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    // A keyboard press has no pointer position, so it starts at the centre.
    const keyboard = e.detail === 0;
    const spot = {
      id: next.current++,
      x: keyboard ? box.width / 2 : e.clientX - box.left,
      y: keyboard ? box.height / 2 : e.clientY - box.top,
    };
    setSpots((all) => [...all.slice(-3), spot]);
  }

  return (
    <div className="relative">
      <Button size="lg" onClick={press}>
        Press anywhere
      </Button>
      {/* A clip layer over the button, so the button's own focus ring is never cut. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-litt-control">
        {spots.map((s) => (
          <motion.span
            key={s.id}
            className="absolute size-8 rounded-litt-pill bg-[color-mix(in_oklab,var(--litt-fg)_12%,transparent)]"
            style={{ left: s.x - 16, top: s.y - 16 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={enter}
            onAnimationComplete={() => setSpots((all) => all.filter((o) => o.id !== s.id))}
          />
        ))}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Surface: a linked card, the way litt builds one                            */
/* -------------------------------------------------------------------------- */

function SurfaceStudy() {
  const [presses, setPresses] = useState(0);
  return (
    <Card as="div" cover="inset" className="h-full">
      <CardCover ratio="auto" className="grid flex-1 place-items-center">
        <span className="font-litt-mono text-litt-h2 text-litt-fg tabular-nums" aria-hidden="true">
          {presses}
        </span>
      </CardCover>
      <CardBody>
        <CardTitle as="h3">
          <CardLink onClick={() => setPresses((n) => n + 1)}>Press the card</CardLink>
        </CardTitle>
        <CardDescription>{presses === 1 ? "Pressed once." : `Pressed ${presses} times.`}</CardDescription>
      </CardBody>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Morph: two shapes crossfade                                                */
/* -------------------------------------------------------------------------- */

function MorphStudy() {
  const enter = useTransition("responsive");
  const leave = useExit("responsive");
  const [done, setDone] = useState(false);

  return (
    <div className="grid place-items-center">
      {/* The one accent fill on the page: the primary action, in both of its shapes. */}
      <motion.div
        className="col-start-1 row-start-1"
        inert={done}
        initial={false}
        animate={{ opacity: done ? 0 : 1, scale: done ? 0.9 : 1 }}
        transition={done ? leave : enter}
      >
        <Button variant="primary" size="md" onClick={() => setDone(true)}>
          Submit
        </Button>
      </motion.div>
      <motion.div
        className="col-start-1 row-start-1"
        inert={!done}
        initial={false}
        animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.9 }}
        transition={done ? enter : leave}
      >
        <Button variant="primary" size="md" iconOnly icon={<CheckIcon />} aria-label="Submitted. Press to reset." onClick={() => setDone(false)} />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Switch: the knob glides, the track fades                                   */
/* -------------------------------------------------------------------------- */

function SwitchStudy() {
  const enter = useTransition("responsive");
  const label = useId();
  const [on, setOn] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={label}
        onClick={() => setOn((v) => !v)}
        className="group inline-flex h-litt-control-md w-litt-control-lg cursor-pointer items-center justify-center outline-none [-webkit-tap-highlight-color:transparent]"
      >
        <span
          className={
            "flex h-6 w-12 items-center rounded-litt-pill p-1 shadow-[inset_0_0_0_1px_var(--litt-line-strong)] " +
            "transition-[background-color,scale] duration-(--litt-dur-instant) ease-litt " +
            "group-active:scale-(--litt-press-scale) " +
            "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-litt-focus " +
            (on ? "justify-end bg-litt-fg" : "justify-start bg-litt-surface-3")
          }
        >
          <motion.span
            layout
            transition={enter}
            className={"size-4 rounded-litt-pill transition-colors duration-(--litt-dur-instant) ease-litt " + (on ? "bg-litt-canvas" : "bg-litt-fg-subtle")}
          />
        </span>
      </button>
      <span id={label} className="w-8 text-litt-small text-litt-fg-muted">
        {on ? "On" : "Off"}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Flip: a half turn on the responsive spring                                 */
/* -------------------------------------------------------------------------- */

function FlipStudy() {
  const enter = useTransition("responsive");
  const [back, setBack] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={back}
      onClick={() => setBack((b) => !b)}
      className="block h-24 w-40 cursor-pointer select-none transition-[scale] duration-(--litt-dur-instant) ease-litt [-webkit-tap-highlight-color:transparent] active:scale-(--litt-press-scale)"
    >
      <span className="block size-full" style={{ perspective: 600 }}>
        <motion.span className="relative block size-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: back ? 180 : 0 }} transition={enter}>
          <span
            aria-hidden={back}
            className={"absolute inset-0 grid place-items-center bg-litt-surface-2 " + OBJECT}
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-litt-small text-litt-fg-muted">Front</span>
          </span>
          <span
            aria-hidden={!back}
            className={"absolute inset-0 grid place-items-center bg-litt-surface-3 " + OBJECT}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-litt-small text-litt-fg-muted">Back</span>
          </span>
        </motion.span>
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Counter: the number slides half a travel                                   */
/* -------------------------------------------------------------------------- */

function CounterStudy() {
  const enter = useTransition("responsive");
  const leave = useExit("responsive");
  const travel = useTravel();
  const [{ n, dir }, setState] = useState({ n: 0, dir: 1 });
  const step = (d: 1 | -1) => setState((s) => ({ n: s.n + d, dir: d }));

  // The number leaves the way it was going: counting up rolls the old one up and the new one in from below.
  const slide: Variants = {
    in: (d: number) => ({ opacity: 0, y: (d * travel) / 2 }),
    rest: { opacity: 1, y: 0, transition: enter },
    out: (d: number) => ({ opacity: 0, y: (-d * travel) / 2, transition: leave }),
  };

  return (
    <div className="flex items-center gap-6">
      <Button variant="secondary" iconOnly icon={<MinusIcon />} aria-label="Decrease" onClick={() => step(-1)} />
      <div className="relative grid h-12 w-16 place-items-center">
        <span className="sr-only" role="status">
          {n}
        </span>
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.span
            key={n}
            custom={dir}
            variants={slide}
            initial="in"
            animate="rest"
            exit="out"
            aria-hidden="true"
            className="font-litt-mono text-litt-h2 text-litt-fg tabular-nums"
          >
            {n}
          </motion.span>
        </AnimatePresence>
      </div>
      <Button variant="secondary" iconOnly icon={<PlusIcon />} aria-label="Increase" onClick={() => step(1)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Arrange: five dots, three layouts                                          */
/* -------------------------------------------------------------------------- */

const ARRANGEMENTS = {
  cluster: [
    [0, 0],
    [-32, -32],
    [32, -32],
    [-32, 32],
    [32, 32],
  ],
  row: [
    [-80, 0],
    [-40, 0],
    [0, 0],
    [40, 0],
    [80, 0],
  ],
  ring: [
    [0, -44],
    [42, -14],
    [26, 36],
    [-26, 36],
    [-42, -14],
  ],
} as const;
type Arrangement = keyof typeof ARRANGEMENTS;

// From the strongest tone to the quietest, so each dot can be followed from layout to layout.
const DOT_TONES = ["bg-litt-fg", "bg-litt-fg-muted", "bg-litt-fg-subtle", "bg-litt-fg-disabled", "bg-litt-line-strong"];

function ArrangeStudy() {
  const enter = useTransition("responsive");
  const stagger = useStagger();
  const [layout, setLayout] = useState<Arrangement>("cluster");
  const place = (i: number): Transition => ({ ...enter, delay: i * stagger });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid h-32 w-48 place-items-center" aria-hidden="true">
        {ARRANGEMENTS[layout].map(([x, y], i) => (
          <motion.span
            key={i}
            className={"col-start-1 row-start-1 size-6 rounded-litt-pill " + DOT_TONES[i]}
            initial={false}
            animate={{ x, y }}
            transition={place(i)}
          />
        ))}
      </div>
      <Segmented
        legend="Arrangement"
        size="sm"
        value={layout}
        onValueChange={setLayout}
        options={[
          { value: "cluster", label: "Cluster" },
          { value: "row", label: "Row" },
          { value: "ring", label: "Ring" },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Insert: the row makes room                                                 */
/* -------------------------------------------------------------------------- */

const MAX_ITEMS = 8;

function InsertStudy() {
  const enter = useTransition("responsive");
  const leave = useExit("responsive");
  const travel = useTravel();
  const [items, setItems] = useState<number[]>([1, 2, 3]);
  const next = useRef(4);

  return (
    <div className="flex w-full flex-col items-center gap-6 px-6">
      <div className="relative flex min-h-16 w-full max-w-xs flex-wrap content-center justify-center gap-2">
        {items.length === 0 && <p className="text-litt-small text-litt-fg-subtle">Nothing here yet.</p>}
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((id) => (
            <motion.span
              key={id}
              layout="position"
              transition={enter}
              initial={{ opacity: 0, y: -travel / 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: leave }}
              className="inline-flex"
            >
              <Tag>Item {id}</Tag>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        <Button size="sm" icon={<PlusIcon />} disabled={items.length >= MAX_ITEMS} onClick={() => setItems((l) => [...l, next.current++])}>
          Add
        </Button>
        <Button size="sm" disabled={items.length === 0} onClick={() => setItems((l) => l.slice(0, -1))}>
          Remove
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cascade: the page's one expressive moment                                  */
/* -------------------------------------------------------------------------- */

const WORD = "Considered";

function CascadeStudy() {
  const enter = useTransition("expressive");
  const stagger = useStagger();
  const travel = useTravel();
  const [run, setRun] = useState(0);
  const arrive = (i: number): Transition => ({ ...enter, delay: i * stagger });

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-litt-h2 text-litt-fg">
        <span className="sr-only">{WORD}</span>
        {/* The word is already in place when the page loads. Only a press plays the cascade. */}
        <span key={run} aria-hidden="true" className="inline-flex">
          {Array.from(WORD).map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={run === 0 ? false : { opacity: 0, y: travel }}
              animate={{ opacity: 1, y: 0 }}
              transition={arrive(i)}
            >
              {char}
            </motion.span>
          ))}
        </span>
      </p>
      <Button variant="ghost" size="sm" onClick={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tilt: held, not hovered                                                    */
/* -------------------------------------------------------------------------- */

const TILT_DEGREES = 14;

function TiltStudy() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const back = useSpringBack(rotateX, rotateY);
  const frame = useRef<HTMLDivElement>(null);
  const [held, setHeld] = useState(false);

  // The angle is a straight function of where the pointer is, so the object follows it one to one.
  function aim(e: PointerEvent<HTMLElement>) {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    rotateY.set(clamp(((e.clientX - box.left) / box.width) * 2 - 1) * TILT_DEGREES);
    rotateX.set(-clamp(((e.clientY - box.top) / box.height) * 2 - 1) * TILT_DEGREES);
  }
  function letGo() {
    setHeld(false);
    back.release();
  }
  const keys = usePullKeys(
    (x, y) => {
      setHeld(true);
      back.to([-y * TILT_DEGREES, x * TILT_DEGREES]);
    },
    letGo,
  );

  return (
    <div ref={frame} className="h-24 w-40" style={{ perspective: 600 }}>
      <motion.button
        type="button"
        style={{ rotateX, rotateY }}
        className={
          "size-full cursor-grab touch-none select-none active:cursor-grabbing " + FADE + " " + OBJECT + (held ? " bg-litt-surface-3" : " bg-litt-surface-2")
        }
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          back.stop();
          e.currentTarget.setPointerCapture(e.pointerId);
          setHeld(true);
          aim(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) aim(e);
        }}
        onPointerUp={letGo}
        onPointerCancel={letGo}
        {...keys}
      >
        <span className="text-litt-small text-litt-fg-muted">Hold and move</span>
        <span className="sr-only">, or hold an arrow key</span>
      </motion.button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Drag: a puck in a well                                                     */
/* -------------------------------------------------------------------------- */

const REACH = 64; // px the puck can travel from the centre, to the edge of its well
const NUDGE = 48; // px an arrow key pulls it
const WELL = { left: -REACH, right: REACH, top: -REACH, bottom: REACH };

function DragStudy() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const back = useSpringBack(x, y);
  const [held, setHeld] = useState(false);
  const keys = usePullKeys(
    (dx, dy) => {
      setHeld(true);
      back.to([dx * NUDGE, dy * NUDGE]);
    },
    () => {
      setHeld(false);
      back.release();
    },
  );

  return (
    <div className="grid size-48 place-items-center rounded-litt-surface bg-litt-surface-2 shadow-[inset_0_0_0_1px_var(--litt-line)]">
      <motion.button
        type="button"
        drag
        dragConstraints={WELL}
        dragElastic={0}
        dragMomentum={false}
        style={{ x, y }}
        onDragStart={() => {
          back.stop();
          setHeld(true);
        }}
        onDragEnd={(_, info) => {
          setHeld(false);
          back.release([info.velocity.x, info.velocity.y]);
        }}
        className={
          "grid size-16 cursor-grab place-items-center select-none active:cursor-grabbing " +
          "transition-[background-color,scale] duration-(--litt-dur-instant) ease-litt [-webkit-tap-highlight-color:transparent] " +
          "active:scale-(--litt-press-scale) " +
          OBJECT +
          (held ? " bg-litt-surface-3" : " bg-litt-surface-1")
        }
        {...keys}
      >
        <span className="text-litt-caption text-litt-fg-subtle">Drag</span>
        <span className="sr-only">, or hold an arrow key</span>
      </motion.button>
    </div>
  );
}
