import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { GraffitiLayer } from "@/components/graffiti-layer";
import { themeScript } from "@/components/theme-switch";
import { TooltipProvider } from "@/components/litt/tooltip";
import { Toaster } from "@/components/litt/toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://litt.design"),
  title: {
    default: "litt.design",
    template: "%s | litt.design",
  },
  description:
    "Nick is a designer and developer building sites, products, and tools for creators — simple, usable, and considered.",
  openGraph: {
    title: "litt.design",
    description:
      "Sites, products, and tools for creators. The craft is in what I leave out.",
    type: "website",
    url: "https://litt.design",
    images: ["/og.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "litt.design",
    description:
      "Sites, products, and tools for creators. The craft is in what I leave out.",
    images: ["/og.svg"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative isolate">
        {/* The one light source: static, from the top (P2, P5). */}
        <div aria-hidden="true" className="site-light litt-lit litt-grain litt-grain-fade" />
        <TooltipProvider>
          <Toaster>
            <GraffitiLayer />
            <SiteHeader />
            {children}
          </Toaster>
        </TooltipProvider>
      </body>
    </html>
  );
}
