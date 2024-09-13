// src/components/ApiKeysForm.tsx

import { useState, FormEvent } from "react";

export default function ApiKeysForm() {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [openAIApiKey, setOpenAIApiKey] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/save-api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Certifique-se de incluir esta linha
      body: JSON.stringify({ googleApiKey, openAIApiKey }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };
  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Inserir Chaves de API</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Chave da API do Google</label>
          <input
            type="text"
            value={googleApiKey}
            onChange={(e) => setGoogleApiKey(e.target.value)}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Chave da API do OpenAI</label>
          <input
            type="text"
            value={openAIApiKey}
            onChange={(e) => setOpenAIApiKey(e.target.value)}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Salvar
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
