import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { ServicesPage } from "@/components/services-page";
import { DirectionalTransition } from "@/components/view-transitions";
import { POSITIONING } from "@/data/packages";
import { siteSettings } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description: POSITIONING,
  openGraph: {
    title: "Services | litt.design",
    description: POSITIONING,
    url: "https://litt.design/services",
    images: ["/og.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | litt.design",
    description: POSITIONING,
    images: ["/og.svg"],
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
