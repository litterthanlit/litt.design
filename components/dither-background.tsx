"use client";

import { useRef, useEffect } from "react";

const CHARS = " .·:;+=*#%@";
const CELL = 4; // px per character cell
const FPS = 12;

// Simple 2D noise for breathing mask
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // Smoothstep
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  const n00 = hash(ix, iy);
  const n10 = hash(ix + 1, iy);
  const n01 = hash(ix, iy + 1);
  const n11 = hash(ix + 1, iy + 1);

  return n00 * (1 - sx) * (1 - sy) + n10 * sx * (1 - sy) + n01 * (1 - sx) * sy + n11 * sx * sy;
}

function fbm(x: number, y: number): number {
  return smoothNoise(x, y) * 0.6 + smoothNoise(x * 2, y * 2) * 0.3 + smoothNoise(x * 4, y * 4) * 0.1;
}

// Warm palette matching the reference — orange, peach, lavender, cream
type Blob = {
  x: number;
  y: number;
  r: number;
  color: [number, number, number];
  vx: number;
  vy: number;
};

function createBlobs(): Blob[] {
  return [
    { x: 0.25, y: 0.3, r: 0.45, color: [245, 165, 100], vx: 0.008, vy: 0.006 },
    { x: 0.7, y: 0.2, r: 0.4, color: [250, 190, 140], vx: -0.006, vy: 0.009 },
    { x: 0.5, y: 0.7, r: 0.5, color: [200, 180, 220], vx: 0.007, vy: -0.005 },
    { x: 0.3, y: 0.8, r: 0.35, color: [250, 220, 170], vx: -0.009, vy: -0.007 },
    { x: 0.8, y: 0.6, r: 0.4, color: [240, 150, 110], vx: 0.005, vy: 0.008 },
  ];
}

export function DitherBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const blobsRef = useRef<Blob[]>(createBlobs());
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = 1; // keep 1:1 for ASCII look
      canvas!.width = Math.ceil(window.innerWidth / CELL);
      canvas!.height = Math.ceil(window.innerHeight / CELL);
    }

    resize();
    window.addEventListener("resize", resize);

    const frameInterval = 1000 / FPS;

    function animate(now: number) {
      rafRef.current = requestAnimationFrame(animate);

      if (now - lastFrameRef.current < frameInterval) return;
      lastFrameRef.current = now;

      const w = canvas!.width;
      const h = canvas!.height;
      const blobs = blobsRef.current;
      const t = now / 1000;

      // Move blobs
      for (const blob of blobs) {
        blob.x += blob.vx * 0.002;
        blob.y += blob.vy * 0.002;
        // Soft bounce
        if (blob.x < -0.1 || blob.x > 1.1) blob.vx *= -1;
        if (blob.y < -0.1 || blob.y > 1.1) blob.vy *= -1;
        // Gentle wobble
        blob.x += Math.sin(t * 0.3 + blob.r * 10) * 0.0003;
        blob.y += Math.cos(t * 0.25 + blob.r * 8) * 0.0003;
      }

      ctx!.clearRect(0, 0, w, h);
      ctx!.font = `${CELL}px "Geist Mono", "SF Mono", Menlo, monospace`;
      ctx!.textAlign = "left";
      ctx!.textBaseline = "top";

      // Breathing mask — slow drifting noise field
      const noiseOffsetX = t * 0.06;
      const noiseOffsetY = t * 0.04;
      const breathe = Math.sin(t * 0.15) * 0.15 + 0.5; // 0.35–0.65 pulse

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const nx = x / w;
          const ny = y / h;

          // Breathing visibility mask
          const mask = fbm(nx * 5 + noiseOffsetX, ny * 5 + noiseOffsetY);
          const visibility = Math.max(0, mask - (1 - breathe));
          if (visibility < 0.05) continue;

          // Blend blob colors based on distance
          let r = 245, g = 230, b = 215; // base warm cream
          let totalWeight = 0.3;

          for (const blob of blobs) {
            const dx = nx - blob.x;
            const dy = ny - blob.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const weight = Math.max(0, 1 - dist / blob.r);
            const w2 = weight * weight;

            r += (blob.color[0] - r) * w2 * 0.5;
            g += (blob.color[1] - g) * w2 * 0.5;
            b += (blob.color[2] - b) * w2 * 0.5;
            totalWeight += w2;
          }

          // Brightness from color
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          const charIdx = Math.floor((1 - brightness) * (CHARS.length - 1));
          const char = CHARS[Math.min(charIdx, CHARS.length - 1)];

          if (char === " ") continue;

          const alpha = Math.min(1, visibility * 2) * 0.9;
          ctx!.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha.toFixed(2)})`;
          ctx!.fillText(char, x * CELL, y * CELL);
        }
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        width: "100vw",
        height: "100vh",
        opacity: 0.14,
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}
