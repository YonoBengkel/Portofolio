import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { SocialIcon } from "./social-icons";

/**
 * The project card, in the reference's format: a 16:9 screen, then a header row with a
 * marked square beside the title, then the facts, the description and the stack, then a
 * full-width primary action with a two-up pair under it.
 *
 * Four things are deliberately not the reference's, and each one is the difference
 * between using a structure and copying a site:
 *
 *   - no alternating +/-2 degree tilt on the cards. That tilt is the single most
 *     recognisable thing in his grid; the numbered square in the header does the same
 *     "made by a person" work and is already this site's own device.
 *   - the marked square carries the project's number, not a stock glyph.
 *   - one accent, not four. He runs green, blue, red and grey in this one section; the
 *     live link here is the only filled control and it is the site's single yellow.
 *   - the description is set at normal weight. His runs the whole paragraph at 700,
 *     which is why his cards read as shouting.
 *
 * A project with nothing deployed gets a real disabled button saying so, rather than the
 * reference's red one, which looks like an error rather than an absence.
 */

const MAX_CHIPS = 4;

function links(project: Project) {
  const code = project.links.find((l) => l.href.includes("github.com"));
  const live = project.links.find((l) => !l.href.includes("github.com"));
  return { code, live };
}

function Card({ project }: { project: Project }) {
  const { code, live } = links(project);
  const shown = project.tools.slice(0, MAX_CHIPS);
  const rest = project.tools.length - shown.length;

  return (
    <article className="pcard">
      <div className="pcard-shot">
        <Image src={project.cover.src} alt={project.cover.alt} sizes="(min-width: 860px) 42vw, 100vw" />
        <span className={`pcard-flag ${project.status === "Live" ? "pcard-flag-on" : ""}`}>{project.status}</span>
      </div>

      <div className="pcard-head">
        <span className="pcard-no" aria-hidden="true">
          {project.number}
        </span>
        <div>
          <h3 className="pcard-title">{project.cardTitle}</h3>
          <p className="pcard-sub">{project.subtitle}</p>
        </div>
      </div>

      <div className="pcard-body">
        <dl className="pcard-meta">
          <div>
            <dt>Team</dt>
            <dd>{project.teamLabel}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{project.period}</dd>
          </div>
        </dl>

        <p className="pcard-say">{project.summary}</p>

        <ul className="pcard-chips">
          {shown.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
          {rest > 0 && <li className="pcard-chip-more">+{rest}</li>}
        </ul>
      </div>

      <div className="pcard-acts">
        <Link href={`/work/${project.slug}`} className="stamp stamp-ink pcard-open">
          Read the case study
        </Link>
        <div className="pcard-pair">
          {code ? (
            <a href={code.href} target="_blank" rel="noopener noreferrer" className="stamp stamp-sm">
              <SocialIcon name="github" size={15} />
              Code
            </a>
          ) : (
            <button type="button" className="stamp stamp-sm" disabled aria-disabled="true" title="No public repository">
              No repo
            </button>
          )}
          {live ? (
            <a href={live.href} target="_blank" rel="noopener noreferrer" className="stamp stamp-sm stamp-fill">
              Open it
            </a>
          ) : (
            <button type="button" className="stamp stamp-sm" disabled aria-disabled="true" title="Nothing deployed yet">
              No demo
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="pgrid stagger">
      {projects.map((project, i) => (
        <div key={project.slug} style={{ "--i": i } as React.CSSProperties}>
          <Card project={project} />
        </div>
      ))}
    </div>
  );
}
