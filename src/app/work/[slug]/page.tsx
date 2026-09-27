import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyBody, DiagramFigure, FigureBlock, ProjectFacts } from "@/components/case-study";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { getProject, projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.subtitle,
    openGraph: { title: project.title, description: project.subtitle },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <Link href="/#work" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg">
        <ArrowLeftIcon width={16} height={16} /> All work
      </Link>

      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
          Case study {project.number} · {project.category}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-brand sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted sm:text-xl">{project.subtitle}</p>
      </header>

      <div className="mt-10">
        {project.heroDiagram ? (
          <DiagramFigure diagram={project.heroDiagram.diagram} caption={project.heroDiagram.caption} />
        ) : (
          <FigureBlock figure={project.cover} preload />
        )}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CaseStudyBody project={project} />
        <div className="order-first lg:order-last">
          <ProjectFacts project={project} />
        </div>
      </div>

      <nav aria-label="Next case study" className="mt-16 border-t border-line pt-8">
        <Link href={`/work/${next.slug}`} className="group inline-flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Next case study</span>
          <span className="mt-1 inline-flex items-center gap-2 font-serif text-2xl font-semibold text-brand">
            {next.cardTitle} <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </nav>
    </article>
  );
}
