"use client";
import { useEffect, useState } from "react";

type Email = {
  id: string;
  to: string;
  subject: string;
  status: string;
  createdAt: string;
  sentAt?: string;
};

export default function EmailsPage() {
  const [items, setItems] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/emails");
      const data = await res.json();
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Emails</h1>
      <div className="rounded-2xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-6 text-neutral-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-neutral-400">No emails yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 text-neutral-400">
              <tr>
                <th className="text-left p-3">To</th>
                <th className="text-left p-3">Subject</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Sent</th>
              </tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e.id} className="border-t border-neutral-800">
                  <td className="p-3">{e.to}</td>
                  <td className="p-3">{e.subject}</td>
                  <td className="p-3">{e.status}</td>
                  <td className="p-3">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="p-3">{e.sentAt ? new Date(e.sentAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
