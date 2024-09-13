// src/pages/index.tsx

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center mt-4">Carregando...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao ChatGPT Planner</h1>
      <p className="mb-4">Você não está autenticado</p>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Entrar com Google
      </button>
    </div>
  );
}
