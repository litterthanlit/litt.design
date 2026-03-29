export type HeroFrame = {
  id: string;
  background: string;
  texture?: string;
  focus: number;
};

export type StoryBlock = {
  label: string;
  heading: string;
  body: string;
};

export type Metric = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  oneLineOutcome: string;
  client: string;
  year: string;
  services: string[];
  stack: string[];
  accent: string;
  coverMedia: {
    background: string;
  };
  heroFrames: HeroFrame[];
  storyBlocks: StoryBlock[];
  metrics?: Metric[];
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  heroIntro: string;
  contactEmail: string;
  location: string;
  engagement: string;
  availability: {
    label: string;
    note: string;
    color: string;
  };
  about: string[];
  services: {
    name: string;
    description: string;
  }[];
  approach: {
    step: string;
    title: string;
    description: string;
  }[];
  socialLinks: {
    label: string;
    href: string;
  }[];
};
