"use client";
import { useState } from "react";

export default function AssistantPage() {
  const [toEmail, setToEmail] = useState("owner@acmeplumbing.com");
  const [subject, setSubject] = useState("Quick idea to boost Acme Plumbing’s bookings");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate email from AI
  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "intro", company: "Acme Plumbing", industry: "Home Services" }),
      });
      const data = await res.json();
      setSubject(data.subject || subject);
      setBody(data.body || "");
    } catch (err) {
      console.error(err);
      alert("❌ Error generating email");
    } finally {
      setLoading(false);
    }
  };

  // Send test email via Resend
  const sendTest = async () => {
    if (!body.trim()) {
      alert("Please generate or write an email before sending.");
      return;
    }
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "mynewinfinityai@gmail.com", // ✅ your test email
          subject,
          body,
        }),
      });
      const data = await res.json();
      alert(data.id ? "✅ Sent!" : "❌ Send failed: " + (data.error || "Unknown"));
    } catch (err) {
      console.error(err);
      alert("❌ Error sending email");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Infinity AI — Email Assistant</h1>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            placeholder="To"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
          />
          <input
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <textarea
          rows={10}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 leading-6 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          placeholder="Message body…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>

          <button
            onClick={sendTest}
            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
          >
            Send Test
          </button>
        </div>
      </div>
    </div>
  );
}
