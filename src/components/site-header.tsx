import Link from "next/link";
import { profile } from "@/content/site";

const nav = [
  { href: "/#work", label: "Case studies" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

// Sits on top of each page's first band, so it has no background of its own.
export function SiteHeader() {
  return (
    <header className="site-header absolute inset-x-0 top-0 z-30">
      <div className="frame flex flex-col gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
        <Link href="/" className="w-fit text-[0.95rem] font-extrabold tracking-[-0.01em]">
          {profile.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem] font-semibold">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
