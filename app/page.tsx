import { BookshelfSceneLoader } from "@/components/bookshelf-scene-loader";
import { projects } from "@/data/projects";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center">
      {/* Logo */}
      <div className="pt-10">
        <p className="font-display text-sm font-medium tracking-[-0.04em] text-ink">
          {siteSettings.brandName}
        </p>
      </div>

      {/* 3D Bookshelf — centered */}
      <div className="flex-1 w-full max-w-4xl">
        <BookshelfSceneLoader projects={projects} />
      </div>
    </main>
  );
}
