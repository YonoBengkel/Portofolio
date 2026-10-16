"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/**
 * A pill of four links, with the page you are on filled in - the same read as the hero's
 * switch when it is on, which is what Ilham asked for. The fill is the accessible state,
 * not a decoration: `aria-current="page"` carries it to anyone not looking at the page.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="nav-pill">
      {NAV.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
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
