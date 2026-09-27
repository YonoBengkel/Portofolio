import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowRightIcon } from "./icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-bg transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-card">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          {project.number} · {project.category}
        </p>
        <h3 className="font-serif text-2xl font-semibold leading-snug text-fg">{project.cardTitle}</h3>
        <p className="text-muted">{project.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm">
          <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand">{project.teamLabel}</span>
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            Read case study <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
