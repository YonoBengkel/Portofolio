import Link from "next/link";
import type { Project } from "@/content/projects";
import { FlowChain } from "./flow-chain";
import { WorkIndexNav } from "./work-index-nav";

/**
 * The shaft runs down the edge of the window while the entries scroll past it,
 * so the reading column keeps the whole page to itself.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const items = projects.map((p) => ({
    slug: p.slug,
    number: p.number,
    category: p.category,
    title: p.cardTitle,
  }));

  return (
    <div className="frame">
      <WorkIndexNav items={items} />

      <div className="column">
        {projects.map((project) => (
          <article
            key={project.slug}
            id={`project-${project.slug}`}
            className="lit reveal scroll-mt-28 border-t border-concrete py-14 first:border-t-0 first:pt-0"
          >
            <p className="meta">
              {project.number} {project.category}
            </p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.9rem)]">
              <Link href={`/work/${project.slug}`} className="link-quiet" transitionTypes={["nav-forward"]}>
                {project.cardTitle}
              </Link>
            </h2>
            <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-relaxed">{project.subtitle}</p>

            <FlowChain steps={project.flow} />

            <p className="meta mt-6 flex flex-wrap gap-x-5 gap-y-1">
              <span className="status">{project.status}</span>
              <span>{project.teamLabel}</span>
              <span>{project.period}</span>
            </p>

            <p className="mt-6">
              <Link href={`/work/${project.slug}`} className="link" transitionTypes={["nav-forward"]}>
                Read the case study
              </Link>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
