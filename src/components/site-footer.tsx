import Link from "next/link";
import { profile } from "@/content/site";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/about/competitions", label: "Competitions" },
  { href: "/about/activities", label: "Organisations" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-concrete">
      <div className="frame grid gap-10 py-14 sm:grid-cols-[minmax(0,1fr)_auto]">
        <p className="meta">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <nav aria-label="Footer">
          <ul className="grid gap-2 text-[0.95rem] sm:text-right">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-quiet">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
