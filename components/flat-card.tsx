import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CoverShape, WorkCard } from "@/data/work";

// A card links to its page, with <Link> inside this app and a plain <a> to /art
export function CardLink({ card, className, children }: { card: WorkCard; className: string; children: ReactNode }) {
  return card.sameApp ? (
    <Link href={card.href} transitionTypes={["nav-forward"]} className={className}>
      {children}
    </Link>
  ) : (
    <a href={card.href} className={className}>
      {children}
    </a>
  );
}

// The wide shape is 16/10 on a phone, where every card is one column
const ASPECT: Record<CoverShape, string> = {
  landscape: "aspect-[16/10]",
  wide: "aspect-[16/10] sm:aspect-[2/1]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

type FlatCardProps = {
  card: WorkCard;
  shape?: CoverShape;
  sizes: string;
  className?: string;
};

// Flat: a grey frame, the cover set 4px inside it, no lines and no shadow.
// The frame steps one grey darker on hover and press.
export function FlatCard({ card, shape = "landscape", sizes, className = "" }: FlatCardProps) {
  const body = (
    <>
      <div className={`relative ${ASPECT[shape]} overflow-hidden rounded-[8px] bg-card-hover`}>
        <Image
          src={card.covers[shape]}
          alt={card.alt}
          fill
          sizes={sizes}
          draggable={false}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 px-3 pt-3 pb-2.5">
        <div>
          <h3 className="text-body font-medium text-ink">{card.title}</h3>
          {card.status && (
            <p className="meta mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9BD62E]" aria-hidden="true" />
              {card.status}
            </p>
          )}
        </div>
        <div>
          {/* Not text-muted: it fails contrast on the hover grey */}
          <p className="text-body text-ink/60">{card.category}</p>
          <p className="meta mt-1">{card.year}</p>
        </div>
      </div>
    </>
  );

  const frame = `group block rounded-[12px] bg-card p-1 transition-colors duration-150 ease-out hover:bg-card-hover active:bg-card-hover focus-visible:outline-offset-4 ${className}`;

  return (
    <CardLink card={card} className={frame}>
      {body}
    </CardLink>
  );
}
