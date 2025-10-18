// pages/api/emails/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type PostBody = {
  subject?: string;
  body?: string;
  address?: string; // required by Prisma model
  to?: string;      // allow legacy client payload; we map it to `address`
  userId?: string | null;
  leadId?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const emails = await prisma.email.findMany({
        orderBy: { createdAt: "desc" },
        include: { lead: true, user: true },
      });
      return res.status(200).json(emails);
    }

    if (req.method === "POST") {
      const { subject, body, address, to, userId, leadId } = (req.body ?? {}) as PostBody;

      if (!subject || !body) {
        return res.status(400).json({ error: "subject and body are required" });
      }

      // Prisma model requires `address`. If caller sent `to`, map it.
      const addr = address ?? to;
      if (!addr) {
        return res.status(400).json({ error: "address (or to) is required" });
      }

      const email = await prisma.email.create({
        data: {
          subject,
          body,
          address: addr,
          userId: userId ?? null,
          leadId: leadId ?? null,
        },
      });

      return res.status(201).json(email);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ error: msg });
  }
}
