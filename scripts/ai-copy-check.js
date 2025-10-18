// scripts/ai-copy-check.js
// ESM-compatible (Node 18+). Validates OPENAI_API_KEY + model.

import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const KEY = process.env.OPENAI_API_KEY;

if (!KEY) {
  console.error("❌ OPENAI_API_KEY is missing in .env.local");
  process.exit(1);
}

console.log("OPENAI_MODEL:", MODEL);
console.log("OPENAI_BASE_URL:", BASE_URL);

const { OpenAI } = await import("openai");
const openai = new OpenAI({ apiKey: KEY, baseURL: BASE_URL });

const sys = "You write concise, warm, professional sales emails. Use simple HTML paragraphs. 80–120 words.";
const usr = `Lead name: Alex
Product: Infinity AI — personal AI for sales (outreach, follow-ups, lead management).
Goal: Book a 10-min demo this week.
Tone: confident, helpful, no hype.
Include: 1-sentence value prop, 2–3 short bullet benefits, 1 clear CTA link (https://infinity.ai/demo).
No pricing. Keep it tight.`;

try {
  const resp = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr },
    ],
    temperature: 0.7,
  });

  const content = resp?.choices?.[0]?.message?.content?.trim() || "";
  const html = content.startsWith("<")
    ? content
    : `<p>${content.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`;

  console.log("\n=== SAMPLE AI EMAIL HTML ===\n");
  console.log(html);
  console.log("\n✅ AI copy generation OK");
} catch (e) {
  console.error("❌ OpenAI request failed:", e?.message || e);
  process.exit(1);
}
