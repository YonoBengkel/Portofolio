import Link from "next/link";
import { openTo, profile } from "@/content/site";

/**
 * One screen: the name at the size of a poster, what he does, and two ways in.
 *
 * This is the reference's hero almost exactly - it is the part Ilham picked - with the
 * dotted field behind it so the empty page reads as a surface rather than as a gap.
 */
export function Hero() {
  return (
    <section className="hero frame" aria-label="Introduction">
      <div className="dots" aria-hidden="true" />
      <div>
        <h1 className="display hero-name">
          {profile.name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span className="marker">{profile.name.split(" ").slice(2).join(" ")}</span>
        </h1>
        <p className="hero-role">{profile.label}</p>
        <p className="hero-line">{profile.tagline}</p>
        <div className="hero-cta">
          <Link href="/work" className="pill pill-solid" transitionTypes={["nav-forward"]}>
            See the work
          </Link>
          <Link href="/cv" className="pill" transitionTypes={["nav-forward"]}>
            Download CV
          </Link>
        </div>
        <p className="meta mt-8 opacity-70">{openTo}</p>
      </div>
    </section>
  );
}
