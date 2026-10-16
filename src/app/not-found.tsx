import Link from "next/link";

/**
 * The one television.
 *
 * The TV is the central motif of Little Nightmares II and it would be a waste to spread
 * it thinly over the whole site, so it gets exactly one page: the one that means the
 * signal is gone. It is also the only page where scan lines cost nothing, because there
 * is nothing here anyone needs to read carefully.
 *
 * Static, never animated, and the lines sit behind the text rather than across it.
 */
export default function NotFound() {
  return (
    <div className="frame pb-28 pt-36 sm:pt-44">
      <div className="dead-channel">
        <span className="dead-snow" aria-hidden="true" />
        <p className="meta dead-label">No signal</p>
        <h1 className="display dead-title">Page not found</h1>
        <p className="dead-body">
          The link may be outdated. The case studies are still here.
        </p>
        <Link href="/work" className="btn btn-solid mt-8" transitionTypes={["nav-forward"]}>
          Go to the case studies
        </Link>
      </div>
    </div>
  );
}
