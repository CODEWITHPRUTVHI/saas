import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Content Distribution OS | Multi-Brand Enterprise Automation",
  description: "Autonomous folder monitoring, AI metadata generation, smart queueing, and multi-platform social publishing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen" style={{ background: "#EDE8F5", color: "#3D52A0" }}>
        {children}
      </body>
    </html>
  );
}
