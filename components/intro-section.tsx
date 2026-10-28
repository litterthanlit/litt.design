import Image from "next/image";

export function IntroSection() {
  return (
    <section className="section-shell pt-36 pb-12 md:pt-44 md:pb-16">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        <div className="reveal-in-scale h-[150px] w-[150px] shrink-0 overflow-hidden rounded-lg border-2 border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]">
          <Image
            src="/nick.png"
            alt="Portrait of Nick"
            width={150}
            height={150}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="reveal-in max-w-[520px] [animation-delay:60ms]">
          <h1 className="text-body font-medium text-ink">
            Nick Georgiev
            <span className="font-normal text-muted"> · Designer &amp; engineer</span>
          </h1>
          <p className="mt-3 text-intro text-ink">
          Hi, I&apos;m Nick. I got into design through art and a fascination with how people interact with things - spaces, objects and screens. Studying marketing in Australia only made it worse. Now I design sites, products, and tools that are simple, usable, and feel considered.
          </p>
        </div>
      </div>
    </section>
  );
}
