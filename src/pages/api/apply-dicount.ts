// pages/api/apply-discount.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Você precisa estar autenticado." });
  }

  const { code } = req.body;

  const discount = await prisma.discountCode.findUnique({
    where: { code },
  });

  if (!discount || discount.expiresAt < new Date()) {
    return res.status(400).json({ error: "Código inválido ou expirado." });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { discountCodeId: discount.id },
  });

  res.status(200).json({ message: "Código de desconto aplicado com sucesso!" });
}
