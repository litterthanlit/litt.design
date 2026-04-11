import type { Project } from "@/data/types";

export const projects: Project[] = [
  {
    slug: "ergon",
    title: "Ergon",
    category: "Creative Tool",
    description:
      "A browser-based creative coding studio for generative art. Write code templates, tweak parameters in real time, and export visual output — Processing meets a polished desktop IDE.",
    oneLineOutcome:
      "A creative coding studio that makes generative art accessible to designers and developers alike.",
    client: "Personal Project",
    year: "2026",
    services: ["Product Design", "Front-End Development", "WebGL"],
    stack: ["Next.js", "TypeScript", "WebGL", "CodeMirror", "Zustand"],
    accent: "#6C5CE7",
    coverMedia: {
      background:
        "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 50%, #dfe6e9 100%)",
    },
    heroFrames: [
      { id: "ergon-1", background: "linear-gradient(180deg, #6C5CE7, #a29bfe)", focus: 0.3 },
      { id: "ergon-2", background: "linear-gradient(180deg, #a29bfe, #dfe6e9)", focus: 0.5 },
      { id: "ergon-3", background: "linear-gradient(180deg, #6C5CE7, #74b9ff)", focus: 0.7 },
      { id: "ergon-4", background: "linear-gradient(180deg, #a29bfe, #6C5CE7)", focus: 0.4 },
      { id: "ergon-5", background: "linear-gradient(180deg, #dfe6e9, #a29bfe)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Creative coding needs better tools",
        body: "Existing creative coding environments feel dated or require too much boilerplate. Designers want to experiment with generative visuals without wrestling with build systems.",
      },
      {
        label: "Approach",
        heading: "Code-first, parameter-driven",
        body: "Built a studio with live code editing, a template system, and a parameter panel that exposes every tweakable value. Changes render instantly on canvas.",
      },
      {
        label: "Execution",
        heading: "One loop from idea to export",
        body: "CodeMirror editor with custom completions, a Zustand store driving the render pipeline, and one-click export to PNG, SVG, or video.",
      },
      {
        label: "Result",
        heading: "Ship generative work faster",
        body: "A polished studio that collapses the distance between writing code and seeing output, with templates that get you from zero to interesting in seconds.",
      },
    ],
    metrics: [
      { label: "Templates", value: "12+" },
      { label: "Export Formats", value: "3" },
      { label: "Render Latency", value: "<16ms" },
    ],
  },
  {
    slug: "wavr",
    title: "Wavr",
    category: "Creative Tool",
    description:
      "An interactive animated gradient editor. Create moving mesh gradients and visual effects through a visual editor, then export as CSS, PNG, or video. Raw WebGL shaders, no abstraction layer.",
    oneLineOutcome:
      "A visual gradient editor that turns shader code into exportable motion graphics.",
    client: "Personal Project",
    year: "2026",
    services: ["Product Design", "WebGL Development", "Shader Programming"],
    stack: ["Next.js", "WebGL 2", "GLSL", "Zustand", "Tailwind"],
    accent: "#E17055",
    coverMedia: {
      background:
        "linear-gradient(135deg, #E17055 0%, #fab1a0 40%, #ffeaa7 100%)",
      preview: "/previews/wavr.jpg",
    },
    externalUrl: "https://wavr-v1.vercel.app/",
    heroFrames: [
      { id: "wavr-1", background: "linear-gradient(180deg, #E17055, #fab1a0)", focus: 0.3 },
      { id: "wavr-2", background: "linear-gradient(180deg, #fab1a0, #ffeaa7)", focus: 0.5 },
      { id: "wavr-3", background: "linear-gradient(180deg, #E17055, #fdcb6e)", focus: 0.7 },
      { id: "wavr-4", background: "linear-gradient(180deg, #ffeaa7, #E17055)", focus: 0.4 },
      { id: "wavr-5", background: "linear-gradient(180deg, #fab1a0, #fdcb6e)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Gradient tools are static",
        body: "CSS gradient generators produce flat output. Designers want animated, organic gradients but shader programming has a steep learning curve.",
      },
      {
        label: "Approach",
        heading: "Visual controls over raw GLSL",
        body: "Exposed every shader uniform through intuitive UI controls — sliders for speed, complexity, distortion. The fragment shader does the heavy lifting; the interface hides the math.",
      },
      {
        label: "Execution",
        heading: "Single-shader architecture",
        body: "One fragment shader handles all gradient modes, noise, particles, bloom, and post-processing. No recompilation when switching modes — just uniform swaps.",
      },
      {
        label: "Result",
        heading: "Export-ready motion gradients",
        body: "Designers create living gradients and export as CSS, PNG, or WebM video in seconds. Mouse-reactive effects make every gradient feel interactive.",
      },
    ],
    metrics: [
      { label: "Gradient Modes", value: "5" },
      { label: "Effects", value: "6" },
      { label: "Export Formats", value: "3" },
    ],
  },
  {
    slug: "good-md",
    title: "Houston",
    category: "Desktop App",
    description:
      "A native Markdown reader built with Tauri. Opens and renders .md and .mdx files with syntax highlighting, GFM support, and a clean tabbed reading interface. Lightweight, fast, local-first.",
    oneLineOutcome:
      "A native desktop Markdown reader that prioritizes reading comfort over editing features.",
    client: "Personal Project",
    year: "2026",
    services: ["Product Design", "Desktop Development", "Typography"],
    stack: ["Tauri 2", "React 19", "Vite", "TypeScript"],
    accent: "#00B894",
    coverMedia: {
      background:
        "linear-gradient(135deg, #00B894 0%, #55efc4 50%, #dfe6e9 100%)",
      preview: "/previews/good-md.png",
    },
    externalUrl: "https://houston-rose.vercel.app/",
    heroFrames: [
      { id: "gmd-1", background: "linear-gradient(180deg, #00B894, #55efc4)", focus: 0.3 },
      { id: "gmd-2", background: "linear-gradient(180deg, #55efc4, #dfe6e9)", focus: 0.5 },
      { id: "gmd-3", background: "linear-gradient(180deg, #00B894, #81ecec)", focus: 0.7 },
      { id: "gmd-4", background: "linear-gradient(180deg, #dfe6e9, #00B894)", focus: 0.4 },
      { id: "gmd-5", background: "linear-gradient(180deg, #55efc4, #00cec9)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Markdown readers try to do too much",
        body: "Most Markdown apps are editors first. Readers who just want to open and read files get buried under editing chrome and configuration.",
      },
      {
        label: "Approach",
        heading: "Read-first, native-fast",
        body: "Built on Tauri for native performance with a minimal React UI. Drag-and-drop files, tabbed reading, keyboard navigation — nothing more.",
      },
      {
        label: "Execution",
        heading: "GFM, syntax highlighting, clean type",
        body: "Full GitHub-flavored Markdown support with syntax highlighting, auto-linked headings, and a reading layout designed around comfortable line lengths.",
      },
      {
        label: "Result",
        heading: "Opens instantly, reads beautifully",
        body: "A lightweight native app that does one thing well — rendering Markdown with the care of a good book layout.",
      },
    ],
    metrics: [
      { label: "Bundle Size", value: "~4MB" },
      { label: "Startup Time", value: "<200ms" },
      { label: "Formats", value: "md/mdx" },
    ],
  },
  {
    slug: "studio-os",
    title: "Studio OS",
    category: "AI Product",
    description:
      "An AI-powered creative workspace for designers. Briefing dashboard, six specialized AI agents, and an ASCII-inspired visual identity — a command center for solo design practice.",
    oneLineOutcome:
      "A designer's command center with AI agents that handle the busywork so you can focus on craft.",
    client: "Personal Project",
    year: "2025–2026",
    services: ["Product Strategy", "UI Design", "AI Integration"],
    stack: ["Next.js", "TypeScript", "Tailwind", "AI Agents"],
    accent: "#2D3436",
    coverMedia: {
      background:
        "linear-gradient(135deg, #2D3436 0%, #636e72 50%, #b2bec3 100%)",
      preview: "/previews/studio-os.png",
    },
    externalUrl: "https://studio-os.io/",
    heroFrames: [
      { id: "sos-1", background: "linear-gradient(180deg, #2D3436, #636e72)", focus: 0.3 },
      { id: "sos-2", background: "linear-gradient(180deg, #636e72, #b2bec3)", focus: 0.5 },
      { id: "sos-3", background: "linear-gradient(180deg, #2D3436, #dfe6e9)", focus: 0.7 },
      { id: "sos-4", background: "linear-gradient(180deg, #b2bec3, #2D3436)", focus: 0.4 },
      { id: "sos-5", background: "linear-gradient(180deg, #636e72, #2D3436)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Solo designers drown in admin",
        body: "Running a one-person studio means context-switching between design, content scheduling, client management, and strategic planning. The creative work suffers.",
      },
      {
        label: "Approach",
        heading: "Six agents, one dashboard",
        body: "Each AI agent owns a specific domain — content orchestration, typography curation, distraction shielding, automation. The briefing dashboard surfaces what matters today.",
      },
      {
        label: "Execution",
        heading: "ASCII-inspired, editorially restrained",
        body: "Jack Butcher-inspired visual language with sharp corners, Geist typography, and a monochrome palette. The interface feels like a briefing document, not an app.",
      },
      {
        label: "Result",
        heading: "Focus hours, not admin hours",
        body: "A workspace that absorbs the operational overhead of solo practice and gives you back the hours for the work that actually matters.",
      },
    ],
    metrics: [
      { label: "AI Agents", value: "6" },
      { label: "Iterations", value: "v6" },
      { label: "Status", value: "MVP" },
    ],
  },
  {
    slug: "vceezy",
    title: "VCEEZY",
    category: "Web3 Platform",
    description:
      "A music and NFT platform on Hedera. Player, collection, archive, merch, and token-gated content with wallet connectivity. Monochrome quiet-luxury design with spring-driven motion.",
    oneLineOutcome:
      "A music platform where artists own their distribution through NFTs on Hedera.",
    client: "VCeezy",
    year: "2026",
    services: ["Brand Identity", "Web Design", "Web3 Integration"],
    stack: ["Next.js", "Hedera SDK", "Framer Motion", "Howler.js"],
    accent: "#1A1A1A",
    coverMedia: {
      background:
        "linear-gradient(135deg, #1A1A1A 0%, #4a4a4a 50%, #8a8a8a 100%)",
      preview: "/previews/vceezy.png",
    },
    heroFrames: [
      { id: "vc-1", background: "linear-gradient(180deg, #1A1A1A, #4a4a4a)", focus: 0.3 },
      { id: "vc-2", background: "linear-gradient(180deg, #4a4a4a, #8a8a8a)", focus: 0.5 },
      { id: "vc-3", background: "linear-gradient(180deg, #1A1A1A, #6a6a6a)", focus: 0.7 },
      { id: "vc-4", background: "linear-gradient(180deg, #8a8a8a, #1A1A1A)", focus: 0.4 },
      { id: "vc-5", background: "linear-gradient(180deg, #4a4a4a, #2a2a2a)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Artists lose control on streaming platforms",
        body: "Streaming services commoditize music. Artists need a way to distribute directly to fans with ownership, exclusivity, and real revenue.",
      },
      {
        label: "Approach",
        heading: "Token-gated music on Hedera",
        body: "NFT-based ownership on Hedera's low-cost network. Wallet-connected player, collection management, and a merch storefront — all in one monochrome interface.",
      },
      {
        label: "Execution",
        heading: "Quiet luxury, spring-driven motion",
        body: "Geist Sans typography, pill-shaped buttons, fadeUp animations with blur. Every interaction uses spring physics — no CSS easing. The design gets out of the music's way.",
      },
      {
        label: "Result",
        heading: "Direct artist-to-fan distribution",
        body: "A platform where artists control their catalog, fans own what they buy, and the interface respects both the music and the listener.",
      },
    ],
    metrics: [
      { label: "Routes", value: "7" },
      { label: "Chain", value: "Hedera" },
      { label: "Design", value: "Monochrome" },
    ],
  },
];
