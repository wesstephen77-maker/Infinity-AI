type WaitlistSubscriber = { id: string; email: string; source?: string | null; createdAt?: string | Date | null };
import { prisma } from "../../../lib/db";
import { notFound } from "next/navigation";

export default async function WaitlistPage({ searchParams }: { searchParams: Record<string, string> }) {
  const token = searchParams?.token;
  if (token !== process.env.ADMIN_TOKEN) return notFound();

  const subs = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Waitlist (latest 500)</h1>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-zinc-800">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Source</th>
              <th className="text-left p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s: WaitlistSubscriber) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.source || "-"}</td>
                <td className="p-3">{(s.createdAt ? (typeof s.createdAt === "string" ? new Date(s.createdAt) : new Date((s.createdAt as Date).getTime())).toLocaleString() : "-")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}