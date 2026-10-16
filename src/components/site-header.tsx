import Link from "next/link";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

/**
 * A floating pill rather than a bar across the window: it is what both reference sites
 * do, and it keeps the page colour unbroken behind it.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="frame flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
          <Logo size={18} />
          <span className="hidden sm:inline">Ilham Bintang Satria</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
