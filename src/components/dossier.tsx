import Image from "next/image";
import portrait from "@/assets/images/portrait-cutout.webp";
import { atAGlance, experience, openTo, profile, toolbox } from "@/content/site";

/**
 * The dossier.
 *
 * One dense, lit object rather than three airy sections. It answers who, what I have
 * done and what I can do in a single block, so a reader who scrolls once has all three
 * without going anywhere — the thing Toriq's page does well.
 *
 * It is also the answer to "too much empty space": a page needs something in the frame
 * to light, and this is the largest thing we own. It sits on the peeling-paint plate,
 * so it reads as a surface in the room rather than a card floating in the dark.
 *
 * The CV is deliberately not here. Whoever opens this already has it.
 */
export function Dossier() {
  const ideola = experience[0];

  return (
    <section className="lit band" aria-label="About Ilham">
      <div className="column">
        <div className="dossier panel plate reveal">
          {/*
            A cut-out standing on a sheet of paper, the way the reference site does it:
            the person without the room behind them. The sheet is a generated paper tile,
            so the only photograph here is him.
          */}
          <div className="dossier-portrait">
            <Image
              src={portrait}
              alt={profile.name}
              sizes="(min-width: 900px) 17rem, 60vw"
              placeholder="blur"
            />
          </div>

          <div className="dossier-body">
            <div>
              <h2 className="display dossier-name">{profile.name}</h2>
              <p className="dossier-line">{profile.intro}</p>
            </div>

            <dl className="dossier-facts">
              {atAGlance.map((item) => (
                <div key={item.label}>
                  <dt className="meta">{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
              <div className="dossier-span">
                <dt className="meta">Available</dt>
                <dd>{openTo}</dd>
              </div>
            </dl>

            <div className="dossier-now">
              <p className="meta">
                {ideola.role} · {ideola.org} · {ideola.period}
              </p>
              <p>{ideola.points[0]}</p>
            </div>

            <div className="dossier-skills">
              {toolbox.map((group) => (
                <div key={group.group}>
                  <p className="meta">{group.group}</p>
                  <p>{group.items.join(" · ")}</p>
                </div>
              ))}
            </div>

            <ul className="dossier-links">
              <li>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="link">
                  {profile.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
