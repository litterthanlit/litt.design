"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkCard } from "@/data/work";
import { Reveal } from "@/components/reveal";

const ROW =
  "grid grid-cols-[48px_minmax(0,4fr)_minmax(0,6fr)_3.5rem] items-center gap-x-3 rounded-[12px] bg-card p-1 pr-4 transition-colors duration-150 ease-out hover:bg-card-hover focus-visible:bg-card-hover focus-visible:outline-offset-4 sm:gap-x-4";

function IndexRow({ card, onActive }: { card: WorkCard; onActive: () => void }) {
  const body = (
    <>
      <span className="relative block h-12 w-12 overflow-hidden rounded-[8px] bg-card-hover">
        <Image src={card.covers.square} alt="" fill sizes="48px" draggable={false} className="object-cover" />
      </span>
      <span className="truncate text-body font-medium text-ink">{card.title}</span>
      {/* Not text-muted: it fails contrast on the hover grey */}
      <span className="truncate text-body text-ink/60">{card.category}</span>
      <span className="meta text-right">{card.year}</span>
    </>
  );

  const events = { onMouseEnter: onActive, onFocus: onActive };
  return card.sameApp ? (
    <Link href={card.href} transitionTypes={["nav-forward"]} className={ROW} {...events}>
      {body}
    </Link>
  ) : (
    <a href={card.href} className={ROW} {...events}>
      {body}
    </a>
  );
}

// The preview is decoration for a pointer: every row already carries the
// title, category, year and link, so touch loses nothing without it
export function IndexList({ cards }: { cards: WorkCard[] }) {
  const [activeKey, setActiveKey] = useState(cards[0].key);
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_5fr] lg:items-start">
      <ul className="grid gap-1">
        {cards.map((card, index) => (
          <li key={card.key}>
            <Reveal delay={index * 0.06}>
              <IndexRow card={card} onActive={() => setActiveKey(card.key)} />
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.06} className="sticky top-28 hidden lg:block">
        <div aria-hidden="true" className="rounded-[12px] bg-card p-1">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-card-hover">
            {cards.map((card) => {
              const active = card.key === activeKey;
              return (
                <motion.div
                  key={card.key}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 1.03, filter: `blur(${active ? 0 : 4}px)` }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Image src={card.covers.landscape} alt="" fill sizes="460px" draggable={false} className="object-cover" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
