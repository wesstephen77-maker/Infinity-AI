import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    // List tables Prisma sees in the connected SQLite DB
    const tables = await prisma.$queryRawUnsafe<any[]>(
      `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`
    );

    return NextResponse.json({
      cwd: process.cwd(),
      DATABASE_URL: process.env.DATABASE_URL || "(not set)",
      tables: tables.map((t: any) => t.name),
    });
  } catch (e: any) {
    return NextResponse.json({
      cwd: process.cwd(),
      DATABASE_URL: process.env.DATABASE_URL || "(not set)",
      error: e?.message || String(e),
    }, { status: 500 });
  }
}
