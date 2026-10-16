"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/** A pill of four links. The page you are on is the one in the accent. */
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
            transitionTypes={["nav-forward"]}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
