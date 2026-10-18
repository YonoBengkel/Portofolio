import Link from "next/link";
import { RunSwitch } from "@/components/run-switch";
import { openTo, profile } from "@/content/site";

/**
 * One screen: the name at the size of a poster, what he does, and two ways in - and a
 * switch that swaps the whole ground underneath it.
 *
 * Flipping it brings seven full-bleed bands in along their own diagonals, and the name
 * goes down into the floor letter by letter rather than fading out. Those are two
 * different things and the difference is the whole feel: a fade says the text stopped
 * existing, a sink says it went somewhere. Each letter rides inside its own clipped
 * slot, so what you see is a letter sliding under a line, not dissolving on the spot.
 *
 * There are no permanent corner bands. They were tried and removed: a strip cropped into
 * the corner of an otherwise empty page reads as something that failed to get out of the
 * way rather than as a deliberate mark.
 *
 * The split text is hidden from the accessibility tree and the real string sits beside
 * it, because a screen reader given one letter per element reads out one letter at a
 * time.
 */

/*
  Seven bands in two crossing sets, and the split is what makes both halves of the brief
  possible at once.

  A cream gap between two strips is only even if the strips are parallel: give them
  opposing tilts and the gap is a wedge, wide at one end and shut at the other. So the
  bands are grouped, four running one way and three the other, parallel inside each
  group. The gap inside a group is therefore the same at every point across the screen,
  and the two directions come from the groups crossing each other rather than from
  neighbouring strips disagreeing. Where they cross, ink covers ink and nothing opens.

  That is the reference's own device. Measured on alieffauzan.com, his tape is two strips
  at -4 and +6 degrees pulled into each other by about 104px so they overlap rather than
  meet - a crossing, not a seam.

  The words repeat on purpose. Four ideas across seven bands is a wall of the same few
  words, which is what a police line is; seven different words would be a list.
*/
const SET_A = ["Process", "Data", "Decisions", "Evidence"];
const SET_B = ["Process", "Decisions", "Data"];

/*
  The entry angle of each band, as a share of its vertical travel. The resting tilt is a
  property of the group now, so this is the only thing left that varies band to band -
  which is the point: the composition stands still and flat, the arrival does not. Not a
  ramp, because a monotonic sequence reads as a single hinged sheet rather than seven
  strips that happen to be falling.
*/
const SKEW = [-0.34, -0.62, -0.42, -0.7, -0.38, -0.66, -0.46];

// Enough repeats that half a track is wider than any window, since the keyframe moves
// each band by half its own width - the same arithmetic as every other marquee here.
const PER_BAND = 8;

/*
  Which words come out in the accent. Not Math.random: the server and the browser have to
  agree on the markup or React replaces it on hydration, and a wall that reshuffles itself
  on every render is a different thing from one that looks hand-placed. This is a fixed
  pattern chosen to have no visible period - the gaps run 3, 4, 2, 5, 3 - so it reads as
  irregular without being unstable.
*/
const LIT = new Set([2, 6, 9, 15, 19]);

function Band({ word, i, className = "" }: { word: string; i: number; className?: string }) {
  return (
    <div className={`hero-band ${className}`} style={{ "--i": i, "--skew": SKEW[i] } as React.CSSProperties}>
      <div className="hero-band-in">
        <div className="hero-band-run">
          {[0, 1].map((copy) => (
            <span className="hero-band-set" key={copy}>
              {Array.from({ length: PER_BAND }, (_, k) => (
                <b key={k} className={LIT.has((i * 3 + k) % 21) ? "lit" : undefined}>
                  {word}
                </b>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * One line of hero copy, cut into pieces that each sink into their own slot. `--i` is the
 * piece's place in the queue and `--n` the length, so the stagger can run forwards going
 * down and backwards coming back up.
 */
function Sink({ text, by = "letter", lead = 0 }: { text: string; by?: "letter" | "word"; lead?: number }) {
  const pieces = by === "word" ? text.split(" ") : [...text];
  return (
    <span className="sink-line" style={{ "--n": pieces.length } as React.CSSProperties}>
      {pieces.map((piece, i) =>
        piece === " " ? (
          <span key={i}> </span>
        ) : (
          <span className="sink" key={i} style={{ "--i": i + lead } as React.CSSProperties}>
            <span>{piece}</span>
            {by === "word" && i < pieces.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        ),
      )}
    </span>
  );
}

export function Hero() {
  const words = profile.name.split(" ");
  const first = words.slice(0, 2).join(" ");
  const last = words.slice(2).join(" ");

  return (
    <section className="hero frame" aria-label="Introduction">
      <div className="dots" aria-hidden="true" />

      <div className="hero-alt marquee-run" aria-hidden="true">
        <div className="hero-set hero-set-a">
          {SET_A.map((word, i) => (
            <Band key={`a-${word}-${i}`} word={word} i={i} />
          ))}
        </div>
        <div className="hero-set hero-set-b">
          {SET_B.map((word, i) => (
            <Band key={`b-${word}-${i}`} word={word} i={i + SET_A.length} />
          ))}
        </div>
      </div>

      <div className="hero-copy">
        <h1 className="display hero-name">
          <span className="sr-only">{profile.name}</span>
          <span className="hero-out" aria-hidden="true">
            <Sink text={first} />
            <br />
            <span className="marker marker-split">
              <Sink text={last} lead={first.length} />
            </span>
          </span>
        </h1>

        <RunSwitch />

        <p className="hero-role">
          <span className="sr-only">{profile.label}</span>
          <span className="hero-out" aria-hidden="true">
            <Sink text={profile.label} by="word" />
          </span>
        </p>

        <p className="hero-line">
          <span className="sr-only">{profile.tagline}</span>
          <span className="hero-out" aria-hidden="true">
            <Sink text={profile.tagline} by="word" />
          </span>
        </p>

        {/* These two are not split, so they go down as blocks inside their own clip. */}
        <div className="sink-block hero-out mt-10">
          <div className="hero-cta">
            <Link href="/work" className="pill pill-solid">
              See the work
            </Link>
            <Link href="/cv" className="pill">
              Download CV
            </Link>
          </div>
        </div>
        <div className="sink-block hero-out mt-8">
          <p className="meta opacity-70">{openTo}</p>
        </div>
      </div>
    </section>
  );
}
