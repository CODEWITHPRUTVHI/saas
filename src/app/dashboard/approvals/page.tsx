"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, Clock, Sparkles, RefreshCw, User, FileText } from "lucide-react";
import { STAGE_CONFIG, APPROVAL_STAGES, getAvailableTransitions, type ApprovalStage } from "@/lib/rbac/approval-workflow";

interface ApprovalItem {
  id: string; title: string; brand: string; stage: ApprovalStage;
  submittedBy: string; submittedAt: string; platform: string;
}

const DEMO_ITEMS: ApprovalItem[] = [
  { id: "ci-1", title: "Building Enterprise AI Content OS Pipelines [2026 Blueprint]",    brand: "HyperGrowth Tech AI", stage: "EDITOR_REVIEW",   submittedBy: "Jordan Lee",  submittedAt: "2 hours ago",  platform: "YOUTUBE" },
  { id: "ci-2", title: "Reels Cut: Turn 1 Raw Video into 5 Platform Cuts",                brand: "HyperGrowth Tech AI", stage: "MANAGER_REVIEW",  submittedBy: "Sam Chen",    submittedAt: "5 hours ago",  platform: "INSTAGRAM" },
  { id: "ci-3", title: "Q3 Performance Report Visual Summary",                            brand: "Zenith Finance",      stage: "SUBMITTED",        submittedBy: "Priya Nair",  submittedAt: "1 day ago",    platform: "LINKEDIN" },
  { id: "ci-4", title: "NovaFit Summer Campaign – Workout Series Ep1",                   brand: "NovaFit Sports",      stage: "OWNER_APPROVED",   submittedBy: "Alex Wright", submittedAt: "3 hours ago",  platform: "TIKTOK" },
  { id: "ci-5", title: "Aura Minimalist Home Tour – Episode 8",                          brand: "Aura Modern Living",  stage: "EDITOR_REVIEW",    submittedBy: "Maya Torres", submittedAt: "30 mins ago",  platform: "YOUTUBE" },
];

const STAGE_ORDER: ApprovalStage[] = ["SUBMITTED", "EDITOR_REVIEW", "MANAGER_REVIEW", "OWNER_APPROVED", "PUBLISHED", "REJECTED"];

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: "#3D52A0", INSTAGRAM: "#7091E6", TIKTOK: "#8697C4", LINKEDIN: "#ADBBDA",
};

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>(DEMO_ITEMS);
  const [selectedStage, setSelectedStage] = useState<ApprovalStage | "ALL">("ALL");
  const [isAdvancing, setIsAdvancing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const displayItems = selectedStage === "ALL" ? items : items.filter((i) => i.stage === selectedStage);

  async function handleAdvance(item: ApprovalItem, toStage: ApprovalStage) {
    setIsAdvancing(item.id);
    try {
      await fetch("/api/approvals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contentItemId: item.id, toStage, userId: "current-user" }) });
    } catch {}
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, stage: toStage } : i));
    setIsAdvancing(null);
    setMessage(`"${item.title.slice(0, 40)}..." advanced to ${STAGE_CONFIG[toStage].label}`);
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleReject(item: ApprovalItem) {
    setIsAdvancing(item.id);
    try {
      await fetch("/api/approvals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contentItemId: item.id, toStage: "REJECTED", userId: "current-user", rejectionReason }) });
    } catch {}
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, stage: "REJECTED" } : i));
    setRejectingId(null);
    setRejectionReason("");
    setIsAdvancing(null);
    setMessage(`"${item.title.slice(0, 40)}..." rejected.`);
    setTimeout(() => setMessage(null), 4000);
  }

  const stageCounts = STAGE_ORDER.reduce((acc, s) => { acc[s] = items.filter((i) => i.stage === s).length; return acc; }, {} as Record<ApprovalStage, number>);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6" style={{ color: "#7091E6" }} />
          Approval Workflow
        </h1>
        <p className="page-subtitle">Multi-stage content review: Draft → Editor → Manager → Owner → Published</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "rgba(112,145,230,.12)", border: "1px solid rgba(112,145,230,.30)", color: "#3D52A0" }}>
          <Sparkles className="h-4 w-4 shrink-0" />{message}
        </div>
      )}

      {/* Pipeline Visualizer */}
      <div className="card p-5">
        <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#8697C4" }}>Approval Pipeline</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["SUBMITTED", "EDITOR_REVIEW", "MANAGER_REVIEW", "OWNER_APPROVED", "PUBLISHED"] as ApprovalStage[]).map((stage, i, arr) => (
            <div key={stage} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedStage(selectedStage === stage ? "ALL" : stage)}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition min-w-[110px]"
                style={{
                  borderColor: selectedStage === stage ? "#3D52A0" : "#ADBBDA",
                  background: selectedStage === stage ? "rgba(61,82,160,.08)" : "#EDE8F5",
                }}>
                <div className="h-2 w-2 rounded-full" style={{ background: STAGE_CONFIG[stage].dotColor ?? "#3D52A0" }} />
                <span className="text-xs font-semibold" style={{ color: selectedStage === stage ? "#3D52A0" : "#8697C4" }}>
                  {STAGE_CONFIG[stage].label}
                </span>
                <span className="text-base font-bold" style={{ color: stageCounts[stage] > 0 ? "#3D52A0" : "#ADBBDA" }}>
                  {stageCounts[stage]}
                </span>
              </button>
              {i < arr.length - 1 && <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "#ADBBDA" }} />}
            </div>
          ))}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-4 w-px" style={{ background: "#ADBBDA" }} />
            <button
              onClick={() => setSelectedStage(selectedStage === "REJECTED" ? "ALL" : "REJECTED")}
              className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition min-w-[90px]"
              style={{
                borderColor: selectedStage === "REJECTED" ? "#dc2626" : "#ADBBDA",
                background: selectedStage === "REJECTED" ? "rgba(220,38,38,.05)" : "#EDE8F5",
              }}>
              <XCircle className="h-3 w-3" style={{ color: "#dc2626" }} />
              <span className="text-xs font-semibold" style={{ color: "#8697C4" }}>Rejected</span>
              <span className="text-base font-bold" style={{ color: "#ADBBDA" }}>{stageCounts["REJECTED"] ?? 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid #ADBBDA" }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8697C4" }}>
            Review Queue ({displayItems.filter(i => i.stage !== "PUBLISHED" && i.stage !== "REJECTED").length} pending)
          </span>
          {selectedStage !== "ALL" && (
            <button onClick={() => setSelectedStage("ALL")} className="text-xs font-semibold hover:underline" style={{ color: "#7091E6" }}>Show All</button>
          )}
        </div>

        <div>
          {displayItems.length === 0 && (
            <div className="p-10 text-center" style={{ color: "#ADBBDA" }}>
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No items at this stage</p>
            </div>
          )}
          {displayItems.map((item) => {
            const stageConf = STAGE_CONFIG[item.stage];
            const transitions = getAvailableTransitions(item.stage).filter((t) => t.to !== "REJECTED");
            const canReject = getAvailableTransitions(item.stage).some((t) => t.to === "REJECTED");
            const platColor = PLATFORM_COLORS[item.platform] ?? "#3D52A0";

            return (
              <div key={item.id} className="p-5 transition" style={{ borderBottom: "1px solid #EDE8F5" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE8F5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg shrink-0" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                      <FileText className="h-4 w-4" style={{ color: "#8697C4" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: "#3D52A0" }}>{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs" style={{ color: "#8697C4" }}>
                        <span className="font-medium" style={{ color: "#3D52A0" }}>{item.brand}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded font-semibold text-[10px]"
                          style={{ background: `${platColor}15`, color: platColor, border: `1px solid ${platColor}30` }}>
                          {item.platform}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{item.submittedBy}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                      style={{ background: `${stageConf.dotColor ?? "#3D52A0"}15`, color: "#3D52A0", borderColor: `${stageConf.dotColor ?? "#3D52A0"}30` }}>
                      {stageConf.label}
                    </span>

                    {item.stage !== "PUBLISHED" && item.stage !== "REJECTED" && (
                      <>
                        {transitions.map((t) => (
                          <button key={t.to} onClick={() => handleAdvance(item, t.to)} disabled={isAdvancing === item.id}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                            style={{ background: "rgba(34,197,94,.10)", border: "1px solid rgba(34,197,94,.30)", color: "#16a34a" }}>
                            {isAdvancing === item.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {t.actionLabel}
                          </button>
                        ))}
                        {canReject && (
                          <button onClick={() => setRejectingId(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                            style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.25)", color: "#dc2626" }}>
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {rejectingId === item.id && (
                  <div className="mt-4 p-4 rounded-xl space-y-3" style={{ background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.20)" }}>
                    <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>Rejection reason (optional):</p>
                    <input autoFocus value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Caption exceeds character limit" className="input" style={{ borderColor: "#f87171" }} />
                    <div className="flex gap-3">
                      <button onClick={() => handleReject(item)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition"
                        style={{ background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.30)", color: "#dc2626" }}>
                        Confirm Reject
                      </button>
                      <button onClick={() => setRejectingId(null)} className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
