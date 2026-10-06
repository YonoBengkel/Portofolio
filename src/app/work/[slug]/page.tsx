import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CaseStudyBody, CoverFigure, ProjectFacts } from "@/components/case-study";
import { FlowChain } from "@/components/flow-chain";
import { PageTransition } from "@/components/page-transition";
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
    <PageTransition>
      <article>
        {/* The page opens in the dark: name the work, say what it is, show the shape of it. */}
        <header className="lit">
          <div className="column pb-12 pt-32 sm:pt-40">
            <Link href="/work" className="meta link-quiet hover:text-bone" transitionTypes={["nav-back"]}>
              All work
            </Link>
            <p className="meta mt-8">
              {project.number} {project.category}
            </p>
            <ViewTransition name={`study-${project.slug}`} share="study-title" default="none">
              <h1 className="display mt-3 text-[clamp(2.3rem,5.6vw,4.4rem)]">{project.title}</h1>
            </ViewTransition>
            <p className="mt-6 max-w-[34rem] text-[1.1rem] leading-relaxed">{project.subtitle}</p>
            <FlowChain steps={project.flow} />
          </div>
        </header>

        <ProjectFacts project={project} />

        <CoverFigure project={project} />

        <div className="lit">
          <div className="article-grid prose-body pb-24">
            <CaseStudyBody project={project} />
          </div>
        </div>

        <nav aria-label="Next case study" className="lit">
          <div className="column border-t border-concrete py-16">
            <p className="meta">Next</p>
            <Link
              href={`/work/${next.slug}`}
              className="link-quiet display mt-3 block text-[clamp(1.9rem,4.4vw,3.2rem)]"
              transitionTypes={["nav-forward"]}
            >
              {next.cardTitle}
            </Link>
            <p className="mt-4 max-w-[32rem] leading-relaxed text-ash">{next.summary}</p>
          </div>
        </nav>
      </article>
    </PageTransition>
  );
}
