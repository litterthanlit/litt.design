// Cover for the Hypher work card: the product's own mark as the handoff.
// Claude Code (left block) saves, particles cross the bridge, Codex CLI (right
// block) resumes. At rest it is a still of the mark; on hover the sequence
// plays (timing in globals.css, "Hypher work card"). Decorative, so
// aria-hidden; the card's title and caption carry the meaning.

// Outline of the mark in a 446×94 box: two blocks joined by a bridge. The
// bridge is masked out of the visible body and used as the particle channel.
const OUTLINE =
  "M0 8.0598C0 5.8507 1.79086 4.0598 4 4.0598H133.02C135.229 4.0598 137.02 5.8507 137.02 8.0598V21.608C137.02 23.8171 138.811 25.608 141.02 25.608H274.158C276.367 25.608 278.158 23.8171 278.158 21.608V4C278.158 1.7909 279.949 0 282.158 0H409.158C412.543 0 415.561 2.1307 416.695 5.3203L445.102 85.2249C446.027 87.8289 444.096 90.565 441.333 90.565H312.483C309.857 90.565 307.27 89.918 304.952 88.6815L279.817 75.2719C277.499 74.0355 274.912 73.3887 272.285 73.3887H141.02C138.811 73.3887 137.02 75.1796 137.02 77.3887V90C137.02 92.209 135.229 94 133.02 94H2C0.895431 94 0 93.105 0 92V8.0598Z";

// Deterministic spread (no Math.random: server and client must match)
const STREAKS = Array.from({ length: 40 }, (_, i) => ({
  y: 4 + ((i * 29) % 92),
  w: 5 + ((i * 5) % 11),
  delay: -((i * 0.097) % 1.15),
  dur: 0.75 + ((i * 7) % 5) * 0.1,
  alpha: 0.45 + ((i * 3) % 6) * 0.1,
}));

function Glow({ side }: { side: "l" | "r" }) {
  const clip = side === "l" ? "hyp-clip-l" : "hyp-clip-r";
  return (
    <>
      {(["bloom", "halo"] as const).map((kind) => (
        <svg
          key={kind}
          viewBox="0 0 446 94"
          className={`hyp-glow hyp-glow-${side} hyp-glow-${kind}`}
          focusable="false"
        >
          <g filter={`url(#hyp-blur-${kind})`}>
            <use href="#hyp-outline" clipPath={`url(#${clip})`} />
          </g>
        </svg>
      ))}
    </>
  );
}

export function HypherPreview() {
  return (
    <div className="hyp-scene" aria-hidden="true">
      <p className="hyp-meta">Handoff · token-gate</p>

      <div className="hyp-mark">
        <Glow side="l" />
        <Glow side="r" />

        <svg viewBox="0 0 446 94" className="hyp-body" focusable="false">
          <defs>
            <path id="hyp-outline" d={OUTLINE} />
            <mask id="hyp-cut" maskUnits="userSpaceOnUse" x="-1" y="-1" width="448" height="96">
              <rect x="-1" y="-1" width="448" height="96" fill="#fff" />
              <rect x="137.02" y="21.608" width="141.138" height="55.78" fill="#000" />
            </mask>
            <clipPath id="hyp-clip-l">
              <rect x="-1" y="-1" width="138.02" height="96" />
            </clipPath>
            <clipPath id="hyp-clip-r">
              <rect x="278.158" y="-1" width="168.842" height="96" />
            </clipPath>
            <filter
              id="hyp-blur-halo"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
              x="-19"
              y="-19"
              width="484"
              height="132"
            >
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter
              id="hyp-blur-bloom"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
              x="-49"
              y="-49"
              width="544"
              height="192"
            >
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>
          <use href="#hyp-outline" mask="url(#hyp-cut)" fill="currentColor" />
        </svg>

        <div className="hyp-bridge">
          {STREAKS.map((s, i) => (
            <span
              key={i}
              className="hyp-streak"
              style={
                {
                  top: `${s.y}%`,
                  "--w": `${s.w}px`,
                  "--delay": `${s.delay}s`,
                  "--dur": `${s.dur}s`,
                  "--alpha": s.alpha,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="hyp-label hyp-label-from">
          <span className="hyp-name">Claude Code</span>
          <span className="hyp-cmd hyp-cmd-save">/hypher-save</span>
        </div>
        <div className="hyp-label hyp-label-to">
          <span className="hyp-name">Codex CLI</span>
          <span className="hyp-cmd hyp-cmd-resume">$hypher-resume</span>
        </div>
      </div>
    </div>
  );
}
