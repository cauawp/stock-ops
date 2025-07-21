"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputText from "@/components/form/inputText";
import InputSelect, { Option } from "@/components/form/inputSelect";
import Button from "@/components/form/button";
import Header from "@/components/header";
import ChangePasswordModal from "./changePasswordModal";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator";
};

export default function UserForm() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Option>({ label: "", value: "" });
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  // Carrega dados do usuário ao montar
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
          method: "GET",
          credentials: "include", // envia cookie HttpOnly
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Falha ao carregar usuário");
        const data: User = await res.json();
        setUser(data);
        setName(data.name ?? "");
        setRole({
          label: data.role === "admin" ? "Administrador" : "Operador",
          value: data.role,
        });
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, [router]);

  const handleUpdate = async () => {
    if (!user) return;
    try {
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            role: role.value,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar usuário");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-store",
      },
    });
    router.push("/login");
  };

  if (!user && !error) {
    return (
      <>
        <p>Carregando...</p>
      </>
    );
  }

  return (
    <>
      <form
        className="formContainer max-w-[448px] flex-auto space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <InputText
          label="Nome"
          placeholder="Seu nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled
        />
        <InputText
          label="Email"
          placeholder="Seu email"
          type="text"
          value={user?.email ?? ""}
          disabled
        />
        <InputText
          type="text"
          label="Cargo"
          placeholder="Seu cargo"
          value={role?.label ?? ""}
          disabled
        />
        <Button
          label="Alterar senha"
          onClick={async () => {
            setIsModalOpen(true);
          }}
        />
        <Button label="Logout" onClick={handleLogout} />

        {user && (
          <ChangePasswordModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userId={user.id}
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </>
  );
}
