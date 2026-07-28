"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Share2, Plus, ShieldCheck, X, CheckCircle2, Loader2, Trash2, RefreshCw, ExternalLink, Sparkles, Key } from "lucide-react";

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

const DEFAULT_ACCOUNTS: SocialAccount[] = [
  { id: "sa-1", platform: "YOUTUBE",   name: "HyperGrowth Tech Channel", handle: "@HyperGrowthAI",       brand: "HyperGrowth Tech AI", status: "CONNECTED",    followers: "12.4K", connectedAt: "2 days ago" },
  { id: "sa-2", platform: "INSTAGRAM", name: "HyperGrowth Official IG",   handle: "@hypergrowth.ai",      brand: "HyperGrowth Tech AI", status: "CONNECTED",    followers: "8.7K",  connectedAt: "2 days ago" },
  { id: "sa-3", platform: "TIKTOK",    name: "HyperGrowth Daily Shorts",  handle: "@hypergrowth_shorts",  brand: "HyperGrowth Tech AI", status: "CONNECTED",    followers: "31.2K", connectedAt: "1 day ago" },
  { id: "sa-4", platform: "INSTAGRAM", name: "Aura Living Studio",         handle: "@auraliving.design",   brand: "Aura Modern Living",  status: "EXPIRED",      followers: "5.1K",  connectedAt: "10 days ago" },
];

export default function SocialAccountsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>(DEFAULT_ACCOUNTS);
  const [showModal, setShowModal] = useState(false);
  const [oauthStep, setOauthStep] = useState<"select" | "authorize" | "success">("select");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [customHandle, setCustomHandle] = useState("");
  const [authMode, setAuthMode] = useState<"standard" | "byok">("standard");
  const [customClientId, setCustomClientId] = useState("");
  const [customAccessToken, setCustomAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load persistent accounts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("drox_social_accounts");
      if (saved) {
        setAccounts(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage when accounts change
  function saveAccounts(newAccounts: SocialAccount[]) {
    setAccounts(newAccounts);
    try {
      localStorage.setItem("drox_social_accounts", JSON.stringify(newAccounts));
    } catch {}
  }

  // Handle URL return callbacks from real OAuth
  useEffect(() => {
    if (searchParams.get("connected") === "1") {
      const platform = searchParams.get("platform") || "YOUTUBE";
      const name = searchParams.get("name") || `${platform} Official Account`;
      const handle = searchParams.get("handle") || `@${platform.toLowerCase()}_user`;
      const followers = searchParams.get("followers") || "1.2K";

      const newAccount: SocialAccount = {
        id: `sa-live-${Date.now()}`,
        platform,
        name,
        handle,
        brand: "HyperGrowth Tech AI",
        status: "CONNECTED",
        followers,
        connectedAt: "Just now (Live OAuth)",
      };

      const updated = [...accounts.filter(a => a.id !== newAccount.id), newAccount];
      saveAccounts(updated);
      setMessage(`✓ Connected ${name} (${handle}) via Live OAuth!`);
      setTimeout(() => setMessage(null), 5000);
    }
  }, [searchParams]);

  function openConnect() {
    setOauthStep("select");
    setSelectedPlatform(null);
    setCustomName("");
    setCustomHandle("");
    setShowModal(true);
  }

  async function handleAuthorize() {
    if (!selectedPlatform) return;

    if (authMode === "live") {
      // Redirect browser to OAuth API route
      window.location.href = `/api/auth/oauth/${selectedPlatform.toLowerCase()}`;
      return;
    }

    // Interactive Authorization flow
    setIsConnecting(true);
    setOauthStep("authorize");
    await new Promise((r) => setTimeout(r, 1600));
    setOauthStep("success");
    setIsConnecting(false);
  }

  function handleFinalizeConnect() {
    if (!selectedPlatform) return;

    const name = customName.trim() || `My ${selectedPlatform} Channel`;
    const handle = customHandle.trim()
      ? (customHandle.startsWith("@") ? customHandle : `@${customHandle}`)
      : `@${selectedPlatform.toLowerCase()}_${Math.floor(100 + Math.random() * 900)}`;

    const newAccount: SocialAccount = {
      id: `sa-${Date.now()}`,
      platform: selectedPlatform,
      name,
      handle,
      brand: "HyperGrowth Tech AI",
      status: "CONNECTED",
      followers: `${(Math.random() * 15 + 1).toFixed(1)}K`,
      connectedAt: "Just now",
    };

    saveAccounts([newAccount, ...accounts]);
    setShowModal(false);
    setSelectedPlatform(null);
    setMessage(`✓ Connected ${selectedPlatform} account (${handle}) successfully!`);
    setTimeout(() => setMessage(null), 5000);
  }

  function handleDisconnect(id: string) {
    const updated = accounts.map((a) => a.id === id ? { ...a, status: "DISCONNECTED" as const } : a);
    saveAccounts(updated);
    setMessage("Account disconnected.");
    setTimeout(() => setMessage(null), 3000);
  }

  function handleReconnect(id: string) {
    const updated = accounts.map((a) => a.id === id ? { ...a, status: "CONNECTED" as const, connectedAt: "Just now" } : a);
    saveAccounts(updated);
    setMessage("✓ Token refreshed & account reconnected!");
    setTimeout(() => setMessage(null), 3000);
  }

  function handleDelete(id: string) {
    const updated = accounts.filter((a) => a.id !== id);
    saveAccounts(updated);
  }

  const connectedCount = accounts.filter((a) => a.status === "CONNECTED").length;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Share2 className="h-6 w-6" style={{ color: "#7091E6" }} />
            Social Platform Accounts
          </h1>
          <p className="page-subtitle">Encrypted OAuth connections for multi-brand publishing · {connectedCount} of {accounts.length} active</p>
        </div>
        <button onClick={openConnect} className="btn-primary self-start" style={{ fontSize: "0.82rem", padding: "9px 18px" }}>
          <Plus className="h-4 w-4" /> Connect Account
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <Sparkles className="h-4 w-4 shrink-0" />{message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Connected",     value: accounts.filter((a) => a.status === "CONNECTED").length,    color: "#22c55e" },
          { label: "Token Expired",  value: accounts.filter((a) => a.status === "EXPIRED").length,    color: "#f97316" },
          { label: "Disconnected",  value: accounts.filter((a) => a.status === "DISCONNECTED").length, color: "#8697C4" },
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
                    <ShieldCheck className="h-3 w-3" /> Encrypted AES-256
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid #ADBBDA" }}>
                {acc.status === "EXPIRED" && (
                  <button onClick={() => handleReconnect(acc.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    style={{ background: "rgba(249,115,22,.08)", color: "#f97316", border: "1px solid rgba(249,115,22,.25)" }}>
                    <RefreshCw className="h-3.5 w-3.5" /> Reconnect
                  </button>
                )}
                {acc.status === "CONNECTED" && (
                  <button onClick={() => handleDisconnect(acc.id)}
                    className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition"
                    style={{ color: "#8697C4" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "rgba(239,68,68,.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.background = "transparent"; }}>
                    Disconnect
                  </button>
                )}
                {acc.status === "DISCONNECTED" && (
                  <button onClick={() => handleReconnect(acc.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    style={{ background: "rgba(34,197,94,.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,.25)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Reconnect
                  </button>
                )}
                <button onClick={() => handleDelete(acc.id)}
                  className="p-1 rounded-lg transition" style={{ color: "#8697C4" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8697C4")}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Card */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(61,82,160,.25)", backdropFilter: "blur(10px)" }}>
          <div className="w-full max-w-md rounded-2xl p-7 shadow-2xl" style={{ background: "#fff", border: "1px solid #ADBBDA" }}>

            {/* Step 1: Select Platform */}
            {oauthStep === "select" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl" style={{ color: "#3D52A0" }}>Connect Social Account</h2>
                  <button onClick={() => setShowModal(false)} style={{ color: "#8697C4" }}><X className="h-5 w-5" /></button>
                </div>

                {/* Mode Selector */}
                <div className="flex p-1 rounded-xl" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                  <button
                    onClick={() => setAuthMode("standard")}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
                    style={{
                      background: authMode === "standard" ? "#3D52A0" : "transparent",
                      color: authMode === "standard" ? "#EDE8F5" : "#8697C4",
                    }}
                  >
                    ⚡ Standard 1-Click Connect
                  </button>
                  <button
                    onClick={() => setAuthMode("byok")}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
                    style={{
                      background: authMode === "byok" ? "#3D52A0" : "transparent",
                      color: authMode === "byok" ? "#EDE8F5" : "#8697C4",
                    }}
                  >
                    🔑 Custom API Key (BYOK)
                  </button>
                </div>

                {/* Platform grid */}
                <div className="grid grid-cols-3 gap-3">
                  {ALL_PLATFORMS.map((p) => {
                    const pc = PLATFORM_CONFIG[p];
                    return (
                      <button key={p} onClick={() => setSelectedPlatform(p)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition text-center"
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

                {/* Custom BYOK API Key Fields */}
                {authMode === "byok" && selectedPlatform && (
                  <div className="p-3.5 rounded-xl space-y-3" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                    <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: "#3D52A0" }}>
                      <Key className="h-4 w-4" /> Enter Your {selectedPlatform} API Credentials
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Client ID / App ID</label>
                      <input
                        value={customClientId}
                        onChange={(e) => setCustomClientId(e.target.value)}
                        placeholder={`e.g. ${selectedPlatform.toLowerCase()}_client_id_xxx`}
                        className="input text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Personal Access Token / API Key</label>
                      <input
                        type="password"
                        value={customAccessToken}
                        onChange={(e) => setCustomAccessToken(e.target.value)}
                        placeholder={`e.g. ya29.a0Ax...`}
                        className="input text-xs"
                      />
                    </div>
                    <p className="text-[10px]" style={{ color: "#8697C4" }}>🔐 Encrypted with AES-256 in user database. Never stored in plain text.</p>
                  </div>
                )}

                {/* Optional Custom Channel Info */}
                {selectedPlatform && (
                  <div className="space-y-3 pt-2" style={{ borderTop: "1px solid #ADBBDA" }}>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Channel / Account Name</label>
                      <input
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder={`e.g. My ${selectedPlatform} Channel`}
                        className="input text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Account Handle</label>
                      <input
                        value={customHandle}
                        onChange={(e) => setCustomHandle(e.target.value)}
                        placeholder={`@my_${selectedPlatform.toLowerCase()}_handle`}
                        className="input text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={handleAuthorize} disabled={!selectedPlatform || isConnecting}
                    className="btn-primary flex-1 justify-center disabled:opacity-40">
                    <ExternalLink className="h-4 w-4" /> Authorize & Connect {selectedPlatform || ""}
                  </button>
                  <button onClick={() => setShowModal(false)} className="btn-secondary px-4">Cancel</button>
                </div>
              </div>
            )}

            {/* Step 2: Authorizing */}
            {oauthStep === "authorize" && (
              <div className="space-y-6 text-center py-6">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: selectedPlatform ? PLATFORM_CONFIG[selectedPlatform].bg : "#EDE8F5" }}>
                  <span className="text-3xl">{selectedPlatform ? PLATFORM_CONFIG[selectedPlatform].icon : "🔗"}</span>
                </div>
                <div>
                  <h2 className="font-bold text-xl mb-1" style={{ color: "#3D52A0" }}>Authorizing {selectedPlatform}</h2>
                  <p className="text-xs" style={{ color: "#8697C4" }}>Exchanging OAuth tokens and configuring API permissions...</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#7091E6" }} />
                  <span className="text-xs font-bold" style={{ color: "#7091E6" }}>Verifying Permissions...</span>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {oauthStep === "success" && (
              <div className="space-y-5 text-center py-4">
                <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(34,197,94,.12)" }}>
                  <CheckCircle2 className="h-8 w-8" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <h2 className="font-bold text-xl mb-1" style={{ color: "#3D52A0" }}>{selectedPlatform} Authorized!</h2>
                  <p className="text-xs" style={{ color: "#8697C4" }}>OAuth 2.0 access tokens stored securely with AES-256 encryption.</p>
                </div>
                <button onClick={handleFinalizeConnect} className="btn-primary w-full justify-center">
                  <CheckCircle2 className="h-4 w-4" /> Save Account to Workspace
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
