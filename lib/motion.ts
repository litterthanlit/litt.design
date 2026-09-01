export function quietFade(reduceMotion: boolean | null, delay = 0) {
  if (reduceMotion) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" as const },
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1] as const,
      delay,
    },
  };
}
