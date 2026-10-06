"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";

export type LedgerItem = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  status: string;
  teamLabel: string;
  period: string;
  cover: { src: StaticImageData; alt: string };
};

/**
 * A ledger of work, with one plate.
 *
 * The four rows are the whole list; the plate beside them shows whichever row
 * you are pointing at. Only one project is lit at a time, which is the same
 * rule the rest of the site runs on, and it means the page can hold four
 * screenshots without becoming four screens tall.
 *
 * On a narrow screen there is no plate: each row carries its own picture.
 */
export function ProjectLedger({ items }: { items: LedgerItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="ledger">
      <ol className="ledger-rows">
        {items.map((item, i) => (
          <li key={item.slug}>
            <Link
              href={`/work/${item.slug}`}
              className="ledger-row"
              data-lit={i === active ? "true" : undefined}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              transitionTypes={["nav-forward"]}
            >
              <span className="meta ledger-number">{item.number}</span>
              <span className="ledger-body">
                <span className="display ledger-title">{item.title}</span>
                <span className="ledger-summary">{item.summary}</span>
                <span className="meta ledger-facts">
                  {item.status} &nbsp; {item.teamLabel} &nbsp; {item.period}
                </span>
              </span>
            </Link>

            {/* The picture travels with the row until there is room for a plate. */}
            <div className="ledger-inline-plate">
              <Image
                src={item.cover.src}
                alt={item.cover.alt}
                sizes="(min-width: 1024px) 0px, 92vw"
                preload={i === 0}
                className="graded h-full w-full object-cover object-left-top"
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="ledger-plate" aria-hidden="true">
        {items.map((item, i) => (
          <Image
            key={item.slug}
            src={item.cover.src}
            alt=""
            sizes="(min-width: 1024px) 40vw, 0px"
            data-lit={i === active ? "true" : undefined}
            className="graded"
          />
        ))}
      </div>
    </div>
  );
}
