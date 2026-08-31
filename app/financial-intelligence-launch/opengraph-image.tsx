import { ImageResponse } from "next/og";

export const alt = "Entimema Financial Intelligence — evidence to decision architecture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#071725", color: "#f3efe6", fontFamily: "Georgia, serif" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Arial, sans-serif", fontSize: 18, letterSpacing: 3 }}><b>ENTIMEMA</b><span>09 · 09 · 2026</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}><span style={{ fontFamily: "Arial, sans-serif", fontSize: 16, letterSpacing: 2 }}>EVIDENCE</span><i style={{ width: 350, height: 1, background: "#a59b84" }} /><span style={{ border: "1px solid #a59b84", padding: "22px 30px", fontFamily: "Arial, sans-serif", letterSpacing: 2 }}>CONTROLLED WORKFLOW</span><i style={{ width: 150, height: 1, background: "#a59b84" }} /><span style={{ fontFamily: "Arial, sans-serif", fontSize: 16, letterSpacing: 2 }}>DECISION</span></div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 58, lineHeight: 1.06, maxWidth: 920 }}>From financial evidence to a decision you can defend.</div><div style={{ marginTop: 28, fontFamily: "Arial, sans-serif", fontSize: 18, color: "#c7c1b5" }}>FINANCIAL INTELLIGENCE · LAUNCHING 9 SEPTEMBER 2026</div></div>
  </div>, size);
}
