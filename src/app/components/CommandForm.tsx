// src/components/CommandForm.tsx

import { useState, FormEvent } from "react";

export default function CommandForm() {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/process-command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });
    const data = await res.json();
    setResponse(data.message || data.error);
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Enviar Comando</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            placeholder="Digite seu comando"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full px-3 py-2 border rounded h-32"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Enviar
        </button>
      </form>
      {response && <p className="mt-4 text-purple-600">{response}</p>}
    </div>
  );
}
