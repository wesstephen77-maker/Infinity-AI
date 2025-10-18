// scripts/send-one.js
// ESM-compatible (Node 18+). Sends one HTML email via Resend.

import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const { Resend } = await import("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "you@yourdomain.com"; // verified sender
const TO = process.argv[2] || "you@example.com";              // recipient from CLI
const SUBJECT = process.argv[3] || "Infinity AI — Test Email";

// Inline the same HTML you saw printed (or read from a file if you prefer)
const HTML = `
<html>
<body>
<p>Hi Alex,</p>

<p>I hope this message finds you well! I wanted to introduce you to Infinity AI, your personal AI for sales that streamlines outreach, follow-ups, and lead management.</p>

<ul>
<li>Increase your efficiency with automated follow-ups.</li>
<li>Enhance lead management with smart insights.</li>
<li>Focus on closing deals while we handle the routine tasks.</li>
</ul>

<p>I'd love to show you how Infinity AI can transform your sales process. Can we schedule a quick 10-minute demo this week? You can book a time that works for you here: <a href="https://infinity.ai/demo">Schedule Demo</a>.</p>

<p>Looking forward to connecting!</p>
<p>Best,</p>
<p>[Your Name]</p>
</body>
</html>
`;

if (!RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY missing in .env.local");
  process.exit(1);
}

if (!FROM) {
  console.error("❌ RESEND_FROM missing. Set it in .env.local and verify the domain/address in Resend.");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

try {
  console.log("Sending test email…");
  const result = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: SUBJECT,
    html: HTML,
  });
  console.log("✅ Sent:", result);
} catch (e) {
  console.error("❌ Send failed:", e?.message || e);
  process.exit(1);
}

