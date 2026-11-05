import { ImageResponse } from "next/og";

// The icon iPhones and iPads use when the site is added to the home screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const bar = { position: "absolute", width: 28, height: 90, top: 45, borderRadius: 7, background: "#ffffff" } as const;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0f1419" }}>
        <div style={{ ...bar, left: 48 }} />
        <div style={{ ...bar, left: 104 }} />
        <div style={{ position: "absolute", left: 68, top: 76, width: 44, height: 28, background: "#3fb4e6" }} />
      </div>
    ),
    size
  );
}
