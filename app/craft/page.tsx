import { CraftGallery } from "@/components/craft-gallery";
import { DirectionalTransition } from "@/components/view-transitions";

export const metadata = {
  title: "Craft",
  description:
    "Interaction studies: buttons, cards, toggles, drag and flip. Small things to press and move.",
};

export default function CraftPage() {
  return (
    <DirectionalTransition>
      <CraftGallery />
    </DirectionalTransition>
  );
}
