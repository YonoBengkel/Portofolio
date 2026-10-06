import type { Metadata } from "next";
import { EntryList } from "@/components/entry-list";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { competitions } from "@/content/site";

export const metadata: Metadata = {
  title: "Competitions",
  description: "National and inter-university data competitions, all as team entries.",
};

export default function CompetitionsPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Competitions"
        lede="Every entry here was a team entry that reached the participant stage. No placements are claimed."
        back={{ href: "/about", label: "Back to about" }}
      />
      <section className="lit">
        <div className="column pb-24">
          <EntryList
            entries={competitions.map((c) => ({
              title: c.name,
              org: c.org,
              meta: c.year,
              body: c.body,
            }))}
          />
        </div>
      </section>
    </PageTransition>
  );
}
