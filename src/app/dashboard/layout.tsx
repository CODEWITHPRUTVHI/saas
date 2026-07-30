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
      <div className="min-h-screen flex items-center justify-center bg-[#EDE8F5]">
        <div className="h-8 w-8 rounded-full border-2 border-[#3D52A0] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EDE8F5]">
      {/* Left Sidebar with Social Accounts */}
      <Sidebar />

      {/* Right: Header + Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Metricool-style dark top nav */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-7 bg-[#EDE8F5]">
          {children}
        </main>
      </div>
    </div>
  );
}
