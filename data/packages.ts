export type ServicePackage = {
  name: string;
  price: string;
  duration: string;
  description: string;
  notIncluded?: string;
  note?: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const POSITIONING =
  "I build launch sites for AI and dev-tool startups, with shader-grade motion, written in Next.js your team can keep shipping.";

export const servicePackages: ServicePackage[] = [
  {
    name: "Launch Site",
    price: "from €6,500",
    duration: "3 weeks",
    description:
      "Landing page up to 5 sections, plus 2 inner pages (pricing, about, or changelog). Custom motion, CMS or MDX, Lighthouse 90+ on mobile, Vercel deploy, handover video.",
    notIncluded: "brand identity, ongoing content",
  },
  {
    name: "Launch Hero",
    price: "from €1,800",
    duration: "5 working days",
    description:
      "One WebGL/shader hero, a matching OG image, and a 15-second Remotion social video. Delivered as a Next.js component. Two revision rounds.",
    notIncluded: "copywriting, full-site build",
  },
  {
    name: "Launch Video Kit",
    price: "from €2,500",
    duration: "1 week",
    description:
      "A re-renderable Remotion template: 30–60s launch film, 3 feature clips, changelog videos.",
    note: "Also sold as an add-on to Launch Site.",
  },
  {
    name: "Design Engineer Retainer",
    price: "from €3,800/month",
    duration: "~10 days/month · 2-month minimum",
    description:
      "Landing-page experiments, feature pages, motion and design-system work. Prioritised queue. 48h turnaround on small items.",
  },
  {
    name: "Taste Audit",
    price: "€450",
    duration: "48 hours",
    description:
      "A recorded 20-minute teardown of your site, a prioritised fix list, and one redesigned section as Figma or code.",
    note: "Fee credited if you upgrade to another package within 30 days.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Concept first",
    description:
      "Lock the offer, the hero, and what ships. No pixels until that's true.",
  },
  {
    step: "02",
    title: "Build",
    description: "Next.js, shaders, motion. The site your team can keep.",
  },
  {
    step: "03",
    title: "Handover",
    description: "Repo, a walkthrough video, and the files that matter.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "A short window after launch for the small things that always show up.",
  },
];
