"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SiteSettings } from "@/data/types";

type FooterProps = {
  settings: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20, filter: "blur(4px)" } as const,
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
          viewport: { once: true, margin: "-80px" } as const,
          transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 30,
            delay,
          },
        };

  return (
    <footer className="section-shell border-t border-[rgba(0,0,0,0.06)] py-16 md:py-24">
      {/* Bio */}
      <motion.div className="max-w-xl" {...fadeUp(0)}>
        <p className="text-[20px] font-normal leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]">
          I build tools for creators.
        </p>
        <p className="mt-2 text-[20px] font-normal leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]">
          The craft is in what I leave out.
        </p>
        <p className="mt-2 text-[20px] font-normal leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]">
          More Play.
        </p>
        <p className="mt-4 text-[13px] leading-[1.7] text-[#a3a3a3]">
          {settings.location} &middot; {settings.availability.label}
        </p>
      </motion.div>

      {/* Socials */}
      <motion.div className="mt-10 flex flex-wrap gap-2" {...fadeUp(0.08)}>
        {settings.socialLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
            whileHover={reduceMotion ? {} : { y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={
              reduceMotion
                ? {}
                : { opacity: 0, y: 12, filter: "blur(2px)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              delay: 0.12 + i * 0.04,
            }}
          >
            {link.label}
            <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
              ↗
            </span>
          </motion.a>
        ))}

        {/* Email */}
        <motion.a
          href={`mailto:${settings.contactEmail}`}
          className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
          whileHover={reduceMotion ? {} : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          initial={
            reduceMotion
              ? {}
              : { opacity: 0, y: 12, filter: "blur(2px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            delay: 0.12 + settings.socialLinks.length * 0.04,
          }}
        >
          {settings.contactEmail}
          <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
            ↗
          </span>
        </motion.a>
      </motion.div>
    </footer>
  );
}

// --- Thank You Orb (Canvas-based for performance) ---

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

type Dot = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  hue: number;
  speed: number;
  phase: number;
  orbitRadius: number;
};

function generateDots(count: number, radius: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const angle = seededRandom(i * 2) * Math.PI * 2;
    const dist = Math.sqrt(seededRandom(i * 2 + 1)) * radius;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const distRatio = dist / radius;

    const size = 0.015 + seededRandom(i * 3) * 0.03 * (1 - distRatio * 0.5);
    const opacity = 0.4 + (1 - distRatio) * 0.5 + seededRandom(i * 4) * 0.1;
    const hue = distRatio;
    const speed = 0.3 + seededRandom(i * 5) * 0.7;
    const phase = seededRandom(i * 6) * Math.PI * 2;
    const orbitRadius = 0.01 + seededRandom(i * 7) * 0.03;

    dots.push({ x, y, size, opacity, hue, speed, phase, orbitRadius });
  }
  return dots;
}

// Normalized coords: dots live in -1..1 space
const DOTS = generateDots(200, 0.9);

// Per-dot spring state for mouse interaction
const dotOffsets = DOTS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));

// Spring constants for cursor interaction
const SPRING_STIFFNESS = 120;  // how snappy the return (higher = faster snap)
const SPRING_DAMPING = 12;     // resistance (higher = less oscillation)
const REPEL_STRENGTH = 0.008;  // force magnitude
const REPEL_RADIUS = 0.3;     // influence radius in normalized space

// OKLCH palettes: [lightness, chroma, hue°]
// Interpolation uses nearest-hue in OKLCH space for natural transitions
const COLOR_PALETTES = [
  { center: [0.78, 0.22, 130], edge: [0.82, 0.16, 130], glow: [0.60, 0.28, 145] },   // vivid lime
  { center: [0.65, 0.18, 230], edge: [0.72, 0.14, 230], glow: [0.48, 0.24, 250] },   // electric blue
  { center: [0.60, 0.24, 300], edge: [0.68, 0.18, 300], glow: [0.42, 0.30, 310] },   // vivid violet
  { center: [0.68, 0.22, 350], edge: [0.74, 0.16, 350], glow: [0.45, 0.28, 360] },   // hot pink
];

const CYCLE_DURATION = 8;

// Nearest-hue interpolation in OKLCH
function lerpHue(a: number, b: number, t: number): number {
  let diff = b - a;
  // Nearest hue: take the shortest path around the wheel
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return ((a + diff * t) % 360 + 360) % 360;
}

function lerpOklch(a: number[], b: number[], t: number): number[] {
  return [
    a[0] + (b[0] - a[0]) * t,  // lightness
    a[1] + (b[1] - a[1]) * t,  // chroma
    lerpHue(a[2], b[2], t),     // hue (nearest path)
  ];
}

// Convert OKLCH to RGB for canvas (canvas doesn't support oklch natively)
function oklchToRgb(l: number, c: number, h: number): number[] {
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);

  // OKLab to linear sRGB via LMS
  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

  const ll = l_ * l_ * l_;
  const mm = m_ * m_ * m_;
  const ss = s_ * s_ * s_;

  const r = +4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss;
  const g = -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss;
  const b = -0.0041960863 * ll - 0.7034186147 * mm + 1.7076147010 * ss;

  // Gamma correction + clamp
  const toSrgb = (x: number) => Math.round(Math.max(0, Math.min(1, x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055)) * 255);
  return [toSrgb(r), toSrgb(g), toSrgb(b)];
}


export function ThankYouOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let size = canvas.clientWidth || 360;

    function resizeCanvas() {
      size = canvas!.clientWidth || 360;
      canvas!.width = size * dpr;
      canvas!.height = size * dpr;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const half = size / 2;
    const startTime = performance.now();
    let lastTime = startTime;

    function animate(now: number) {
      const t = (now - startTime) / 1000;
      const dt = Math.min((now - lastTime) / 1000, 0.033); // cap at ~30fps delta to avoid explosions
      lastTime = now;
      const mouse = mouseRef.current;

      // Palette
      const totalCycle = CYCLE_DURATION * COLOR_PALETTES.length;
      const cycleT = (t % totalCycle) / CYCLE_DURATION;
      const pidx = Math.floor(cycleT) % COLOR_PALETTES.length;
      const nidx = (pidx + 1) % COLOR_PALETTES.length;
      const blend = cycleT - Math.floor(cycleT);
      const ease = blend * blend * (3 - 2 * blend);

      const cur = COLOR_PALETTES[pidx];
      const nxt = COLOR_PALETTES[nidx];
      const centerOklch = lerpOklch(cur.center, nxt.center, ease);
      const edgeOklch = lerpOklch(cur.edge, nxt.edge, ease);
      const glowOklch = lerpOklch(cur.glow, nxt.glow, ease);
      const center = oklchToRgb(centerOklch[0], centerOklch[1], centerOklch[2]);
      const edge = oklchToRgb(edgeOklch[0], edgeOklch[1], edgeOklch[2]);
      const glow = oklchToRgb(glowOklch[0], glowOklch[1], glowOklch[2]);

      // Text: white with a glow matching the current palette
      if (textRef.current) {
        textRef.current.style.color = `rgba(255,255,255,0.95)`;
        textRef.current.style.textShadow = `0 0 20px rgba(${glow[0]},${glow[1]},${glow[2]},0.6), 0 0 40px rgba(${glow[0]},${glow[1]},${glow[2]},0.3)`;
      }

      glowRefs.current.forEach((el, idx) => {
        if (!el) return;
        const op = [0.15, 0.3, 0.45][idx] ?? 0.3;
        el.style.background = `radial-gradient(circle, rgba(${glow[0]},${glow[1]},${glow[2]},${op}) 0%, transparent 65%)`;
      });

      // Clear — use current size
      const currentSize = canvas!.clientWidth || 360;
      const currentHalf = currentSize / 2;
      ctx!.clearRect(0, 0, currentSize, currentSize);

      // Draw each dot with spring-based cursor interaction
      for (let i = 0; i < DOTS.length; i++) {
        const dot = DOTS[i];
        const off = dotOffsets[i];

        const dx = Math.sin(t * dot.speed + dot.phase) * dot.orbitRadius;
        const dy = Math.cos(t * dot.speed * 0.8 + dot.phase) * dot.orbitRadius;

        const baseX = dot.x + dx;
        const baseY = dot.y + dy;

        // --- Spring physics for cursor interaction ---
        // 1. Calculate repulsion force from cursor
        let forceX = 0;
        let forceY = 0;

        if (mouse.active) {
          const toX = baseX + off.x - mouse.x;
          const toY = baseY + off.y - mouse.y;
          const dist = Math.sqrt(toX * toX + toY * toY);

          if (dist < REPEL_RADIUS && dist > 0.001) {
            // Inverse-square falloff — sharp near cursor, gentle at edge
            const normalizedDist = dist / REPEL_RADIUS;
            const falloff = 1 / (normalizedDist * normalizedDist + 0.1) - 1 / 1.1;
            forceX = (toX / dist) * falloff * REPEL_STRENGTH;
            forceY = (toY / dist) * falloff * REPEL_STRENGTH;
          }
        }

        // 2. Spring force pulling back to rest (offset = 0)
        const springX = -SPRING_STIFFNESS * off.x;
        const springY = -SPRING_STIFFNESS * off.y;

        // 3. Damping (friction opposing velocity)
        const dampX = -SPRING_DAMPING * off.vx;
        const dampY = -SPRING_DAMPING * off.vy;

        // 4. Integrate (semi-implicit Euler)
        off.vx += (springX + dampX + forceX * 1000) * dt;
        off.vy += (springY + dampY + forceY * 1000) * dt;
        off.x += off.vx * dt;
        off.y += off.vy * dt;

        const fx = baseX + off.x;
        const fy = baseY + off.y;

        const breath = dot.size + Math.sin(t * dot.speed * 0.5 + dot.phase) * 0.003;

        // Convert normalized to px
        const px = (fx * 0.5 + 0.5) * currentSize;
        const py = (fy * 0.5 + 0.5) * currentSize;
        const pr = Math.max(1, breath * currentHalf);
        const bloomR = pr * 2.5;

        const c = [
          Math.round(center[0] + (edge[0] - center[0]) * dot.hue),
          Math.round(center[1] + (edge[1] - center[1]) * dot.hue),
          Math.round(center[2] + (edge[2] - center[2]) * dot.hue),
        ];

        // Single radial gradient per dot — core + soft falloff = bloom effect
        const grad = ctx!.createRadialGradient(px, py, 0, px, py, bloomR);
        grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${dot.opacity})`);
        grad.addColorStop(0.4, `rgba(${c[0]},${c[1]},${c[2]},${dot.opacity * 0.35})`);
        grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);

        ctx!.beginPath();
        ctx!.arc(px, py, bloomR, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y, active: true };
  }

  function handleMouseLeave() {
    mouseRef.current = { ...mouseRef.current, active: false };
  }

  const setGlowRef = (idx: number) => (el: HTMLDivElement | null) => {
    glowRefs.current[idx] = el;
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden py-32 md:py-48">
      {/* Bloom layers — tight around the orb */}
      <div ref={setGlowRef(0)} className="pointer-events-none absolute h-[500px] w-[500px] rounded-full blur-[100px] md:h-[600px] md:w-[600px]" />
      <div ref={setGlowRef(1)} className="pointer-events-none absolute h-[380px] w-[380px] rounded-full blur-[50px] md:h-[460px] md:w-[460px]" />
      <div ref={setGlowRef(2)} className="pointer-events-none absolute h-[280px] w-[280px] rounded-full blur-[25px] md:h-[360px] md:w-[360px]" />

      {/* Interactive dot orb */}
      <div
        className="relative h-[280px] w-[280px] cursor-default md:h-[360px] md:w-[360px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="h-full w-full" />

        {/* Text overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p
            ref={textRef}
            className="pl-4 text-[16px] font-medium leading-[1.5] tracking-[-0.01em] md:text-[18px]"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            thank you
            <br />
            for being here
          </p>
        </div>
      </div>
    </section>
  );
}
