import { google } from "googleapis";
import { prisma } from "./prisma";

export async function getAuthenticatedGoogleClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!account || !account.access_token || !account.refresh_token) {
    throw new Error("Tokens de acesso do Google não encontrados.");
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
  );

  oAuth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  // Verifica se o token expirou e atualiza se necessário
  oAuth2Client.on("tokens", async (tokens) => {
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: tokens.access_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : null,
        refresh_token: tokens.refresh_token ?? account.refresh_token,
      },
    });
  });

  return oAuth2Client;
}
