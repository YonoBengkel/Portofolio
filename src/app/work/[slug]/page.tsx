import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyBody, CoverFigure, ProjectFacts } from "@/components/case-study";
import { projectColors } from "@/components/project-card";
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
    <article>
      {/* The band takes the project's colour; data-band-ink tells the header which ink to use. */}
      <header data-band-ink={project.color.ink} className="tile" style={projectColors(project)}>
        <div className="frame pb-[clamp(8rem,17vw,13rem)] pt-32 sm:pt-40">
          <Link href="/#work" className="link font-semibold">
            All case studies
          </Link>
          <h1 className="mx-auto mt-8 max-w-[22ch] text-[clamp(2.3rem,6vw,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.035em]">
            {project.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[40rem] text-lg leading-relaxed sm:text-xl">{project.subtitle}</p>
          <ProjectFacts project={project} />
        </div>
      </header>

      <div className="article-grid prose-body pb-24">
        <CoverFigure project={project} />
        <CaseStudyBody project={project} />
      </div>

      <nav aria-label="Next case study">
        <Link href={`/work/${next.slug}`} className="tile group block" style={projectColors(next)}>
          <span className="frame block py-20 sm:py-28">
            <span className="block text-[0.95rem] font-bold">Next case study</span>
            <span className="mx-auto mt-4 block max-w-[24ch] text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] underline decoration-transparent decoration-[0.07em] underline-offset-[0.14em] transition-colors group-hover:decoration-current">
              {next.cardTitle}
            </span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
