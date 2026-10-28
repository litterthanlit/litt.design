import { WorkSection } from "@/components/work-section";
import { ContributionGraph } from "@/components/contribution-graph";
import { WritingSection } from "@/components/writing-section";
import { Footer, ThankYouOrb } from "@/components/footer";
import { IntroSection } from "@/components/intro-section";
import { DirectionalTransition } from "@/components/view-transitions";
import { writings } from "@/data/writing";
import { workCards } from "@/data/work";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <DirectionalTransition>
      <main>
        <IntroSection />
        <WorkSection cards={workCards()} />
        <ContributionGraph username="litterthanlit" />
        <WritingSection entries={writings} />
        <Footer settings={siteSettings} />
        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
