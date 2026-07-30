import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DROX — Multi-Brand Enterprise AI Content OS",
  description: "Autonomous folder monitoring, AI metadata generation, smart queueing, and multi-platform social publishing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#EDE8F5] text-[#3D52A0] selection:bg-[#7091E6]/30 selection:text-[#3D52A0]">
        {children}
      </body>
    </html>
  );
}
