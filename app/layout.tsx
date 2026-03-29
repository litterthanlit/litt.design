import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { siteSettings } from "@/data/site";
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
      <body className={`${GeistSans.variable} ${GeistMono.variable} bg-canvas text-ink antialiased`}>
        <div className="grain" aria-hidden="true" />
        <SiteHeader settings={siteSettings} />
        {children}
      </body>
    </html>
  );
}
