import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/data/types";

type ContactSectionProps = {
  settings: SiteSettings;
};

export function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="contact" className="content-section section-shell py-14 md:py-20">
      <div className="relative overflow-hidden rounded-[2.8rem] bg-ink px-7 py-10 text-canvas md:px-10 md:py-14">
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-display text-[clamp(7rem,22vw,20rem)] tracking-[-0.12em] text-white/5">
          litt
        </div>
        <Reveal className="relative z-10 space-y-8" delay={0.05}>
          <div className="space-y-4">
            <p className="eyebrow text-canvas/60">Contact</p>
            <h2 className="balance max-w-4xl font-display text-[clamp(3rem,7vw,6.8rem)] leading-[0.92] tracking-[-0.07em]">
              Let&apos;s make a site that feels inevitable the moment it loads.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-3">
              <Link href={`mailto:${settings.contactEmail}`} className="inline-flex items-center gap-3 text-xl leading-none md:text-2xl">
                {settings.contactEmail}
                <span aria-hidden="true">↗</span>
              </Link>
              <p className="text-sm uppercase tracking-[0.22em] text-canvas/68">
                {settings.availability.label} · {settings.availability.note}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.22em] text-canvas/78">
              {settings.socialLinks.map((link) => (
                <Link key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

