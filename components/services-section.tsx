import { Reveal } from "@/components/reveal";
import type { ApproachItem, ServiceItem } from "@/data/types";

type ServicesSectionProps = {
  services: ServiceItem[];
  approach: ApproachItem[];
};

export function ServicesSection({ services, approach }: ServicesSectionProps) {
  return (
    <section id="services" className="content-section section-shell py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
        <Reveal className="space-y-5" delay={0.05}>
          <p className="eyebrow">Services / Approach</p>
          <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.95] tracking-[-0.06em] text-ink">
            A small studio setup with end-to-end control.
          </h2>
          <p className="max-w-lg text-base leading-8 text-muted">
            The offer is intentionally narrow: define the story, shape the interface, build the thing. Enough strategy to avoid drift, enough execution to ship without handoff loss.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {services.map((service, index) => (
            <Reveal key={service.name} delay={0.1 + index * 0.06}>
              <article className="grid gap-4 rounded-[2rem] border border-line bg-white/70 p-6 md:grid-cols-[0.26fr_1fr] md:items-start md:p-7">
                <p className="eyebrow text-ink">{service.name}</p>
                <p className="max-w-2xl text-base leading-8 text-muted">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {approach.map((item, index) => (
          <Reveal key={item.title} delay={0.24 + index * 0.05}>
            <article className="rounded-[2rem] border border-line bg-panel/72 p-6">
              <p className="eyebrow mb-4 text-ink">{item.step}</p>
              <h3 className="font-display text-2xl tracking-[-0.05em] text-ink">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

