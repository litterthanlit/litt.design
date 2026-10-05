"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Press and drag on empty space to draw, with a marker or a spray can. Strokes
// sit under the content, are stored per page in localStorage, and only exist
// for mouse and pen input so touch scrolling is never hijacked. Text and
// elements are keep-out zones: ink that lands on or near them is erased, so
// the drawing never overlaps them.

// Marker points carry the line width; spray points carry how much paint landed
type Point = [x: number, y: number, size: number];
// The path a drip ran: one point per simulation step, each with the trail
// width there, so playback runs at the speed the paint actually moved
type Run = Point[];
type Stroke = { color: string; points: Point[]; tool?: "spray"; runs?: Run[] };
type Rect = { x: number; y: number; w: number; h: number };
type Tool = "marker" | "spray";

const COLORS = [
  { value: "#0a0a0a", label: "Ink" },
  { value: "#F0782D", label: "Orange" },
  { value: "#7B61FF", label: "Violet" },
  { value: "#9BD62E", label: "Lime" },
] as const;

const MIN_WIDTH = 2;
const MAX_WIDTH = 7;
const MAX_POINTS = 20000; // total across strokes; oldest strokes drop first
const STORAGE_PREFIX = "litt:graffiti:";

const SPRAY_RADIUS = 20; // nominal radius of the spray cone where it meets the wall
const SPRAY_SIGMA = SPRAY_RADIUS * 0.45; // spread of the cone's Gaussian
const SPRAY_REACH = SPRAY_RADIUS * 1.6; // furthest any droplet lands
const SPRAY_RATE = 1.1; // paint per millisecond the nozzle is held down
const DEPOSIT = 0.04; // coverage one unit of paint adds at the centre of the cone
const TILE = 128; // css px per tile of a spray stroke's paint
const DROPLETS = 512; // device px per side of the droplet texture (power of two)
const WET_CELL = 6; // px resolution of the wet-paint field
const POOL = 460; // wet paint a spot can hold before it runs
const DRY_HALF_LIFE = 1400; // ms for surface paint to half set
const RUN_STEP = 1000 / 30; // ms of simulated time per stored run point
const MAX_RUNS_PER_POOL = 3;

const KEEP_OUT_PAD = 10; // breathing room around text and elements

// Elements that are keep-out zones as a whole box (text is handled per line)
const BLOCKS =
  "a, button, input, textarea, select, label, summary, img, picture, video, svg, canvas, iframe, " +
  "figure, table, pre, blockquote, header, nav, [data-no-graffiti]";

// Never start a stroke inside these, wherever the pointer is
const INTERACTIVE = `${BLOCKS}, [role], [tabindex], [contenteditable]`;

// Decorative layers (backgrounds, this canvas, the toolbar) are not content
const IGNORE = '[aria-hidden="true"], [data-graffiti-ignore]';

// Every text line and element box on the page, in drawing coordinates
function collectKeepOut(): Rect[] {
  const cx = window.innerWidth / 2;
  const sy = window.scrollY;
  const rects: Rect[] = [];
  const add = (r: DOMRect) => {
    if (!r.width || !r.height) return;
    rects.push({
      x: r.left - cx - KEEP_OUT_PAD,
      y: r.top + sy - KEEP_OUT_PAD,
      w: r.width + KEEP_OUT_PAD * 2,
      h: r.height + KEEP_OUT_PAD * 2,
    });
  };

  for (const el of document.body.querySelectorAll(BLOCKS)) {
    if (!el.closest(IGNORE)) add(el.getBoundingClientRect());
  }

  // Line boxes of every visible text node, so text in plain divs counts too
  const range = document.createRange();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.nodeValue?.trim() && !node.parentElement?.closest(`script, style, noscript, ${IGNORE}`)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  while (walker.nextNode()) {
    range.selectNodeContents(walker.currentNode);
    for (const r of range.getClientRects()) add(r);
  }
  return rects;
}

function hits(rects: Rect[], x: number, y: number) {
  return rects.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
}

// Cut every keep-out zone within the given band of the screen out of the ink
function eraseKeepOut(
  ctx: CanvasRenderingContext2D,
  rects: Rect[],
  cx: number,
  scrollY: number,
  top: number,
  bottom: number
) {
  ctx.globalCompositeOperation = "destination-out";
  for (const r of rects) {
    const y = r.y - scrollY;
    if (y > bottom || y + r.h < top) continue;
    ctx.fillRect(r.x + cx, y, r.w, r.h);
  }
  ctx.globalCompositeOperation = "source-over";
}

function readStrokes(path: string): Stroke[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + path);
    return raw ? (JSON.parse(raw) as Stroke[]) : [];
  } catch {
    return [];
  }
}

function writeStrokes(path: string, strokes: Stroke[]) {
  try {
    if (strokes.length) localStorage.setItem(STORAGE_PREFIX + path, JSON.stringify(strokes));
    else localStorage.removeItem(STORAGE_PREFIX + path);
  } catch {
    // Storage full or blocked — the drawing just won't survive a reload
  }
}

function trim(strokes: Stroke[]) {
  let total = strokes.reduce((n, s) => n + s.points.length, 0);
  while (total > MAX_POINTS && strokes.length > 1) total -= strokes.shift()!.points.length;
  return strokes;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

// Points are stored with x relative to the viewport centre (the layout is
// centred, so drawings stay next to the content they were drawn beside) and
// y relative to the top of the document.
function toScreen([x, y]: Point, cx: number, scrollY: number) {
  return [x + cx, y - scrollY] as const;
}

// Document-space box a stroke can paint into, drips included
function strokeBounds(stroke: Stroke): Rect {
  const pad = stroke.tool === "spray" ? SPRAY_REACH + 2 : MAX_WIDTH;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const grow = (x: number, y: number, r: number) => {
    x0 = Math.min(x0, x - r);
    y0 = Math.min(y0, y - r);
    x1 = Math.max(x1, x + r);
    y1 = Math.max(y1, y + r);
  };
  for (const [x, y] of stroke.points) grow(x, y, pad);
  for (const run of stroke.runs ?? []) for (const [x, y, w] of run) grow(x, y, w * 1.2 + 1);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  i: number,
  cx: number,
  scrollY: number
) {
  const pts = stroke.points;
  const [x0, y0] = toScreen(pts[Math.max(0, i - 2)], cx, scrollY);
  const [x1, y1] = toScreen(pts[i - 1], cx, scrollY);
  const [x2, y2] = toScreen(pts[i], cx, scrollY);
  // Quadratic through midpoints keeps the line smooth at any pointer rate
  ctx.beginPath();
  ctx.moveTo((x0 + x1) / 2, (y0 + y1) / 2);
  ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2);
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = pts[i][2];
  ctx.stroke();
}

function drawMarker(ctx: CanvasRenderingContext2D, stroke: Stroke, cx: number, scrollY: number) {
  const pts = stroke.points;
  if (pts.length === 1) {
    const [x, y] = toScreen(pts[0], cx, scrollY);
    ctx.beginPath();
    ctx.arc(x, y, pts[0][2] / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.color;
    ctx.fill();
    return;
  }
  for (let i = 1; i < pts.length; i++) drawSegment(ctx, stroke, i, cx, scrollY);
}

// Seeded PRNG (mulberry32), so the droplet texture is identical on every load
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Spray paint is opaque droplets, not a translucent wash. Every spray stroke
// keeps a coverage map of how much paint has landed on each pixel, and a pixel
// shows solid colour once its coverage passes the threshold this texture gives
// it. Droplets of varied size each get one threshold, so they appear whole:
// light coverage reads as grain with the wall showing through, heavy coverage
// as solid paint, and the far edge as scattered overspray. Tiled in document
// space, so the grain stays put on the wall.
let dropletCache: { scale: number; field: Float32Array } | null = null;
function droplets(scale: number) {
  if (dropletCache?.scale === scale) return dropletCache.field;
  const rand = random(0x5eed);
  const n = DROPLETS;
  const field = new Float32Array(n * n);
  // Fine grain between droplets: light coverage leaves it speckled and only
  // heavy coverage fills it in solid
  for (let i = 0; i < field.length; i++) field[i] = 0.2 + rand() * 1.1;
  const count = Math.round((n * n) / (scale * scale * 4));
  for (let k = 0; k < count; k++) {
    const cx = rand() * n;
    const cy = rand() * n;
    const r = (0.35 + rand() ** 4 * 1.1) * scale; // mostly fine, a few fat drops
    const v = rand();
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 > r * r) continue;
        const i = (y & (n - 1)) * n + (x & (n - 1));
        if (v < field[i]) field[i] = v;
      }
    }
  }
  dropletCache = { scale, field };
  return field;
}

// How the cone spreads one puff of paint over css px, with each row's
// non-zero span so deposits skip the empty corners
type Kernel = { r: number; size: number; w: Float32Array; spans: Int32Array };
let kernelCache: Kernel | null = null;
function sprayKernel(): Kernel {
  if (kernelCache) return kernelCache;
  const r = Math.ceil(SPRAY_REACH);
  const size = r * 2 + 1;
  const w = new Float32Array(size * size);
  const spans = new Int32Array(size);
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d2 = x * x + y * y;
      if (d2 > SPRAY_REACH ** 2) continue;
      w[(y + r) * size + x + r] = sprayProfile(d2);
      spans[y + r] = Math.max(spans[y + r], Math.abs(x));
    }
  }
  kernelCache = { r, size, w, spans };
  return kernelCache;
}

// Wet-paint weight a puff leaves at a given squared distance from its centre
function sprayProfile(d2: number) {
  return Math.exp(-d2 / (2 * SPRAY_SIGMA ** 2));
}

// A spray stroke's paint, in tiles that grow wherever it reaches. Coverage
// is smooth, so it's tracked per css px; droplets are resolved per device px
// only when a tile is flushed. While the stroke is live each tile keeps its
// coverage and pixels; once finished only the rendered canvas is kept
type Tile = {
  tx: number;
  ty: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: ImageData | null;
  coverage: Float32Array | null;
  dirty: [x0: number, y0: number, x1: number, y1: number] | null; // css px
};
type PaintLayer = {
  size: number; // device px per tile
  rgb: [number, number, number];
  tiles: Map<number, Tile>;
  applied: number; // stroke points already deposited
  sealed: boolean;
};

function createLayer(color: string, size: number): PaintLayer {
  const hex = parseInt(color.slice(1, 7), 16);
  return {
    size,
    rgb: [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255],
    tiles: new Map(),
    applied: 0,
    sealed: false,
  };
}

function layerTile(layer: PaintLayer, tx: number, ty: number) {
  const key = (tx + 32768) * 65536 + (ty + 32768);
  let tile = layer.tiles.get(key);
  if (!tile) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = layer.size;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(layer.size, layer.size);
    const [r, g, b] = layer.rgb;
    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = r;
      image.data[i + 1] = g;
      image.data[i + 2] = b;
    }
    tile = { tx, ty, canvas, ctx, image, coverage: new Float32Array(TILE * TILE), dirty: null };
    layer.tiles.set(key, tile);
  }
  return tile;
}

// Land one puff of paint centred on (x, y) in document space
function deposit(layer: PaintLayer, x: number, y: number, amount: number) {
  const k = sprayKernel();
  const cx = Math.round(x);
  const cy = Math.round(y);
  const x0 = cx - k.r;
  const y0 = cy - k.r;
  for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((cy + k.r) / TILE); ty++) {
    for (let tx = Math.floor(x0 / TILE); tx <= Math.floor((cx + k.r) / TILE); tx++) {
      const tile = layerTile(layer, tx, ty);
      const coverage = tile.coverage!;
      const ox = tx * TILE;
      const oy = ty * TILE;
      const ay = Math.max(y0, oy);
      const by = Math.min(cy + k.r, oy + TILE - 1);
      const ax = Math.max(x0, ox);
      const bx = Math.min(cx + k.r, ox + TILE - 1);
      for (let gy = ay; gy <= by; gy++) {
        const span = k.spans[gy - y0];
        const kRow = (gy - y0) * k.size - x0;
        const tRow = (gy - oy) * TILE - ox;
        for (let gx = Math.max(cx - span, ax); gx <= Math.min(cx + span, bx); gx++) {
          coverage[tRow + gx] += amount * k.w[kRow + gx];
        }
      }
      const d = tile.dirty;
      tile.dirty = d
        ? [Math.min(d[0], ax - ox), Math.min(d[1], ay - oy), Math.max(d[2], bx - ox), Math.max(d[3], by - oy)]
        : [ax - ox, ay - oy, bx - ox, by - oy];
    }
  }
}

// Resolve the droplets in a tile's dirty area and push them to its canvas
function flush(layer: PaintLayer, tile: Tile) {
  if (!tile.dirty) return;
  const { size } = layer;
  const scale = size / TILE;
  const field = droplets(scale);
  const mask = DROPLETS - 1;
  const coverage = tile.coverage!;
  const data = tile.image!.data;
  const [x0, y0, x1, y1] = tile.dirty;
  const dx0 = Math.floor(x0 * scale);
  const dy0 = Math.floor(y0 * scale);
  const dx1 = Math.min(size, Math.ceil((x1 + 1) * scale));
  const dy1 = Math.min(size, Math.ceil((y1 + 1) * scale));
  const ox = tile.tx * size;
  const oy = tile.ty * size;
  for (let dy = dy0; dy < dy1; dy++) {
    const cRow = Math.min(TILE - 1, (dy / scale) | 0) * TILE;
    const fRow = ((oy + dy) & mask) * DROPLETS;
    for (let dx = dx0; dx < dx1; dx++) {
      const c = coverage[cRow + Math.min(TILE - 1, (dx / scale) | 0)];
      // Droplets are opaque: a pixel flips to solid paint just past its
      // threshold, with a hair of ramp to soften the pixel edge
      data[(dy * size + dx) * 4 + 3] = (c - field[fRow + ((ox + dx) & mask)]) * 6000 + 127.5;
    }
  }
  tile.ctx.putImageData(tile.image!, 0, 0, dx0, dy0, dx1 - dx0, dy1 - dy0);
  tile.dirty = null;
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: PaintLayer,
  cx: number,
  scrollY: number,
  dpr: number,
  height: number
) {
  // Place tiles on whole device pixels so neighbours meet without seams
  const left = Math.round(cx * dpr);
  const top = Math.round(scrollY * dpr);
  const side = layer.size / dpr;
  for (const tile of layer.tiles.values()) {
    const y = (tile.ty * layer.size - top) / dpr;
    if (y > height || y + side < 0) continue;
    ctx.drawImage(tile.canvas, (left + tile.tx * layer.size) / dpr, y, side, side);
  }
}

// Run a drip down the wall. Paint on a vertical surface moves as a viscous
// film: it eases up to a terminal speed set by its weight, spends paint on the
// trail it leaves (so it thins, slows and stops), gathers more where it runs
// through wet paint, and wanders a little with the surface texture.
function simulateRun(
  x: number,
  y: number,
  mass: number,
  rand: () => number,
  pickUp: (x: number, y: number) => number
): Run {
  const run: Run = [];
  const dt = RUN_STEP / 1000;
  let m = mass;
  let v = 0;
  let drift = 0;
  for (let step = 0; step < 150; step++) {
    const width = 1.4 + 1.9 * Math.sqrt(m);
    run.push([round1(x), round1(y), round1(width)]);
    v += (70 * m - v) * (1 - Math.exp(-dt / 0.35));
    const dy = v * dt;
    drift = drift * 0.85 + (rand() - 0.5) * 0.12;
    x += drift;
    y += dy;
    m += pickUp(x, y) - dy * 0.0042 * width;
    if (m <= 0.06 || (step > 10 && v < 4)) break;
  }
  return run;
}

// A drip's trail up to `shown` steps, tapering as it ran out of paint, with
// the bead of paint that leads it
function drawRun(
  ctx: CanvasRenderingContext2D,
  run: Run,
  color: string,
  cx: number,
  scrollY: number,
  shown = run.length - 1
) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  const n = Math.min(Math.floor(shown), run.length - 1);
  let [hx, hy] = toScreen(run[0], cx, scrollY);
  let hw = run[0][2];
  for (let k = 1; k <= n + 1 && k < run.length; k++) {
    const t = k <= n ? 1 : shown - n;
    if (t <= 0) break;
    const [x1, y1] = toScreen(run[k], cx, scrollY);
    const x = hx + (x1 - hx) * t;
    const y = hy + (y1 - hy) * t;
    ctx.lineWidth = run[k][2];
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(x, y);
    ctx.stroke();
    [hx, hy, hw] = [x, y, run[k][2]];
  }
  ctx.beginPath();
  ctx.arc(hx, hy, hw * 0.75 + 0.8, 0, Math.PI * 2);
  ctx.fill();
}

// Ring cursor the size of the spray, tinted with the current colour
function sprayCursor(color: string) {
  const size = SPRAY_RADIUS * 2 + 4;
  const c = size / 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<circle cx="${c}" cy="${c}" r="${SPRAY_RADIUS}" fill="none" stroke="#fff" stroke-width="2.5" stroke-opacity=".7"/>` +
    `<circle cx="${c}" cy="${c}" r="${SPRAY_RADIUS}" fill="none" stroke="${color}" stroke-dasharray="2 3"/>` +
    `<circle cx="${c}" cy="${c}" r="1.5" fill="${color}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${c} ${c}, crosshair`;
}

const TOOLS = [
  {
    value: "marker",
    label: "Marker",
    icon: (
      <>
        <path d="M10 2.5 13.5 6l-6 6L4 8.5z" />
        <path d="M4 8.5 7.5 12l-5 1.5z" />
      </>
    ),
  },
  {
    value: "spray",
    label: "Spray can",
    icon: (
      <>
        <rect x="3.5" y="6.5" width="6" height="8" rx="1.25" />
        <path d="M4.75 6.5V5h3.5v1.5M6.5 5V3h2" />
        <circle cx="12" cy="2.5" r=".6" fill="currentColor" stroke="none" />
        <circle cx="14" cy="3.5" r=".6" fill="currentColor" stroke="none" />
        <circle cx="12.25" cy="4.75" r=".6" fill="currentColor" stroke="none" />
        <circle cx="14.25" cy="6" r=".6" fill="currentColor" stroke="none" />
      </>
    ),
  },
] as const;

export function GraffitiLayer() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const colorRef = useRef<string>(COLORS[0].value);
  const toolRef = useRef<Tool>("marker");
  const redrawRef = useRef<() => void>(() => {});
  const relayoutRef = useRef<() => void>(() => {});
  const [enabled, setEnabled] = useState(false);
  const [color, setColor] = useState<string>(COLORS[0].value);
  const [tool, setTool] = useState<Tool>("marker");
  const [count, setCount] = useState(0);

  // Only fine pointers with hover (mouse, trackpad, pen) get the feature
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Load this page's drawing whenever the route changes
  useEffect(() => {
    strokesRef.current = readStrokes(pathname);
    setCount(strokesRef.current.length);
    redrawRef.current();
    // The new page's content has to lay out before its keep-out zones exist
    const id = requestAnimationFrame(() => relayoutRef.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dpr = 1;
    let frame = 0;
    let settle = 0;
    let keepOut: Rect[] = [];
    let current: Stroke | null = null;
    let cursor = "";
    let last = { x: 0, y: 0, t: 0, w: MIN_WIDTH };

    // Spray state: pointer in client space, last emission in document space
    let pointer = { x: 0, y: 0 };
    let nozzle = { x: 0, y: 0, t: 0 };
    let loop = 0;
    let lastTick = 0;

    // Wet paint on the wall, in coarse cells. Puffs add to it, it slowly sets,
    // and wherever it pools past what the surface can hold, it runs
    type WetCell = { i: number; j: number; wet: number; stroke: Stroke };
    const wetField = new Map<number, WetCell>();
    const cellKey = (i: number, j: number) => (i + 32768) * 65536 + j;
    const cellAt = (x: number, y: number) =>
      wetField.get(cellKey(Math.floor(x / WET_CELL), Math.floor(y / WET_CELL)));

    // Drips still running, revealed at the speed they were simulated
    const running = new Map<Run, { stroke: Stroke; start: number }>();

    // Each spray stroke's rendered paint. Built from its stored puffs on
    // first sight (so a reload paints exactly what was sprayed), added to as
    // the can sprays, then sealed down to plain canvases once it's finished
    const layers = new WeakMap<Stroke, PaintLayer>();

    function paintLayer(stroke: Stroke) {
      const size = Math.round(TILE * dpr);
      let layer = layers.get(stroke);
      if (!layer || layer.size !== size || (layer.sealed && layer.applied < stroke.points.length)) {
        layer = createLayer(stroke.color, size);
        layers.set(stroke, layer);
      }
      const pts = stroke.points;
      while (layer.applied < pts.length) {
        // Puffs landing on the same css px only add up, so a held can's
        // repeats merge into one deposit
        const x = Math.round(pts[layer.applied][0]);
        const y = Math.round(pts[layer.applied][1]);
        let paint = 0;
        while (
          layer.applied < pts.length &&
          Math.round(pts[layer.applied][0]) === x &&
          Math.round(pts[layer.applied][1]) === y
        ) {
          paint += pts[layer.applied++][2];
        }
        deposit(layer, x, y, paint * DEPOSIT);
      }
      for (const tile of layer.tiles.values()) flush(layer, tile);
      if (stroke !== current && !layer.sealed) {
        for (const tile of layer.tiles.values()) {
          tile.image = null;
          tile.coverage = null;
        }
        layer.sealed = true;
      }
      return layer;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(window.innerWidth * dpr);
      canvas!.height = Math.round(window.innerHeight * dpr);
      relayout();
    }

    function redraw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const sy = window.scrollY;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      const offscreen = (b: Rect) => b.y - sy > h || b.y + b.h - sy < 0;
      for (const stroke of strokesRef.current) {
        if (stroke.tool === "spray") {
          if (offscreen(strokeBounds(stroke))) continue;
          drawLayer(ctx!, paintLayer(stroke), cx, sy, dpr, h);
          const now = performance.now();
          for (const r of stroke.runs ?? []) {
            const run = running.get(r);
            drawRun(ctx!, r, stroke.color, cx, sy, run && (now - run.start) / RUN_STEP);
          }
          continue;
        }
        if (!offscreen(strokeBounds(stroke))) drawMarker(ctx!, stroke, cx, sy);
      }
      eraseKeepOut(ctx!, keepOut, cx, sy, 0, h);
    }
    redrawRef.current = redraw;

    function relayout() {
      keepOut = collectKeepOut();
      redraw();
    }
    relayoutRef.current = relayout;

    // Reveal animations and lazy images shift content while scrolling, so
    // re-measure once scrolling settles
    function onScroll() {
      scheduleRedraw();
      clearTimeout(settle);
      settle = window.setTimeout(relayout, 150);
    }

    function scheduleRedraw() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(redraw);
    }

    function addPoint(e: PointerEvent) {
      if (!current) return;
      const now = e.timeStamp;
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      if (dist < 1.5) return;
      // Faster strokes thin out like a real marker; eased so width never jumps
      const speed = dist / Math.max(1, now - last.t);
      const target = Math.max(MIN_WIDTH, MAX_WIDTH - speed * 2.2);
      const w = last.w + (target - last.w) * 0.35;
      current.points.push([e.clientX - window.innerWidth / 2, e.clientY + window.scrollY, w]);
      const prevY = last.y;
      last = { x: e.clientX, y: e.clientY, t: now, w };
      const cx = window.innerWidth / 2;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSegment(ctx!, current, current.points.length - 1, cx, window.scrollY);
      const pad = MAX_WIDTH * 2;
      eraseKeepOut(
        ctx!,
        keepOut,
        cx,
        window.scrollY,
        Math.min(prevY, e.clientY) - pad,
        Math.max(prevY, e.clientY) + pad
      );
    }

    // The can sprays at a constant rate on every frame it is held down, not
    // only when it moves: a fast sweep spreads that paint thin and a slow pass
    // or a pause piles it up
    function spray(now: number) {
      if (!current || current.tool !== "spray") return;
      const cx = window.innerWidth / 2;
      const sy = window.scrollY;
      const x = pointer.x - cx;
      const y = pointer.y + sy;
      const dt = Math.min(48, Math.max(0, now - nozzle.t));
      const dist = Math.hypot(x - nozzle.x, y - nozzle.y);
      const steps = Math.max(1, Math.ceil(dist / (SPRAY_RADIUS * 0.3)));
      const paint = Math.max(1, Math.round((dt * SPRAY_RATE) / steps));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        puff(current, nozzle.x + (x - nozzle.x) * t, nozzle.y + (y - nozzle.y) * t, paint);
      }
      nozzle = { x, y, t: now };
    }

    // One burst from the nozzle: stored (and painted on the next frame) and
    // added to the wet field
    function puff(stroke: Stroke, x: number, y: number, paint: number) {
      stroke.points.push([round1(x), round1(y), paint]);
      const r = SPRAY_RADIUS;
      const j0 = Math.max(0, Math.floor((y - r) / WET_CELL));
      for (let i = Math.floor((x - r) / WET_CELL); i <= Math.floor((x + r) / WET_CELL); i++) {
        for (let j = j0; j <= Math.floor((y + r) / WET_CELL); j++) {
          const d2 = ((i + 0.5) * WET_CELL - x) ** 2 + ((j + 0.5) * WET_CELL - y) ** 2;
          if (d2 > r * r) continue;
          const wet = paint * sprayProfile(d2);
          const key = cellKey(i, j);
          const cell = wetField.get(key);
          if (cell) {
            cell.wet += wet;
            cell.stroke = stroke;
          } else wetField.set(key, { i, j, wet, stroke });
        }
      }
    }

    // Let the wet paint set, and start a drip from the heaviest pool that
    // has gone past what the surface can hold
    function dry(dt: number) {
      const keep = 0.5 ** (dt / DRY_HALF_LIFE);
      const alive = new Set(strokesRef.current);
      let heaviest: WetCell | null = null;
      for (const [key, cell] of wetField) {
        cell.wet *= keep;
        // Dry, undone, cleared or left behind on another page
        if (cell.wet < 4 || !alive.has(cell.stroke)) wetField.delete(key);
        else if (cell.wet > POOL && (!heaviest || cell.wet > heaviest.wet)) heaviest = cell;
      }
      if (heaviest) startRun(heaviest);
    }

    function startRun(pool: WetCell) {
      const { stroke } = pool;
      const px = (pool.i + 0.5) * WET_CELL;
      const py = (pool.j + 0.5) * WET_CELL;

      // Drips form side by side along a pool, never on top of one another
      const runs = (stroke.runs ??= []);
      const nearby = runs.filter(
        ([[rx, ry]]) => Math.abs(rx - px) < SPRAY_RADIUS * 1.6 && Math.abs(ry - py) < SPRAY_RADIUS * 2
      );
      const x =
        nearby.length < MAX_RUNS_PER_POOL
          ? [0, -0.6, 0.6, -1.1, 1.1]
              .map((o) => px + (o + (Math.random() - 0.5) * 0.4) * SPRAY_RADIUS)
              .find(
                (x) =>
                  // Only where the paint itself has pooled, clear of earlier drips
                  (cellAt(x, py)?.wet ?? 0) > POOL * 0.5 &&
                  nearby.every(([[rx]]) => Math.abs(rx - x) > SPRAY_RADIUS * 0.8)
              )
          : undefined;
      if (x === undefined) {
        // The surface around it is already streaked; the pool just sets
        pool.wet = POOL * 0.9;
        return;
      }

      // It runs from the bottom edge of the wet paint in its own column
      const i = Math.floor(x / WET_CELL);
      let j = pool.j;
      while (j - pool.j < 8 && (wetField.get(cellKey(i, j + 1))?.wet ?? 0) > POOL * 0.3) j++;
      const y = (j + 1) * WET_CELL;

      // The drip takes the pooled paint with it
      // Uneven surfaces hold uneven amounts, so drips vary a lot in length
      const excess = (pool.wet - POOL) / POOL;
      const mass = Math.min(1.6, 0.3 + excess * 0.8 + Math.random() ** 2 * 0.9);
      for (const cell of wetField.values()) {
        const d2 = ((cell.i + 0.5) * WET_CELL - x) ** 2 + ((cell.j + 0.5) * WET_CELL - y) ** 2;
        if (d2 < SPRAY_RADIUS * SPRAY_RADIUS) cell.wet *= 0.35;
      }
      const run = simulateRun(x, y, mass, Math.random, (rx, ry) => {
        const cell = cellAt(rx, ry);
        if (!cell) return 0;
        const take = cell.wet * 0.25;
        cell.wet -= take;
        return (take / POOL) * 0.5;
      });
      runs.push(run);
      if (!current) writeStrokes(window.location.pathname, strokesRef.current);
      if (reducedMotion.matches) scheduleRedraw();
      else running.set(run, { stroke, start: performance.now() });
    }

    // One frame loop for the nozzle, the drying paint and the running drips;
    // it sleeps once the can is down, the paint has set and every drip stopped
    function tick(now: number) {
      loop = 0;
      const dt = Math.min(48, Math.max(0, now - lastTick));
      lastTick = now;
      const spraying = current?.tool === "spray";
      spray(now);
      dry(dt);
      const dripping = running.size > 0; // includes drips finishing this frame
      for (const [run, { stroke, start }] of running) {
        const done = (now - start) / RUN_STEP >= run.length - 1;
        if (done || !strokesRef.current.includes(stroke)) running.delete(run);
      }
      if (spraying || dripping) redraw();
      if (current?.tool === "spray" || wetField.size || running.size) {
        loop = requestAnimationFrame(tick);
      }
    }

    function wake() {
      if (loop) return;
      lastTick = performance.now();
      loop = requestAnimationFrame(tick);
    }

    function isEmptyAt(e: PointerEvent) {
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return false;
      return !hits(keepOut, e.clientX - window.innerWidth / 2, e.clientY + window.scrollY);
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      keepOut = collectKeepOut(); // measure fresh so the start check is exact
      if (!isEmptyAt(e)) return;
      e.preventDefault(); // no text selection while drawing
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY + window.scrollY;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (toolRef.current === "spray") {
        current = {
          tool: "spray",
          color: colorRef.current,
          points: [],
        };
        strokesRef.current.push(current);
        pointer = { x: e.clientX, y: e.clientY };
        nozzle = { x, y, t: performance.now() };
        puff(current, x, y, 12);
        wake();
        return;
      }

      const w = (MIN_WIDTH + MAX_WIDTH) / 2;
      current = { color: colorRef.current, points: [[x, y, w]] };
      strokesRef.current.push(current);
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp, w };
      drawMarker(ctx!, current, window.innerWidth / 2, window.scrollY);
    }

    function onPointerMove(e: PointerEvent) {
      if (current) {
        if (current.tool === "spray") {
          pointer = { x: e.clientX, y: e.clientY };
          return;
        }
        // Coalesced events give smooth curves on fast flicks
        const events = e.getCoalescedEvents?.() ?? [];
        if (events.length) events.forEach(addPoint);
        else addPoint(e);
        return;
      }
      if (e.pointerType === "touch") return;
      const next = !isEmptyAt(e)
        ? ""
        : toolRef.current === "spray"
          ? sprayCursor(colorRef.current)
          : "crosshair";
      if (cursor !== next) root.style.cursor = cursor = next;
    }

    function onPointerUp() {
      if (!current) return;
      const sprayed = current.tool === "spray";
      current = null;
      if (sprayed) scheduleRedraw(); // seals the finished stroke's paint
      strokesRef.current = trim(strokesRef.current);
      writeStrokes(window.location.pathname, strokesRef.current);
      setCount(strokesRef.current.length);
    }

    // Page height changes (images loading, route changes) move content
    const observer = new ResizeObserver(() => relayout());
    observer.observe(document.body);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(loop);
      clearTimeout(settle);
      observer.disconnect();
      wetField.clear();
      running.clear();
      root.style.cursor = "";
      redrawRef.current = () => {};
      relayoutRef.current = () => {};
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("blur", onPointerUp);
    };
  }, [enabled]);

  const pickColor = useCallback((value: string) => {
    colorRef.current = value;
    setColor(value);
  }, []);

  const pickTool = useCallback((value: Tool) => {
    toolRef.current = value;
    setTool(value);
  }, []);

  const update = useCallback(
    (next: Stroke[]) => {
      strokesRef.current = next;
      writeStrokes(pathname, next);
      setCount(next.length);
      redrawRef.current();
    },
    [pathname]
  );

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 -z-[1] h-screen w-screen"
        aria-hidden="true"
      />

      {count > 0 && (
        <div
          role="toolbar"
          aria-label="Graffiti"
          data-graffiti-ignore
          className="graffiti-toolbar fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white/70 p-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] backdrop-blur-md"
        >
          {TOOLS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => pickTool(t.value)}
              aria-label={t.label}
              aria-pressed={tool === t.value}
              title={t.label}
              className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors duration-150 hover:text-ink aria-pressed:bg-ink/[0.06] aria-pressed:text-ink"
            >
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {t.icon}
              </svg>
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => pickColor(c.value)}
              aria-label={`${c.label} colour`}
              aria-pressed={color === c.value}
              className="grid h-7 w-7 place-items-center rounded-full"
            >
              <span
                className="h-3.5 w-3.5 rounded-full transition-transform duration-150 ease-out"
                style={{
                  background: c.value,
                  transform: color === c.value ? "scale(1.25)" : undefined,
                  boxShadow: color === c.value ? `0 0 0 2px #fff, 0 0 0 3px ${c.value}` : undefined,
                }}
              />
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          <button
            type="button"
            onClick={() => update(strokesRef.current.slice(0, -1))}
            className="rounded-full px-2.5 py-1 text-meta text-muted transition-colors hover:text-ink"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => update([])}
            className="rounded-full px-2.5 py-1 text-meta text-muted transition-colors hover:text-ink"
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
}
