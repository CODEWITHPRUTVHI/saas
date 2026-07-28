"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";

const STRENGTH_LEVELS = [
  { label: "Too short", color: "#ef4444", width: "20%" },
  { label: "Weak",      color: "#f97316", width: "40%" },
  { label: "Fair",      color: "#eab308", width: "60%" },
  { label: "Good",      color: "#22c55e", width: "80%" },
  { label: "Strong",    color: "#16a34a", width: "100%" },
];

function getStrength(p: string): number {
  if (p.length < 6) return 0;
  let s = 1;
  if (p.length >= 10)         s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

export default function SignupPage() {
  const router = useRouter();
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [brand,     setBrand]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const strength = getStrength(password);
  const strengthInfo = STRENGTH_LEVELS[strength];

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm)      return setError("Passwords don't match.");
    if (password.length < 6)      return setError("Password must be at least 6 characters.");
    if (!agreed)                  return setError("Please accept the terms to continue.");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      login(email, password, name, brand || "My Brand");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "#EDE8F5",
    border: "1.5px solid #ADBBDA",
    color: "#3D52A0",
  };

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#7091E6";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(112,145,230,.15)";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#ADBBDA";
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #EDE8F5 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7091E6 0%, transparent 70%)" }} />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl" style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(173,187,218,0.4)",
          boxShadow: "0 32px 64px rgba(61,82,160,.25), 0 0 0 1px rgba(255,255,255,0.6) inset",
        }}>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #3D52A0, #7091E6)" }}>
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-black text-[18px] tracking-tight leading-none" style={{ color: "#3D52A0" }}>DROX</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: "#8697C4" }}>Content OS</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-black leading-tight" style={{ color: "#3D52A0" }}>Start for free</h1>
            <p className="text-sm mt-1.5" style={{ color: "#8697C4" }}>Create your workspace — no credit card required</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4 text-sm font-medium"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "#dc2626" }}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Brand row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>Full name</label>
                <input
                  type="text" required autoComplete="name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>Brand / Company</label>
                <input
                  type="text"
                  value={brand} onChange={(e) => setBrand(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>Work email</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium outline-none transition-all"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#8697C4" }}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#ADBBDA" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: strengthInfo.width, background: strengthInfo.color }} />
                  </div>
                  <p className="text-[11px] font-semibold" style={{ color: strengthInfo.color }}>
                    {strengthInfo.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8697C4" }}>Confirm password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Same as above"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    ...inputStyle,
                    borderColor: confirm && password !== confirm ? "#ef4444" : "#ADBBDA",
                  }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                {confirm && password === confirm && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#22c55e" }} />
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <button type="button" onClick={() => setAgreed((v) => !v)}
                className="h-5 w-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0 mt-0.5"
                style={{ background: agreed ? "#7091E6" : "transparent", borderColor: agreed ? "#7091E6" : "#ADBBDA" }}>
                {agreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-xs leading-relaxed" style={{ color: "#8697C4" }}>
                I agree to DROX's{" "}
                <a href="#" className="font-semibold hover:underline" style={{ color: "#3D52A0" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="font-semibold hover:underline" style={{ color: "#3D52A0" }}>Privacy Policy</a>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all mt-1"
              style={{
                background: "linear-gradient(135deg, #3D52A0, #7091E6)",
                boxShadow: "0 4px 16px rgba(61,82,160,.35)",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 24px rgba(61,82,160,.50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,82,160,.35)"; }}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating workspace...</> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#8697C4" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "#3D52A0" }}>Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs mt-5 font-medium text-white/60">
          14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  );
}
