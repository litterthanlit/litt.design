import { BookshelfSceneLoader } from "@/components/bookshelf-scene-loader";
import { WorkSection } from "@/components/work-section";
import { projects } from "@/data/projects";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <main>
      {/* Hero — 3D Bookshelf */}
      <div className="flex h-screen flex-col items-center">
        <div className="pt-10">
          <p className="font-display text-sm font-medium tracking-[-0.04em] text-ink">
            {siteSettings.brandName}
          </p>
        </div>
        <div className="flex-1 w-full max-w-4xl">
          <BookshelfSceneLoader projects={projects} />
        </div>
      </div>

      {/* Work — Project grid */}
      <WorkSection projects={projects} />
    </main>
  );
}
