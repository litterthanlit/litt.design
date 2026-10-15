"use client";

import { useSyncExternalStore } from "react";
import { Segmented } from "@/components/litt/segmented";

// Light and dark are both first-class (P8). "System" leaves data-theme off the
// <html> element so the litt tokens follow prefers-color-scheme on their own;
// Light and Dark pin it. The choice is a per-viewer convenience, kept in
// localStorage, and the inline script in the layout applies it before paint.

export type ThemeChoice = "system" | "light" | "dark";

export const THEME_KEY = "litt-theme";

// Runs in <head> before the body paints, so a pinned theme never flashes.
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const listeners = new Set<() => void>();

function read(): ThemeChoice {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" || t === "dark" ? t : "system";
}

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
  try {
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Private mode or blocked storage: the choice still applies to this page.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function ThemeSwitch({ className = "" }: { className?: string }) {
  const value = useSyncExternalStore(subscribe, read, () => "system" as ThemeChoice);
  return (
    <Segmented<ThemeChoice>
      legend="Theme"
      size="sm"
      value={value}
      onValueChange={apply}
      options={[
        { value: "system", label: "System" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ]}
      className={className}
    />
  );
}
