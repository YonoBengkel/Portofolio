import { ImageResponse } from "next/og";
import { profile } from "@/content/site";

export const alt = `${profile.name}: business process, data, and applied AI`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social preview image shown when the site link is shared (LinkedIn, WhatsApp, etc.).
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
          padding: "80px",
          background: "#001f5f",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#b9c7e6" }}>
          Portfolio · case studies
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>{profile.name}</div>
        <div style={{ width: 120, height: 8, background: "#ffffff", borderRadius: 4, marginTop: 36 }} />
        <div style={{ fontSize: 34, marginTop: 36, color: "#dfe6f3", maxWidth: 980, lineHeight: 1.35 }}>
          {profile.tagline}
        </div>
      </div>
    ),
    size,
  );
}
