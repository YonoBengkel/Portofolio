import { Dossier } from "@/components/dossier";
import { Hero } from "@/components/hero";
import { PageTransition } from "@/components/page-transition";
import { WorkPreview } from "@/components/work-preview";
import { projects } from "@/content/projects";

/**
 * Three bands, in this order: the room, then who I am, then two of the four projects
 * with a door to the rest. Introduction before evidence, because whoever arrives here
 * already holds the CV and is deciding whether to go deeper, not whether to look at all.
 */
export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Dossier />
      <WorkPreview projects={projects.slice(0, 2)} />
    </PageTransition>
  );
}
