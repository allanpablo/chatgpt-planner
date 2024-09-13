import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user)
    return res.status(401).json({ error: "Não autenticado" });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.openAIApiKey) {
    return res
      .status(400)
      .json({ error: "Chave da API do OpenAI não encontrada." });
  }

  const openai = new OpenAI({
    apiKey: user.openAIApiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use um modelo válido
      messages: [{ role: "user", content: "Say this is a test" }],
    });

    const gptResponse = completion.choices[0].message.content.trim();

    // Parse da resposta do GPT
    const eventData = JSON.parse(gptResponse || "{}");

    // Chamar o endpoint para criar o evento no Google Calendar
    // Aqui, você pode chamar a função diretamente ou ajustar conforme necessário
    const createEventResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/create-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Não é necessário passar o Cookie aqui se estiver usando getServerSession
        },
        body: JSON.stringify(eventData),
      },
    );

    if (!createEventResponse.ok) {
      const errorData = await createEventResponse.json();
      return res.status(500).json({ error: errorData.error });
    }

    const event = await createEventResponse.json();

    res.status(200).json({ message: "Evento criado com sucesso!", event });
  } catch (error: any) {
    console.error("Erro ao processar o comando:", error);
    res.status(500).json({ error: error.message });
  }
}
