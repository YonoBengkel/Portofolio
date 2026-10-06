"use client";

import { useEffect, useState } from "react";

export type IndexItem = { slug: string; number: string; category: string; title: string };

/**
 * The list that stays with you. It marks whichever case study is currently in
 * the middle of the window, so the list doubles as a position marker. On a
 * phone it becomes a rail you can push sideways.
 *
 * Without JavaScript these are still ordinary anchor links to each entry.
 */
export function WorkIndexNav({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace("project-", ""));
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(`project-${item.slug}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <ol className="work-rail">
      {items.map((item) => (
        <li key={item.slug}>
          <a
            href={`#project-${item.slug}`}
            aria-current={active === item.slug ? "true" : undefined}
            className="work-rail-link"
          >
            <span className="meta">
              {item.number} {item.category}
            </span>
            <span className="mt-1 block font-semibold leading-snug">{item.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
