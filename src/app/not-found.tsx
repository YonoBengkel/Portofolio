import Link from "next/link";

export default function NotFound() {
  return (
    <div className="frame pb-28 pt-36 sm:pt-44">
      <h1 className="big-word mb-0 text-[clamp(3rem,9vw,8rem)]">
        Page not found<span className="stop">.</span>
      </h1>
      <p className="mt-10 max-w-[36rem] text-lg leading-relaxed text-graphite">
        The link may be outdated. The case studies are on the home page.
      </p>
      <Link href="/#work" className="btn btn-solid mt-8">
        Go to the case studies
      </Link>
    </div>
  );
}
