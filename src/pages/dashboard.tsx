// src/pages/dashboard.tsx

import { GetServerSideProps } from "next";
import { getSession, signOut } from "next-auth/react";
import ApiKeysForm from "../app/components/ApiKeysForm";
import DiscountCodeForm from "../app/components/DiscountCodeForm";
import CommandForm from "../app/components/CommandForm";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </header>
      <div className="grid grid-cols-1 gap-8">
        <ApiKeysForm />
        <DiscountCodeForm />
        <CommandForm />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
