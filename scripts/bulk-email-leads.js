// scripts/bulk-email-leads.js
// ESM-compatible (Node 18+). Works with your current setup.

// ---------- Env ----------
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

// ---------- Deps ----------
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const { Resend } = await import("resend");

// ---------- Flags ----------
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY_NEW = !process.argv.includes("--all") && !process.argv.includes("--resend") && !process.argv.includes("--force")
  ? true
  : process.argv.includes("--only-new") || false; // default true unless user passes --all/--resend/--force
const BATCH_SIZE = Number(getArgValue("--batch", "20"));
const SEND_DELAY_MS = Number(getArgValue("--delay", "300"));

// ---------- Config ----------
const resendKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM || "you@yourdomain.com"; // <-- set a verified sender in .env.local

assertEnv("RESEND_API_KEY", resendKey);
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL missing in .env.local (Prisma may still work locally if already initialized).");
}
if (!process.env.RESEND_FROM) {
  console.warn("⚠️ RESEND_FROM not set. Using default:", fromAddress, "— make sure it’s a verified sender in Resend.");
}

const resend = new Resend(resendKey);

// ---------- Helpers ----------
function getArgValue(flag, fallback) {
  const i = process.argv.findIndex(a => a === flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function assertEnv(name, value) {
  if (!value) {
    console.error(`❌ Missing ${name}. Add it to .env.local`);
    process.exit(1);
  }
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function isValidEmail(email) { return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

// AI (optional). If OPENAI_API_KEY is set, we’ll try; else use a fallback template.
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const { OpenAI } = await import("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) {
    console.warn("⚠️ OpenAI not available; using fallback template.", e?.message || e);
  }
}

async function generateEmailCopy(lead) {
  if (openai) {
    try {
      const sys = "You write concise, warm, professional sales emails. 80–120 words. Use simple HTML paragraphs and bullets.";
      const usr = `Lead name: ${lead.firstName || lead.name || "there"}
Product: Infinity AI — personal AI assistant for sales pros (outreach, follow-ups, lead management).
Goal: Book a quick 10-min demo this week.
Tone: confident, helpful, no hype.
Include: 1-sentence value prop, 2–3 short bullet benefits, 1 clear CTA link placeholder (https://infinity.ai/demo).
No pricing. Keep it tight.`;
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: usr }
        ],
        temperature: 0.7,
      });
      const content = res?.choices?.[0]?.message?.content?.trim() || "";
      const html = content.startsWith("<")
        ? content
        : `<p>${content.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`;

      const subject = `Quick demo for ${lead.firstName || lead.name || "your team"} — Infinity AI`;
      return { subject, html };
    } catch (e) {
      console.warn("⚠️ AI generation failed; using fallback template.", e?.message || e);
    }
  }

  const subject = `Quick demo for ${lead.firstName || lead.name || "your team"} — Infinity AI`;
  const html = `
    <p>Hi ${lead.firstName || lead.name || "there"},</p>
    <p><b>Infinity AI</b> helps sales pros move faster—write outreach, follow up, and keep leads organized in one place.</p>
    <ul>
      <li>Instant, tailored email drafts</li>
      <li>One-click follow-ups & reminders</li>
      <li>Clean dashboard to track pipeline</li>
    </ul>
    <p>Want a 10-min walkthrough? Book a time: <a href="https://infinity.ai/demo">https://infinity.ai/demo</a></p>
    <p>— Infinity AI Team</p>
  `;
  return { subject, html };
}

function shouldSendToLead(lead) {
  // If we only want new leads, skip if status says emailed OR if an 'emailed' flag exists and is true
  if (ONLY_NEW) {
    if (typeof lead.emailed === "boolean" && lead.emailed) return false;
    if (typeof lead.status === "string" && lead.status.toLowerCase() === "emailed") return false;
  }
  return true;
}

async function updateLeadStatus(leadId) {
  // Prefer emailed/lastEmailedAt if your schema has them. If not, fall back to status.
  try {
    return await prisma.lead.update({
      where: { id: leadId },
      data: { emailed: true, lastEmailedAt: new Date(), updatedAt: new Date() },
    });
  } catch {
    try {
      return await prisma.lead.update({
        where: { id: leadId },
        data: { status: "emailed", updatedAt: new Date() },
      });
    } catch (e2) {
      console.warn(`⚠️ Could not update lead ${leadId}:`, e2?.message || e2);
    }
  }
}

async function sendEmail(lead) {
  const { subject, html } = await generateEmailCopy(lead);

  if (DRY_RUN) {
    console.log(`🧪 [DRY-RUN] Would send to ${lead.email} | Subject: ${subject}`);
    return { id: null, status: "dry-run" };
  }

  return await resend.emails.send({
    from: fromAddress,
    to: lead.email,
    subject,
    html,
  });
}

// ---------- Main ----------
async function main() {
  console.log("===== Infinity AI Bulk Email Sender =====");
  console.log("ENV:", {
    RESEND_API_KEY: resendKey ? "✔︎ set" : "✘ missing",
    RESEND_FROM: fromAddress,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✔︎ set" : "—",
  });
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN" : "LIVE"} | Only new: ${ONLY_NEW ? "yes" : "no"} | Batch: ${BATCH_SIZE} | Delay: ${SEND_DELAY_MS}ms`);

  // Pull all leads (we'll filter in JS to avoid schema-coupling)
  const allLeads = await prisma.lead.findMany();
  const leads = (allLeads || []).filter(l => isValidEmail(l.email)).filter(shouldSendToLead);

  if (leads.length === 0) {
    console.log("No eligible leads to email. (Either none in DB, no valid emails, or all already emailed.)");
    await prisma.$disconnect();
    return;
  }

  console.log(`Found ${leads.length} eligible lead(s).`);

  let sent = 0, failed = 0;

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const chunk = leads.slice(i, i + BATCH_SIZE);
    console.log(`\n→ Processing leads ${i + 1} to ${i + chunk.length} of ${leads.length}`);

    for (const lead of chunk) {
      try {
        const res = await sendEmail(lead);
        console.log(`✅ ${DRY_RUN ? "Planned" : "Sent"} to ${lead.email} (${lead.id})`, DRY_RUN ? "" : `| Message: ${res?.id || "ok"}`);

        if (!DRY_RUN) {
          await updateLeadStatus(lead.id);
        }
        sent++;
      } catch (e) {
        failed++;
        console.error(`❌ Failed for ${lead.email} (${lead.id}):`, e?.message || e);
      }

      if (SEND_DELAY_MS > 0) await sleep(SEND_DELAY_MS);
    }
  }

  console.log("\n===== Summary =====");
  console.log(`Total eligible: ${leads.length} | ${DRY_RUN ? "Planned" : "Sent"}: ${sent} | Failed: ${failed} | Mode: ${DRY_RUN ? "DRY-RUN" : "LIVE"}`);

  await prisma.$disconnect();
}

await main().catch(async (e) => {
  console.error("Unhandled error:", e?.message || e);
  await prisma.$disconnect();
  process.exit(1);
});

