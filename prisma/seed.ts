// prisma/seed.ts
import { prisma } from "@/lib/prisma";

async function main() {
  // Users WITHOUT password (your schema has no password field)
  await prisma.user.upsert({
    where: { email: "john.wes@example.com" },
    update: {},
    create: { name: "John Wes", email: "john.wes@example.com" },
  });

  await prisma.user.upsert({
    where: { email: "jane.doe@example.com" },
    update: {},
    create: { name: "Jane Doe", email: "jane.doe@example.com" },
  });

  console.log("Seed complete (seed.ts)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
