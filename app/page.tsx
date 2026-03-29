import { WorkSection } from "@/components/work-section";
import { Footer } from "@/components/footer";
import { projects } from "@/data/projects";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <main className="pt-24 md:pt-32">
      <WorkSection projects={projects} />
      <Footer settings={siteSettings} />
    </main>
  );
}
