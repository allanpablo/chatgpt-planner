// pages/api/create-event.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { google } from "googleapis";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Não autenticado" });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const { summary, description, startTime, endTime } = req.body;

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
  );

  // Aqui, você precisará gerenciar tokens de acesso e refresh para o usuário.
  // O ideal é implementar o fluxo OAuth completo para obter os tokens necessários.
  // Por simplicidade, assumiremos que o access_token está armazenado no user.googleApiKey

  oAuth2Client.setCredentials({ access_token: user?.googleApiKey });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const event = {
    summary,
    description,
    start: { dateTime: startTime },
    end: { dateTime: endTime },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    res.status(200).json({ event: response.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
