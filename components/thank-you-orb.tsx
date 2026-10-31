"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const COUNT = 420;
// Radians a second the sphere turns on its own
const TURN = 0.12;
// How far the cursor can tip the sphere, in radians
const LEAN = 0.35;
// Every eleventh point is the accent
const ACCENT_EVERY = 11;

// A repeatable 0..1 value per point, so the server and every visit scatter alike
function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Points spread evenly over a unit sphere (a Fibonacci lattice). Each also has
// a loose spot in the lower part of the canvas, where it waits before the
// scroll gathers it, and a delay, so the points arrive in a stream, not in step.
const POINTS = Array.from({ length: COUNT }, (_, i) => {
  const y = 1 - ((i + 0.5) / COUNT) * 2;
  const r = Math.sqrt(1 - y * y);
  const a = i * Math.PI * (3 - Math.sqrt(5));
  return {
    x: Math.cos(a) * r,
    y,
    z: Math.sin(a) * r,
    looseX: hash(i) * 2 - 1,
    looseY: hash(i + 101),
    delay: hash(i + 202) * 0.4,
    accent: i % ACCENT_EVERY === 0,
  };
});

const easeOut = (t: number) => 1 - (1 - t) ** 3;

// The page's sign-off: a sphere of points that gathers as the page ends, turns
// slowly and leans toward the cursor. Points on the far side are smaller and
// fainter, so it reads as a ball, not a disc. Under reduced motion it is drawn
// once, whole and still.
export function ThankYouOrb() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const pointer = useRef({ x: 0, y: 0 });

  // 0 when the section's top meets the bottom of the window, 1 when its centre
  // reaches the window's centre
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const gathered = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const words = useTransform(gathered, [0.75, 1], [0, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let turn = 0;
    const lean = { x: 0, y: 0 };

    function draw(progress: number) {
      const R = Math.min(width, height) * 0.36;
      const cx = width / 2;
      const cy = height / 2;
      ctx!.clearRect(0, 0, width, height);

      // A faint violet core that fills in as the points arrive
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
      glow.addColorStop(0, `rgba(124, 108, 255, ${0.16 * progress})`);
      glow.addColorStop(1, "rgba(124, 108, 255, 0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, width, height);

      const yaw = turn + lean.x;
      const pitch = 0.3 + lean.y;
      const projected = POINTS.map((p) => {
        const x1 = p.x * Math.cos(yaw) + p.z * Math.sin(yaw);
        const z1 = -p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
        const y2 = p.y * Math.cos(pitch) - z1 * Math.sin(pitch);
        const z2 = p.y * Math.sin(pitch) + z1 * Math.cos(pitch);
        const e = easeOut(Math.min(1, Math.max(0, (progress - p.delay) / 0.6)));
        const looseX = p.looseX * (width / 2) * 0.92;
        const looseY = (p.looseY * 0.5 + 0.02) * height;
        // Depth only shows once a point has joined the sphere
        const depth = 0.5 + ((z2 + 1) / 2 - 0.5) * e;
        return {
          x: cx + looseX + (x1 * R - looseX) * e,
          y: cy + looseY + (y2 * R - looseY) * e,
          depth,
          accent: p.accent,
        };
      });
      projected.sort((a, b) => a.depth - b.depth);

      for (const p of projected) {
        const d = p.depth;
        ctx!.fillStyle = p.accent
          ? `rgba(140, 190, 20, ${0.35 + 0.6 * d})`
          : `rgba(${40 + 50 * (1 - d)}, ${30 + 40 * (1 - d)}, ${120 + 100 * d}, ${0.18 + 0.75 * d})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.1 + 2.4 * d, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    resize();
    const sizer = new ResizeObserver(() => {
      resize();
      if (reduce) draw(1);
    });
    sizer.observe(canvas);

    if (reduce) {
      draw(1);
      return () => sizer.disconnect();
    }

    let frame = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      turn += TURN * dt;
      // Ease the lean toward the cursor, at the same pace at any frame rate
      const k = 1 - Math.exp(-dt * 4);
      lean.x += (pointer.current.x * LEAN - lean.x) * k;
      lean.y += (pointer.current.y * LEAN - lean.y) * k;
      draw(gathered.get());
      frame = requestAnimationFrame(tick);
    }

    // Only animate while the orb is on screen
    const watcher = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        if (entry.isIntersecting) {
          last = performance.now();
          frame = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "200px" },
    );
    watcher.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      watcher.disconnect();
      sizer.disconnect();
    };
  }, [reduce, gathered]);

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - box.left) / box.width) * 2 - 1,
      y: ((event.clientY - box.top) / box.height) * 2 - 1,
    };
  }

  return (
    <section
      ref={sectionRef}
      className="section-shell flex flex-col items-center pt-16 pb-32 md:pt-24 md:pb-40"
      onPointerMove={onPointerMove}
      onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
    >
      <canvas ref={canvasRef} className="h-[360px] w-full max-w-[720px] md:h-[460px]" aria-hidden="true" />
      {/* The words wait for the sphere; CSS shows them at once under reduced motion */}
      <motion.p className="mt-4 text-body text-muted motion-reduce:opacity-100!" style={{ opacity: words }}>
        <span className="font-medium text-ink">thank you</span> for being here
      </motion.p>
    </section>
  );
}
