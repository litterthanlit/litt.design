import Image from "next/image";

// Lines up with the content column of the rows below it
export function IntroSection() {
  return (
    <section className="section-shell pt-16 pb-4 md:pt-24 md:pb-6">
      <div className="max-w-[800px] md:pl-[120px]">
        <div className="reveal-in-scale size-16 overflow-hidden rounded-[10px] border border-line">
          <Image
            src="/nick.png"
            alt="Portrait of Nick"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h1 className="reveal-in mt-5 text-body [animation-delay:60ms]">
          <span className="block font-medium text-ink">Nick Georgiev</span>
          <span className="block text-muted">Designer &amp; engineer</span>
        </h1>
      </div>
    </section>
  );
}
