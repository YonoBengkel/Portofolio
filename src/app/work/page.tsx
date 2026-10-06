import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { WorkIndex } from "@/components/work-index";
import { projects } from "@/content/projects";
import { otherWork } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Four case studies and the smaller projects behind them.",
};

export default function WorkPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Work"
        lede="Four case studies, each one a job someone actually had to do. The list stays with you while you read."
      />

      <WorkIndex projects={projects} />

      <section aria-labelledby="other-title" className="lit">
        <div className="column band">
          <h2 id="other-title" className="display text-[clamp(1.9rem,4.5vw,3rem)]">
            Also worth a look
          </h2>
          <ul className="mt-10">
            {otherWork.map((w) => (
              <li key={w.title} className="reveal recede-rule border-t border-concrete py-7 first:pt-0">
                <p className="meta">{w.meta}</p>
                <h3 className="mt-2 text-[1.15rem] font-semibold leading-snug">
                  {w.href ? (
                    <a href={w.href} target="_blank" rel="noopener noreferrer" className="link">
                      {w.title}
                    </a>
                  ) : (
                    w.title
                  )}
                </h3>
                <p className="mt-3 max-w-[34rem] leading-relaxed text-ash">{w.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10">
            <Link href="/about/competitions" className="link" transitionTypes={["nav-forward"]}>
              Competitions are listed separately
            </Link>
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
