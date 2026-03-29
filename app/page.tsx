import { WorkSection } from "@/components/work-section";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <main className="pt-24 md:pt-32">
      <WorkSection projects={projects} />
    </main>
  );
}
