import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/site";

export const alt = `${profile.name}: business process, data, and applied AI`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og cannot read the site's woff2 fonts, so it gets two small static TTF instances
// of Plus Jakarta Sans (licence in src/assets/fonts/OFL.txt).
const fontDir = join(process.cwd(), "src/assets/fonts");
const extraBold = await readFile(join(fontDir, "PlusJakartaSans-ExtraBold.ttf"));
const medium = await readFile(join(fontDir, "PlusJakartaSans-Medium.ttf"));

// The hero drawing (process box, data store, decision). The decision carries the one accent.
const ROUTE = [
  "M40 40H400V250H40Z",
  "M400 145H560V174",
  "M450 200A110 26 0 1 0 670 200A110 26 0 1 0 450 200",
  "M450 200V420A110 26 0 0 0 670 420V200",
  "M670 330H760",
  "M760 330L910 180L1060 330L910 480Z",
];
const colors = { ground: "#0a0b0a", ink: "#d8d4c8", route: "#2a2e2a", lamp: "#e8b23c" };

// Social preview image shown when the site link is shared (LinkedIn, WhatsApp, etc.).
export default function OpengraphImage() {
  const [first, middle, last] = profile.name.split(" ");
  const width = 960;
  const height = Math.round((width * 530) / 1100);
  const nameSize = Math.round(width * 0.082);
  const word = {
    position: "absolute",
    fontSize: nameSize,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: -0.035 * nameSize,
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: colors.ground,
          color: colors.ink,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        <div style={{ position: "relative", display: "flex", width, height, marginTop: 30 }}>
          <svg width={width} height={height} viewBox="0 0 1100 530" style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 14 }, (_, k) => (
              <g
                key={k}
                transform={`translate(0 ${k * 3.2})`}
                opacity={1 - k * 0.066}
                fill="none"
                stroke={colors.route}
                strokeWidth={1.35}
                strokeLinejoin="round"
              >
                {ROUTE.map((d, i) => (
                  <path key={d} d={d} stroke={i === ROUTE.length - 1 ? colors.lamp : colors.route} />
                ))}
              </g>
            ))}
          </svg>
          <div style={{ ...word, left: -0.01 * width, top: 0.17 * height }}>{first}</div>
          <div style={{ ...word, left: 0, right: 0, top: 0.45 * height, display: "flex", justifyContent: "center" }}>
            {middle}
          </div>
          <div style={{ ...word, right: -0.01 * width, top: 0.73 * height }}>{last}</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            maxWidth: 860,
            textAlign: "center",
            fontSize: 27,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {profile.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plus Jakarta Sans", data: extraBold, weight: 800, style: "normal" },
        { name: "Plus Jakarta Sans", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
