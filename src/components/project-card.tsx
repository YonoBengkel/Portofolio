import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";
import { PipelineDiagram, StarSchemaDiagram } from "./diagrams";

/** CSS variables that paint a block in the project's own colour. */
export function projectColors(project: Project) {
  return {
    "--tile": project.color.tile,
    "--on-tile": project.color.ink === "light" ? "#ffffff" : "#001f5f",
  } as CSSProperties;
}

// One field of the case-study mosaic. The whole field is clickable through the title link.
export function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  return (
    <article className={`tile ${wide ? "tile-wide" : ""}`} style={projectColors(project)}>
      <div className="max-w-[44rem] px-6 pt-16 sm:px-10 sm:pt-20 lg:pt-24">
        <h3 className="text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]">
          <Link href={`/work/${project.slug}`} className="tile-link">
            {project.cardTitle}
          </Link>
        </h3>
        <p className="mx-auto mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed sm:text-lg">{project.summary}</p>
        <p className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[0.95rem] font-bold">
          <span>{project.teamLabel}</span>
          <span>{project.period}</span>
        </p>
      </div>

      {project.heroDiagram ? (
        <div className="diagram-on-tile mt-auto w-full max-w-[46rem] px-5 pb-12 pt-12 sm:px-8 sm:pb-16">
          {project.heroDiagram.diagram === "pipeline" ? <PipelineDiagram /> : <StarSchemaDiagram />}
        </div>
      ) : (
        <div
          className={`relative mt-12 w-[88%] overflow-hidden rounded-t-[10px] sm:mt-14 ${
            wide ? "h-[clamp(220px,34vw,460px)] max-w-[1040px]" : "h-[clamp(200px,24vw,340px)]"
          }`}
        >
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={wide ? "(min-width: 1440px) 1040px, 88vw" : "(min-width: 900px) 44vw, 88vw"}
            className="object-cover object-left-top"
          />
        </div>
      )}
    </article>
  );
}
