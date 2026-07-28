"use client";

import { useState } from "react";
import { FolderKanban, Film, Layers, Plus, Search, Upload, X, CheckCircle2 } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  brand: string;
  mimeType: string;
  duration: string;
  aspectRatio: string;
  size: string;
  variantsCount: number;
  status: "INGESTED" | "PROCESSING" | "PENDING";
}

export default function AssetsDamPage() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: "asset-1", name: "ai_agent_architecture_v1.mp4",  brand: "HyperGrowth Tech AI", mimeType: "video/mp4", duration: "03:00", aspectRatio: "16:9", size: "89.4 MB", variantsCount: 3, status: "INGESTED" },
    { id: "asset-2", name: "master_product_demo_8829.mp4",  brand: "HyperGrowth Tech AI", mimeType: "video/mp4", duration: "02:25", aspectRatio: "16:9", size: "45.2 MB", variantsCount: 3, status: "INGESTED" },
    { id: "asset-3", name: "aura_home_tour_episode8.mp4",   brand: "Aura Modern Living",  mimeType: "video/mp4", duration: "04:12", aspectRatio: "16:9", size: "112.6 MB", variantsCount: 2, status: "INGESTED" },
  ]);

  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadBrand, setUploadBrand] = useState("HyperGrowth Tech AI");
  const [message, setMessage] = useState<string | null>(null);

  const filtered = assets.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.brand.toLowerCase().includes(search.toLowerCase()));

  function handleUpload() {
    if (!uploadName.trim()) return;
    const name = uploadName.trim().endsWith(".mp4") ? uploadName.trim() : uploadName.trim() + ".mp4";
    setAssets((prev) => [...prev, {
      id: `asset-${Date.now()}`,
      name,
      brand: uploadBrand,
      mimeType: "video/mp4",
      duration: "00:00",
      aspectRatio: "16:9",
      size: "—",
      variantsCount: 0,
      status: "PENDING",
    }]);
    setShowUploadModal(false);
    setUploadName("");
    setMessage(`✓ Asset "${name}" uploaded and queued for processing.`);
    setTimeout(() => setMessage(null), 4000);
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FolderKanban className="h-6 w-6" style={{ color: "#7091E6" }} />
            Asset Library
          </h1>
          <p className="page-subtitle">Master media files and platform-specific derived variants</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary self-start" style={{ fontSize: "0.82rem", padding: "9px 18px" }}>
          <Upload className="h-4 w-4" /> Upload Asset
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <CheckCircle2 className="h-4 w-4" />{message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Assets",    value: assets.length },
          { label: "Total Variants",  value: assets.reduce((s, a) => s + a.variantsCount, 0) },
          { label: "Storage Used",    value: "247 MB" },
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets..." className="input pl-10" />
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((asset) => (
          <div key={asset.id} className="card p-6 space-y-4 card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ background: "rgba(112,145,230,.12)" }}>
                  <Film className="h-6 w-6" style={{ color: "#7091E6" }} />
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: "#3D52A0" }}>{asset.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>{asset.brand}</p>
                </div>
              </div>
              <span className={`badge ${asset.status === "INGESTED" ? "badge-success" : asset.status === "PROCESSING" ? "badge-info" : "badge-neutral"}`}>
                {asset.status}
              </span>
            </div>

            <div className="p-4 rounded-xl grid grid-cols-3 gap-2 text-center text-xs" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
              {[
                { label: "Duration", value: asset.duration },
                { label: "File Size", value: asset.size },
                { label: "Variants",  value: `${asset.variantsCount} Generated` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="block" style={{ color: "#8697C4" }}>{label}</span>
                  <span className="font-bold" style={{ color: "#3D52A0" }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: "1px solid #ADBBDA" }}>
              <span className="flex items-center gap-1.5 font-medium" style={{ color: "#7091E6" }}>
                <Layers className="h-3.5 w-3.5" /> YouTube (16:9), Instagram (9:16), TikTok (9:16)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(61,82,160,.2)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl p-7 space-y-5 shadow-2xl" style={{ background: "#fff", border: "1px solid #ADBBDA" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl" style={{ color: "#3D52A0" }}>Upload Asset</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ color: "#8697C4" }}><X className="h-5 w-5" /></button>
            </div>
            <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: "#ADBBDA", background: "#EDE8F5" }}>
              <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "#8697C4" }} />
              <p className="text-sm font-semibold" style={{ color: "#3D52A0" }}>Drop video file here</p>
              <p className="text-xs mt-1" style={{ color: "#8697C4" }}>MP4, MOV, AVI up to 2GB</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>File Name</label>
              <input value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="my_video.mp4" className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Brand</label>
              <input value={uploadBrand} onChange={(e) => setUploadBrand(e.target.value)} className="input" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpload} disabled={!uploadName.trim()} className="btn-primary flex-1 justify-center disabled:opacity-40">
                <Upload className="h-4 w-4" /> Upload & Process
              </button>
              <button onClick={() => setShowUploadModal(false)} className="btn-secondary px-4">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
