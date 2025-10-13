"use client";
import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Lead = { id:string; stage:string };

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
      setLoading(false);
    })();
  }, []);

  const byStage = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of leads) counts[l.stage] = (counts[l.stage] || 0) + 1;
    return Object.entries(counts).map(([stage, count]) => ({ stage, count }));
  }, [leads]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Analytics</h1>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 h-72">
        {loading ? (
          <div className="text-neutral-400">Loading…</div>
        ) : byStage.length === 0 ? (
          <div className="text-neutral-400">No data yet — add some leads.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byStage}>
              <XAxis dataKey="stage" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
