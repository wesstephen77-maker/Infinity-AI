export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL! } },
});

// Lazy init Resend at request-time; skip email if env missing
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    return new Resend(key);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });

    let subscriber;
    if (existing) {
      subscriber = existing;
    } else {
      subscriber = await prisma.subscriber.create({
        data: { email, source: typeof source === 'string' ? source : 'coming-soon' },
      });

      // send email non-blocking if creds exist
      const resend = getResend();
      const FROM = process.env.RESEND_FROM;

      if (resend && FROM) {
        (async () => {
          try {
            await resend.emails.send({
              from: FROM,
              to: email,
              subject: 'Thanks for subscribing to Infinity AI',
              html: `
                <div style="font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif">
                  <h2>You're on the list 🎉</h2>
                  <p>Thanks for subscribing to <strong>Infinity AI</strong>. We'll keep you posted.</p>
                  <p style="color:#666">If this wasn't you, you can ignore this email.</p>
                </div>
              `,
            });
          } catch {
            // ignore email errors; do not fail the request
          }
        })();
      }
    }

    return new Response(JSON.stringify({ ok: true, subscriber, already: !!existing }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
