// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type PostBody = {
  name?: string | null;
  email?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { leads: true, emails: true },
      });
      return res.status(200).json(users);
    }

    if (req.method === "POST") {
      const { name, email } = (req.body ?? {}) as PostBody;
      if (!email) return res.status(400).json({ error: "email is required" });

      const safeName =
        (typeof name === "string" && name.trim().length > 0 && name.trim()) ||
        (email.includes("@") ? email.split("@")[0] : "User");

      const user = await prisma.user.create({
        data: {
          name: safeName,
          email,
        },
      });
      return res.status(201).json(user);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ error: msg });
  }
}
