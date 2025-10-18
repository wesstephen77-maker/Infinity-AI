// pages/api/emails/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = req.query as { id?: string | string[] };
  const idStr = Array.isArray(q.id) ? (q.id?.[0] ?? "") : (q.id ?? "");

  if (!idStr) return res.status(400).json({ error: "Missing id" });

  try {
    if (req.method === "GET") {
      const email = await prisma.email.findUnique({
        where: { id: idStr },
        include: { lead: true, user: true },
      });
      return res.status(200).json(email);
    }

    if (req.method === "DELETE") {
      await prisma.email.delete({ where: { id: idStr } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ error: msg });
  }
}
