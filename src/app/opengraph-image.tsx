import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mamy mimo davu · Video program";
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
          alignItems: "center",
          justifyContent: "center",
          background: "#fffbfb",
          color: "#111111",
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 999,
            background: "#fdd7d7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          MMD
        </div>
        <div style={{ marginTop: 32, fontSize: 56, fontWeight: 700 }}>Mamy mimo davu</div>
        <div style={{ marginTop: 12, fontSize: 28, color: "#666666" }}>Online video program</div>
      </div>
    ),
    size,
  );
}
