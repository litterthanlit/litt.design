export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  accent: string;
  coverMedia: {
    background: string;
  };
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
