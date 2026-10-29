import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  // Primary is the one ink fill in a view; secondary is the raised white block
  variant?: "primary" | "secondary";
  // Opens in a new tab, and says so to a screen reader
  external?: boolean;
  // A 16px icon after the label
  icon?: ReactNode;
  children: ReactNode;
};

// litt.md's Button as a link, in its monochrome accent: 44px tall, 4px corners,
// the label at the title weight and trimmed to its cap height, so the side
// padding equals the air above and below it. Hover changes the fill only; a
// press sinks the block half a pixel and tightens its cast at once. A finger's
// press takes the hover fill, since a touch has no hover.
const base =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] px-4 text-body font-medium select-none [-webkit-tap-highlight-color:transparent] transition-[background-color,color,translate] duration-100 ease-out active:translate-y-[0.5px] motion-reduce:transition-none motion-reduce:active:translate-y-0";

const variants = {
  primary:
    "bg-ink text-canvas shadow-block-lift inset-shadow-[0_1px_0_color-mix(in_oklab,white_22%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-ink),var(--color-canvas)_18%)] pointer-coarse:active:bg-[color-mix(in_oklab,var(--color-ink),var(--color-canvas)_18%)]",
  secondary:
    "bg-block text-ink shadow-block-lift active:shadow-block-press hover:bg-[color-mix(in_oklab,var(--color-block),var(--color-ink)_4%)] pointer-coarse:active:bg-[color-mix(in_oklab,var(--color-block),var(--color-ink)_4%)]",
};

export function ButtonLink({ href, variant = "secondary", external = false, icon, children }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]}`}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <span className="leading-none [text-box:trim-both_cap_alphabetic]">{children}</span>
      {icon}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

// The 16px arrow for a link that leaves the site
export function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 10.5 10.5 5.5M6.5 5.5h4v4" />
    </svg>
  );
}
