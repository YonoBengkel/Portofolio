import Link from "next/link";
import { profile } from "@/content/site";
import { NavLinks } from "./nav-links";
import { PlainModeToggle } from "./plain-mode";

// Sits on top of each page's first band, so it has no background of its own.
export function SiteHeader() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="frame flex flex-col gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
        <Link href="/" className="w-fit text-[0.95rem] font-semibold tracking-[0.01em]" transitionTypes={["nav-back"]}>
          {profile.name}
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <NavLinks />
          <PlainModeToggle />
        </div>
      </div>
    </header>
  );
}
