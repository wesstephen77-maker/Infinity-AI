import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { to, subject, body } = await req.json().catch(() => ({}));

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing to, subject, or body" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Infinity AI <onboarding@resend.dev>", // Sandbox sender
        to: Array.isArray(to) ? to : [to],
        subject,
        text: body,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.error?.message || data?.message || "Resend error";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Send failed" }, { status: 500 });
  }
}
