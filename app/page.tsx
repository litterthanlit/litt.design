import Link from "next/link";
import { WorkSection } from "@/components/work-section";
import { ContributionGraph } from "@/components/contribution-graph";
import { ButtonLink, ExternalIcon } from "@/components/button-link";
import { ThankYouOrb } from "@/components/footer";
import { HomeRow } from "@/components/home-row";
import { IntroSection } from "@/components/intro-section";
import { SocialLinks } from "@/components/social-links";
import { DirectionalTransition } from "@/components/view-transitions";
import { workCards } from "@/data/work";
import { BOOKING_URL, siteSettings } from "@/data/site";

export default function HomePage() {
  const { contactEmail, location, socialLinks } = siteSettings;

  return (
    <DirectionalTransition>
      <main>
        <IntroSection />

        {/* The first screen reveals in CSS, like the intro, so it paints before JS loads */}
        <HomeRow id="about" label="About" className="reveal-in [animation-delay:120ms]">
          <p className="max-w-[560px] text-body text-ink">
            Hi, I&apos;m Nick. I got into design through art and a fascination with how people interact with things - spaces, objects and screens. Studying marketing in Australia only made it worse. Now I design sites, products, and tools that are simple, usable, and feel considered.
          </p>
        </HomeRow>

        <HomeRow id="now" label="Now" className="reveal-in [animation-delay:180ms]">
          <p className="max-w-[560px] text-body text-ink">Taking on new projects.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={BOOKING_URL} variant="primary" external icon={<ExternalIcon />}>
              Book a call
            </ButtonLink>
            <ButtonLink href={`mailto:${contactEmail}`}>Email me</ButtonLink>
          </div>
          <p className="meta mt-4">
            {location} &middot;{" "}
            <Link href="/services" transitionTypes={["nav-forward"]} className="link group">
              See services
              <span
                className="ml-1 inline-block transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </p>
        </HomeRow>

        <WorkSection cards={workCards()} />
        <ContributionGraph username="litterthanlit" />

        <HomeRow id="elsewhere" label="Elsewhere">
          <SocialLinks socialLinks={socialLinks} contactEmail={contactEmail} />
        </HomeRow>

        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
