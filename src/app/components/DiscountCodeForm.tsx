// src/components/DiscountCodeForm.tsx

import { useState, FormEvent } from "react";

export default function DiscountCodeForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/apply-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Aplicar Código de Desconto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Código de desconto"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Aplicar
        </button>
      </form>
      {message && <p className="mt-4 text-indigo-600">{message}</p>}
    </div>
  );
}
