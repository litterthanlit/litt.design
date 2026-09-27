import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { DitherBackground } from "@/components/dither-background";
import { GraffitiLayer } from "@/components/graffiti-layer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-canvas text-ink antialiased">
        <DitherBackground />
        <GraffitiLayer />
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
