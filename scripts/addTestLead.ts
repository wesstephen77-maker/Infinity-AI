import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("⚙️ Running test lead insert...")

  const lead = await prisma.lead.create({
    data: {
      name: 'Wes Test Lead',
      email: 'wes@example.com',
    },
  })

  console.log('✅ Lead created:', lead)
}

main()
  .catch((e) => {
    console.error('❌ Error creating lead:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
