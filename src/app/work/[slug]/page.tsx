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
      {/* Marks this page as a different room: the wall behind it is tile, not concrete. */}
      <div className="study-room" hidden />
      <article>
        {/*
          Name the work, then show it. The title used to sit alone above a screen and a
          half of nothing - the first project image was 238px below the fold on a laptop
          and 550px below it on a phone - which is the wrong order for a reader who came
          here for depth. The facts and the chain now come after the evidence, not before.
        */}
        <header className="lit">
          <div className="column pb-10 pt-28 sm:pt-32">
            <Link href="/work" className="meta link-quiet hover:text-bone" transitionTypes={["nav-back"]}>
              All work
            </Link>
            <p className="meta mt-7">
              {project.number} {project.category}
            </p>
            <ViewTransition name={`study-${project.slug}`} share="study-title" default="none">
              <h1 className="display mt-3 text-[clamp(2.1rem,4.8vw,3.6rem)]">{project.title}</h1>
            </ViewTransition>
            <p className="mt-5 max-w-[36rem] text-[1.08rem] leading-relaxed">{project.subtitle}</p>
          </div>
        </header>

        <CoverFigure project={project} />

        <div className="lit">
          <div className="column pb-4">
            <FlowChain steps={project.flow} />
          </div>
        </div>

        <ProjectFacts project={project} />

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
