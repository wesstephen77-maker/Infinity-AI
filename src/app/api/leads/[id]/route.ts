import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json().catch(() => ({}));

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        stage: typeof data.stage === "string" ? data.stage : undefined,
        score: typeof data.score === "number" ? data.score : undefined,
        notes: typeof data.notes === "string" ? data.notes : undefined,
      },
    });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
}
