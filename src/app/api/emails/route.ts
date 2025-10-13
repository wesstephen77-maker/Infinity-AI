import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.email.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });
  return NextResponse.json(items);
}
