import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { Footer, ThankYouOrb } from "@/components/footer";
import { projects } from "@/data/projects";
import { writings } from "@/data/writing";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <main>
      <WorkSection projects={projects} />
      <WritingSection entries={writings} />
      <Footer settings={siteSettings} />
      <ThankYouOrb />
    </main>
  );
}
