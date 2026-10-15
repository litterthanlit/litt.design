"use client";

/**
 * Button: the reference component. Read this before writing another one.
 *
 * - Slightly rounded, three sizes on the shared control scale (P10). Labels sit in
 *   .litt-trim, so side padding equals the visible air.
 * - Weight 400 always (P9). State changes color and fill only; the box never
 *   moves or resizes (loading keeps the label mounted at opacity 0).
 * - Motion: the instant tier. Hover and press are CSS transitions on
 *   --litt-dur-instant, which tokens.css owns. Press is scale(--litt-press-scale). Tailwind's
 *   active:scale-* sets the CSS `scale` property, not `transform`, so the transition
 *   names `scale`; naming `transform` instead would let the press snap.
 * - Touch: the button keeps the press scale as its feedback, and the OS tap flash is
 *   turned off so the two do not double. Rows and segments fill instead (see Tabs, List).
 * - Corners: rounded-litt-control (4px in litt.md v0.5). Icon-only buttons are
 *   round (pill) and need an aria-label.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Primary is the one accent fill in a view. Secondary is the default. Ghost is for quiet actions like Cancel. */
  variant?: ButtonVariant;
  /** Height on the shared control scale: sm is 32, md is 44, lg is 56. Use lg for hero actions and a form's submit. */
  size?: ButtonSize;
  /** Swaps the label for a spinner, keeps the width, sets aria-busy and disables the button. */
  loading?: boolean;
  /** 16px icon before the label. */
  icon?: ReactNode;
  /** 16px icon after the label. */
  iconRight?: ReactNode;
  /** Round icon-only button. Requires aria-label. */
  iconOnly?: boolean;
  /** Fills the width of its container. */
  block?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

const base =
  "relative inline-flex shrink-0 items-center justify-center gap-litt-control whitespace-nowrap select-none font-normal " +
  "cursor-pointer transition-[background-color,color,scale] duration-(--litt-dur-instant) ease-litt " +
  "[-webkit-tap-highlight-color:transparent] " +
  "active:scale-(--litt-press-scale) disabled:cursor-not-allowed disabled:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-litt-focus";

const sizes: Record<ButtonSize, string> = {
  sm: "h-litt-control-sm px-litt-control-pad-sm text-litt-small",
  md: "h-litt-control-md px-litt-control-pad-md text-litt-body",
  lg: "h-litt-control-lg px-litt-control-pad-lg text-(length:--litt-control-text-lg)",
};
const iconSizes: Record<ButtonSize, string> = { sm: "w-litt-control-sm", md: "w-litt-control-md", lg: "w-litt-control-lg" };

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-litt-accent text-litt-accent-fg hover:bg-litt-accent-hover shadow-litt-glow " +
    "inset-shadow-[0_1px_0_color-mix(in_oklab,white_22%,transparent)]",
  secondary:
    "bg-litt-surface-1 text-litt-fg hover:bg-litt-surface-2 shadow-[inset_0_0_0_1px_var(--litt-line-strong),var(--litt-highlight)]",
  ghost: "bg-transparent text-litt-fg-muted hover:text-litt-fg hover:bg-[color-mix(in_oklab,var(--litt-fg)_6%,transparent)]",
};
const disabledLook =
  "disabled:bg-litt-surface-2 disabled:text-litt-fg-disabled disabled:shadow-none disabled:inset-shadow-none";

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  iconOnly = false,
  block = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const shape = iconOnly ? `${iconSizes[size]} px-0 rounded-litt-pill` : "rounded-litt-control";
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[base, sizes[size], variants[variant], disabledLook, shape, block ? "w-full" : "", className].join(" ")}
      {...rest}
    >
      <span
        className={
          "inline-flex items-center gap-litt-control transition-opacity duration-(--litt-dur-instant) ease-litt " +
          (loading ? "opacity-0" : "opacity-100")
        }
      >
        {icon}
        {!iconOnly && children != null && <span className="litt-trim">{children}</span>}
        {iconOnly && children}
        {iconRight}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <Spinner />
        </span>
      )}
    </button>
  );
}

/** 16px spinner, 1.5px stroke, currentColor. The rotation is a loading signal, not decoration. */
export function Spinner({
  size = 16,
}: {
  /** Width and height in px. */
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="animate-spin" /* litt-allow: spinner */>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.5" />
      <path d="M14.25 8A6.25 6.25 0 0 0 8 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
