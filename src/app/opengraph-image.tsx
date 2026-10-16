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
const display = await readFile(join(fontDir, "Anton-Regular.ttf"));
const sans = await readFile(join(fontDir, "Archivo-Regular.ttf"));

const colors = { paper: "#fbefd8", paper2: "#fff8ec", ink: "#241206", ink2: "#5c4631", yellow: "#f2b705" };

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
          background: colors.paper,
          color: colors.ink,
          fontFamily: "Archivo",
        }}
      >
        {/* One soft wash of the accent behind the name. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 110,
            width: 1200,
            height: 430,
            background: `radial-gradient(42% 56% at 32% 50%, ${colors.yellow}, transparent 72%)`,
            opacity: 0.28,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 34 }}>
          <svg width={44} height={44} viewBox="0 0 256 256">
            <path d={MARK} fill={colors.ink} fillRule="evenodd" />
          </svg>
          <div style={{ fontSize: 23, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.ink2 }}>
            {profile.label}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Anton",
            fontSize: 112,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          {profile.name}
        </div>

        <div
          style={{ display: "flex", marginTop: 34, maxWidth: 820, fontSize: 28, lineHeight: 1.45, color: colors.ink2 }}
        >
          {profile.tagline}
        </div>

        {/* A dark band at the foot, the same one the page ends on. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 92,
            background: colors.ink,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: display, weight: 400, style: "normal" },
        { name: "Archivo", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
