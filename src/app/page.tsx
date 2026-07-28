"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#EDE8F5" }}>
      <div className="h-8 w-8 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: "#7091E6", borderTopColor: "transparent" }} />
    </div>
  );
}
