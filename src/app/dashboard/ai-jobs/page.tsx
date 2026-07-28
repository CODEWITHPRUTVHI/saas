"use client";

import { useState } from "react";
import { Cpu, CheckCircle2, Zap, FileCode, Filter } from "lucide-react";

const JOB_TYPES = ["ALL", "SEO_METADATA", "TRANSLATION", "SUBTITLE", "REPURPOSE", "THUMBNAIL"];

const JOB_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SEO_METADATA: { label: "SEO Metadata",  color: "#3D52A0", bg: "rgba(61,82,160,.10)" },
  TRANSLATION:  { label: "Translation",   color: "#7091E6", bg: "rgba(112,145,230,.10)" },
  SUBTITLE:     { label: "Subtitle",      color: "#8697C4", bg: "rgba(134,151,196,.10)" },
  REPURPOSE:    { label: "Repurpose",     color: "#ADBBDA", bg: "rgba(173,187,218,.15)" },
  THUMBNAIL:    { label: "Thumbnail",     color: "#3D52A0", bg: "rgba(61,82,160,.08)" },
};

const DEMO_JOBS = [
  { id: "job-1", type: "SEO_METADATA", brand: "HyperGrowth Tech AI", status: "COMPLETED", costCredits: 2, durationMs: 420,  timestamp: "10 mins ago" },
  { id: "job-2", type: "TRANSLATION",  brand: "HyperGrowth Tech AI", status: "COMPLETED", costCredits: 4, durationMs: 680,  timestamp: "25 mins ago" },
  { id: "job-3", type: "SUBTITLE",     brand: "Aura Modern Living",  status: "COMPLETED", costCredits: 3, durationMs: 910,  timestamp: "1 hour ago" },
  { id: "job-4", type: "SEO_METADATA", brand: "HyperGrowth Tech AI", status: "COMPLETED", costCredits: 2, durationMs: 380,  timestamp: "2 hours ago" },
  { id: "job-5", type: "REPURPOSE",    brand: "NovaFit Sports",      status: "COMPLETED", costCredits: 5, durationMs: 4200, timestamp: "3 hours ago" },
  { id: "job-6", type: "THUMBNAIL",    brand: "Zenith Finance",      status: "COMPLETED", costCredits: 3, durationMs: 1100, timestamp: "4 hours ago" },
  { id: "job-7", type: "SEO_METADATA", brand: "Aura Modern Living",  status: "COMPLETED", costCredits: 2, durationMs: 510,  timestamp: "5 hours ago" },
];

export default function AiJobsPage() {
  const [filterType, setFilterType] = useState("ALL");
  const [creditBalance] = useState(9_982);

  const filtered = filterType === "ALL" ? DEMO_JOBS : DEMO_JOBS.filter((j) => j.type === filterType);
  const totalSpent = DEMO_JOBS.reduce((s, j) => s + j.costCredits, 0);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Cpu className="h-6 w-6" style={{ color: "#7091E6" }} />
            AI Job History
          </h1>
          <p className="page-subtitle">Centralized log of credit consumption, execution status, and LLM outputs</p>
        </div>
        <div className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <Zap className="h-4 w-4" style={{ color: "#7091E6" }} />
          {creditBalance.toLocaleString()} Credits Available
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Jobs This Week",    value: DEMO_JOBS.length },
          { label: "Credits Used",      value: totalSpent },
          { label: "Success Rate",      value: "100%" },
          { label: "Avg. Duration",     value: `${Math.round(DEMO_JOBS.reduce((s, j) => s + j.durationMs, 0) / DEMO_JOBS.length)}ms` },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: "#3D52A0" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "#8697C4" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl w-fit" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
        <Filter className="h-3.5 w-3.5 ml-1" style={{ color: "#8697C4" }} />
        {JOB_TYPES.map((t) => (
          <button key={t} onClick={() => setFilterType(t)}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition"
            style={{ background: filterType === t ? "#3D52A0" : "transparent", color: filterType === t ? "#EDE8F5" : "#8697C4" }}>
            {t === "ALL" ? "All" : JOB_TYPE_CONFIG[t]?.label || t}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="card overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid #ADBBDA" }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>
            Execution Log ({filtered.length} jobs)
          </span>
        </div>
        <div>
          {filtered.map((job) => {
            const tc = JOB_TYPE_CONFIG[job.type] ?? JOB_TYPE_CONFIG.SEO_METADATA;
            return (
              <div key={job.id}
                className="p-5 flex items-center justify-between transition"
                style={{ borderBottom: "1px solid #EDE8F5" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE8F5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl" style={{ background: tc.bg }}>
                    <FileCode className="h-5 w-5" style={{ color: tc.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold" style={{ color: "#3D52A0" }}>{tc.label} Job</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: tc.bg, color: tc.color }}>{job.type}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>
                      {job.brand} · {job.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right text-xs">
                    <div className="font-semibold" style={{ color: "#7091E6" }}>{job.costCredits} Credits</div>
                    <div className="font-mono mt-0.5" style={{ color: "#8697C4" }}>{job.durationMs}ms</div>
                  </div>
                  <span className="badge badge-success"><CheckCircle2 className="h-3 w-3" /> {job.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
