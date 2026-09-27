import Link from "next/link";
import { profile } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "./icons";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-brand">
          {profile.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-2 text-muted transition-colors hover:bg-card hover:text-fg sm:inline-block"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.links.github}
            className="rounded-md p-2 text-muted transition-colors hover:bg-card hover:text-fg"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href={profile.links.linkedin}
            className="rounded-md p-2 text-muted transition-colors hover:bg-card hover:text-fg"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </nav>
      </div>
    </header>
  );
}
