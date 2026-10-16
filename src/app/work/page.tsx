import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { WorkGrid } from "@/components/work-grid";
import { WorkIndex } from "@/components/work-index";
import { projects } from "@/content/projects";
import { otherWork } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Every project in one list, with the case studies behind them.",
};

/**
 * One list, not two. This page used to open with a grid of case studies and then a
 * second section called "also worth a look", which is a judgement the reader never asked
 * for - the index now carries everything and each row says whether it leads anywhere.
 */
export default function WorkPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Work"
        lede="Everything in one list. A row that is a link opens the whole thing: the problem, the decisions, and the screens."
      />

      <section className="band" aria-labelledby="index-h">
        <div className="frame">
          <div className="pwide">
            <h2 id="index-h" className="h-sec reveal">
              Contents
            </h2>
            <div className="draw rule mt-6" />
            <div className="mt-10">
              <WorkIndex projects={projects} other={otherWork} />
            </div>
          </div>
        </div>
      </section>

      {/* Ink, not slate: the reference puts its own project grid on #5A6F84 and this
          site's slate is #4A5A6B. Same reason as the home page. */}
      <section className="band band-ink" aria-labelledby="studies-h">
        <div className="frame">
          <div className="pwide">
            <h2 id="studies-h" className="h-sec rise">
              The case studies
            </h2>
            <div className="draw rule mt-6" />
            <div className="mt-14">
              <WorkGrid projects={projects} />
            </div>
            <div className="mt-14 flex flex-wrap gap-3">
              <Link href="/about/competitions" className="pill pill-yellow">
                Competitions
              </Link>
              <Link href="/about/activities" className="pill">
                Organisations &amp; committees
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
