import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

/**
 * The work, as cards that lead with the screen.
 *
 * The screenshot is the first thing in the card and runs to its edges, because it is the
 * evidence; the title, the one line and the status follow it. On the reference this grid
 * sits on its own coloured band so it cannot blur into the section above.
 */
export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="cards cards-2">
      {projects.map((project, i) => (
        <article key={project.slug} className="work-card tilt" style={{ "--i": i } as React.CSSProperties}>
          <Link href={`/work/${project.slug}`} className="contents" transitionTypes={["nav-forward"]}>
            <span className="work-shot drift">
              <Image src={project.cover.src} alt={project.cover.alt} sizes="(min-width: 760px) 44vw, 100vw" />
            </span>
            <span className="work-body">
              <span className="meta opacity-70">
                {project.number} · {project.category}
              </span>
              <span className="work-title">{project.cardTitle}</span>
              <span className="leading-relaxed">{project.subtitle}</span>
              <span className="chips mt-1">
                <span className={`chip ${project.status === "Live" ? "chip-live" : ""}`}>{project.status}</span>
                <span className="chip">{project.teamLabel}</span>
                <span className="chip">{project.period}</span>
              </span>
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}
