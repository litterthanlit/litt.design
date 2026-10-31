import type { SiteSettings } from "@/data/types";

// Each network's own mark, drawn in one colour on a 24px grid. X and GitHub
// come from Simple Icons, LinkedIn from its last release that carried it, and
// Contra's star from the wordmark on contra.com.
const MARKS: Record<string, string> = {
  X: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  Contra:
    "M8.52767 4.13044C7.3712 5.89404 5.85734 7.40261 4.08536 8.55378C2.83403 9.40933 1.46224 10.1051 0 10.6086V11.0123H10.9955V0.0111084H10.6085C10.102 1.48526 9.39733 2.8694 8.52723 4.13044H8.52767ZM12.9925 0.0111084V11.0595H23.9893V10.6558C22.5275 10.1524 21.1566 9.45654 19.9039 8.60099C18.1337 7.44982 16.6185 5.94125 15.4621 4.17765C14.5827 2.90338 13.8723 1.50335 13.3644 0.0111084H12.9925ZM23.9893 12.9515H12.9925V24H13.3644C13.8723 22.5081 14.5822 21.1077 15.4621 19.8334C16.6185 18.0698 18.1341 16.5612 19.9039 15.4101C21.1566 14.5541 22.5275 13.8587 23.9893 13.3553V12.9515ZM10.9959 24V12.9987H0.000441231V13.4025C1.46224 13.9059 2.83447 14.6017 4.0858 15.4573C5.85734 16.6084 7.3712 18.1175 8.52811 19.8806C9.39822 21.1417 10.1024 22.5254 10.6094 23.9995H10.9964L10.9959 24Z",
  GitHub:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
};

type SocialLinksProps = Pick<SiteSettings, "socialLinks" | "contactEmail">;

// Round, flat icon links, litt.md's ghost button: muted at rest, ink with a
// faint fill on hover. Each is 44px to tap; the row is pulled out by the air
// around the first mark, so the marks line up with the text, and down to one
// line of text, so they centre on the row's label. A network without a mark
// keeps its name.
export function SocialLinks({ socialLinks, contactEmail }: SocialLinksProps) {
  return (
    <ul className="-my-[11px] -ml-3.5 flex flex-wrap items-center">
      {socialLinks.map((link) => {
        const mark = MARKS[link.label];
        return (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={mark ? `${link.label} (opens in a new tab)` : undefined}
              className={
                mark
                  ? "grid size-11 place-items-center rounded-full text-muted transition-[background-color,color] duration-100 ease-out hover:bg-ink/6 hover:text-ink pointer-coarse:active:bg-ink/6 pointer-coarse:active:text-ink motion-reduce:transition-none"
                  : "link mx-3.5 text-body"
              }
            >
              {mark ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d={mark} />
                </svg>
              ) : (
                link.label
              )}
            </a>
          </li>
        );
      })}
      <li className="ml-2">
        <a href={`mailto:${contactEmail}`} className="link text-body">
          {contactEmail}
        </a>
      </li>
    </ul>
  );
}
