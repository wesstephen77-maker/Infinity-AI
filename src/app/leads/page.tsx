"use client";
import { useEffect, useState } from "react";

type Lead = {
  id: string; company: string; email?: string; industry?: string;
  score: number; stage: string; createdAt: string;
};

const STAGES = ["New","Contacted","Qualified","Demo","Won","Lost"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createLead = async () => {
    if (!company.trim()) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ company, email, stage: "New", score: 0 }),
    });
    setCompany(""); setEmail("");
    load();
  };

  const updateStage = async (id: string, stage: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ stage }),
    });
    setLeads(ls => ls.map(l => l.id === id ? { ...l, stage } : l));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Leads & Contacts</h1>

      {/* Quick add */}
      <div className="flex flex-wrap gap-2">
        <input
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500"
          placeholder="Company"
          value={company}
          onChange={(e)=>setCompany(e.target.value)}
        />
        <input
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500"
          placeholder="Email (optional)"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button
          onClick={createLead}
          className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-900 font-medium"
        >
          Add Lead
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-6 text-neutral-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 text-neutral-400">
              <tr>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Score</th>
                <th className="text-left p-3">Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-t border-neutral-800">
                  <td className="p-3">{l.company}</td>
                  <td className="p-3 text-neutral-300">{l.email || "—"}</td>
                  <td className="p-3">{l.score}</td>
                  <td className="p-3">
                    <select
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1"
                      value={l.stage}
                      onChange={(e) => updateStage(l.id, e.target.value)}
                    >
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-neutral-400">
                    No leads yet — add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
