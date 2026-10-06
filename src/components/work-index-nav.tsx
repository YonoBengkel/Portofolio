"use client";

import { useEffect, useState } from "react";

export type IndexItem = { slug: string; number: string; category: string; title: string };

/**
 * The shaft.
 *
 * Four landings on a vertical line pinned to the edge of the window, like the
 * floor indicator in a lift. Only the landing you are on is lit and named; the
 * others are marks until you reach for them. It answers where am I and how much
 * is left without putting a list of titles on screen, and it borrows the
 * reference's sense of a building you move down through.
 *
 * Below 1024px it lies on its side under the header. Without JavaScript these
 * are ordinary anchor links, each named by its full title.
 */
export function WorkIndexNav({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    // Work out the landing from where the entries actually are, not only from which
    // ones the observer reported: between two entries, and at the very top and bottom
    // of the page, nothing is inside the band and the marker would otherwise stick.
    function pick() {
      const line = window.innerHeight * 0.4;
      let current = items[0]?.slug ?? "";
      for (const item of items) {
        const el = document.getElementById(`project-${item.slug}`);
        if (el && el.getBoundingClientRect().top <= line) current = item.slug;
      }
      setActive(current);
    }

    // Scroll fires far more often than the screen redraws, so coalesce to one
    // measurement per frame.
    let frame = 0;
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    }

    pick();
    const observer = new IntersectionObserver(onScroll, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    for (const item of items) {
      const el = document.getElementById(`project-${item.slug}`);
      if (el) observer.observe(el);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className="shaft" aria-label="Case studies">
      <ol>
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`#project-${item.slug}`}
              aria-current={active === item.slug ? "true" : undefined}
              className="shaft-stop"
            >
              <span className="shaft-tick" aria-hidden="true" />
              <span className="shaft-label">
                <span className="shaft-number">{item.number}</span>
                <span className="shaft-title">{item.title}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
