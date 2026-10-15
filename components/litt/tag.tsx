"use client";

/**
 * Tag: a small pill that labels something (Framer, Site) or reports its status (Live, Review).
 *
 * - The look is components.md and the specimen: 24px tall, a pill, a surface-2 fill, an
 *   inset line hairline, and the caption size in fg-subtle.
 * - A status tag colors the text and a 6px dot with the status color, never the fill.
 *   The dot is decoration. The label always says the status in words, so color never
 *   carries it alone.
 * - The status set is the tokens' own: success, warning and danger, plus neutral (fg-subtle).
 *   There is no accent status: the accent is chosen per project, and on surface-2 it does not
 *   promise 4.5:1 for caption text.
 * - `hollow` draws the dot as a ring, so two neutral tags (Draft and Idea) differ without color.
 * - Static: no motion and no states. A tag is a label, not a control, so it never takes
 *   focus. If you need something to press, use Button or a chip.
 */
import type { HTMLAttributes, ReactNode } from "react";

export type TagStatus = "success" | "warning" | "danger" | "neutral";

const STATUS: Record<TagStatus, string> = {
  success: "text-litt-success",
  warning: "text-litt-warning",
  danger: "text-litt-danger",
  neutral: "text-litt-fg-subtle",
};

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  /** Leave it out for a plain label. Set it for a status: the text and a 6px dot take that color, and the fill never does. */
  status?: TagStatus;
  /** Draws the status dot as a ring. Use it so two neutral statuses, such as Draft and Idea, differ without color. */
  hollow?: boolean;
  /** The label. Keep it to a word or two, because a tag never wraps. */
  children: ReactNode;
  /** Extra classes for the tag. */
  className?: string;
};

/** A 24px pill label. Add `status` to color its text and dot. */
export function Tag({ status, hollow = false, children, className = "", ...rest }: TagProps) {
  return (
    <span
      className={
        "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-litt-pill bg-litt-surface-2 px-2 text-litt-caption " +
        "shadow-[inset_0_0_0_1px_var(--litt-line)] " +
        (status ? `gap-1.5 ${STATUS[status]} ` : "text-litt-fg-subtle ") +
        className
      }
      {...rest}
    >
      {status && (
        <span
          aria-hidden="true"
          className={"size-1.5 shrink-0 rounded-litt-pill " + (hollow ? "border border-current" : "bg-current")}
        />
      )}
      {children}
    </span>
  );
}
