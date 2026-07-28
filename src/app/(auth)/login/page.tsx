"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // UX: slight delay feels real
      login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative orbs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #EDE8F5 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7091E6 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Card */}
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(173,187,218,0.4)",
            boxShadow: "0 32px 64px rgba(61,82,160,.25), 0 0 0 1px rgba(255,255,255,0.6) inset",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #3D52A0, #7091E6)" }}
            >
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-black text-[18px] tracking-tight leading-none" style={{ color: "#3D52A0" }}>DROX</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: "#8697C4" }}>Content OS</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-black leading-tight" style={{ color: "#3D52A0" }}>Welcome back</h1>
            <p className="text-sm mt-1.5" style={{ color: "#8697C4" }}>Sign in to your workspace to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm font-medium"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "#dc2626" }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                style={{
                  background: "#EDE8F5",
                  border: "1.5px solid #ADBBDA",
                  color: "#3D52A0",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#7091E6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(112,145,230,.15)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "#ADBBDA"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>
                  Password
                </label>
                <a href="#" className="text-xs font-semibold hover:underline" style={{ color: "#7091E6" }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    background: "#EDE8F5",
                    border: "1.5px solid #ADBBDA",
                    color: "#3D52A0",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#7091E6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(112,145,230,.15)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "#ADBBDA"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition"
                  style={{ color: "#8697C4" }}
                >
                  {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="h-5 w-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0"
                style={{
                  background: remember ? "#7091E6" : "transparent",
                  borderColor: remember ? "#7091E6" : "#ADBBDA",
                }}
              >
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-sm" style={{ color: "#8697C4" }}>Remember me for 30 days</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all mt-2"
              style={{
                background: "linear-gradient(135deg, #3D52A0, #7091E6)",
                boxShadow: "0 4px 16px rgba(61,82,160,.35)",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 24px rgba(61,82,160,.50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,82,160,.35)"; }}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "#ADBBDA" }} />
            <span className="text-xs font-medium" style={{ color: "#8697C4" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "#ADBBDA" }} />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            onClick={() => { login("demo@drox.io", "demo123"); router.push("/dashboard"); }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{
              background: "#ffffff",
              borderColor: "#ADBBDA",
              color: "#3D52A0",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#EDE8F5"; e.currentTarget.style.borderColor = "#7091E6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "#ADBBDA"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: "#8697C4" }}>
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: "#3D52A0" }}>
              Create one free
            </Link>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-xs mt-5 font-medium text-white/60">
          Trusted by 500+ content teams worldwide · SOC 2 Compliant
        </p>
      </div>
    </div>
  );
}
