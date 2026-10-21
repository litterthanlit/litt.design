"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

type CoverVideoProps = {
  video: { mp4: string; webm?: string };
  poster?: string;
  // Whether the visitor wants it playing (reduced motion / pause button)
  playing: boolean;
  className?: string;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// The server can't know, so it renders `false` and the browser corrects it
// right after hydration without a mismatch.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

// A looping screen recording that only spends bandwidth and CPU while it can
// be seen: nothing loads until the card is on screen, and it pauses the moment
// it scrolls away. Decorative: the card's title and caption name it.
export function CoverVideo({ video, poster, playing, className }: CoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!playing) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // A rejected play() (autoplay policy, interrupted load) is harmless
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [playing]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
