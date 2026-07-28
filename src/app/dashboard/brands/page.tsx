"use client";

import { useState } from "react";
import { Building2, Plus, Search, Copy, Sparkles, ExternalLink } from "lucide-react";

interface Brand {
  id: string; name: string; primaryColor: string; secondaryColor: string;
  postsPublished: number; socialAccounts: number; contentItems: number;
  isActive: boolean; isDuplicate: boolean; voice: string; platforms: string[];
}

const DEMO_BRANDS: Brand[] = [
  { id: "b-1", name: "HyperGrowth Tech AI",    primaryColor: "#3D52A0", secondaryColor: "#7091E6", postsPublished: 142, socialAccounts: 3, contentItems: 48, isActive: true,  isDuplicate: false, voice: "Futuristic, energetic, data-driven", platforms: ["YOUTUBE", "INSTAGRAM", "TIKTOK"] },
  { id: "b-2", name: "Aura Modern Living",      primaryColor: "#8697C4", secondaryColor: "#ADBBDA", postsPublished: 87,  socialAccounts: 2, contentItems: 29, isActive: true,  isDuplicate: false, voice: "Minimalist, serene, elegant",        platforms: ["INSTAGRAM", "PINTEREST"] },
  { id: "b-3", name: "Zenith Finance Academy",  primaryColor: "#5a6fc0", secondaryColor: "#8697C4", postsPublished: 63,  socialAccounts: 3, contentItems: 22, isActive: true,  isDuplicate: false, voice: "Authoritative, educational, trustworthy", platforms: ["YOUTUBE", "LINKEDIN"] },
  { id: "b-4", name: "NovaFit Sports",          primaryColor: "#7091E6", secondaryColor: "#3D52A0", postsPublished: 211, socialAccounts: 4, contentItems: 71, isActive: true,  isDuplicate: false, voice: "High-energy, motivational, bold",    platforms: ["INSTAGRAM", "TIKTOK", "YOUTUBE"] },
  { id: "b-5", name: "CraftBrew Collective",    primaryColor: "#ADBBDA", secondaryColor: "#8697C4", postsPublished: 54,  socialAccounts: 2, contentItems: 18, isActive: false, isDuplicate: false, voice: "Artisanal, warm, community-driven",  platforms: ["FACEBOOK", "INSTAGRAM"] },
  { id: "b-6", name: "UrbanLens Photography",   primaryColor: "#8697C4", secondaryColor: "#7091E6", postsPublished: 129, socialAccounts: 3, contentItems: 44, isActive: true,  isDuplicate: false, voice: "Visual-first, creative, storytelling", platforms: ["INSTAGRAM", "YOUTUBE"] },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(DEMO_BRANDS);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  function handleDuplicate(brand: Brand) {
    setDuplicatingId(brand.id);
    setTimeout(() => {
      setBrands((prev) => [...prev, { ...brand, id: `b-dup-${Date.now()}`, name: `${brand.name} (Copy)`, isDuplicate: true, postsPublished: 0, contentItems: 0 }]);
      setDuplicatingId(null);
      setMessage(`Brand "${brand.name}" duplicated!`);
      setTimeout(() => setMessage(null), 3000);
    }, 700);
  }

  function handleCreate() {
    if (!newBrandName.trim()) return;
    setBrands((prev) => [{
      id: `b-new-${Date.now()}`, name: newBrandName.trim(),
      primaryColor: "#3D52A0", secondaryColor: "#7091E6",
      postsPublished: 0, socialAccounts: 0, contentItems: 0,
      isActive: true, isDuplicate: false,
      voice: "Professional, engaging, concise.", platforms: [],
    }, ...prev]);
    setNewBrandName("");
    setShowCreateModal(false);
    setMessage(`Brand "${newBrandName.trim()}" created!`);
    setTimeout(() => setMessage(null), 3000);
  }

  function handleToggleActive(id: string) {
    setBrands((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b));
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Building2 className="h-6 w-6" style={{ color: "#7091E6" }} />
            Brand Management
          </h1>
          <p className="page-subtitle">Create, duplicate, and manage all brand identities across the platform</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary self-start" style={{ fontSize: "0.82rem", padding: "9px 18px" }}>
          <Plus className="h-4 w-4" /> New Brand
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <Sparkles className="h-4 w-4" />{message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Brands",       value: brands.length },
          { label: "Active",             value: brands.filter((b) => b.isActive).length },
          { label: "Posts Published",    value: brands.reduce((s, b) => s + b.postsPublished, 0).toLocaleString() },
          { label: "Paused",             value: brands.filter((b) => !b.isActive).length },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: "#3D52A0" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "#8697C4" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#8697C4" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands..." className="input pl-10" />
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((brand) => (
          <div key={brand.id} className="card p-5 card-hover space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})` }}>
                  {brand.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight" style={{ color: "#3D52A0" }}>
                    {brand.name}
                    {brand.isDuplicate && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: "#EDE8F5", color: "#8697C4", border: "1px solid #ADBBDA" }}>COPY</span>}
                  </h3>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#8697C4" }}>{brand.voice}</p>
                </div>
              </div>
              <span className={`badge ${brand.isActive ? "badge-success" : "badge-neutral"}`}>
                {brand.isActive ? "ACTIVE" : "PAUSED"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { label: "Posts",    value: brand.postsPublished },
                { label: "Accounts", value: brand.socialAccounts },
                { label: "Content",  value: brand.contentItems },
              ].map(({ label, value }) => (
                <div key={label} className="p-2.5 rounded-xl" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                  <div className="font-bold text-base" style={{ color: "#3D52A0" }}>{value}</div>
                  <div style={{ color: "#8697C4" }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {brand.platforms.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: "rgba(61,82,160,.08)", color: "#3D52A0", border: "1px solid rgba(61,82,160,.20)" }}>{p}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid #ADBBDA" }}>
              <button onClick={() => handleDuplicate(brand)} disabled={duplicatingId === brand.id}
                className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition disabled:opacity-50"
                style={{ color: "#8697C4" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#3D52A0"; e.currentTarget.style.background = "#EDE8F5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.background = "transparent"; }}>
                {duplicatingId === brand.id ? <span className="h-3.5 w-3.5 border-2 border-t-transparent rounded-full animate-spin inline-block" style={{ borderColor: "#7091E6", borderTopColor: "transparent" }} /> : <Copy className="h-3.5 w-3.5" />}
                Duplicate
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleActive(brand.id)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition font-medium"
                  style={{
                    color: brand.isActive ? "#f97316" : "#22c55e",
                    borderColor: brand.isActive ? "rgba(249,115,22,.30)" : "rgba(34,197,94,.30)",
                    background: brand.isActive ? "rgba(249,115,22,.06)" : "rgba(34,197,94,.06)",
                  }}>
                  {brand.isActive ? "Pause" : "Activate"}
                </button>
                <button className="p-1.5 rounded-lg transition" style={{ color: "#8697C4" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#3D52A0"; e.currentTarget.style.background = "#EDE8F5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.background = "transparent"; }}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button onClick={() => setShowCreateModal(true)}
          className="card p-5 flex flex-col items-center justify-center gap-3 transition min-h-[220px]"
          style={{ borderStyle: "dashed", color: "#8697C4" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7091E6"; e.currentTarget.style.color = "#3D52A0"; e.currentTarget.style.background = "rgba(112,145,230,.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ADBBDA"; e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.background = "transparent"; }}>
          <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold">Add New Brand</span>
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(61,82,160,.2)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl p-7 space-y-5 shadow-2xl" style={{ background: "#fff", border: "1px solid #ADBBDA" }}>
            <h2 className="font-bold text-xl" style={{ color: "#3D52A0" }}>Create New Brand</h2>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Brand Name</label>
              <input autoFocus value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. TechVision Labs" className="input" />
            </div>
            <p className="text-xs" style={{ color: "#8697C4" }}>A default Approval Workflow and Brand Kit will be created automatically.</p>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={!newBrandName.trim()} className="btn-primary flex-1 justify-center disabled:opacity-40">Create Brand</button>
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary px-4">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
