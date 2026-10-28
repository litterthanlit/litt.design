"use client";

import { Reveal } from "@/components/reveal";
import {
  POSITIONING,
  processSteps,
  servicePackages,
} from "@/data/packages";
import { BOOKING_URL } from "@/data/site";

function BookCallLink() {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-2 text-body font-medium text-ink transition-[background-color,border-color,scale] duration-150 ease-out hover:border-[rgba(0,0,0,0.24)] hover:bg-[rgba(0,0,0,0.03)] active:scale-[0.97] motion-reduce:active:scale-100"
    >
      Book a 15-min call
      <span
        className="text-body text-muted transition-[translate,color] duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink"
        aria-hidden="true"
      >
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function ServicesPage() {
  return (
    <main className="section-shell flex min-h-screen flex-col gap-16 pb-8 pt-36 md:gap-20 md:pb-12 md:pt-44">
      <section className="max-w-2xl">
        <Reveal>
          <h1 className="text-body font-medium text-ink">Services</h1>
          <p className="mt-3 text-intro text-ink">{POSITIONING}</p>
          <p className="mt-3 text-body text-muted">
            Prices in EUR, excl. VAT. From prices unless noted.
          </p>
          <div className="mt-6">
            <BookCallLink />
          </div>
        </Reveal>
      </section>

      <section className="max-w-2xl" aria-labelledby="packages-heading">
        <Reveal>
          <h2 id="packages-heading" className="eyebrow mb-2">
            Packages
          </h2>
        </Reveal>
        <div>
          {servicePackages.map((offer, index) => (
            <Reveal key={offer.name} delay={0.04 + index * 0.04}>
              <article className="border-t border-[rgba(0,0,0,0.06)] py-6">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-body font-medium text-ink">{offer.name}</h3>
                  <p className="meta shrink-0">{offer.price}</p>
                </div>
                <p className="meta mt-1">{offer.duration}</p>
                <p className="mt-2 text-body text-muted">{offer.description}</p>
                {offer.notIncluded && (
                  <p className="mt-1 text-body text-muted">
                    Not included: {offer.notIncluded}.
                  </p>
                )}
                {offer.note && (
                  <p className="mt-1 text-body text-muted">{offer.note}</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-2xl" aria-labelledby="process-heading">
        <Reveal>
          <h2 id="process-heading" className="eyebrow mb-6">
            Process
          </h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
          {processSteps.map((item, index) => (
            <Reveal key={item.title} delay={0.04 + index * 0.04}>
              <p className="meta">{item.step}</p>
              <h3 className="mt-1 text-body font-medium text-ink">{item.title}</h3>
              <p className="mt-0.5 text-body text-muted">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-2xl">
        <Reveal>
          <p className="text-body text-ink">
            Projects take a 50% deposit up front.
          </p>
          <div className="mt-6">
            <BookCallLink />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
