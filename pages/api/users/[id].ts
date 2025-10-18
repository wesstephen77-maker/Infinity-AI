// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type PutBody = {
  name?: string | null;
  email?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = req.query as { id?: string | string[] };
  const idStr = Array.isArray(q.id) ? (q.id?.[0] ?? "") : (q.id ?? "");
  if (!idStr) return res.status(400).json({ error: "Missing id" });

  try {
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { id: idStr },
        include: { leads: true, emails: true },
      });
      return res.status(200).json(user);
    }

    if (req.method === "PUT") {
      const { name, email } = (req.body ?? {}) as PutBody;
      const user = await prisma.user.update({
        where: { id: idStr },
        data: {
          ...(typeof name === "string" ? { name } : {}),
          ...(typeof email === "string" ? { email } : {}),
        },
      });
      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      await prisma.user.delete({ where: { id: idStr } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ error: msg });
  }
}
