import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// dynamic import for Resend
const { Resend } = await import("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  try {
    console.log("===== Infinity AI Test Script =====");

    const leads = await prisma.lead.findMany();
    console.log("Leads in DB:", leads);

    let testLead;
    if (leads.length === 0) {
      testLead = await prisma.lead.create({
        data: {
          name: "Test Lead",
          email: "test@example.com",
          source: "script-test",
        },
      });
      console.log("Created test lead:", testLead);
    } else {
      testLead = leads[0];
      console.log("Using existing lead:", testLead);
    }

    const emailSubject = "Test Email from Infinity AI";
    const emailBody = `<p>Hello ${testLead.name},</p><p>This is a test email from Infinity AI. Everything is working!</p>`;

    const emailResponse = await resend.emails.send({
      from: "you@yourdomain.com", // replace with your verified sender
      to: testLead.email,
      subject: emailSubject,
      html: emailBody,
    });
    console.log("Email sent response:", emailResponse);

    const updatedLead = await prisma.lead.update({
      where: { id: testLead.id },
      data: { emailed: true },
    });
    console.log("Updated lead status:", updatedLead);

    console.log("===== Test Completed Successfully =====");
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
