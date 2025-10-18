import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmail(subject: string, leadName: string, context: string) {
  const prompt = `
Write a professional email to ${leadName}.
Subject: ${subject}
Context: ${context}
Make it concise and friendly.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message?.content ?? "";
}


