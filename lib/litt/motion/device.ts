import { createContext, createElement, useContext, useSyncExternalStore, type ReactNode } from "react";

export type Device = { compact: boolean; coarse: boolean };
export type DeviceMode = "auto" | "phone" | "desktop";

const COMPACT = "(max-width: 39.999rem)";
const COARSE = "(pointer: coarse)";

const lists = new Map<string, MediaQueryList>();
function list(query: string): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  let mql = lists.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    lists.set(query, mql);
  }
  return mql;
}

function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = list(query);
      if (!mql) return () => {};
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => list(query)?.matches ?? false,
    () => false,
  );
}

const ModeContext = createContext<DeviceMode>("auto");

/** Forces the device for everything inside it. Only the Playground uses it; "auto" follows the real screen. */
export function DeviceProvider({ mode, children }: { mode: DeviceMode; children: ReactNode }) {
  return createElement(ModeContext.Provider, { value: mode }, children);
}

/** `{ compact, coarse }` for this screen, or what the nearest DeviceProvider forces. */
export function useDevice(): Device {
  const mode = useContext(ModeContext);
  const compact = useMedia(COMPACT);
  const coarse = useMedia(COARSE);
  if (mode === "phone") return { compact: true, coarse: true };
  if (mode === "desktop") return { compact: false, coarse: false };
  return { compact, coarse };
}

/**
 * The dismissal thresholds from tokens.css: a released drag leaves when it has travelled `distance` of the
 * surface's size, or moves faster than `velocity` px per ms. Read at gesture time, in the browser.
 */
export function readDismiss(): { distance: number; velocity: number } {
  const style = getComputedStyle(document.documentElement);
  const num = (name: string) => {
    const raw = style.getPropertyValue(name).trim();
    const v = Number(raw);
    if (!raw || !Number.isFinite(v) || v <= 0) throw new Error(`tokens.css: ${name} should be a positive number, found "${raw}"`);
    return v;
  };
  return { distance: num("--litt-dismiss-distance"), velocity: num("--litt-dismiss-velocity") };
}
