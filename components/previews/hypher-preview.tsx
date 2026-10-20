// Hover motion for the Hypher work card: the product's loop in six seconds.
// Someone dumps a messy thought → it lands in the project note → the note
// updates. Purely decorative (aria-hidden); timing lives in globals.css so the
// card stays a server-rendered, zero-JS layer.
//
// Everything is positioned in the screenshot's own coordinate space (the
// `.hyp-stage`), so the ring lands on the real "hypher beta launch" card in
// the image at any card width.

const DUMP = "no auth changes. ship friday";

export function HypherPreview() {
  return (
    <div className="hyp-fx" aria-hidden="true">
      <div className="hyp-scrim" />
      <div className="hyp-stage">
        {/* The project card in the screenshot, lit up when the note updates */}
        <span className="hyp-ring" />

        {/* Composer: types the dump, then confirms the write-back */}
        <div className="hyp-pos">
          <div className="hyp-pill">
            <div className="hyp-a">
              <span className="hyp-type">{DUMP}</span>
              <span className="hyp-caret" />
            </div>
            <div className="hyp-b">
              <svg viewBox="0 0 16 16" className="hyp-check" fill="none">
                <path
                  d="M4 8.5 7 11.5 12 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hyp-b-title">Note updated</span>
              <span className="hyp-b-meta">+1 decision</span>
            </div>
          </div>
        </div>

        {/* The dump, travelling from the composer into the project */}
        <span className="hyp-chip" />
      </div>
    </div>
  );
}
