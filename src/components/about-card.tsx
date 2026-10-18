import Link from "next/link";
import { AsciiPortrait } from "./ascii-portrait";
import { atAGlance, profile } from "@/content/site";
import { SocialIcon } from "./social-icons";

/**
 * About me, built to the reference's structure because Ilham asked for it by name.
 *
 * The section is a four-screen scroll runway holding one sticky screen. Behind
 * everything, the words ABOUT ME are set at display size and never move. A card starts
 * zoomed in at 2.8x and un-zooms toward the reader until it fills the frame and covers
 * them. The scale curve is not invented: it is the reference's own, sampled at thirteen
 * scroll positions and written back out as keyframes - a fast ease-out from 2.8 to 1.2,
 * then a linear tail from 1.2 to 1.0. Opacity never changes; the reveal is scale alone.
 *
 * All of it is CSS scroll-driven animation on a named view-timeline, so there is no
 * listener, no library and nothing on the main thread. Where that is unsupported, and
 * under prefers-reduced-motion, the card simply sits at its finished size - which is the
 * page you would have wanted anyway.
 *
 * Below 768px there is no runway and no zoom. A sticky four-screen section on a phone
 * costs four flicks of scrolling to deliver one card, and the card is the point.
 *
 * What is deliberately not the reference's: the card is paper rather than white, the
 * borders are 2px rather than 4px, the emphasised nouns are set in mono rather than
 * uppercase-bold-black, and the one filled button is the accent. Those four changes are
 * what keep this his page rather than a copy of a classmate's.
 *
 * The photograph is not a photograph. See ascii-portrait.tsx; the frame grew from 17rem
 * to 27rem to carry it, because a hundred characters across a 248px frame renders them
 * at four pixels and the portrait stops being made of anything legible.
 */
export function AboutCard() {
  return (
    <section id="about" className="about-stage" aria-labelledby="about-h">
      <div className="about-sticky">
        {/*
          Four runs, not two: the keyframe moves the strip by half its width, and that
          half has to outrun the window or the band runs out of words before it wraps.
          Measured at 1440, two runs left the last fifth of every cycle empty.
        */}
        <div className="about-tape marquee-run" aria-hidden="true">
          <div className="about-tape-run">
            {Array.from({ length: 4 }, (_, t) => (
              <span key={t}>
                {Array.from({ length: 8 }, (_, i) => (
                  <b key={i}>About me</b>
                ))}
              </span>
            ))}
          </div>
        </div>

        <p className="about-back display" aria-hidden="true">
          About me
        </p>

        <div className="about-stack">
          <div className="about-zoom">
            <div className="about-card">
              <span className="about-br about-br-a" aria-hidden="true" />
              <span className="about-br about-br-b" aria-hidden="true" />

              <div className="about-photo">
                <div className="about-photo-in">
                  <AsciiPortrait alt={profile.name} />
                </div>
              </div>

              <div className="about-text">
                <h2 id="about-h" className="about-name display">
                  {profile.name}
                </h2>
                <p className="about-role">{profile.label}</p>

                <div className="about-say">
                  <p>
                    Applied Data Science student at <b>Politeknik Elektronika Negeri Surabaya</b> and{" "}
                    <b>AI Engineer</b> at <b>Ideola</b>, a digital marketing agency for SMEs. He maps how a
                    business runs, organizes its data, and turns both into practical recommendations and tools.
                  </p>
                </div>

                <div className="about-cta">
                  <Link href="/contact" className="stamp stamp-fill">
                    Contact me
                  </Link>
                  <Link href="/cv" className="stamp">
                    Download CV
                  </Link>
                </div>
              </div>

              {/*
                The four facts on their own reversed strip across the foot of the card.
                They used to be a quiet two-by-two grid in the same ink on the same paper
                as everything else, which is why the card read as one soft block: there
                was nothing in it with any weight. A band of ink gives the card a base to
                stand on and a second register to read in.
              */}
              <dl className="about-facts">
                {atAGlance.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <nav className="about-social" aria-label="Profiles">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="about-tile"
              style={{ "--i": 0 } as React.CSSProperties}
              aria-label="Ilham Bintang Satria on GitHub"
            >
              <SocialIcon name="github" size={24} />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="about-tile"
              style={{ "--i": 1 } as React.CSSProperties}
              aria-label="Ilham Bintang Satria on LinkedIn"
            >
              <SocialIcon name="linkedin" size={24} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="about-tile"
              style={{ "--i": 2 } as React.CSSProperties}
              aria-label={`Email ${profile.email}`}
            >
              <SocialIcon name="email" size={24} />
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
