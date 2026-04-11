import { CraftGallery } from "@/components/craft-gallery";
import { DirectionalTransition } from "@/components/view-transitions";

export const metadata = {
  title: "Craft",
  description:
    "Interaction gallery — buttons, cards, physics, and liquid experiments.",
};

export default function CraftPage() {
  return (
    <DirectionalTransition>
      <CraftGallery />
    </DirectionalTransition>
  );
}
