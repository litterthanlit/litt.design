"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header, type HeaderLink } from "@/components/litt/header";

// The sticky glass header (P3: it floats, so it earns glass). A text wordmark
// at 400 (P9) replaces the looping logo GIF: litt has no autoplay loops.
// /art and /studies are separate apps on this domain, so they stay plain <a>.

const EXTERNAL = new Set(["/art", "/studies"]);

export function SiteHeader() {
  const pathname = usePathname();

  const links: HeaderLink[] = [
    { label: "Work", href: "/#work", current: pathname.startsWith("/work") },
    { label: "Art", href: "/art" },
    { label: "Studies", href: "/studies" },
    { label: "Writing", href: "/#writing", current: pathname.startsWith("/writing") },
  ];

  return (
    <Header
      navFrom="sm"
      wordmark={
        <Link
          href="/"
          {...({ transitionTypes: ["nav-back"] } as object)}
          className="litt-trim text-litt-body text-litt-fg"
        >
          litt.design
        </Link>
      }
      links={links}
      renderLink={(link, props) =>
        EXTERNAL.has(link.href) ? (
          <a href={link.href} {...props} />
        ) : (
          <Link href={link.href} {...props} />
        )
      }
    />
  );
}
