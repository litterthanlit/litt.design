import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { Footer, ThankYouOrb } from "@/components/footer";
import { IntroSection } from "@/components/intro-section";
import { NowSection } from "@/components/now-section";
import { DirectionalTransition } from "@/components/view-transitions";
import { projects } from "@/data/projects";
import { writings } from "@/data/writing";
import { nowEntries } from "@/data/now";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <DirectionalTransition>
      <main>
        <IntroSection />
        <WorkSection projects={projects} />
        <NowSection entries={nowEntries} />
        <WritingSection entries={writings} />
        <Footer settings={siteSettings} />
        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
