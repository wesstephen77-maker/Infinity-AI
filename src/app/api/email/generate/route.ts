import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const company = body?.company ?? "your business";

  const subject = `Quick idea to boost ${company}'s bookings`;
  const emailBody = [
    `Hi ${company} team,`,
    ``,
    `Noticed you’re doing solid work. Similar teams are adding 15–30% more appointments by automating polite AI follow-ups.`,
    ``,
    `Open to a 10-minute walkthrough this week? If it isn’t valuable in 5 minutes, I’ll end early.`,
    ``,
    `— Infinity AI`,
  ].join("\n");

  return NextResponse.json({ subject, body: emailBody });
}
