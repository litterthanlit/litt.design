// Composes the homepage card covers into public/previews/covers/<slug>-landscape.jpg.
// SHAPES holds the one shape the homepage uses; a scene's layout tables are keyed
// by shape, so another shape is one more entry in SHAPES and in each table.
//
// The covers are flat: a solid ground with crisp pieces of the real product
// on it, and the composition does the work (scale, crop, edges, air). There is
// no blur, no grain, no light and no shadow, except what a capture carries in
// itself. Vyo is the one exception: its soft orange field is part of its Block
// style. Sources are captured from the live sites into scripts/covers/.cache,
// which is gitignored.
//
//   node scripts/covers/build.mjs            every scene
//   node scripts/covers/build.mjs brand      one scene
//   node scripts/covers/build.mjs --fresh    recapture the sources first
//
// Needs Playwright with Chromium (npx playwright install chromium).

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CACHE = path.join(ROOT, "scripts/covers/.cache");
const OUT = path.join(ROOT, "public/previews/covers");

// Each shape in CSS px, rendered at 2x
const SHAPES = {
  landscape: { w: 800, h: 500 },
};

const BRAND = "https://brand-five-gules.vercel.app/";
const LITT = "https://littmd.vercel.app/";

// Brand's generators, by the slug its index links to
const GENERATORS = [
  "stipple-cloud", "glitch-field", "ink-bleed", "long-exposure", "line-sweep", "particle-stream",
  "blur-echo", "screen-orb", "photogram", "bar-type", "halftone", "mesh-gradient", "dither", "stamp",
  "bauhaus", "flow-field", "truchet", "blob", "topography", "type-repeat", "sunburst", "waves", "rings",
];

// litt.md's own wall: its components, by their wall tile's id, on raised tiles
// over the stone page, in columns, so every component in a column shows at one
// scale. A tile takes its share of the column's spare height as air.
const LITT_WALL = {
  landscape: { margin: [20, 20], columns: [["chart", "dot-plot"], ["switch", "slide-confirm", "button"]] },
};
const LITT_TILES = [...new Set(Object.values(LITT_WALL).flatMap((s) => s.columns.flat()))];

// Hypher's marketing CSS, minus every backdrop, so a card captures on transparent
const HYPHER_BARE =
  "html,body,main,section,.marketing-wrap,.marketing-section,.marketing-vtile,.marketing-photo,.marketing-vcards,.marketing-vcard{background:transparent!important}" +
  ".marketing-photo__img{visibility:hidden!important}" +
  ".marketing-photo::before,.marketing-photo::after,.marketing-vtile::before,.marketing-vtile::after{display:none!important}";

// Brand rounds its index tiles and blurs what scrolls under its header; a cover wants square tiles and a bare header
const BRAND_SQUARE = "li .rounded-md{border-radius:0!important}header{backdrop-filter:none!important}";

// The screenshot is clipped to the element's whole CSS pixels, so no sliver of
// the page shows at an edge, and grown by margin px to keep what overflows it
const shoot = (url, { scale = 2, viewport = { width: 1440, height: 900 }, css, prepare, locate, bare = false, margin = 0 }) => async (browser) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: scale, reducedMotion: "reduce" });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    if (css) await page.addStyleTag({ content: css });
    if (prepare) await prepare(page);
    const el = locate(page);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    if (bare) await el.evaluate((node) => { for (let p = node.parentElement; p; p = p.parentElement) p.style.background = "transparent"; });
    const b = await el.boundingBox();
    const [x, y] = [Math.ceil(b.x) - margin, Math.ceil(b.y) - margin];
    const clip = { x, y, width: Math.floor(b.x + b.width) + margin - x, height: Math.floor(b.y + b.height) + margin - y };
    return await page.screenshot({ clip, omitBackground: bare });
  } finally {
    await page.close();
  }
};


async function expectClass(locator, name, act, tries = 20) {
  for (let i = 0; i < tries; i++) {
    await act();
    await locator.page().waitForTimeout(250);
    if ((await locator.getAttribute("class"))?.split(" ").includes(name)) return;
  }
  throw new Error(`${name} never appeared`);
}

// The litt.works gallery's Orb view lays itself out to the window, so each shape
// gets its own capture at that shape's proportions, with the page chrome hidden
const littWorksOrb = (shape) =>
  shoot("https://www.litt.design/art", {
    scale: 1.25,
    viewport: { width: SHAPES[shape].w * 1.6, height: SHAPES[shape].h * 1.6 },
    // A click before hydration is lost, so it repeats until Orb is the active view.
    // The chrome hides only after, since a hidden button takes no clicks.
    prepare: async (p) => {
      const orb = p.locator("button.gallery-view-btn", { hasText: "Orb" });
      await expectClass(orb, "is-active", () => orb.click());
      await p.addStyleTag({ content: ".canvas-logo,.gallery-view-toggle,.canvas-header-label,.canvas-hint{visibility:hidden!important}" });
    },
    locate: (p) => p.locator("body"),
  });

const SOURCES = {
  ...Object.fromEntries(Object.keys(SHAPES).map((shape) => [`litt-works-${shape}.png`, littWorksOrb(shape)])),
  "hypher-note.png": shoot("https://www.hypher.app/", { scale: 3, css: HYPHER_BARE, bare: true, locate: (p) => p.locator("#the-loop .marketing-vtile").nth(1) }),
  // The taste rows, set into one dark panel of their own so the gaps read as the panel
  "studio-taste.png": shoot("https://studio-os.io/", {
    scale: 3,
    bare: true,
    css: "html,body{background:transparent!important}article.group div.absolute.inset-0{display:none!important}article.group div.max-w-\\[240px\\]{background:#0b0b10!important;padding:12px!important;max-width:264px!important;border-radius:8px!important}",
    locate: (p) => p.locator("article.group").nth(1).locator("div.max-w-\\[240px\\]"),
  }),
  ...Object.fromEntries(
    GENERATORS.map((g) => [`brand-${g}.png`, shoot(BRAND, { css: BRAND_SQUARE, locate: (p) => p.locator(`li a[href="#/t/${g}"] [role=img]`) })]),
  ),
  "brand-index-heading.png": shoot(BRAND, { scale: 6, bare: true, css: "#tools-heading{line-height:1!important}", locate: (p) => p.locator("#tools-heading") }),
  // A component as its wall tile draws it, without most of the tile's air. A tile mounts its component once it scrolls into view.
  ...Object.fromEntries(
    LITT_TILES.map((id) => [
      `litt-${id}.png`,
      shoot(LITT, {
        scale: 3,
        margin: 12,
        prepare: (p) => p.locator(`[data-tile="${id}"]`).scrollIntoViewIfNeeded(),
        locate: (p) => p.locator(`[data-tile="${id}"] > div:first-child > div > *`).first(),
      }),
    ]),
  ),
};

const cached = (name) => pathToFileURL(path.join(CACHE, name)).href;

const BRAND_INK = "#0a0a0b";

// An object is a box on the stage: x and y are its centre, w its width, all in
// % of the stage (h in % of its height). Without h the image keeps its own
// shape; with h it fits the box ("contain") or fills and crops it ("cover", at
// pos). fill, pad and radius make the box a flat tile of its own.
function objectHtml(o) {
  const box = [
    `left:${o.x}%`,
    `top:${o.y}%`,
    `width:${o.w}%`,
    o.h && `height:${o.h}%`,
    o.fill && `background:${o.fill}`,
    o.pad && `padding:${o.pad}`,
    o.radius && `border-radius:${o.radius}px`,
  ].filter(Boolean).join(";");
  const fit = o.h ? `height:100%;object-fit:${o.fit ?? "contain"};object-position:${o.pos ?? "center"}` : "height:auto";
  return `<div class="o" style="${box}"><img src="${cached(o.src)}" style="width:100%;${fit}"></div>`;
}

// Lays cells out edge to edge like CSS grid-template-areas: one string of names
// per row, and a name that fills a rectangle of the grid is one cell spanning
// it. Cell edges fall on whole pixels so the gaps stay crisp.
function areas(shape, rows, { gap, cell }) {
  const { w: W, h: H } = SHAPES[shape];
  const grid = rows.map((r) => r.trim().split(/\s+/));
  const edges = (n, size) => Array.from({ length: n + 1 }, (_, i) => Math.round((i * (size + gap)) / n));
  const xs = edges(grid[0].length, W);
  const ys = edges(grid.length, H);
  const spans = new Map();
  grid.forEach((names, r) =>
    names.forEach((name, c) => {
      const s = spans.get(name) ?? { r0: r, c0: c, r1: r, c1: c };
      spans.set(name, { ...s, r1: r, c1: Math.max(s.c1, c) });
    }),
  );
  return [...spans].map(([name, { r0, c0, r1, c1 }]) => {
    const [left, right, top, bottom] = [xs[c0], xs[c1 + 1] - gap, ys[r0], ys[r1 + 1] - gap];
    return { ...cell(name), x: ((left + right) / 2 / W) * 100, y: ((top + bottom) / 2 / H) * 100, w: ((right - left) / W) * 100, h: ((bottom - top) / H) * 100 };
  });
}

const byShape = (table, layout) => Object.fromEntries(Object.entries(table).map(([shape, rows]) => [shape, layout(shape, rows)]));

// Brand, edge to edge: all 23 generators once each, cropped to their cells,
// and one cell for the index's own heading. A crop position keeps a
// generator's own words whole, or its words out and its subject in.
const GENERATOR_POS = { "stipple-cloud": "left center", "glitch-field": "right center", "particle-stream": "center 80%" };
const generatorCell = (name) =>
  name === "index"
    ? { src: "brand-index-heading.png", fill: BRAND_INK, pad: "28px" }
    : { src: `brand-${name}.png`, fit: "cover", pos: GENERATOR_POS[name] };

const BRAND_MOSAIC = {
  landscape: [
    "sunburst dither truchet screen-orb waves bauhaus",
    "particle-stream stamp photogram rings mesh-gradient stipple-cloud",
    "type-repeat flow-field blur-echo index long-exposure halftone",
    "glitch-field blob line-sweep topography ink-bleed bar-type",
  ],
};

const fullBleed = (src) => ({ src, x: 50, y: 50, w: 100, h: 100, fit: "cover" });

// Every scene has a flat ground and, for each shape, the objects on it.
// A scene with `html` draws itself.
const SCENES = {
  hypher: {
    ground: "#b9cdd8",
    shapes: {
      landscape: [{ src: "hypher-note.png", x: 50, y: 50, w: 74 }],
    },
  },
  "studio-os": {
    ground: "#f2f5f9",
    shapes: {
      landscape: [{ src: "studio-taste.png", x: 50, y: 50, w: 57 }],
    },
  },
  vyo: { html: vyo },
  "litt-md": { html: littWall },
  brand: {
    ground: BRAND_INK,
    shapes: byShape(BRAND_MOSAIC, (shape, rows) => areas(shape, rows, { gap: 4, cell: generatorCell })),
  },
  "litt-works": {
    ground: "#f4f2ee",
    shapes: Object.fromEntries(Object.keys(SHAPES).map((shape) => [shape, [fullBleed(`litt-works-${shape}.png`)]])),
  },
};

// Vyo's own Block style: one hue, out of focus, with the features stacked as
// black blocks, each tagged with a status tab. Words sit on blocks, never on the field.
// Each shape sets the 12 columns' outer edges, the top of the stack and each block's height.
const VYO = {
  landscape: { left: 48, right: 48, top: 56, rows: [88, 104, 88, 88] },
};

function vyo(shape) {
  const { w: W } = SHAPES[shape];
  const { left, right, top, rows } = VYO[shape];
  const gutter = 16;
  const colW = (W - left - right - 11 * gutter) / 12;
  const col = (n) => left + n * (colW + gutter);
  const span = (a, b) => col(b) - col(a) - gutter;
  const blocks = [
    { from: 2, to: 8, tab: "Scan", say: "Reads the repository" },
    { from: 4, to: 12, tab: "App guide", say: "How the app works, in plain English" },
    { from: 1, to: 7, tab: "Project story", say: "The sheet you sell it with" },
    { from: 3, to: 10, tab: "Exploded view", say: "Its real parts, drawn from the code" },
  ];
  let y = top;
  const stack = blocks.map((b, i) => {
    const h = rows[i];
    const at = y;
    y += h;
    return `
      <div style="position:absolute;left:${col(b.from)}px;top:${at}px;width:${span(b.from, b.to)}px;height:${h}px;background:#0a0a0a">
        <div style="position:absolute;top:-12px;${i % 2 ? "right:0" : "left:0"};height:24px;padding:0 8px;display:flex;gap:6px;align-items:center;background:#ffcc00;font:700 10px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#0a0a0a">${b.tab}<span style="font-weight:400">Live</span></div>
        <p style="margin:0;padding:20px 16px 0;font:500 14px/24px 'Helvetica Neue',Arial,sans-serif;color:#fff">${b.say}</p>
      </div>`;
  });
  return `
    <div class="ground" style="background:#f2560a">
      <div style="position:absolute;inset:-20%;filter:blur(60px)">
        <div style="position:absolute;left:8%;top:6%;width:52%;height:58%;border-radius:50%;background:#ffb27a"></div>
        <div style="position:absolute;left:52%;top:40%;width:56%;height:62%;border-radius:50%;background:#b83300"></div>
        <div style="position:absolute;left:30%;top:58%;width:34%;height:40%;border-radius:50%;background:#ff8a3d"></div>
      </div>
    </div>
    ${stack.join("")}
    <div style="position:absolute;left:${col(8)}px;top:${y + 24}px;padding:8px 12px;background:#fff;font:700 18px/24px 'Helvetica Neue',Arial,sans-serif;letter-spacing:-.01em;color:#0a0a0a">Vyo<span style="color:#e4002b">.</span></div>`;
}

function littWall(shape) {
  const { margin: [mx, my], columns } = LITT_WALL[shape];
  const tile = (id) =>
    `<div style="flex:1 1 auto;display:grid;place-items:center;padding:12px;background:#f7f5f3;border:1px solid #e8e4e1;border-radius:8px"><img src="${cached(`litt-${id}.png`)}" style="display:block;width:100%"></div>`;
  const column = (ids) => `<div data-fits style="flex:1;display:flex;flex-direction:column;gap:12px">${ids.map(tile).join("")}</div>`;
  return `<div class="ground" style="background:#fcfbfa;display:flex;gap:12px;padding:${my}px ${mx}px">${columns.map(column).join("")}</div>`;
}

function sceneHtml(s, shape) {
  if (s.html) return s.html(shape);
  return `<div class="ground" style="background:${s.ground}"></div>${s.shapes[shape].map(objectHtml).join("")}`;
}

const page = (body, { w, h }) => `<!doctype html><html><head><style>
  html,body{margin:0}
  .stage{position:relative;width:${w}px;height:${h}px;overflow:hidden}
  .ground{position:absolute;inset:0}
  .o{position:absolute;box-sizing:border-box;overflow:hidden;transform:translate(-50%,-50%)}
  .o img{display:block}
</style></head><body><div class="stage">${body}</div></body></html>`;

const args = process.argv.slice(2);
const fresh = args.includes("--fresh");
const only = args.filter((a) => !a.startsWith("--"));
const slugs = only.length ? only : Object.keys(SCENES);
for (const slug of slugs) if (!SCENES[slug]) throw new Error(`No scene named ${slug}. Scenes: ${Object.keys(SCENES).join(", ")}`);

fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, get] of Object.entries(SOURCES)) {
    const file = path.join(CACHE, name);
    if (fresh || !fs.existsSync(file)) {
      fs.writeFileSync(file, await get(browser));
      console.log(`captured ${name}`);
    }
  }
  const tab = await browser.newPage({ viewport: { width: 800, height: 750 }, deviceScaleFactor: 2 });
  for (const slug of slugs) {
    for (const [shape, size] of Object.entries(SHAPES)) {
      const html = path.join(CACHE, `${slug}-${shape}.html`);
      fs.writeFileSync(html, page(sceneHtml(SCENES[slug], shape), size));
      await tab.goto(pathToFileURL(html).href, { waitUntil: "load" });
      await tab.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
      // A column marked data-fits holds whole tiles, so one that overflows would cut its last
      const over = await tab.evaluate(() => [...document.querySelectorAll("[data-fits]")].some((e) => e.scrollHeight > e.clientHeight + 1));
      if (over) throw new Error(`${slug}-${shape}: a column overflows the stage; give it fewer tiles`);
      await tab.locator(".stage").screenshot({ path: path.join(OUT, `${slug}-${shape}.jpg`), type: "jpeg", quality: 86 });
      console.log(`wrote public/previews/covers/${slug}-${shape}.jpg`);
    }
  }
} finally {
  await browser.close();
}
