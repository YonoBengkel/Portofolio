import Link from "next/link";
import { profile } from "@/content/site";
import { Logo } from "./logo";

/** The last band. Dark, the name once more at size, and the three ways to reach him. */
export function SiteFooter() {
  return (
    <footer className="band-ink">
      <div className="frame py-20">
        <div className="column">
          <div className="flex items-center gap-3">
            <Logo size={22} />
            <p className="meta">{profile.label}</p>
          </div>
          <p className="display mt-6 text-[clamp(2rem,6.4vw,5rem)]">{profile.name}</p>
          <p className="lede mt-6 max-w-[34rem] opacity-80">{profile.tagline}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="pill">
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="pill">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="pill">
              Email
            </a>
            <Link href="/cv" className="pill" transitionTypes={["nav-forward"]}>
              CV
            </Link>
          </div>

          <p className="meta mt-14 opacity-60">
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
