import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { Footer, ThankYouOrb } from "@/components/footer";
import { DirectionalTransition } from "@/components/view-transitions";
import { projects } from "@/data/projects";
import { writings } from "@/data/writing";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <DirectionalTransition>
      <main>
        <WorkSection projects={projects} />
        <Footer settings={siteSettings} />
        <WritingSection entries={writings} />
        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
