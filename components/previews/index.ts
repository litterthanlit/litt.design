import type { ComponentType } from "react";
import { HypherPreview } from "@/components/previews/hypher-preview";

// Per-project hover motion for the work grid, keyed by project slug. A card
// with no entry just shows its screenshot.
export const previewMotion: Partial<Record<string, ComponentType>> = {
  hypher: HypherPreview,
};
