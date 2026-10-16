import Link from "next/link";
import { RunSwitch } from "@/components/run-switch";
import { openTo, profile } from "@/content/site";

/**
 * One screen: the name at the size of a poster, what he does, and two ways in - and a
 * switch that swaps the whole ground underneath it.
 *
 * This is what Ilham asked for after watching the reference: flipping the switch changes
 * the hero's background rather than stopping anything. Three full-bleed bands slide in
 * from alternating sides at shallow angles while the name and the lines under it leave
 * downward, and flipping back reverses it exactly. The reference uses five bands at
 * random angles up to 30 degrees carrying its author's cloud stack; three bands at fixed
 * shallow angles carrying the three things Ilham actually does is the calmer version of
 * the same idea, and it says something rather than listing tools.
 *
 * The switch itself stays put and stays readable in both states - it is the one control
 * here and it must not disappear into what it just turned on.
 */

// His own three steps, in order. Not a stack list: these are what the rest of the page
// is about, and they are the same three the method section names.
const BANDS = ["Process", "Data", "Decisions"];

export function Hero() {
  return (
    <section className="hero frame" aria-label="Introduction">
      <div className="dots" aria-hidden="true" />

      <div className="hero-alt" aria-hidden="true">
        {BANDS.map((word, i) => (
          <div key={word} className="hero-band" style={{ "--i": i } as React.CSSProperties}>
            <div className="hero-band-run">
              {Array.from({ length: 6 }, (_, k) => (
                <span key={k}>{word}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hero-copy">
        <h1 className="display hero-name hero-out">
          {profile.name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span className="marker">{profile.name.split(" ").slice(2).join(" ")}</span>
        </h1>
        <RunSwitch />
        <p className="hero-role hero-out">{profile.label}</p>
        <p className="hero-line hero-out">{profile.tagline}</p>
        <div className="hero-cta hero-out">
          <Link href="/work" className="pill pill-solid" transitionTypes={["nav-forward"]}>
            See the work
          </Link>
          <Link href="/cv" className="pill" transitionTypes={["nav-forward"]}>
            Download CV
          </Link>
        </div>
        <p className="meta hero-out mt-8 opacity-70">{openTo}</p>
      </div>
    </section>
  );
}
