"use client";

import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell flex items-center justify-between py-5">
        <Link href="/" aria-label="Home">
          <Image
            src="/logo.gif"
            alt="litt.design"
            width={80}
            height={42}
            unoptimized
            priority
          />
        </Link>
      </div>
    </header>
  );
}
