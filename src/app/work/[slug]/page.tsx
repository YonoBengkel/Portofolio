import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  // The cover goes into openGraph explicitly. Next replaces the root's openGraph object
  // rather than merging into it, so a case study that set only a title and description
  // here was shared with no picture at all - every link sent to a recruiter over
  // WhatsApp or LinkedIn arrived as bare text.
  const cover = project.cover.src;
  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: project.cover.alt }],
    },
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
        {/*
          Name the work on the dark band, then show it on the slate one. The title used
          to sit alone above a screen and a half of nothing - the first project image was
          238px below the fold on a laptop - so the facts and the chain come after the
          evidence rather than before it.
        */}
        <header className="band-ink">
          <div className="frame pb-20 pt-36 sm:pt-44">
            <div className="column">
              <Link href="/work" className="pill">
                ← All work
              </Link>
              <p className="meta mt-8 opacity-70">
                {project.number} · {project.category} · {project.teamLabel}
              </p>
              <h1 className="display mt-4 text-[clamp(2.2rem,6.4vw,5rem)]">{project.title}</h1>
              <p className="lede mt-6 max-w-[38rem] opacity-80">{project.subtitle}</p>
              {/*
                The role is the first thing a recruiter looks for, so it is read on the first
                screen rather than in the facts card two screens down - measured at y = 1815
                on a laptop, after the title and the whole cover image. Only the role moves:
                the facts card stays after the picture, because the picture is what keeps
                the first screen from being a title over empty space.
              */}
              <p className="case-role mt-6 max-w-[38rem]">
                <span className="meta opacity-70">My role</span> {project.role}
              </p>
              <FlowChain steps={project.flow} />
            </div>
          </div>
        </header>

        <CoverFigure project={project} />

        <ProjectFacts project={project} />

        <div className="band">
          <div className="article-grid prose-body">
            <CaseStudyBody project={project} />
          </div>
        </div>

        <nav aria-label="Next case study" className="band band-ink">
          <div className="frame">
            <div className="column">
              <p className="meta opacity-70">Next</p>
              <Link
                href={`/work/${next.slug}`}
                className="display mt-4 block text-[clamp(2rem,6vw,4.4rem)] hover:text-yellow"
              >
                {next.cardTitle}
              </Link>
              <p className="lede mt-5 max-w-[34rem] opacity-80">{next.summary}</p>
            </div>
          </div>
        </nav>
      </article>
    </PageTransition>
  );
}
