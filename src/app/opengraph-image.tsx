import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/site";

export const alt = `${profile.name}: business process, data, and applied AI`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og cannot read the site's woff2 files, so it gets static TTF copies of the same
// two faces the site uses (licences in src/assets/fonts/OFL.txt).
const fontDir = join(process.cwd(), "src/assets/fonts");
const serif = await readFile(join(fontDir, "Newsreader-Regular.ttf"));
const sans = await readFile(join(fontDir, "Archivo-Regular.ttf"));

const colors = { void: "#0c131d", soot: "#142638", concrete: "#2b4962", ink: "#d9d5c8", ash: "#92acc4" };

// The mark: a decision diamond cut open by a vertical slot that reads as an I.
const MARK = "M 128 26 L 230 128 L 128 230 L 26 128 Z M 110 63 L 146 63 L 146 187 L 110 187 Z";

/**
 * The link preview. It used to draw the hero flowchart, which the site no longer has, so
 * it now shows what the site shows: the mark, the name, and one line about the work, on
 * the page colour with a single band of light behind it.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 84px",
          background: colors.void,
          color: colors.ink,
          fontFamily: "Archivo",
        }}
      >
        {/* The one pool of light, behind the name rather than everywhere. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 110,
            width: 1200,
            height: 430,
            background: `radial-gradient(44% 58% at 34% 50%, ${colors.concrete}, transparent 72%)`,
            opacity: 0.5,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 34 }}>
          <svg width={44} height={44} viewBox="0 0 256 256">
            <path d={MARK} fill={colors.ink} fillRule="evenodd" />
          </svg>
          <div style={{ fontSize: 23, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.ash }}>
            {profile.label}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Newsreader",
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: "-0.025em",
          }}
        >
          {profile.name}
        </div>

        <div
          style={{ display: "flex", marginTop: 34, maxWidth: 820, fontSize: 28, lineHeight: 1.45, color: colors.ash }}
        >
          {profile.tagline}
        </div>

        {/* The floor line, so the frame holds a room rather than a void. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 92,
            background: `linear-gradient(to top, ${colors.soot}, transparent)`,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, weight: 400, style: "normal" },
        { name: "Archivo", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
