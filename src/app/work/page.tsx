import type { Metadata } from "next";
import Link from "next/link";
import { Marquee } from "@/components/marquee";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { WorkGrid } from "@/components/work-grid";
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
        lede="Four case studies, each one a job someone actually had to do. Every card opens the whole thing: the problem, the decisions, and the screens."
      />

      {/* Ink, not slate: the reference puts its own project grid on #5A6F84 and this
          site's slate is #4A5A6B. Same reason as the home page. */}
      <section className="band band-ink" aria-labelledby="studies-h">
        <div className="frame">
          <div className="column">
            <h2 id="studies-h" className="sr-only">
              Case studies
            </h2>
            <WorkGrid projects={projects} />
          </div>
        </div>
      </section>

      <Marquee text="Also worth a look" />

      <section className="band" aria-labelledby="other-h">
        <div className="frame">
          <div className="column">
            <h2 id="other-h" className="h-sec reveal">
              Also worth a look
            </h2>
            <p className="lede reveal mt-5 max-w-[38rem] opacity-80">
              Smaller pieces and coursework. They are here because they are real, not because they are
              finished.
            </p>

            <ol className="mt-12 grid gap-5">
              {otherWork.map((w, i) => (
                <li key={w.title} className="sticker entry reveal">
                  <p className="entry-n">{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <p className="meta opacity-70">{w.meta}</p>
                    <h3 className="work-title mt-1.5">
                      {w.href ? (
                        <a href={w.href} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4 hover:decoration-yellow">
                          {w.title} ↗
                        </a>
                      ) : (
                        w.title
                      )}
                    </h3>
                    <p className="mt-4 leading-relaxed">{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/about/competitions" className="pill pill-solid" transitionTypes={["nav-forward"]}>
                Competitions
              </Link>
              <Link href="/about/activities" className="pill" transitionTypes={["nav-forward"]}>
                Organisations &amp; volunteering
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
