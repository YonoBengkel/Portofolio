import Link from "next/link";

export default function NotFound() {
  return (
    <div className="frame pb-28 pt-36 sm:pt-44">
      <h1 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">This page does not exist</h1>
      <p className="mt-4 text-lg text-graphite">The link may be outdated. The case studies are on the home page.</p>
      <Link href="/#work" className="btn btn-solid mt-8">
        Back to my work
      </Link>
    </div>
  );
}
