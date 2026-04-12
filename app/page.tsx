import Image from "next/image";
import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { Footer, ThankYouOrb } from "@/components/footer";
import { IntroSection } from "@/components/intro-section";
import { DirectionalTransition } from "@/components/view-transitions";
import { projects } from "@/data/projects";
import { writings } from "@/data/writing";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <DirectionalTransition>
      <main>
        <IntroSection />
        <WorkSection projects={projects} />
        <Footer settings={siteSettings} />
        <WritingSection entries={writings} />
        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
