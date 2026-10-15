"use client";

import { Button } from "@/components/litt/button";
import { Tag } from "@/components/litt/tag";
import { toast } from "@/components/litt/toast";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteSettings } from "@/data/site";
import type { SiteSettings } from "@/data/types";

// The footer is quiet on purpose: a hairline, Nick's three lines, where and
// whether, the links, and the theme. Nothing here moves, glows or reveals on
// scroll. It brings its own air above (a section's --section-y), so it works
// in either order with the closing statement below.

type FooterProps = {
  settings: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="shell section pb-12">
      <div className="border-t border-litt-line pt-12">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="text-litt-body">
              <p className="text-litt-fg">I build tools for creators.</p>
              <p className="text-litt-fg-muted">The craft is in what I leave out.</p>
              <p className="text-litt-fg-muted">More play.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-litt-small text-litt-fg-subtle">
              <span>{settings.location}</span>
              <Tag status="success">{settings.availability.label}</Tag>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Social links">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {settings.socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link inline-flex h-litt-control-sm items-center text-litt-body"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeSwitch className="self-start lg:self-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}

// The closing statement. The export keeps its old name so page.tsx still
// compiles, but the animated orb is gone: material is static (P5), and the
// page's one centered statement is a thank-you and one action. The primary
// button owns the page's accent fill and glow (P1, P10). Pressing it copies
// the address and fires the view's one expressive moment, the toast. The
// plain mailto link under it works without JavaScript.
export function ThankYouOrb() {
  const email = siteSettings.contactEmail;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Email copied", description: email, tone: "success" });
    } catch {
      // Clipboard blocked or unavailable: say so, and show the address to copy by hand.
      toast({ title: "Couldn’t copy", description: email, tone: "error" });
    }
  }

  return (
    <section aria-labelledby="closing-title" className="shell section">
      <div className="mx-auto flex max-w-litt-reading flex-col items-center gap-8 text-center">
        <h2 id="closing-title" className="text-litt-h2 text-litt-fg text-balance">
          Thank you for being here.
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Button variant="primary" size="lg" onClick={copyEmail}>
            Copy email
          </Button>
          <a
            href={`mailto:${email}`}
            className="link inline-flex h-litt-control-sm items-center text-litt-small"
          >
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}
