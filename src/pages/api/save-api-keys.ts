import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const { googleApiKey, openAIApiKey } = req.body;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        googleApiKey,
        openAIApiKey,
      },
    });

    res.status(200).json({ message: "Chaves de API salvas com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar as chaves de API:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
