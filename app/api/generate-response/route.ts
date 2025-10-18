import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "../../../lib/db"; // matches your subscribe route import

export async function POST(req: Request) {
  try {
    const { leadId, message } = await req.json();

    if (!leadId || !message) {
      return NextResponse.json({ error: "Missing leadId or message" }, { status: 400 });
    }

    // Fetch the lead
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // If no API key yet, return a helpful mocked response so the route still works
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const fallback = `Hi${lead.name ? " " + lead.name : ""}! Infinity AI helps salespeople by drafting replies, auto-logging interactions, and suggesting next steps. Want me to schedule a quick call or send a one-pager?`;
      return NextResponse.json({ response: fallback }, { status: 200 });
    }

    const openai = new OpenAI({ apiKey });

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are Infinity, a friendly, professional AI sales assistant. Be concise, helpful, and persuasive. Always finish with a clear call to action."
        },
        {
          role: "user",
          content:
            `Lead name: ${lead.name ?? "there"}.\nLead message: ${message}\nReply as an assistant for Infinity AI describing how it helps salespeople (lead capture, auto follow-up, drafting replies, logging CRM notes, scheduling).`
        }
      ]
    });

    const reply = chat.choices?.[0]?.message?.content ?? "Thanks for reaching out! Infinity AI helps salespeople automate follow-ups and close more deals.";

    return NextResponse.json({ response: reply }, { status: 200 });
  } catch (err) {
    console.error("[generate-response] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
