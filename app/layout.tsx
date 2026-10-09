import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Base World",
  description: "A fast, stylized 3D open world for the Base ecosystem. Quests, protocol districts and AI agents, all simulated in-game.",
};

export const viewport: Viewport = {
  themeColor: "#0052ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050b24", color: "#dce8ff", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
