export type NowEntry = {
  title: string;
  kind: string;
  note: string;
};

// Work in progress. Shown on the homepage so the site reflects what's
// on the desk right now, not just what's shipped.
export const nowEntries: NowEntry[] = [
  {
    title: "Carson",
    kind: "Tribute",
    note: "A study of how David Carson moved type — rebuilt from physical copies, scans, and a lot of tinkering. Landing page and everything.",
  },
  {
    title: "Brand",
    kind: "Tool study",
    note: "Taking apart the tools Basement Studio builds for their brand work, to understand how they make identity systems feel alive.",
  },
  {
    title: "Hyphr",
    kind: "Product",
    note: "In progress. More soon.",
  },
];
