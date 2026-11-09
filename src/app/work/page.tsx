import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { WorkIndex } from "@/components/work-index";
import { projects } from "@/content/projects";
import { otherWork } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description: "Every project in one list, with the case studies behind them.",
};

/**
 * One list, not two. This page used to open with a grid of case studies and then a
 * second section called "also worth a look", which is a judgement the reader never asked
 * for - the index now carries everything and each row says whether it leads anywhere.
 *
 * The grid of case-study cards under it went on 9 Nov 2026, Ilham's call: the cover that
 * floats beside the pointer (windex-preview.tsx) shows each one as you read the list.
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
