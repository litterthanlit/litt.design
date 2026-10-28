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

        {/* The first sentence is the page's h1, set inline so it reads as one paragraph */}
        <div className="reveal-in max-w-[520px] text-intro text-ink [animation-delay:60ms]">
          <h1 className="inline">Hi, I&apos;m Nick Georgiev, a designer who builds.</h1>{" "}
          <p className="inline">
            I got into the practice through art and a fascination with how people interact with things - spaces, objects and screens. Studying marketing in Australia only made it worse. Now I design sites, products, and tools that are simple, usable, and feel considered.
          </p>
        </div>
      </div>
    </section>
  );
}
