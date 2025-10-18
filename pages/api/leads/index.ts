// pages/api/leads/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type PostBody = {
  name?: string | null;
  email?: string | null;
  userId?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        include: { emails: true, user: true },
      });
      return res.status(200).json(leads);
    }

    if (req.method === "POST") {
      const { name, email, userId } = (req.body ?? {}) as PostBody;

      if (!email) {
        return res.status(400).json({ error: "email is required" });
      }

      const safeName =
        (typeof name === "string" && name.trim().length > 0 && name.trim()) ||
        (email.includes("@") ? email.split("@")[0] : "Lead");

      const lead = await prisma.lead.create({
        data: {
          name: safeName,          // Prisma requires string (not null)
          email,
          userId: userId ?? null,  // nullable relation is OK
        },
      });

      return res.status(201).json(lead);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ error: msg });
  }
}
