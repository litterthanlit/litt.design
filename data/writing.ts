export type WritingEntry = {
  slug: string;
  title: string;
  date: string;
  external?: string;
  body?: string[];
};

export const writings: WritingEntry[] = [
  {
    slug: "why-i-build-tools",
    title: "Why I build tools instead of apps",
    date: "2026-03",
    body: [
      "Apps solve problems for users. Tools solve problems for makers.",
      "The difference matters. An app decides what you need. A tool trusts you to figure that out yourself. One closes doors to keep things simple. The other opens them and gets out of the way.",
      "Every project I build — Ergon, Wavr, Houston — is a tool. A creative coding studio. A shader editor. A Markdown reader. None of them have onboarding flows, notification systems, or engagement metrics. None of them need to.",
      "A tool earns its place by doing one thing and doing it immediately. You open Ergon, you write code, you see output. You open Wavr, you drag a slider, a gradient moves. There is no tutorial because there is nothing to learn. The interface is the instruction.",
      "This is where restraint becomes the whole design.",
      "Most software adds features to justify its existence. Tools remove them. Every button I don't add is a decision I don't force on the person using it. Every screen I cut is a second they keep. The craft is not in what I build. It's in what I leave out.",
      "Building for makers is different because makers don't want to be guided. They want to be unblocked. A designer opening a gradient editor doesn't need a walkthrough. They need the parameters exposed and the render loop fast. A developer opening a Markdown reader doesn't need themes and plugins. They need the file open and the type clean.",
      "The audience is small and that's the point. I'm not building for millions of casual users who need hand-holding. I'm building for thousands of people who already know what they want to make and need a sharper instrument to make it with.",
      "Tools also age differently. Apps chase trends — dark mode, AI features, social integrations. Tools stay useful as long as the problem exists. A text editor from 1991 still works. A social app from 2015 is gone.",
      "I build tools because that's the software I want to exist. Small, fast, opinionated, quiet. Software that respects the person on the other side of the screen enough to assume they don't need help.",
      "The best tool is the one you forget you're using.",
    ],
  },
  {
    slug: "good-md",
    title: "Houston",
    date: "2026-03",
    body: [
      "I built a Markdown reader because every Markdown app tries to be an editor first.",
      "I don't need another editor. I have six. What I need is something that opens a file and renders it well. Fast, clean, no sidebar of plugins I'll never use.",
      "Houston does that. Drag a file in. Read it. Close it.",
      "It runs on Tauri, which means it's a native app that starts in under 200ms and weighs about 4MB. Not an Electron wrapper pretending to be native. Not a web app in a frame. Actual native performance with actual native memory usage.",
      "The reading experience is the product. GitHub-flavored Markdown, syntax highlighting, auto-linked headings, and typography tuned for comfortable line lengths. No themes to configure. No appearance settings. One look, done right.",
      "Tabs let you keep multiple files open. Keyboard shortcuts handle navigation. You can drag and drop from Finder. That's the feature set.",
      "People ask why there's no editing. Because editing is a different problem, and the tools that solve it already exist. VS Code is a better editor than anything I'd build. Houston is a better reader than anything VS Code renders.",
      "The hardest part wasn't building it. It was not building more of it. Every week I'd think of something to add — a file tree, a search panel, export to PDF. Every week I'd ask whether it made the reading better. The answer was always no.",
      "A 4MB app that opens instantly and does one thing. That's the whole pitch.",
      "Software doesn't have to be ambitious to be good. Sometimes the best thing you can ship is the smallest thing that works.",
    ],
  },
  {
    slug: "raw-webgl-no-abstraction",
    title: "Raw WebGL, no abstraction layer",
    date: "2026-02",
  },
  {
    slug: "designing-with-restraint",
    title: "Designing with restraint",
    date: "2026-01",
  },
  {
    slug: "spring-physics-not-easing",
    title: "Spring physics, not easing curves",
    date: "2025-12",
  },
];
