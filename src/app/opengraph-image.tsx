import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE, SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${APP_NAME} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(circle at 12% 18%, rgba(45,212,191,0.28), transparent 42%), radial-gradient(circle at 88% 12%, rgba(96,165,250,0.22), transparent 40%), #070A0D",
          color: "#E8EEF4",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#2DD4BF",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#2DD4BF",
            }}
          />
          {APP_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2 }}>
            {APP_TAGLINE}
          </div>
          <div style={{ fontSize: 28, color: "#93A0AE", maxWidth: 820 }}>
            {SITE.tagline}. Parse. Interview. Evaluate. Decide.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#5B6570" }}>
          Series A quality · Gemini-powered · Memory-first demo
        </div>
      </div>
    ),
    { ...size }
  );
}
