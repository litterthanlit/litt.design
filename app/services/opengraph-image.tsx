import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { POSITIONING } from "@/data/packages";

export const alt = `Services at litt.design. ${POSITIONING}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");

export default async function Image() {
  const [regular, medium] = await Promise.all([
    readFile(join(FONTS, "Geist-Regular.ttf")),
    readFile(join(FONTS, "Geist-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "52px 76px 72px 86px",
          background: "#EFEAE4",
          fontFamily: "Geist",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 64 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#5F5A53" }}>litt.design · services</div>
          <div style={{ fontSize: 50, fontWeight: 500, lineHeight: 1.15, letterSpacing: -1, color: "#141414" }}>
            {POSITIONING}
          </div>
          <div style={{ fontSize: 22, letterSpacing: 3, color: "#5F5A53" }}>Book a 15-min call</div>
        </div>
        <div
          style={{
            width: 360,
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            backgroundImage: "linear-gradient(155deg, #141414 0%, #6F4C3D 45%, #D9C9BC 100%)",
          }}
        >
          <svg width="201" height="275" viewBox="282 172 252 344">
            <path
              d="M312 172h62v256c0 25 10 36 34 36h33v52h-46c-75 0-113-36-113-109V172Zm160 0h62v344h-62z"
              fill="#F6F2ED"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: medium, weight: 500 },
      ],
    },
  );
}
