"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/**
 * A pill of four links, with the page you are on filled in - the same read as the hero's
 * switch when it is on.
 *
 * The fill is one element that slides between the links rather than a background that
 * blinks from one to the next, because four separate backgrounds cannot animate between
 * each other: only a single object can travel. Its position is measured from the live
 * link rather than written down, so it stays right whatever the labels say and at
 * whatever the font renders to.
 *
 * It also moves *early*. The curtain delays the route change until the panel has covered
 * the page, and announces where it is going as soon as the link is clicked - so the fill
 * has already arrived at the destination before the panel lifts, which is what Ilham
 * asked for. The header sits above the curtain so that move is actually visible.
 */
export function NavLinks() {
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState<{ x: number; w: number } | null>(null);

  /*
    The curtain tells us where it is going before it gets there, and tells us again when
    it has finished. Both come in as events, so the state is set from a handler rather
    than from an effect watching the pathname - an effect would be a render triggering a
    render for something the click already knew.
  */
  useEffect(() => {
    const onPending = (e: Event) => setPending((e as CustomEvent<string | null>).detail ?? null);
    window.addEventListener("nav:pending", onPending);
    return () => window.removeEventListener("nav:pending", onPending);
  }, []);

  const path = pending ?? pathname;
  const activeIndex = NAV.findIndex((item) => path === item.href || path.startsWith(`${item.href}/`));

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const link = nav.querySelectorAll<HTMLElement>("a")[activeIndex];
      setBox(link ? { x: link.offsetLeft, w: link.offsetWidth } : null);
    };
    measure();
    // Fonts land after first paint and change every label's width.
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [activeIndex]);

  return (
    <nav
      aria-label="Main"
      className="nav-pill"
      ref={navRef}
      data-has-fill={box ? "" : undefined}
      style={box ? ({ "--fill-x": `${box.x}px`, "--fill-w": `${box.w}px` } as React.CSSProperties) : undefined}
    >
      <span className="nav-fill" aria-hidden="true" />
      {NAV.map((item, i) => {
        const current = i === activeIndex;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
            className={current ? "nav-current" : undefined}
            data-current={current ? "" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
