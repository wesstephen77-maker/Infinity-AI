import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  if (!data?.company || typeof data.company !== "string") {
    return NextResponse.json({ error: "company is required" }, { status: 400 });
  }
  const lead = await prisma.lead.create({
    data: {
      company: data.company,
      email: data.email ?? null,
      industry: data.industry ?? null,
      score: typeof data.score === "number" ? data.score : 0,
      stage: typeof data.stage === "string" ? data.stage : "New",
      notes: typeof data.notes === "string" ? data.notes : null,
    },
  });
  return NextResponse.json(lead, { status: 201 });
}
