// prisma/seed-upsert.ts
import { prisma } from "@/lib/prisma";

async function main() {
  // Users (no password field in your schema)
  const user1 = await prisma.user.upsert({
    where: { email: "john.wes@example.com" },
    update: {},
    create: { name: "John Wes", email: "john.wes@example.com" },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane.doe@example.com" },
    update: {},
    create: { name: "Jane Doe", email: "jane.doe@example.com" },
  });

  // Optional: a sample lead + email so the app has data
  const lead = await prisma.lead.upsert({
    where: { email: "wes@example.com" },
    update: {},
    create: {
      name: "Wes Test Lead",
      email: "wes@example.com",
      userId: user1.id,
    },
  });

  await prisma.email.upsert({
    where: { id: "seed-email-1" }, // requires id to be unique; if your model auto-generates, use create instead
    update: {},
    create: {
      id: "seed-email-1",
      subject: "Welcome to Infinity AI",
      body: "This is a seeded email for demo/testing.",
      address: "wes@example.com",
      userId: user1.id,
      leadId: lead.id,
    },
  });

  console.log("Seed complete:", { user1: user1.email, user2: user2.email, lead: lead.email });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
