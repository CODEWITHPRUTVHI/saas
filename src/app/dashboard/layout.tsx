"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#EDE8F5" }}>
        <div className="h-8 w-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#7091E6", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#EDE8F5" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
