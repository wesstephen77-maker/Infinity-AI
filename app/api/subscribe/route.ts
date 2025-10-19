export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';

const FALLBACK_DB =
  'postgresql://neondb_owner:npg_SxG4bnHBfM7t@ep-bitter-brook-addrpqq6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true';

// Prefer env if present; otherwise fallback so prod works even if env missing
const effectiveDbUrl = process.env.DATABASE_URL!;


const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL! },
  },
});

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: typeof source === 'string' ? source : 'coming-soon' },
    });

    return new Response(JSON.stringify({ ok: true, subscriber }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({
        ok: false,
        error: message,
        sawEnv: !!process.env.DATABASE_URL,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
