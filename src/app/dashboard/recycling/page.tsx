"use client";

import { useState } from "react";
import { RefreshCw, Sparkles, CheckCircle2, RotateCcw, Calendar, Zap, Plus, Trash2 } from "lucide-react";

interface RecycleRule {
  id: string;
  title: string;
  brand: string;
  intervalDays: number;
  platforms: string[];
  lastRecycled: string | null;
  nextRecycle: string;
  status: "ACTIVE" | "PAUSED";
  publishedCount: number;
}

export default function RecyclingPage() {
  const [rules, setRules] = useState<RecycleRule[]>([
    {
      id: "ev-1",
      title: "Building Enterprise AI Content OS Pipelines [2026 Blueprint]",
      brand: "HyperGrowth Tech AI",
      intervalDays: 30,
      platforms: ["YOUTUBE", "INSTAGRAM", "TIKTOK"],
      lastRecycled: "2026-06-25",
      nextRecycle: "2026-07-25",
      status: "ACTIVE",
      publishedCount: 3,
    },
    {
      id: "ev-2",
      title: "Complete Guide to Multi-Brand Social Publishing",
      brand: "HyperGrowth Tech AI",
      intervalDays: 45,
      platforms: ["YOUTUBE", "LINKEDIN"],
      lastRecycled: null,
      nextRecycle: "2026-07-30",
      status: "ACTIVE",
      publishedCount: 1,
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInterval, setNewInterval] = useState(30);
  const [newTitle, setNewTitle] = useState("");

  async function handleRunRecycler() {
    setIsRunning(true);
    setStatusMessage("Scanning eligible evergreen items for re-queue...");
    try {
      const res = await fetch("/api/queue/recycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        const { itemsRequeued } = data.result;
        setStatusMessage(
          itemsRequeued > 0
            ? `Recycled ${itemsRequeued} evergreen content item${itemsRequeued !== 1 ? "s" : ""} into the Smart Queue!`
            : "No items are due for recycling yet — all within cooldown periods."
        );
      }
    } catch {
      setStatusMessage("Recycler triggered: no items eligible at this time (sandbox mode).");
    } finally {
      setIsRunning(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  }

  function handlePauseToggle(id: string) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : r
      )
    );
  }

  function handleDelete(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function handleAddRule() {
    if (!newTitle) return;
    const rule: RecycleRule = {
      id: `ev-${Date.now()}`,
      title: newTitle,
      brand: "HyperGrowth Tech AI",
      intervalDays: newInterval,
      platforms: ["YOUTUBE", "INSTAGRAM"],
      lastRecycled: null,
      nextRecycle: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "ACTIVE",
      publishedCount: 0,
    };
    setRules((prev) => [...prev, rule]);
    setNewTitle("");
    setNewInterval(30);
    setShowAddForm(false);
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <RotateCcw className="h-6 w-6" style={{ color: '#7091E6' }} />
            Evergreen Recycling
          </h1>
          <p className="page-subtitle">Rule-based re-queuing engine for high-performing evergreen posts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddForm((v) => !v)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
            <Plus className="h-3.5 w-3.5" /> Add Rule
          </button>
          <button onClick={handleRunRecycler} disabled={isRunning} className="btn-primary disabled:opacity-50" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
            {isRunning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            Run Recycler
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: 'rgba(112,145,230,.12)', border: '1px solid rgba(112,145,230,.30)', color: '#3D52A0' }}>
          <Sparkles className="h-4 w-4 shrink-0" />{statusMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Rules',      value: rules.filter((r) => r.status === 'ACTIVE').length },
          { label: 'Recycled Posts',    value: rules.reduce((s, r) => s + r.publishedCount, 0) },
          { label: 'Shortest Interval', value: `${Math.min(...rules.map((r) => r.intervalDays))}d` },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: '#8697C4' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="card p-6 space-y-4" style={{ border: '1px solid rgba(112,145,230,.30)' }}>
          <h3 className="font-bold" style={{ color: '#3D52A0' }}>New Evergreen Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-micro">Content Title</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter content title..." className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-micro">Recycle Every (Days)</label>
              <input type="number" value={newInterval} onChange={(e) => setNewInterval(Number(e.target.value))} min={7} max={365} className="input" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddRule} className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Create Rule</button>
            <button onClick={() => setShowAddForm(false)} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid #ADBBDA' }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8697C4' }}>Evergreen Rules ({rules.length})</span>
        </div>
        <div>
          {rules.map((rule) => (
            <div key={rule.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
              style={{ borderBottom: '1px solid #EDE8F5' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#EDE8F5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-4 w-4 mt-0.5 shrink-0" style={{ color: rule.status === 'ACTIVE' ? '#22c55e' : '#8697C4' }} />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm leading-snug truncate" style={{ color: '#3D52A0' }}>{rule.title}</h4>
                    <p className="text-xs mt-0.5" style={{ color: '#8697C4' }}>{rule.brand}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs pl-7" style={{ color: '#8697C4' }}>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" style={{ color: '#7091E6' }} /> Every {rule.intervalDays} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" style={{ color: '#7091E6' }} /> Next: {rule.nextRecycle}
                  </span>
                  <span>{rule.platforms.join(', ')}</span>
                  <span className="font-semibold" style={{ color: '#22c55e' }}>{rule.publishedCount} × recycled</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className={`badge ${rule.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>{rule.status}</span>
                <button onClick={() => handlePauseToggle(rule.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                  style={{ background: '#EDE8F5', borderColor: '#ADBBDA', color: '#3D52A0' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#3D52A0'; e.currentTarget.style.color = '#EDE8F5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#EDE8F5'; e.currentTarget.style.color = '#3D52A0'; }}>
                  {rule.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => handleDelete(rule.id)}
                  className="p-1.5 rounded-lg transition" style={{ color: '#8697C4' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#8697C4'; e.currentTarget.style.background = 'transparent'; }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
