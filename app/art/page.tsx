import { ArtPage } from "@/components/art-page";
import { DirectionalTransition } from "@/components/view-transitions";

export const metadata = {
  title: "Art",
  description: "Digital abstract art — prints, visual experiments, and long-form pieces.",
};

export default function Art() {
  return (
    <DirectionalTransition>
      <ArtPage />
    </DirectionalTransition>
  );
}
