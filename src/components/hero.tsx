import Image from "next/image";
import room from "@/assets/images/hero-room.webp";
import { profile } from "@/content/site";

/**
 * The hero is a room, not a drawing.
 *
 * The photograph was already Little Nightmares by accident: one small figure in a
 * large empty room, a reflective floor running away, a window as the only cold light,
 * and a second figure in the distance. That is the reference's own two-figure language,
 * so it earns the whole first screen. Graded onto the measured ladder it sits at median
 * luminance 0.0166 and saturation 0.62, inside the reference band on both counts, where
 * the old page measured 0.004 and 0.15.
 *
 * Three planes move at three speeds as you scroll: the wall behind, the photograph, and
 * the text on top. That is the dollhouse camera we had only been talking about. It is
 * built with scroll-driven CSS, so there is no listener and no JavaScript, and it simply
 * holds still where that is unsupported or unwanted.
 *
 * The name is set at 92px because at 112px it wraps, and one line was the choice.
 */
export function Hero() {
  return (
    <section className="hero wall" aria-label="Introduction">
      {/* The floor the room stands on. */}
      <div className="hero-floor" aria-hidden="true" />
      <div className="hero-grid frame">
        <div className="hero-copy">
          <p className="meta hero-kicker">{profile.label}</p>
          <h1 className="display hero-name">{profile.name}</h1>
          <p className="hero-tagline">{profile.tagline}</p>
        </div>

        {/* Priority: this is the largest thing on the first screen, so it is the page's
            largest contentful paint and should not wait its turn. */}
        <div className="hero-plate recede">
          <Image
            src={room}
            alt="Ilham standing in an empty top-floor room, lit from the window wall behind him"
            sizes="(min-width: 1024px) 48vw, 100vw"
            placeholder="blur"
            priority
          />
        </div>
      </div>
    </section>
  );
}
