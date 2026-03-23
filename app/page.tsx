import { HeroText } from "@/components/hero-text";
import { BookshelfSceneLoader } from "@/components/bookshelf-scene-loader";
import { projects } from "@/data/projects";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <main className="min-h-screen md:h-screen">
      <section className="grid h-full grid-cols-1 md:grid-cols-[0.42fr_0.58fr]">
        <HeroText settings={siteSettings} />
        <div className="hidden md:block">
          <BookshelfSceneLoader projects={projects} />
        </div>
      </section>
    </main>
  );
}
