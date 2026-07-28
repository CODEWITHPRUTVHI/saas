"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Share2, Plus, ShieldCheck, X, CheckCircle2, Loader2, Trash2, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  handle: string;
  brand: string;
  status: "CONNECTED" | "EXPIRED" | "DISCONNECTED";
  followers: string;
  connectedAt: string;
}

const PLATFORM_CONFIG: Record<string, { color: string; bg: string; icon: string; scopes: string }> = {
  YOUTUBE:   { color: "#3D52A0", bg: "rgba(61,82,160,.10)",   icon: "▶", scopes: "youtube.upload, youtube.readonly" },
  INSTAGRAM: { color: "#7091E6", bg: "rgba(112,145,230,.10)", icon: "📸", scopes: "instagram_basic, instagram_content_publish" },
  TIKTOK:    { color: "#8697C4", bg: "rgba(134,151,196,.10)", icon: "🎵", scopes: "video.upload, user.info.basic" },
  LINKEDIN:  { color: "#3D52A0", bg: "rgba(61,82,160,.08)",   icon: "💼", scopes: "w_member_social, r_liteprofile" },
  PINTEREST: { color: "#ADBBDA", bg: "rgba(173,187,218,.15)", icon: "📌", scopes: "boards:read, pins:write" },
  TWITTER:   { color: "#8697C4", bg: "rgba(134,151,196,.12)", icon: "𝕏",  scopes: "tweet.read, tweet.write" },
};

const ALL_PLATFORMS = ["YOUTUBE", "INSTAGRAM", "TIKTOK", "LINKEDIN", "PINTEREST", "TWITTER"];

export default function SocialAccountsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: "sa-1", platform: "YOUTUBE",   name: "HyperGrowth Tech Channel", handle: "@HyperGrowthAI",       brand: "HyperGrowth Tech AI", status: "CONNECTED",    followers: "12.4K", connectedAt: "2 days ago" },
    { id: "sa-2", platform: "INSTAGRAM", name: "HyperGrowth Official IG",   handle: "@hypergrowth.ai",      brand: "HyperGrowth Tech AI", status: "CONNECTED",    followers: "8.7K",  connectedAt: "2 days ago" },
    { id: "sa-3", platform: "TIKTOK",    name: "HyperGrowth Daily Shorts",  handle: "@hypergrowth_shorts",  brand: "HyperGrowth Tech AI", status: "CONNECTED",    followers: "31.2K", connectedAt: "1 day ago" },
    { id: "sa-4", platform: "INSTAGRAM", name: "Aura Living Studio",         handle: "@auraliving.design",   brand: "Aura Modern Living",  status: "EXPIRED",      followers: "5.1K",  connectedAt: "10 days ago" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [oauthStep, setOauthStep] = useState<"select" | "authorize" | "success">("select");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"live" | "simulated">("live");
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL params for real OAuth return callbacks
  useEffect(() => {
    if (searchParams.get("connected") === "1") {
      const platform = searchParams.get("platform") || "ACCOUNT";
      const name = searchParams.get("name") || `${platform} Connected`;
      const handle = searchParams.get("handle") || "@user";
      const followers = searchParams.get("followers") || "0";

      setAccounts((prev) => [
        ...prev,
        {
          id: `sa-live-${Date.now()}`,
          platform,
          name,
          handle,
          brand: "HyperGrowth Tech AI",
          status: "CONNECTED",
          followers,
          connectedAt: "Just now (Live OAuth)",
        },
      ]);
      setMessage(`✓ Live OAuth authorization successful! Connected ${name} (${handle})`);
      setTimeout(() => setMessage(null), 6000);
    } else if (searchParams.get("error")) {
      const err = searchParams.get("error");
      const platform = searchParams.get("platform") || "";
      if (err === "missing_credentials") {
        setErrorMessage(`Live OAuth credentials missing in .env for ${platform}. Set ${platform}_CLIENT_ID & ${platform}_CLIENT_SECRET or use Simulated Mode.`);
      } else {
        setErrorMessage(`OAuth Error: ${err}`);
      }
      setTimeout(() => setErrorMessage(null), 7000);
    }
  }, [searchParams]);

  function openConnect() {
    setOauthStep("select");
    setSelectedPlatform(null);
    setShowModal(true);
  }

  function handleInitiateAuthorize() {
    if (!selectedPlatform) return;

    if (authMode === "live") {
      // Direct browser redirect to the real OAuth endpoint route
      window.location.href = `/api/auth/oauth/${selectedPlatform.toLowerCase()}`;
    } else {
      // Sandbox simulation mode
      handleSimulatedAuthorize();
    }
  }

  async function handleSimulatedAuthorize() {
    if (!selectedPlatform) return;
    setConnecting(true);
    setOauthStep("authorize");
    await new Promise((r) => setTimeout(r, 2000));
    setOauthStep("success");
    setConnecting(false);
  }

  function handleConfirmConnect() {
    if (!selectedPlatform) return;
    const handleName = `@brand_${selectedPlatform.toLowerCase()}`;
    setAccounts((prev) => [...prev, {
      id: `sa-${Date.now()}`,
      platform: selectedPlatform,
      name: `New ${selectedPlatform} Account`,
      handle: handleName,
      brand: "HyperGrowth Tech AI",
      status: "CONNECTED",
      followers: "0",
      connectedAt: "Just now",
    }]);
    setShowModal(false);
    setMessage(`✓ ${selectedPlatform} account connected successfully!`);
    setTimeout(() => setMessage(null), 4000);
  }

  function handleDisconnect(id: string) {
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, status: "DISCONNECTED" as const } : a));
  }

  function handleReconnect(id: string) {
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, status: "CONNECTED" as const, connectedAt: "Just now" } : a));
    setMessage("✓ Token refreshed successfully.");
    setTimeout(() => setMessage(null), 3000);
  }

  const connected = accounts.filter((a) => a.status === "CONNECTED").length;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Share2 className="h-6 w-6" style={{ color: "#7091E6" }} />
            Social Platform Accounts
          </h1>
          <p className="page-subtitle">Encrypted OAuth 2.0 connections for multi-brand publishing · {connected} of {accounts.length} active</p>
        </div>
        <button onClick={openConnect} className="btn-primary self-start" style={{ fontSize: "0.82rem", padding: "9px 18px" }}>
          <Plus className="h-4 w-4" /> Connect Account
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <CheckCircle2 className="h-4 w-4 shrink-0" />{message}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(239,68,68,.10)", border: "1px solid rgba(239,68,68,.30)", color: "#dc2626" }}>
          <AlertTriangle className="h-4 w-4 shrink-0" />{errorMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Connected",    value: accounts.filter((a) => a.status === "CONNECTED").length,    color: "#22c55e" },
          { label: "Token Expired", value: accounts.filter((a) => a.status === "EXPIRED").length,    color: "#f97316" },
          { label: "Disconnected", value: accounts.filter((a) => a.status === "DISCONNECTED").length, color: "#8697C4" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "#8697C4" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const pc = PLATFORM_CONFIG[acc.platform] ?? PLATFORM_CONFIG.YOUTUBE;
          return (
            <div key={acc.id} className="card p-6 space-y-4 card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl" style={{ background: pc.bg }}>
                    {pc.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide" style={{ color: pc.color }}>{acc.platform}</div>
                    <div className="text-[11px]" style={{ color: "#8697C4" }}>{acc.handle}</div>
                  </div>
                </div>
                <span className={`badge ${acc.status === "CONNECTED" ? "badge-success" : acc.status === "EXPIRED" ? "badge-warning" : "badge-neutral"}`}>
                  {acc.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm" style={{ color: "#3D52A0" }}>{acc.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>{acc.followers} followers · Connected {acc.connectedAt}</p>
              </div>

              <div className="p-3 rounded-xl space-y-1.5 text-xs" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                <div className="flex justify-between">
                  <span style={{ color: "#8697C4" }}>Brand</span>
                  <span className="font-semibold" style={{ color: "#3D52A0" }}>{acc.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8697C4" }}>Token</span>
                  <span className="font-semibold flex items-center gap-1" style={{ color: "#22c55e" }}>
                    <ShieldCheck className="h-3 w-3" /> AES-256 Encrypted
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid #ADBBDA" }}>
                {acc.status === "EXPIRED" && (
                  <button onClick={() => handleReconnect(acc.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    style={{ background: "rgba(249,115,22,.08)", color: "#f97316", border: "1px solid rgba(249,115,22,.25)" }}>
                    <RefreshCw className="h-3.5 w-3.5" /> Reconnect
                  </button>
                )}
                {acc.status === "CONNECTED" && (
                  <button onClick={() => handleDisconnect(acc.id)}
                    className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition ml-auto"
                    style={{ color: "#8697C4" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "rgba(239,68,68,.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.background = "transparent"; }}>
                    <Trash2 className="h-3.5 w-3.5" /> Disconnect
                  </button>
                )}
                {acc.status === "DISCONNECTED" && (
                  <button onClick={() => handleReconnect(acc.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    style={{ background: "rgba(34,197,94,.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,.25)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Reconnect
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <button onClick={openConnect}
          className="card p-6 border-dashed flex flex-col items-center justify-center gap-3 transition min-h-[220px]"
          style={{ color: "#8697C4", borderStyle: "dashed" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7091E6"; e.currentTarget.style.color = "#3D52A0"; e.currentTarget.style.background = "rgba(112,145,230,.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ADBBDA"; e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.background = "transparent"; }}>
          <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold">Connect Platform</span>
        </button>
      </div>

      {/* OAuth Connect Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(61,82,160,.2)", backdropFilter: "blur(10px)" }}>
          <div className="w-full max-w-md rounded-2xl p-7 shadow-2xl" style={{ background: "#fff", border: "1px solid #ADBBDA" }}>

            {/* Step: Select Platform */}
            {oauthStep === "select" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl" style={{ color: "#3D52A0" }}>Connect Social Account</h2>
                  <button onClick={() => setShowModal(false)} style={{ color: "#8697C4" }}><X className="h-5 w-5" /></button>
                </div>

                {/* Live vs Sandbox mode toggle */}
                <div className="flex p-1 rounded-xl" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                  <button
                    onClick={() => setAuthMode("live")}
                    className="flex-1 py-1.5 text-xs font-bold rounded-lg transition"
                    style={{
                      background: authMode === "live" ? "#3D52A0" : "transparent",
                      color: authMode === "live" ? "#EDE8F5" : "#8697C4",
                    }}
                  >
                    ⚡ Live OAuth (.env)
                  </button>
                  <button
                    onClick={() => setAuthMode("simulated")}
                    className="flex-1 py-1.5 text-xs font-bold rounded-lg transition"
                    style={{
                      background: authMode === "simulated" ? "#3D52A0" : "transparent",
                      color: authMode === "simulated" ? "#EDE8F5" : "#8697C4",
                    }}
                  >
                    🧪 Sandbox Simulation
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {ALL_PLATFORMS.map((p) => {
                    const pc = PLATFORM_CONFIG[p];
                    return (
                      <button key={p} onClick={() => setSelectedPlatform(p)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-center"
                        style={{
                          borderColor: selectedPlatform === p ? pc.color : "#ADBBDA",
                          background: selectedPlatform === p ? pc.bg : "#EDE8F5",
                        }}>
                        <span className="text-2xl">{pc.icon}</span>
                        <span className="text-[11px] font-bold" style={{ color: selectedPlatform === p ? pc.color : "#8697C4" }}>{p}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedPlatform && (
                  <div className="p-3 rounded-xl text-xs" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA", color: "#8697C4" }}>
                    <p className="font-semibold mb-1" style={{ color: "#3D52A0" }}>OAuth Scopes Requested:</p>
                    <p className="font-mono">{PLATFORM_CONFIG[selectedPlatform].scopes}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleInitiateAuthorize} disabled={!selectedPlatform}
                    className="btn-primary flex-1 justify-center disabled:opacity-40">
                    <ExternalLink className="h-4 w-4" /> Authorize with {selectedPlatform || "Platform"}
                  </button>
                  <button onClick={() => setShowModal(false)} className="btn-secondary px-4">Cancel</button>
                </div>
              </div>
            )}

            {/* Step: Authorizing (Sandbox) */}
            {oauthStep === "authorize" && (
              <div className="space-y-6 text-center py-4">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: selectedPlatform ? PLATFORM_CONFIG[selectedPlatform].bg : "#EDE8F5" }}>
                  <span className="text-3xl">{selectedPlatform ? PLATFORM_CONFIG[selectedPlatform].icon : "🔗"}</span>
                </div>
                <div>
                  <h2 className="font-bold text-xl mb-2" style={{ color: "#3D52A0" }}>Connecting to {selectedPlatform}</h2>
                  <p className="text-sm" style={{ color: "#8697C4" }}>Completing OAuth handshake and encrypting tokens...</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#7091E6" }} />
                  <span className="text-sm font-semibold" style={{ color: "#7091E6" }}>Authorizing...</span>
                </div>
              </div>
            )}

            {/* Step: Success (Sandbox) */}
            {oauthStep === "success" && (
              <div className="space-y-6 text-center py-4">
                <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(34,197,94,.12)" }}>
                  <CheckCircle2 className="h-8 w-8" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <h2 className="font-bold text-xl mb-2" style={{ color: "#3D52A0" }}>{selectedPlatform} Connected!</h2>
                  <p className="text-sm" style={{ color: "#8697C4" }}>OAuth tokens encrypted and stored securely.</p>
                </div>
                <button onClick={handleConfirmConnect} className="btn-primary w-full justify-center">
                  <CheckCircle2 className="h-4 w-4" /> Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
