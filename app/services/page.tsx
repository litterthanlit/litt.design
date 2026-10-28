import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { ServicesPage } from "@/components/services-page";
import { DirectionalTransition } from "@/components/view-transitions";
import { POSITIONING } from "@/data/packages";
import { siteSettings } from "@/data/site";

export const metadata: Metadata = {
  title: "Launch sites for AI & dev-tool startups",
  description: POSITIONING,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | litt.design",
    description: POSITIONING,
    type: "website",
    url: "https://litt.design/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | litt.design",
    description: POSITIONING,
  },
};

export default function ServicesRoute() {
  return (
    <DirectionalTransition>
      <ServicesPage />
      <Footer settings={siteSettings} />
    </DirectionalTransition>
  );
}
