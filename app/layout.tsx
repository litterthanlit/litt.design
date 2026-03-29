import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { siteSettings } from "@/data/site";
import "./globals.css";

const display = localFont({
  variable: "--font-display",
  src: [
    { path: "./fonts/schibsted-grotesk-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/schibsted-grotesk-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/schibsted-grotesk-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/schibsted-grotesk-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/schibsted-grotesk-800.ttf", weight: "800", style: "normal" },
    { path: "./fonts/schibsted-grotesk-900.ttf", weight: "900", style: "normal" },
  ],
});

const body = localFont({
  variable: "--font-body",
  src: [
    { path: "./fonts/ibm-plex-sans-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-600.ttf", weight: "600", style: "normal" },
  ],
});

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
      <body className={`${display.variable} ${body.variable} bg-canvas text-ink antialiased`}>
        <div className="grain" aria-hidden="true" />
        <SiteHeader settings={siteSettings} />
        {children}
      </body>
    </html>
  );
}
