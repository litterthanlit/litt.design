import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { Footer, ThankYouOrb } from "@/components/footer";
import { IntroSection } from "@/components/intro-section";
import { ProofSection } from "@/components/proof-section";
import { ElsewhereSection } from "@/components/elsewhere-section";
import { DirectionalTransition } from "@/components/view-transitions";
import { writings } from "@/data/writing";
import { siteSettings } from "@/data/site";

export default function HomePage() {
  return (
    <DirectionalTransition>
      <main>
        <IntroSection />
        <WorkSection />
        <ProofSection />
        <Footer settings={siteSettings} />
        <ElsewhereSection />
        <WritingSection entries={writings} />
        <ThankYouOrb />
      </main>
    </DirectionalTransition>
  );
}
