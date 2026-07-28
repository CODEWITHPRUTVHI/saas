"use client";

import { useState } from "react";
import { FileText, Plus, Download, RefreshCw, Calendar, Clock, Sparkles, BarChart3, Building2, Layers, CheckCircle2, X } from "lucide-react";

interface Report {
  id: string; name: string; type: string; brands: string[];
  dateRange: string; schedule: string | null; status: string;
  lastGenerated: string | null; outputUrl: string | null;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  EXECUTIVE_SUMMARY:   { label: "Executive Summary",  color: "#3D52A0", bg: "rgba(61,82,160,.10)" },
  CROSS_BRAND:         { label: "Cross-Brand",         color: "#7091E6", bg: "rgba(112,145,230,.10)" },
  PLATFORM_BREAKDOWN:  { label: "Platform Breakdown",  color: "#8697C4", bg: "rgba(134,151,196,.10)" },
  SINGLE_BRAND:        { label: "Single Brand",        color: "#ADBBDA", bg: "rgba(173,187,218,.15)" },
};

const DEMO_CSV = `Report,Brand,Platform,Views,Followers,Engagement
Q3 2026 Summary,HyperGrowth Tech AI,YouTube,48200,12400,4.2%
Q3 2026 Summary,HyperGrowth Tech AI,Instagram,29100,8700,5.1%
Q3 2026 Summary,HyperGrowth Tech AI,TikTok,112000,31200,8.7%`;

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    { id: "r-1", name: "Q3 2026 Executive Summary",       type: "EXECUTIVE_SUMMARY",  brands: ["All Brands"],           dateRange: "Jul 1 – Sep 30, 2026", schedule: null,                status: "READY",     lastGenerated: "2 hours ago", outputUrl: "#" },
    { id: "r-2", name: "HyperGrowth Platform Breakdown",  type: "PLATFORM_BREAKDOWN",  brands: ["HyperGrowth Tech AI"],  dateRange: "Last 30 days",          schedule: "Weekly (Mon 08:00)", status: "READY",     lastGenerated: "1 day ago",   outputUrl: "#" },
    { id: "r-3", name: "Cross-Brand Growth Comparison",   type: "CROSS_BRAND",         brands: ["All Brands"],           dateRange: "Last 90 days",          schedule: "Monthly",           status: "GENERATING",lastGenerated: null,          outputUrl: null },
    { id: "r-4", name: "NovaFit Campaign Analysis",       type: "SINGLE_BRAND",        brands: ["NovaFit Sports"],       dateRange: "Jun 15 – Jul 15, 2026", schedule: null,                status: "READY",     lastGenerated: "3 days ago",  outputUrl: "#" },
  ]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleDownload(name: string) {
    const blob = new Blob([DEMO_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleGenerate(id: string, name: string) {
    setIsGenerating(id);
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "GENERATING" } : r));
    setTimeout(() => {
      setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "READY", lastGenerated: "just now", outputUrl: "#" } : r));
      setIsGenerating(null);
      setMessage(`✓ "${name}" generated!`);
      setTimeout(() => setMessage(null), 4000);
    }, 2000);
  }

  function handleCreate() {
    if (!newReportName.trim()) return;
    setReports((prev) => [{ id: `r-new-${Date.now()}`, name: newReportName.trim(), type: "CROSS_BRAND", brands: ["All Brands"], dateRange: "Last 30 days", schedule: null, status: "PENDING", lastGenerated: null, outputUrl: null }, ...prev]);
    setNewReportName(""); setShowCreateModal(false);
    setMessage(`Report "${newReportName.trim()}" created!`);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="h-6 w-6" style={{ color: "#7091E6" }} />
            Reports
          </h1>
          <p className="page-subtitle">Scheduled executive reports, cross-brand comparisons, and platform breakdowns</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary self-start" style={{ fontSize: "0.82rem", padding: "9px 18px" }}>
          <Plus className="h-4 w-4" /> New Report
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <Sparkles className="h-4 w-4 shrink-0" />{message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reports",      value: reports.length },
          { label: "Ready to Export",    value: reports.filter((r) => r.status === "READY").length },
          { label: "Scheduled",          value: reports.filter((r) => r.schedule).length },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: "#3D52A0" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "#8697C4" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5" style={{ borderBottom: "1px solid #ADBBDA" }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Report Library</span>
        </div>
        <div>
          {reports.map((report) => {
            const tc = TYPE_CONFIG[report.type] ?? TYPE_CONFIG.EXECUTIVE_SUMMARY;
            return (
              <div key={report.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 transition"
                style={{ borderBottom: "1px solid #EDE8F5" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE8F5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-2.5 rounded-xl border shrink-0" style={{ background: tc.bg, borderColor: `${tc.color}30`, color: tc.color }}>
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm leading-tight" style={{ color: "#3D52A0" }}>{report.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: "#8697C4" }}>
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] border"
                        style={{ background: tc.bg, color: tc.color, borderColor: `${tc.color}30` }}>{tc.label}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{report.dateRange}</span>
                      {report.schedule && <span className="flex items-center gap-1" style={{ color: "#7091E6" }}><Clock className="h-3 w-3" />{report.schedule}</span>}
                      <span>{report.brands.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {report.lastGenerated && <span className="text-[11px]" style={{ color: "#8697C4" }}>Last: {report.lastGenerated}</span>}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    report.status === "READY" ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                    : report.status === "GENERATING" ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                    : "text-gray-500 border-gray-300 bg-gray-50"
                  }`}>{report.status}</span>
                  {report.status === "READY" && (
                    <button onClick={() => handleDownload(report.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                      style={{ background: "#EDE8F5", border: "1px solid #ADBBDA", color: "#3D52A0" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#3D52A0"; e.currentTarget.style.color = "#EDE8F5"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#EDE8F5"; e.currentTarget.style.color = "#3D52A0"; }}>
                      <Download className="h-3.5 w-3.5" /> Export CSV
                    </button>
                  )}
                  <button onClick={() => handleGenerate(report.id, report.name)}
                    disabled={isGenerating === report.id || report.status === "GENERATING"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
                    <RefreshCw className={`h-3.5 w-3.5 ${(isGenerating === report.id || report.status === "GENERATING") ? "animate-spin" : ""}`} />
                    {isGenerating === report.id || report.status === "GENERATING" ? "Generating..." : "Regenerate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(61,82,160,.2)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl p-7 space-y-5 shadow-2xl" style={{ background: "#fff", border: "1px solid #ADBBDA" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl" style={{ color: "#3D52A0" }}>Create New Report</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ color: "#8697C4" }}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>Report Name</label>
              <input autoFocus value={newReportName} onChange={(e) => setNewReportName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Q4 2026 Executive Summary" className="input" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={!newReportName.trim()} className="btn-primary flex-1 justify-center disabled:opacity-40">
                Create Report
              </button>
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary px-4">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
