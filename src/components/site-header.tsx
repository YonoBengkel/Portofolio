import Link from "next/link";
import { profile } from "@/content/site";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

// Sits on top of each page's first band, so it has no background of its own.
export function SiteHeader() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="frame flex flex-col gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
        <Link
          href="/"
          className="flex w-fit items-center gap-2.5 text-[0.95rem] font-semibold tracking-[0.01em]"
          transitionTypes={["nav-back"]}
        >
          {/* Clear space is two slot widths, a quarter of the mark's height: at 20px that is the 10px gap. */}
          <Logo size={20} />
          {profile.name}
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
