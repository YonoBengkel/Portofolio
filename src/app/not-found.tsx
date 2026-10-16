import Link from "next/link";

export default function NotFound() {
  return (
    <div className="band-ink">
      <div className="frame pb-28 pt-40 sm:pt-48">
        <div className="column">
          <p className="meta opacity-70">404</p>
          <h1 className="display mt-5 text-[clamp(3rem,13vw,10rem)]">Not found</h1>
          <p className="lede mt-6 max-w-[34rem] opacity-80">
            The link may be outdated. The case studies are still here.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/work" className="pill pill-yellow" transitionTypes={["nav-forward"]}>
              See the work
            </Link>
            <Link href="/" className="pill" transitionTypes={["nav-back"]}>
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
