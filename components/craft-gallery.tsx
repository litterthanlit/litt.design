"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

// Seeded random for deterministic droplet configs
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const DROPLET_CONFIGS = Array.from({ length: 5 }, (_, i) => ({
  width: 10 + seededRandom(i * 3) * 8,
  height: 10 + seededRandom(i * 3 + 1) * 8,
  yOffset: -20 - seededRandom(i * 3 + 2) * 16,
  xOffset: (seededRandom(i * 5) - 0.5) * 20,
}));

/* ─────────────────────────────────────────────
   Gallery shell
   ───────────────────────────────────────────── */

export function CraftGallery() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="pt-36 pb-32 md:pt-44">
      <div className="section-shell">
        <motion.p
          className="eyebrow mb-4"
          initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
          whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
        >
          Craft
        </motion.p>
        <motion.p
          className="mb-16 max-w-md text-[15px] leading-[1.6] text-[#737373]"
          initial={reduceMotion ? {} : { opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30, delay: 0.05 }}
        >
          Interactive experiments — spring physics, liquid effects, and
          micro-interactions. Click, drag, and hover.
        </motion.p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DemoCard label="Spring Press" delay={0}>
            <SpringButton />
          </DemoCard>
          <DemoCard label="Magnetic Hover" delay={0.04}>
            <MagneticButton />
          </DemoCard>
          <DemoCard label="Liquid Button" delay={0.08}>
            <LiquidButton />
          </DemoCard>
          <DemoCard label="3D Tilt" delay={0.12}>
            <TiltCard />
          </DemoCard>
          <DemoCard label="Jelly Press" delay={0.16}>
            <JellyCard />
          </DemoCard>
          <DemoCard label="Drag & Snap" delay={0.2}>
            <DragSnap />
          </DemoCard>
          <DemoCard label="Flip Card" delay={0.24}>
            <FlipCard />
          </DemoCard>
          <DemoCard label="Gravity Drop" delay={0.28}>
            <GravityDrop />
          </DemoCard>
          <DemoCard label="Spring Counter" delay={0.32}>
            <SpringCounter />
          </DemoCard>
          <DemoCard label="Spring Toggle" delay={0.36}>
            <SpringToggle />
          </DemoCard>
          <DemoCard label="Gooey Blobs" delay={0.4}>
            <GooeyBlobs />
          </DemoCard>
          <DemoCard label="Wave Text" delay={0.44}>
            <WaveText />
          </DemoCard>
          <DemoCard label="Ripple Touch" delay={0.48}>
            <RippleButton />
          </DemoCard>
          <DemoCard label="Morph Button" delay={0.52}>
            <MorphButton />
          </DemoCard>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Demo card wrapper
   ───────────────────────────────────────────── */

function DemoCard({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-8"
      style={{ minHeight: 260 }}
      initial={
        reduceMotion ? {} : { opacity: 0, y: 16, filter: "blur(4px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 28,
        delay,
      }}
    >
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3]">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   1 · Spring Button — bouncy press with shadow lift
   ───────────────────────────────────────────── */

function SpringButton() {
  return (
    <motion.button
      className="rounded-full bg-[#0a0a0a] px-7 py-3 text-[13px] font-medium text-white"
      whileHover={{ scale: 1.05, y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
    >
      Press me
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   2 · Magnetic Hover — elastic cursor follow
   ───────────────────────────────────────────── */

function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 12 });
  const springY = useSpring(y, { stiffness: 200, damping: 12 });

  function handleMove(e: React.PointerEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.4);
    y.set(dy * 0.4);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      className="rounded-full border border-[rgba(0,0,0,0.12)] px-7 py-3 text-[13px] font-medium text-[#0a0a0a]"
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      Hover me
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   3 · Liquid Button — gooey SVG filter with spring droplets
   ───────────────────────────────────────────── */

function LiquidButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id="gooey-btn">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: "url(#gooey-btn)", isolation: "isolate", contain: "layout paint" }}>
        <motion.button
          className="relative z-10 rounded-full bg-[#0a0a0a] px-7 py-3 text-[13px] font-medium text-white"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Liquid
          <AnimatePresence>
            {hovered && (
              <>
                {DROPLET_CONFIGS.map((cfg, i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-full bg-[#0a0a0a]"
                    style={{
                      width: cfg.width,
                      height: cfg.height,
                      left: `${20 + i * 15}%`,
                      top: "50%",
                    }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{
                      y: [0, cfg.yOffset, 0],
                      x: cfg.xOffset,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 9,
                      delay: i * 0.04,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   4 · 3D Tilt Card — perspective with glare and dynamic shadow
   ───────────────────────────────────────────── */

function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 18 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 18 });


  function handleMove(e: React.PointerEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 30);
    rotateX.set(-py * 30);
    if (glareRef.current) {
      const gx = (px + 0.5) * 100;
      const gy = (py + 0.5) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.25), transparent 60%)`;
    }
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="relative h-32 w-44 cursor-default overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a0a] to-[#3a3a3a]"
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformPerspective: 600,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div ref={glareRef} className="absolute inset-0 rounded-xl" />
      <div className="flex h-full items-center justify-center">
        <span className="text-[12px] font-medium tracking-wide text-white/60">
          Move cursor
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   5 · Jelly Press — squish with wobble
   ───────────────────────────────────────────── */

function JellyCard() {
  return (
    <motion.div
      className="flex h-28 w-40 cursor-pointer items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#fafafa]"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{
        scale: 0.88,
        rotateZ: -3,
        skewX: 4,
        borderRadius: "20px",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 12 }}
    >
      <span className="text-[12px] text-[#737373]">Squish me</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   6 · Drag & Snap — oscillating snap-back with rotation
   ───────────────────────────────────────────── */

function DragSnap() {
  return (
    <motion.div
      className="flex h-16 w-16 cursor-grab items-center justify-center rounded-2xl bg-[#0a0a0a] active:cursor-grabbing"
      drag
      dragConstraints={{ top: -60, right: 60, bottom: 60, left: -60 }}
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 10 }}
      whileDrag={{ scale: 1.12, rotate: 5, boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <span className="text-[10px] font-medium text-white/60">Drag</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   7 · Flip Card — spring flip with mid-flip scale pulse
   ───────────────────────────────────────────── */

function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: 600 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative h-28 w-40"
        animate={{
          rotateY: flipped ? 180 : 0,
          scale: [null, 1.03, 1],
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#0a0a0a]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-[12px] font-medium text-white/60">
            Click to flip
          </span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[12px] text-[#737373]">Back side</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   8 · Gravity Drop — squash on impact, bounce back
   ───────────────────────────────────────────── */

function GravityDrop() {
  const [balls, setBalls] = useState<{ id: number; x: number }[]>([]);
  const counter = useRef(0);

  function drop() {
    const id = counter.current++;
    const x = (seededRandom(id) - 0.5) * 80;
    setBalls((b) => [...b.slice(-11), { id, x }]);
  }

  return (
    <div
      className="relative flex h-36 w-full cursor-pointer items-start justify-center overflow-hidden pt-2"
      onClick={drop}
    >
      <span className="text-[12px] text-[#a3a3a3]">Click anywhere</span>
      <AnimatePresence>
        {balls.map((ball) => (
          <motion.div
            key={ball.id}
            className="absolute top-2 h-4 w-4 rounded-full bg-[#0a0a0a]"
            style={{ left: `calc(50% + ${ball.x}px)` }}
            initial={{ y: 0, scaleX: 1, scaleY: 1 }}
            animate={{
              y: [0, 120],
              scaleX: [1, 1, 1.35, 0.9, 1],
              scaleY: [1, 1, 0.65, 1.1, 1],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              y: { type: "spring", stiffness: 80, damping: 7 },
              scaleX: {
                type: "spring",
                stiffness: 400,
                damping: 8,
                delay: 0.3,
              },
              scaleY: {
                type: "spring",
                stiffness: 400,
                damping: 8,
                delay: 0.3,
              },
            }}
            onAnimationComplete={() =>
              setBalls((b) => b.filter((item) => item.id !== ball.id))
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   9 · Spring Counter — overshooting number with scale pulse
   ───────────────────────────────────────────── */

function SpringCounter() {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const motionCount = useMotionValue(0);
  const springCount = useSpring(motionCount, { stiffness: 200, damping: 12 });
  const display = useTransform(springCount, (v) => Math.round(v));

  useEffect(() => {
    motionCount.set(count);
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(t);
  }, [count, motionCount]);

  return (
    <div className="flex items-center gap-5">
      <motion.button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] text-[15px] text-[#0a0a0a]"
        whileTap={{ scale: 0.8 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        onClick={() => setCount((c) => c - 1)}
      >
        −
      </motion.button>
      <motion.span
        className="w-10 text-center font-mono text-[28px] tabular-nums text-[#0a0a0a]"
        animate={{ scale: pulse ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 12 }}
      >
        {display}
      </motion.span>
      <motion.button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] text-[15px] text-[#0a0a0a]"
        whileTap={{ scale: 0.8 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        onClick={() => setCount((c) => c + 1)}
      >
        +
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   10 · Spring Toggle — overshoot knob with bounce
   ───────────────────────────────────────────── */

function SpringToggle() {
  const [on, setOn] = useState(false);

  return (
    <motion.button
      className="flex h-8 w-14 cursor-pointer items-center rounded-full p-1"
      style={{ backgroundColor: on ? "#0a0a0a" : "#e5e5e5" }}
      animate={{
        backgroundColor: on ? "#0a0a0a" : "#e5e5e5",
        scale: [null, 1.04, 1],
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setOn((v) => !v)}
    >
      <motion.div
        className="h-6 w-6 rounded-full bg-white shadow-sm"
        animate={{ x: on ? 22 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
      />
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   11 · Gooey Blobs — varied mass + rotation
   ───────────────────────────────────────────── */

function GooeyBlobs() {
  const [active, setActive] = useState(0);
  const positions = [
    { x: 0, y: 0 },
    { x: 36, y: -10 },
    { x: -36, y: -10 },
    { x: 18, y: 28 },
    { x: -18, y: 28 },
  ];

  const cycle = useCallback(() => {
    setActive((a) => (a + 1) % 3);
  }, []);

  const layouts = [
    positions,
    positions.map((p) => ({ x: p.x * 0.3, y: p.y * 0.3 })),
    positions.map((_, i) => ({ x: (i - 2) * 22, y: 0 })),
  ];

  const blobConfigs = [
    { mass: 0.5, rotate: 45 },
    { mass: 1.2, rotate: -30 },
    { mass: 0.8, rotate: 60 },
    { mass: 1.5, rotate: -15 },
    { mass: 0.6, rotate: 90 },
  ];

  return (
    <div className="cursor-pointer" onClick={cycle}>
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id="gooey-blobs">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="8"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
      <div
        className="relative flex h-24 w-32 items-center justify-center"
        style={{ filter: "url(#gooey-blobs)", isolation: "isolate", contain: "layout paint" }}
      >
        {layouts[active].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute h-7 w-7 rounded-full bg-[#0a0a0a]"
            animate={{
              x: pos.x,
              y: pos.y,
              rotate: blobConfigs[i].rotate * (active + 1),
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 14,
              mass: blobConfigs[i].mass,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   12 · Wave Text — bouncy oscillating characters
   ───────────────────────────────────────────── */

function WaveText() {
  const text = "Hover me";

  return (
    <div className="flex gap-[2px]">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block text-[22px] font-medium text-[#0a0a0a]"
          whileHover={{ y: -16, scale: 1.25 }}
          transition={{ type: "spring", stiffness: 500, damping: 8 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   13 · Ripple Button — spring-based ripple expansion
   ───────────────────────────────────────────── */

function RippleButton() {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const counter = useRef(0);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = counter.current++;
    setRipples((r) => [
      ...r.slice(-4),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  }

  return (
    <motion.button
      className="relative overflow-hidden rounded-full bg-[#0a0a0a] px-7 py-3 text-[13px] font-medium text-white"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={handleClick}
    >
      Tap me
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/25"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              marginLeft: -5,
              marginTop: -5,
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 16, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            onAnimationComplete={() =>
              setRipples((r) => r.filter((item) => item.id !== ripple.id))
            }
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   14 · Morph Button — shape morph with wobble
   ───────────────────────────────────────────── */

function MorphButton() {
  const [morphed, setMorphed] = useState(false);

  return (
    <motion.button
      className="flex items-center justify-center bg-[#0a0a0a] text-[13px] font-medium text-white"
      animate={{
        width: morphed ? 48 : 140,
        height: morphed ? 48 : 44,
        borderRadius: morphed ? 24 : 999,
        scale: morphed ? [1, 1.08, 1] : 1,
      }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 14 }}
      onClick={() => setMorphed((m) => !m)}
    >
      <AnimatePresence mode="wait">
        {morphed ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -90, filter: "blur(4px)" }}
            animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ scale: 0, rotate: 90, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            ✓
          </motion.span>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Submit
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
