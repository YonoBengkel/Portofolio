import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { PageTransition } from "@/components/page-transition";
import { ProjectLedger } from "@/components/project-ledger";
import { projects } from "@/content/projects";
import { atAGlance, profile } from "@/content/site";

export default function Home() {
  // The CV link only appears once public/cv.pdf exists.
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cvPath));

  return (
    <PageTransition>
      <Hero hasCv={hasCv} />

      <section aria-label="At a glance" className="lit">
        <div className="column pb-24 sm:pb-32">
          <dl className="grid gap-7 sm:grid-cols-2">
            {atAGlance.map((item) => (
              <div key={item.label} className="reveal recede-rule border-t border-concrete pt-4">
                <dt className="meta">{item.label}</dt>
                <dd className="mt-2 leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="work" aria-labelledby="work-title" className="lit scroll-mt-28">
        <div className="column pb-10">
          <h2 id="work-title" className="display text-[clamp(2.4rem,6vw,4.4rem)]">
            My recent projects
          </h2>
          <p className="mt-5 max-w-[32rem] leading-relaxed text-ash">
            Each one starts from how a job is actually done, and ends in something a person can act on.
          </p>
        </div>
        <div className="column-wide pb-10">
          <ProjectLedger
            items={projects.map((p) => ({
              slug: p.slug,
              number: p.number,
              title: p.cardTitle,
              summary: p.summary,
              status: p.status,
              teamLabel: p.teamLabel,
              period: p.period,
              cover: { src: p.cover.src, alt: p.cover.alt },
            }))}
          />
        </div>
        <div className="column pt-6">
          <Link href="/work" className="link" transitionTypes={["nav-forward"]}>
            All work, including the smaller projects
          </Link>
        </div>
      </section>

      <section aria-label="Elsewhere on this site" className="lit">
        <div className="column band">
          <ul className="grid gap-4 text-[1.05rem]">
            <li>
              <Link href="/about" className="link" transitionTypes={["nav-forward"]}>
                How I work, where I study, and what I use
              </Link>
            </li>
            <li>
              <Link href="/about/competitions" className="link" transitionTypes={["nav-forward"]}>
                Data competitions I have entered
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link" transitionTypes={["nav-forward"]}>
                Get in touch
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}
