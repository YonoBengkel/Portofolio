import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/content/projects";

/**
 * Two case studies on the home page, then a door to the rest.
 *
 * Two rather than four, so it stays a sample and there is a reason to click through.
 * Each one is a panel carrying a real screen from the project, because "no large empty
 * space" can only be answered by objects that have something in them — a list of titles
 * would leave the same hole we started with.
 *
 * The title is the same object as the heading on the case study, so it travels between
 * the pages rather than being redrawn.
 */
export function WorkPreview({ projects }: { projects: Project[] }) {
  return (
    <section className="lit band pt-0" aria-labelledby="recent-heading">
      <div className="column">
        <div className="preview-head reveal">
          <h2 id="recent-heading" className="display preview-title">
            My Recent Project
          </h2>
          <Link href="/work" className="link preview-door" transitionTypes={["nav-forward"]}>
            All four case studies
          </Link>
        </div>

        <div className="preview-grid">
          {projects.map((project) => (
            <article key={project.slug} className="preview-card panel plate reveal">
              <Link href={`/work/${project.slug}`} className="preview-link" transitionTypes={["nav-forward"]}>
                <span className="preview-shot">
                  <Image
                    src={project.cover.src}
                    alt={project.cover.alt}
                    sizes="(min-width: 900px) 34rem, 100vw"
                    className="graded"
                  />
                </span>
                <span className="preview-meta meta">
                  {project.number} {project.category}
                </span>
                <ViewTransition name={`study-${project.slug}`} share="study-title" default="none">
                  <h3 className="display preview-name">{project.cardTitle}</h3>
                </ViewTransition>
                <span className="preview-sub">{project.subtitle}</span>
                <span className="preview-foot meta">
                  <span className="status">{project.status}</span>
                  <span>{project.teamLabel}</span>
                  <span>{project.period}</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
