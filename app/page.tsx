import Link from "next/link";
import { WorkSection } from "@/components/work-section";
import { ContributionGraph } from "@/components/contribution-graph";
import { ThankYouOrb } from "@/components/footer";
import { HomeRow } from "@/components/home-row";
import { IntroSection } from "@/components/intro-section";
import { DirectionalTransition } from "@/components/view-transitions";
import { workCards } from "@/data/work";
import { BOOKING_URL, siteSettings } from "@/data/site";

// The call to action: ink chips that light up in the accent. Clone keeps the
// chip whole on both lines when a phone wraps it.
const CTA =
  "rounded-[3px] bg-ink px-1 py-0.5 text-canvas box-decoration-clone transition-colors duration-150 ease-out hover:bg-accent hover:text-ink";

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
          <p className="max-w-[560px] text-body text-ink">
            Taking on new projects.{" "}
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={CTA}>
              Book a call<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            or{" "}
            <a href={`mailto:${contactEmail}`} className={CTA}>
              email me
            </a>
            .
          </p>
          <p className="meta mt-2">
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
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="link text-body">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contactEmail}`} className="link text-body">
                {contactEmail}
              </a>
            </li>
          </ul>
        </HomeRow>

        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
