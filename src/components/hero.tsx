import Link from "next/link";
import { RunSwitch } from "@/components/run-switch";
import { openTo, profile } from "@/content/site";

/**
 * One screen: the name at the size of a poster, what he does, and two ways in - and a
 * switch that swaps the whole ground underneath it.
 *
 * Flipping it brings six full-bleed bands up out of the floor, each tilted, each with its
 * words already running along it, and takes the name down with them. Flipping back sinks
 * them. Three things here are deliberate answers to how the first version read:
 *
 *   - they rise and sink rather than sliding in from the sides. A band set at nine
 *     degrees that travels horizontally reads as a mistake, because the eye expects a
 *     tilted thing to move along its own line; coming up out of the ground has no such
 *     expectation to break.
 *   - the words run. A police line with still lettering is a picture of a police line.
 *   - six, not three. Three bands on a cream field read as three stripes; six read as a
 *     different ground, which is the whole point of the control.
 *
 * The words are his own three, each used twice, and they are what the rest of the page is
 * about rather than a list of tools.
 */

const BANDS = ["Process", "Data", "Decisions", "Process", "Data", "Decisions"];

// Enough repeats that half a track is wider than any window, since the keyframe moves
// each band by half its own width - the same arithmetic as every other marquee here.
const PER_BAND = 8;

export function Hero() {
  return (
    <section className="hero frame" aria-label="Introduction">
      <div className="dots" aria-hidden="true" />

      <div className="hero-alt marquee-run" aria-hidden="true">
        {BANDS.map((word, i) => (
          <div key={`${word}-${i}`} className="hero-band" style={{ "--i": i } as React.CSSProperties}>
            <div className="hero-band-run">
              {[0, 1].map((copy) => (
                <span className="hero-band-set" key={copy}>
                  {Array.from({ length: PER_BAND }, (_, k) => (
                    <b key={k}>{word}</b>
                  ))}
                </span>
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
          <Link href="/work" className="pill pill-solid">
            See the work
          </Link>
          <Link href="/cv" className="pill">
            Download CV
          </Link>
        </div>
        <p className="meta hero-out mt-8 opacity-70">{openTo}</p>
      </div>
    </section>
  );
}
