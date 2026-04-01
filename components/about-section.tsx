import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/data/types";

type AboutSectionProps = {
  settings: SiteSettings;
};

export function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="about" className="content-section section-shell py-14 md:py-20">
      <div className="grid gap-6 rounded-[2.4rem] border border-line bg-white/78 p-7 md:p-10 lg:grid-cols-[0.55fr_0.45fr] lg:gap-10">
        <Reveal delay={0.05}>
          <p className="eyebrow">About / Studio</p>
          <h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.95] tracking-[-0.06em] text-ink">
            One decision-maker. One point of view. A tighter path from brief to launch.
          </h2>
        </Reveal>
        <Reveal className="space-y-6" delay={0.12}>
          {settings.about.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-muted">
              {paragraph}
            </p>
          ))}
          <div className="grid gap-4 border-t border-line pt-6 text-sm text-muted sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-3 text-ink">Location</p>
              <p>{settings.location}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 text-ink">Typical engagement</p>
              <p>{settings.engagement}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

