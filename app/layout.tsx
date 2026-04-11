import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { DitherBackground } from "@/components/dither-background";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://litt.design"),
  title: {
    default: "litt.design",
    template: "%s | litt.design",
  },
  description:
    "Web design, development, brand systems, and motion direction for founders who need a launch-ready site with a point of view.",
  openGraph: {
    title: "litt.design",
    description:
      "Web experiences, brand identity, and motion that moves business.",
    type: "website",
    url: "https://litt.design",
    images: ["/og.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "litt.design",
    description:
      "Web experiences, brand identity, and motion that moves business.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistMono.variable} bg-canvas text-ink antialiased`}>
        <DitherBackground />
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
