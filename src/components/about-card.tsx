import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/images/portrait-bw.webp";
import { atAGlance, profile } from "@/content/site";

/**
 * The sticker.
 *
 * One white card on the paper, hard black border, solid offset shadow, the photograph
 * printed in a frame beside the text. This is the reference's "about me" card, and it
 * is the only place on the home page where the whole of who he is sits in one object.
 *
 * The portrait is hard monochrome because a colour photograph of a dim room reads as a
 * mistake on a cream page - both reference sites print theirs the same way.
 */
export function AboutCard() {
  return (
    <div className="sticker reveal grid gap-8 p-6 sm:p-10 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-12">
      <div className="photo self-start">
        <Image src={portrait} alt={profile.name} sizes="(min-width: 768px) 18rem, 70vw" placeholder="blur" />
      </div>

      <div>
        <h2 className="h-sec">About me</h2>
        <p className="lede mt-5 max-w-[42rem]">
          <b>{profile.name}</b> is an <b>Applied Data Science</b> student at{" "}
          <b>Politeknik Elektronika Negeri Surabaya</b> and an <b>AI Engineer intern</b> at Ideola, a digital
          marketing agency for SMEs. He maps how a business runs, organizes its data, and turns both into
          practical recommendations and tools.
        </p>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          {atAGlance.map((item) => (
            <div key={item.label}>
              <dt className="meta opacity-70">{item.label}</dt>
              <dd className="mt-1.5 leading-snug">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact" className="pill pill-solid" transitionTypes={["nav-forward"]}>
            Contact me
          </Link>
          <Link href="/cv" className="pill" transitionTypes={["nav-forward"]}>
            Download CV
          </Link>
        </div>
      </div>
    </div>
  );
}
